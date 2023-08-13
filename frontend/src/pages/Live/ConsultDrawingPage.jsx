/* eslint-disable indent */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import StreamComponent from '../../components/Live/Stream';
// eslint-disable-next-line import/no-cycle
import DrawingBox from '../../components/drawing/DrawingBox';
import LiveInfoBox from '../../components/Live/LiveInfoBox';
// import ChatBox from '../../components/Live/ChatBox';

function ConsultDrawingPage({
  localUser,
  subscribers,
  sharedCanvas,
  showCanvas,
}) {
  const liveStatus = useSelector((state) => state.live.liveStatus);
  const localUserRole = useSelector((state) => state.live.localUserRole);

  useEffect(() => {
    console.log(sharedCanvas);
  }, [sharedCanvas]);

  return (
    <div>
      {liveStatus === 1 ? (
        <div>상담화면 입니다</div>
      ) : (
        <div>드로잉화면 입니다</div>
      )}

      <div id="rightBody" className="w-40">
        {localUserRole === 'artist' ? (
          <DrawingBox showCanvas={showCanvas} />
        ) : (
          <div>
            <LiveInfoBox />
            <StreamComponent user={sharedCanvas} />
          </div>
        )}
      </div>

      <div id="rightSideBar">
        {liveStatus === 1 ? (
          // 상담 화면이면 상대, 나 순서대로 띄움
          <div>
            {subscribers.length !== 0
              ? subscribers
                  .filter((sub) => sub.role !== 'canvas')
                  .map((sub) => (
                    <div key={sub.connectionId} id="remoteUsers">
                      <StreamComponent user={sub} />
                    </div>
                  ))
              : null}
            <StreamComponent user={localUser} />
          </div>
        ) : (
          // 드로잉 화면이면 게스트 띄움
          <div>
            {localUserRole === 'artist' ? (
              subscribers
                .filter((sub) => sub.role === 'guest')
                .map((sub) => (
                  <div key={sub.connectionId} id="remoteUsers">
                    <StreamComponent user={sub} />
                  </div>
                ))
            ) : (
              <StreamComponent user={localUser} />
            )}
          </div>
        )}
        <div>캔버스</div>
        <StreamComponent user={sharedCanvas} />
        <div>캔버스끝</div>
        {/* 상담화면이면 채팅, 드로잉중이면 요구사항 띄우기 */}
        {liveStatus === 2 ? '요구사항 입니다' : null}
      </div>
    </div>
  );
}

export default ConsultDrawingPage;
