/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { Satellite } from '@mui/icons-material';
import { createSlice, current } from '@reduxjs/toolkit';
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
      return {
        ...state,
        chatRooms: rooms.map((room) => ({
          ...room,
          lastChat: room.lastChatType && room.lastChatType.startsWith('BOT') ? '[BOT]' : room.lastChat,
        })),
        messages: [], // 상태 변경이 아닌 새로운 객체 반환
      };
    },
    setMemberType: (state, action) => {
      state.memberType = action.payload;
    },
    setNowChatRoom: (state, action) => {
      if (state.nowChatRoom && (current(state.nowChatRoom).chatRoomID !== action.payload.chatRoomID)) {
        state.messages = [];
      }
      state.nowChatRoom = action.payload;
    },
    addPagingMessages: (state, action) => {
      const newMessages = action.payload;
      state.messages.push(...newMessages);
    },
    addNewMessage: (state, action) => {
      const nowChatRoom = state.nowChatRoom ? current(state.nowChatRoom).chatRoomID : null;
      if (!nowChatRoom || action.payload.chatRoomID === nowChatRoom) {
        state.messages = [action.payload, ...state.messages];
      }
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

        return {
          ...state,
          chatRooms: updatedChatRooms,
        };
      }

      // 기존 채팅방이 아닌 경우, 기존 chatRooms에 새로운 채팅방을 추가하여 반환
      const newChatRoom = {
        chatRoomID,
        lastChat: senderType.startsWith('BOT') ? '[BOT]' : content,
        timeLastChatCreated: timestamp,
        // ... (기타 필요한 프로퍼티 추가)
      };

      const addedChatRoom = [
        ...state.chatRooms, // 기존 채팅방 목록 유지
        newChatRoom, // 새로운 채팅방 추가
      ];

      addedChatRoom.sort((a, b) => new Date(b.timeLastChatCreated) - new Date(a.timeLastChatCreated));

      return {
        ...state,
        chatRooms: addedChatRoom,
      };
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
        dispatch(updateChatRooms(received));
        dispatch(addNewMessage(received));
      }, { Authorization: sessionStorage.getItem('access_token') });
    });
  }
};

export default chattingSlice;
