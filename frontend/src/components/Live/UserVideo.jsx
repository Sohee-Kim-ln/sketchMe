import React, { Component } from 'react';
import ovVideo from './ovVideo';

function UserVideo(props) {
  const getNicknameTag = () => {
    return JSON.parse(props.streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {this.props.streamManager !== undefined ? (
        <div className="streamcomponent">
          <ovVideo streamManager={props.streamManager} />
          <div>
            <p>{getNicknameTag()}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UserVideo;
