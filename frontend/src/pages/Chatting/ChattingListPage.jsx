import React, { } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { connectWebSocket, receiveMessage } from '../../reducers/ChatReducer';
import { setNowChatRoom } from '../../reducers/ChatSlice';
import ChattingListItem from '../../components/chatting/ChattingListItem';

function ChattingListPage({ type, handleClick }) {
  const dispatch = useDispatch();
  // const stompClient = useSelector((state) => state.chatting.stompClient);
  // const socket = useSelector((state) => state.chatting.socket);
  const chatRooms = useSelector((state) => state.chatting.chatRooms);

  // const onMessageReceived = (payload) => {
  //   const message = JSON.parse(payload.body);
  //   const { chatRoomId } = message;
  //   dispatch(receiveMessage({ chatRoomId, message }));
  // };

  // useEffect(() => {
  //   if (stompClient && !socket) {
  //     dispatch(connectWebSocket());
  //   }
  // }, [dispatch, stompClient, socket]);

  // useEffect(() => {
  //   if (stompClient) {
  //     stompClient.subscribe('메시지 구독 url', onMessageReceived);
  //   }
  // }, [stompClient]);

  const handleChatRoomClick = (room) => {
    console.log(room);
    if (type != null && type === 'small') { handleClick(); }
    // 현재 채팅방 변경
    // setNowChatRoom 액션을 실행하여 nowChatRoom 변경
    dispatch(setNowChatRoom(room));
  };

  return (
    <div className="w-full max-h-full overflow-contain flex flex-col">
      <div className="mx-5 my-5 text-start font-bold text-black text-xl">채팅</div>
      <div className="flex flex-col overflow-y-scroll">
        {chatRooms.map((room) => (
          <ChattingListItem
            className="cursor-pointer"
            key={room.id}
            item={room}
            onClickRoom={handleChatRoomClick} // 채팅방 클릭 이벤트 핸들러 추가
          />
        ))}
      </div>
    </div>
  );
}

export default ChattingListPage;
