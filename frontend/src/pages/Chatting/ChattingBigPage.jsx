import React, { useEffect, useState } from 'react';
import ChattingListPage from './ChattingListPage';
import ChattingDetailPage from './ChattingDetailPage';

function ChattingBigPage() {
  const [showDetail, setShowDetail] = useState(false);
  useEffect(() => {
    // chattinglistpage가 렌더링된 후 0.5초 뒤에 chattingdetailpage를 렌더링
    const timer = setTimeout(() => {
      setShowDetail(true);
    }, 500);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  return (
    <div className="flex flex-row h-[calc(100vh-5rem)] overscroll-hidden justify-between bg-white">
      <div className="flex flex-col h-full w-1/5 border-grey border-r-2 overflow-y-auto">
        <ChattingListPage />
      </div>
      {showDetail && <ChattingDetailPage type="big" />}
    </div>
  );
}

export default ChattingBigPage;
