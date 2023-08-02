/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { createSlice } from '@reduxjs/toolkit';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const dummyChatRooms = [
  {
    id: 1,
    profileImg: 'https://source.unsplash.com/L2cxSuKWbpo/600x600',
    nickname: '가재주인',
    message: '네 그럼 그때 뵙겠습니다^^ 잘 부탁드려용 네 그럼 그때 뵙겠습니다^^ 잘 부탁드려용',
  },
  {
    id: 2,
    profileImg: 'https://source.unsplash.com/otT2199XwI8/600x600',
    nickname: '예비가재주인',
    message: '안녕하세요~ 반갑습니다. 예비가재주인입니다 껄껄껄',
  },
  {
    id: 3,
    profileImg: 'https://source.unsplash.com/vpOeXr5wmR4/600x600',
    nickname: '바보주인',
    message: '허허허허 제가 좀 멍청해서요 허허허허',
  },
  {
    id: 4,
    profileImg: 'https://designmong.kr/web/product/big/201707/203_shop1_902066.jpg',
    nickname: '으랏챠챠농부',
    message: '안녕하세요 저는 농부일까요 화가일까요 푸하하하하하하핳하하하하',
  },
  {
    id: 5,
    profileImg: 'https://cdn.spotvnews.co.kr/news/photo/202301/580829_806715_1352.jpg',
    nickname: '카카리리나나',
    message: '넥스트 레벨~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  },
  {
    id: 6,
    profileImg: 'https://ynoblesse.com/wp-content/uploads/2022/08/297975306_1008248209844272_696700848492592655_n.jpg',
    nickname: '요즘잘자쿨냥이',
    message: '냐냐냐냐오옹오옹냐옹냐옹오오옹냐냔냐냥냐냐얀야냥??냥냥!!',
  },
  {
    id: 7,
    profileImg: 'https://source.unsplash.com/L2cxSuKWbpo/600x600',
    nickname: '가재주인',
    message: '네 그럼 그때 뵙겠습니다^^ 잘 부탁드려용 네 그럼 그때 뵙겠습니다^^ 잘 부탁드려용',
  },
  {
    id: 8,
    profileImg: 'https://source.unsplash.com/otT2199XwI8/600x600',
    nickname: '예비가재주인',
    message: '안녕하세요~ 반갑습니다. 예비가재주인입니다 껄껄껄',
  },
  {
    id: 9,
    profileImg: 'https://source.unsplash.com/vpOeXr5wmR4/600x600',
    nickname: '바보주인',
    message: '허허허허 제가 좀 멍청해서요 허허허허',
  },
  {
    id: 10,
    profileImg: 'https://designmong.kr/web/product/big/201707/203_shop1_902066.jpg',
    nickname: '으랏챠챠농부',
    message: '안녕하세요 저는 농부일까요 화가일까요 푸하하하하하하핳하하하하',
  },
  {
    id: 11,
    profileImg: 'https://cdn.spotvnews.co.kr/news/photo/202301/580829_806715_1352.jpg',
    nickname: '카카리리나나',
    message: '넥스트 레벨~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
  },
  {
    id: 12,
    profileImg: 'https://ynoblesse.com/wp-content/uploads/2022/08/297975306_1008248209844272_696700848492592655_n.jpg',
    nickname: '요즘잘자쿨냥이',
    message: '냐냐냐냐오옹오옹냐옹냐옹오오옹냐냔냐냥냐냐얀야냥??냥냥!!',
  },
];

const initialState = {
  stompClient: null,
  socket: null,
  chatRooms: dummyChatRooms,
  nowChatRoom: dummyChatRooms.length > 0 ? { ...dummyChatRooms[0], messages: [] } : null,
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
    setNowChatRoom: (state, action) => {
      state.nowChatRoom = action.payload;
    },
    receiveMessage: (state, action) => {
      const { chatRoomId, message } = action.payload;
      // 목록 갱신
      const existingChatRoom = state.find((room) => room.id === chatRoomId);
      if (existingChatRoom) {
        const updatedChatRooms = state.map((room) => {
          if (room.id === chatRoomId) {
            return {
              ...room,
              lastMessage: message,
              lastMessageReceivedTime: new Date().toISOString(),
            };
          }
          return room;
        });
        return updatedChatRooms.sort((a, b) => new Date(b.lastMessageReceivedTime) - new Date(a.lastMessageReceivedTime));
      }
      return [
        ...state,
        {
          id: chatRoomId,
          lastMessage: message,
          lastMessageReceivedTime: new Date().toISOString(),
        },
      ];
    },
  },
});

export const {
  setStompClient,
  setSocket,
  setNowChatRoom,
  receiveMessage,
} = chattingSlice.actions;

export const connectWebSocket = () => (dispatch) => {
  const socket = new SockJS('socket연결url');
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    console.log('websocket 연결됨~!');
    dispatch(setStompClient(stompClient));
    dispatch(setSocket(socket));
  });
};

export default chattingSlice;
