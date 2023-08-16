/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const initialState = {
  stompClient: null,
  socket: null,
  isSocketConnected: false,
  chatRooms: [],
  nowChatRoom: null,
  messages: [],
  memberType: 'USER',
};

const chattingSlice = createSlice({
  name: 'chattingSlice',
  initialState,
  reducers: {
    setStompClient: (state, action) => {
      state.stompClient = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setIsSocketConnected: (state, action) => {
      state.isSocketConnected = action.payload;
    },
    setInitChatRooms: (state, action) => {
      const rooms = action.payload;
      rooms.sort((a, b) => new Date(b.timeLastChatCreated) - new Date(a.timeLastChatCreated));
      state.chatRooms = rooms.map((room) => ({
        ...room,
        lastChat: room.lastChatType && room.lastChatType.startsWith('BOT') ? '[BOT]' : room.lastChat,
      }));

      console.log(action.payload);
      if (rooms.length > 0) state.nowChatRoom = state.chatRooms[0];
      state.messages = []; // 메세지 초기화
    },
    setMemberType: (state, action) => {
      state.memberType = action.payload;
    },
    setNowChatRoom: (state, action) => {
      state.nowChatRoom = action.payload;
      state.messages = [];
    },
    addPagingMessages: (state, action) => {
      const newMessages = action.payload;
      state.messages.push(...newMessages);
    },
    addNewMessage: (state, action) => {
      state.messages = [action.payload, ...state.messages];
    },
    updateChatRooms: (state, action) => {
      const {
        chatRoomID, senderType, content, timestamp,
      } = action.payload;
      // 목록 갱신
      const existingChatRoom = state.chatRooms.find((room) => room.chatRoomID === chatRoomID);
      if (existingChatRoom) {
        const updatedChatRooms = state.chatRooms.map((room) => {
          if (room.chatRoomID === chatRoomID) {
            return {
              ...room,
              lastChat: senderType.startsWith('BOT') ? '[BOT]' : content,
              timeLastChatCreated: timestamp,
            };
          }
          return room;
        });

        updatedChatRooms.sort((a, b) => new Date(b.timeLastChatCreated) - new Date(a.timeLastChatCreated));
        console.log(updatedChatRooms);
        return {
          ...state,
          chatRooms: updatedChatRooms,
        };
      }
      return state;
    },
  },
});

export const {
  setStompClient,
  setSocket,
  setIsSocketConnected,
  setInitChatRooms,
  setInitMessages,
  setMemberType,
  setNowChatRoom,
  addPagingMessages,
  addNewMessage,
  updateChatRooms,
} = chattingSlice.actions;

export const sendMessage = (message) => (dispatch, getState) => {
  const { stompClient } = getState().chatting;
  const headers = {
    'Content-Type': 'application/json',
  };
  if (stompClient) {
    stompClient.send('/communicate/publish', headers, JSON.stringify(message));
  }
};

export const connectWebSocket = () => async (dispatch, getState) => {
  const { socket } = getState().chatting; // 현재 상태에서 socket 가져오기

  if (!socket) {
    console.log('소켓 새로 생성');
    // socket이 null인 경우에만 생성
    const newSocket = new SockJS('https://sketchme.ddns.net/api/ws');
    const stompClient = Stomp.over(newSocket);

    stompClient.connect({ Authorization: `Bearer ${sessionStorage.getItem('access_token')}` }, () => {
      console.log('websocket 연결됨~!');
      dispatch(setStompClient(stompClient));
      dispatch(setSocket(newSocket));
      dispatch(setIsSocketConnected(true)); // isSocketConnected를 true로 설정
      stompClient.subscribe(`/topic/${sessionStorage.getItem('memberID')}`, (message) => {
        const received = JSON.parse(message.body);
        console.log(received);
        dispatch(addNewMessage(received));
        dispatch(updateChatRooms(received));
      }, { Authorization: sessionStorage.getItem('access_token') });
    });
  }
};

export default chattingSlice;
