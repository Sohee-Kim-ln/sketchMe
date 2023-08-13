import React from 'react';

import { MicOff, VideocamOff, VolumeOff } from '@mui/icons-material';
import OvVideoComponent from './ovVideo';

function Stream({ user }) {
  return (
    <div className="OT_widget-container">
      {user !== undefined && user.streamManager !== undefined ? (
        <div className="streamComponent">
          <OvVideoComponent user={user} mutedSound={user.micActive} />
          <div className="nickname">{user.nickname}</div>
          <div>{user.connectionId}</div>
          <div>{user.micActive}</div>
          <div>{user.audioActive}</div>
          <div>{user.videoActive}</div>
          <div>{user.type}</div>
          <div>{user.role}</div>
          <div id="statusIcons">
            {!user.micActive ? <MicOff color="secondary" /> : null}
            {!user.audioActive ? <VolumeOff color="secondary" /> : null}
            {!user.videoActive ? <VideocamOff color="secondary" /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Stream;
