/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ChattingProfileHeader from '../../components/chatting/ChattingProfileHeader';
import ChattingLeftText from '../../components/chatting/ChattingLeftText';
import ChattingRightText from '../../components/chatting/ChattingRightText';
import ChattingInputText from '../../components/chatting/ChattingInputText';

function ChattingDetailPage({ type, handleClick }) {
  // const dispatch = useDispatch();
  const chatRoom = useSelector((state) => state.chatting.nowChatRoom);
  const userId = 1;
  const userProfileImg = 'https://source.unsplash.com/vpOeXr5wmR4/600x600';
  const [messages, setMessages] = useState([
    { id: 1, content: '안녕하세요', senderID: 1 },
    { id: 2, content: '네!!! 작가님 안녕하세요?ㅎㅎ', senderID: 2 },
    { id: 3, content: '예약해주신 부분 요청사항에 대해서 문의드리고 싶어서요. 연락드렸어요^^', senderID: 1 },
    { id: 4, content: '헉 혹시 어떤 부분일까용?', senderID: 2 },
    { id: 5, content: '반려동물과 함께 카테고리를 선택해주셨는데, 반려동물이 가재라고 기재해주셨네요! 근데 가재랑 한 프레임에 같이 나오는 것이 가능한 부분일까요? 그리고 가재가 움직임이 덜한지 궁금합니다!', senderID: 1 },
    { id: 6, content: '아.... 가재가 미동도 없습니다. 그리고 카메라 응시를 잘하는 편이라 그리기 쉬우실 거에요 ㅎㅎ', senderID: 2 },
    { id: 7, content: 'ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ가재 귀엽네용ㅎㅎ', senderID: 1 },
    { id: 8, content: '아 ㅎㅎ 그럼 예약한 시간에 보면 될까요?', senderID: 2 },
    { id: 9, content: '네네! 문제 없습니다. 자세한 사항은 라이브 상담 입장 후 얘기하는 걸로 하죠! ', senderID: 1 },
    { id: 10, content: '네! 그때 뵙겠습니다! 편안한 밤 되세용^^ 👱‍♂️', senderID: 2 },
  ]);
  const scrollRef = useRef();
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // setNewMessages 함수를 사용하여 newMessages를 업데이트하는 예시
  const handleAddNewMessage = (content) => {
    // 현재 메시지 목록(newMessages)의 마지막 id를 가져와서 1을 증가시킨 값을 새로운 메시지의 id로 지정
    const lastMessageId = messages.length > 0 ? messages[messages.length - 1].id : 0;
    const newMessage = { id: lastMessageId + 1, content, senderID: userId };
    // publish!! 하고, new messages 에 추가.
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  useEffect(() => {
    // 스크롤을 새 메시지가 추가된 높이까지 포함해서 맨 아래로 내리는 로직 실행
    scrollToBottom();
    console.log('메시지추가');
  }, [messages]);

  const onClickBack = () => {
    handleClick();
  };

  return (
    <div className="w-full max-h-full px-5 flex flex-col justify-between overflow-contain">
      <ChattingProfileHeader
        type={type}
        profileImg={chatRoom.profileImg}
        nickname={chatRoom.nickname}
        onClickBack={onClickBack}
      />
      <div className="flex flex-col mt-1 overflow-y-scroll" ref={scrollRef}>
        <div className="text-center text-grey mt-5">오전 10:47</div>
        {
          messages && messages.map((message) => (
            message.senderID === userId
              ? (<ChattingRightText type={type} profileImg={userProfileImg} message={message.content} />
              )
              : (<ChattingLeftText type={type} profileImg={chatRoom.profileImg} message={message.content} />
              )
          ))
        }
      </div>
      <ChattingInputText onEnter={handleAddNewMessage} />
    </div>
  );
}

export default ChattingDetailPage;
