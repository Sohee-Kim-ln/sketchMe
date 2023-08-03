import React from 'react';
import { useSelector } from 'react-redux';

import StreamComponent from '../../components/Live/Stream';

function ConsultPage({ localUser, subscribers }) {
  console.log(localUser);
  console.log(subscribers);

  return (
    <div>
      상담화면 입니다
      {/* <UserVideo streamManager={thisMainStreamManager} /> */}
      {/* <Stream user={thisLocalUser} />
      {thisSubscribers.length === 0
        ? thisSubscribers.map((sub, i) => (
            <Stream user={sub} />
          ))
        : null} */}
      {localUser !== undefined &&
        localUser.getStreamManager() !== undefined && (
          <div className="OT_root OT_publisher custom-class" id="localUser">
            <StreamComponent
              user={localUser}
              // handleNickname={this.nicknameChanged}
            />
          </div>
        )}
      {subscribers.map((sub, i) => (
        <div
          key={i}
          className="OT_root OT_publisher custom-class"
          id="remoteUsers"
        >
          <StreamComponent
            user={sub}
            // streamId={sub.streamManager.stream.streamId}
          />
        </div>
      ))}
    </div>
  );
}

export default ConsultPage;
