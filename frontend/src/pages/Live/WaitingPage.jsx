import React from 'react';
import { useSelector } from 'react-redux';
function WaitingPage() {
  const isWaiting = useSelector((state) => state.live.waitingActive);
  return (
    <div>
      {isWaiting ? <div>접속 중 입니다.</div> : <div>대기화면 입니다.</div>}
    </div>
  );
}

export default WaitingPage;
