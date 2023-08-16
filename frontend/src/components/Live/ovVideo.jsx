import React, { useEffect, useRef } from 'react';
// import './StreamComponent.css';

function OvVideoComponent({ user }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (user && user.streamManager && !!videoRef.current) {
      user.streamManager.addVideoElement(videoRef.current);
    }

    if (user && user.streamManager.session && !!videoRef.current) {
      user.streamManager.session.on('signal:userChanged', (e) => {
        const data = JSON.parse(e.data);
        if (data.isScreenShareActive !== undefined) {
          user.streamManager.addVideoElement(videoRef.current);
        }
      });
    }

    // The cleanup function to remove the event listener when the component unmounts
    return () => {
      if (user && user.streamManager.session && !!videoRef.current) {
        user.streamManager.session.off('signal:userChanged');
      }
    };
  }, [user, videoRef]);

  useEffect(() => {
    if (user && !!videoRef.current) {
      user.streamManager.addVideoElement(videoRef.current);
    }
  }, [user, videoRef]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      autoPlay
      id={`video-${user.streamManager.stream.streamId}`}
      ref={videoRef}
      muted={!user.micActive}
      style={{
        border: user.isSpeaking ? '4px solid green' : '0px solid black',
      }}
      className="h-full"
    />
  );
}

export default OvVideoComponent;
