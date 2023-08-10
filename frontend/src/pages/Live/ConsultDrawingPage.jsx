import React from 'react';
import { useSelector } from 'react-redux';

import StreamComponent from '../../components/Live/Stream';
import DrawingBox from '../../components/drawing/DrawingBox';
import LiveInfoBox from '../../components/Live/LiveInfoBox';
import ChatBox from '../../components/Live/ChatBox';

function ConsultDrawingPage({ localUser, subscribers, sharedCanvas }) {
  const liveStatus = useSelector((state) => state.live.liveStatus);

  return (
    <div>
      {liveStatus === 1 ? (
        <div>상담화면 입니다</div>
      ) : (
        <div>드로잉화면 입니다</div>
      )}

      <div id="rightBody">
        {localUser.role === 'artist' ? (
          <DrawingBox />
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
                .filter((sub) => sub !== 'canvas')
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
            {localUser.role === 'guest' ? (
              <StreamComponent user={localUser} />
            ) : (
              subscribers
                .filter((sub) => sub.role === 'guest')
                .map((sub) => (
                  <div key={sub.connectionId} id="remoteUsers">
                    <StreamComponent user={sub} />
                  </div>
                ))
            )}
          </div>
        )}

        {/* 상담화면이면 채팅, 드로잉중이면 요구사항 띄우기 */}
        {liveStatus === 1 ? <ChatBox /> : '요구사항 입니다'}
      </div>
    </div>
  );
}

export default ConsultDrawingPage;
