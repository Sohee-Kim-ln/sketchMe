import React from 'react';

import { MicOff, VideocamOff, VolumeOff } from '@mui/icons-material';
import OvVideoComponent from './ovVideo';

function Stream({ user }) {
  return (
    <div className="OT_widget-container">
      {user !== undefined && user.streamManager !== undefined ? (
        <div className="streamComponent">
          <OvVideoComponent
            user={user}
            mutedSound={user.type === 'local' ? false : user.micActive}
          />
          <div className="nickname">{user.nickname}</div>
          <div>{user.connectionId}</div>
          <div id="statusIcons">
            {!user.micActive ? <MicOff color="secondary" /> : null}
            {!user.audioActive ? <VolumeOff color="secondary" /> : null}
            {!user.videoActive ? <VideocamOff color="secondary" /> : null}
          </div>
        </div>
      ) : (
        <div>영상 로딩 중 입니다</div>
      )}
    </div>
  );
}

export default Stream;
