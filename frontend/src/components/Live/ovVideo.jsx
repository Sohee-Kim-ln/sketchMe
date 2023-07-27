import React, { useEffect, useRef } from 'react';

function ovVideo(props) {
  const videoRed = useRef(null);
  useEffect(() => {
    if (props.streamManager && videoRef.current) {
      props.streamManager.addVideoElement(videoRef.current);
    }
  }, [props.streamManager]);

  return <video autoPlay={true} ref={videoRef} />;
}

export default ovVideo;
