import React, { useEffect, useRef } from 'react';
// import './StreamComponent.css';

function OvVideoComponent({ user, mutedSound }) {
  const videoRef = useRef();

  useEffect(() => {
    if (user && user.streamManager && !!videoRef.current) {
      console.log(user);
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
  }, [user, mutedSound, videoRef]);

  useEffect(() => {
    if (user && !!videoRef.current) {
      user.streamManager.addVideoElement(videoRef.current);
    }
  }, [user, mutedSound, videoRef]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      autoPlay
      id={`video-${user.streamManager.stream.streamId}`}
      ref={videoRef}
      muted={mutedSound}
    />
  );
}

export default OvVideoComponent;
