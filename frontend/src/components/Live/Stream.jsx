import React from 'react';

import { MicOff, VideocamOff, VolumeOff } from '@mui/icons-material';
import OvVideoComponent from './ovVideo';

function Stream({ user }) {
  return (
    <div className="h-1/2 max-h-1/2">
      {user !== undefined && user.streamManager !== undefined ? (
        <div className="streamComponent">
          <OvVideoComponent
            user={user}
            mutedSound={user.type === 'local' ? false : user.micActive}
          />
          <div className="nickname">
            {user.nickname}
            {user.role === 'artist' ? '작가' : null}
            {user.role === 'guest' ? '고객' : null}
          </div>
          <div id="statusIcons" className="absolute right-0 bottom-0 flex">
            {user.micActive ? null : <MicOff color="secondary" />}
            {user.audioActive ? null : <VolumeOff color="secondary" />}
            {user.videoActive ? null : <VideocamOff color="secondary" />}
          </div>
        </div>
      ) : (
        <div>영상 로딩 중 입니다</div>
      )}
    </div>
  );
}

export default Stream;
