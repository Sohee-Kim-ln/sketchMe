import React from 'react';
// import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toolbar, IconButton, Button } from '@mui/material';
// import { AppBar, Toolbar, IconButton } from '@mui/material';
import {
  Mic,
  MicOff,
  VolumeUp,
  VolumeOff,
  Videocam,
  VideocamOff,

  // PictureInPicture,
  // ScreenShare,
  // StopScreenShare,
  MusicNote,
  MusicOff,
  // Fullscreen,
  // FullscreenExit,
} from '@mui/icons-material';

import {
  changeMic,
  changeAudio,
  changeVideo,
  // changeScreenShare,
  changeBgm,
  // changeFullScreen,
} from '../../reducers/VideoSlice';

import { addLiveStatus, resetLiveStatus } from '../../reducers/LiveSlice';
// import { palettimy } from '../../../public/img/logosketch.png';

function UnderBar({
  joinSession,
  leaveSession,
  sendMicSignal,
  sendAudioSignal,
  sendVideoSignal,
}) {
  const thisLiveStatus = useSelector((state) => state.live.liveStatus);
  const localUserRole = useSelector((state) => state.live.localUserRole);
  const thisSessionId = useSelector((state) => state.live.mySessionId);
  // const thisSession = useSelector((state) => state.live.session);
  const isMic = useSelector((state) => state.video.micActive);
  const isAudio = useSelector((state) => state.video.audioActive);
  const isVideo = useSelector((state) => state.video.videoActive);
  // const isScreenShare = useSelector((state) => state.video.screenShareActive);
  const isBgm = useSelector((state) => state.video.bgmActive);
  // const isFullscreen = useSelector((state) => state.video.fullScreenActive);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   sendSignal();
  // }, [isMic, isAudio, isVideo]);

  // 라이브 상태변수 핸들러
  const handleLiveStatusButtonClick = () => {
    if (thisLiveStatus === 0) {
      joinSession(thisSessionId);
    } else if (thisLiveStatus === 1 || thisLiveStatus === 2) {
      dispatch(addLiveStatus());
    } else if (thisLiveStatus === 3) {
      leaveSession();
      navigate('/');
      dispatch(resetLiveStatus());
    }
  };

  // 마이크 버튼 핸들러
  const handleMicButtonClick = () => {
    dispatch(changeMic());
    sendMicSignal();
  };

  // 오디오 버튼 핸들러
  const handleAudioButtonClick = () => {
    dispatch(changeAudio());
    sendAudioSignal();
  };

  // 비디오 버튼 핸들러
  const handleVideoButtonClick = () => {
    dispatch(changeVideo());
    sendVideoSignal();
  };

  // // 화면공유 버튼 핸들러
  // const handleScreenShareButtonClick = () => {
  //   dispatch(changeScreenShare());
  // };
  // Bgm 버튼 핸들러
  const handleBgmButtonClick = () => {
    dispatch(changeBgm());
  };

  // // 풀스크린 버튼 핸들러
  // const handleFullScreenButtonClick = () => {
  //   dispatch(changeFullScreen());
  // };

  return (
    <div className="stiky bottom-0 w-full">
      <Toolbar className="toolbar h-16 flex flex-row justify-center bg-primary_3 align-middle ">
        <div className="buttonsContent grow flex justify-center item-center">
          <IconButton
            color="inherit"
            className="navButton"
            id="navMicButton"
            onClick={handleMicButtonClick}
          >
            {!isMic ? <Mic /> : <MicOff style={{ color: 'red' }} />}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            id="navSpeakerButton"
            onClick={handleAudioButtonClick}
          >
            {!isAudio ? <VolumeUp /> : <VolumeOff style={{ color: 'red' }} />}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            id="navCamButton"
            onClick={handleVideoButtonClick}
          >
            {!isVideo ? <Videocam /> : <VideocamOff style={{ color: 'red' }} />}
          </IconButton>

          {/* <IconButton
            color="inherit"
            className="navButton"
            onClick={handleScreenShareButtonClick}
          >
            {isScreenShare ? (
              <ScreenShare />
            ) : (
              <StopScreenShare style={{ color: 'red' }} />
            )}

          </IconButton> */}

          <IconButton
            color="inherit"
            className="navButton"
            id="navBgmButton"
            onClick={handleBgmButtonClick}
          >
            {isBgm ? <MusicNote /> : <MusicOff style={{ color: 'red' }} />}
          </IconButton>

          {/* <IconButton
            color="inherit"
            className="navButton"
            onClick={handleFullScreenButtonClick}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton> */}
        </div>
        {localUserRole === 'artist' ? (
          <div>
            <button
              type="button"
              onClick={handleLiveStatusButtonClick}
              className="bg-primary w-36 text-white rounded-[4px] px-2 py-2 hover:bg-primary_dark"
            >
              {thisLiveStatus === 0 ? <span>상담 시작하기</span> : null}
              {thisLiveStatus === 1 ? <span>드로잉 시작하기</span> : null}
              {thisLiveStatus === 2 ? <span>드로잉 완성하기</span> : null}
              {thisLiveStatus === 3 ? <span>라이브 종료</span> : null}
            </button>
          </div>
        ) : null}
        {localUserRole === 'guest' && thisLiveStatus === 0 ? (
          <Button
            variant="contained"
            onClick={handleLiveStatusButtonClick}
            color="secondary"
          >
            <span>상담 시작하기</span>
          </Button>
        ) : null}
      </Toolbar>
    </div>
  );
}

export default UnderBar;
