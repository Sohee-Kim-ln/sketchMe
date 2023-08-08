import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setNowChatRoom, setInitChatRooms } from '../../reducers/ChatSlice';
import ChattingListItem from '../../components/chatting/ChattingListItem';
import API from '../../utils/api';

function ChattingListPage({ type, handleClick }) {
  const dispatch = useDispatch();
  const chatRooms = useSelector((state) => state.chatting.chatRooms);

  const handleChatRoomClick = (room) => {
    console.log(room);
    if (type != null && type === 'small') { handleClick(); }
    // 현재 채팅방 변경
    dispatch(setNowChatRoom(room));
  };

  // 채팅방 목록을 가져오는 액션
  const getChatRooms = async (userID, memberType) => {
    let data;
    try {
      const url = `/api/chatroom/list?userID=${userID}&memberType=${memberType}`;
      const response = await API.get(url);
      data = response.data;
      console.log(data);
    } catch (error) {
      console.error('채팅방 목록을 가져오는 데 실패했습니다.', error);
    }
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChatRooms(1, 'USER');
        dispatch(setInitChatRooms(data.data));
      } catch (error) {
        console.error('채팅방 목록을 가져오는데 실패했습니다.', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full overflow-contain flex flex-col">
      <div className="mx-5 my-5 text-start font-bold text-black text-xl flex flex-col flex-5">채팅</div>
      {chatRooms.length > 0 ? (
        <div className="flex flex-col h-full overflow-auto">
          {chatRooms.map((room) => (
            <ChattingListItem
              className="cursor-pointer"
              key={room.chatRoomID}
              item={room}
              onClickRoom={handleChatRoomClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-xl mx-3 mt-5 p-5">채팅방 목록이 없습니다.</div>
      )}
    </div>
  );
}

export default ChattingListPage;
