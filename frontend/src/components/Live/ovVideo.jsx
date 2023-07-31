import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

function ovVideo({ streamManager, mutedSound }) {
  const videoRef = useRef(null);
  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current);
    }
  }, [streamManager]);

  return <video autoPlay={true} ref={videoRef} />;
}

ovVideo.propTypes={
  streamManager: PropTypes.any.isRequired,
  mutedSound: PropTypes.bool.isRequired
}

export default ovVideo;
