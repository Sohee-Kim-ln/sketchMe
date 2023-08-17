/* eslint-disable indent */
import React from 'react';
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

  return (
    <div className="flex">
      <div id="rightBody" className="grow">
        {localUserRole === 'artist' ? (
          <DrawingBox showCanvas={showCanvas} />
        ) : (
          <div className="flex">
            <LiveInfoBox />
            <div className="flex justify-center item-center">
              {/* <StreamComponent user={sharedCanvas} /> */}
              {subscribers
                .filter((sub) => sub.role === 'canvas')
                .map((sub) => (
                  <StreamComponent user={sub} key={sub.connectionId} />
                ))}
            </div>
          </div>
        )}
      </div>

      <div id="rightSideBar">
        {liveStatus === 1 ? (
          // 상담 화면이면 상대, 나 순서대로 띄움
          <div>
            {subscribers.length !== 0 ? (
              subscribers
                .filter((sub) => sub.role !== 'canvas')
                .map((sub) => (
                  <StreamComponent user={sub} key={sub.connectionId} />
                ))
            ) : (
              <div>상대방을 기다리는 중 입니다</div>
            )}
            <StreamComponent user={localUser} />
          </div>
        ) : (
          // 드로잉 화면이면 게스트 띄움
          <div className="h-1/2 max-h-half">
            {localUserRole === 'artist' ? (
              subscribers
                .filter((sub) => sub.role === 'guest')
                .map((sub) => (
                  <StreamComponent user={sub} key={sub.connectionId} />
                ))
            ) : (
              <StreamComponent user={localUser} />
            )}
          </div>
        )}
        {/* <div>캔버스 테스트</div>
        {localUserRole === 'artist' ? (
          <StreamComponent user={sharedCanvas} />
        ) : (
          subscribers
            .filter((sub) => sub.role === 'canvas')
            .map((sub) => (
              <div key={sub.connectionId} id="remoteUsers">
                <StreamComponent user={sub} />
              </div>
            ))
        )}
        <div>캔버스 테스트 끝</div> */}
        {/* 상담화면이면 채팅, 드로잉중이면 요구사항 띄우기 */}
        {liveStatus === 2 ? '요구사항 입니다' : null}
      </div>
    </div>
  );
}

export default ConsultDrawingPage;
