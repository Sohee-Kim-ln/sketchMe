import React from 'react';
// import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Toolbar } from '@mui/material';
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
import BaseBtnPurple from '../common/BaseBtnPurple';

function UnderBar({
  joinSession,
  leaveSession,
  sendMicSignal,
  sendAudioSignal,
  sendVideoSignal,
  session,
}) {
  const thisLiveStatus = useSelector((state) => state.live.liveStatus);
  const localUserRole = useSelector((state) => state.live.localUserRole);
  const thisMeetingId = useSelector((state) => state.live.meetingId);
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
  const handleLiveStatusButtonClick = async () => {
    if (thisLiveStatus === 0) {
      joinSession(thisMeetingId);
      // const url = `api/meeting/${thisMeetingId}/reservation-info`;
      // const response = await API.get(url);

      // console.log(response);
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
    sendMicSignal(session);
  };

  // 오디오 버튼 핸들러
  const handleAudioButtonClick = () => {
    dispatch(changeAudio());
    sendAudioSignal(session);
  };

  // 비디오 버튼 핸들러
  const handleVideoButtonClick = () => {
    dispatch(changeVideo());
    sendVideoSignal(session);
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
        <div className="buttonsContent grow flex justify-center item-center gap-x-4">
          <button
            type="button"
            onClick={handleMicButtonClick}
            className="py-2 px-4 h-10 rounded-lg  flex justify-center items-center hover:bg-shadowbg focus:ring-primary_3 focus:ring-offset-primary_3 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 "
          >
            {!isMic ? (
              <div>
                <Mic />
                마이크 켜짐
              </div>
            ) : (
              <div>
                <MicOff style={{ color: 'red' }} />
                마이크 꺼짐
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={handleAudioButtonClick}
            className="py-2 px-4 h-10 rounded-lg  flex justify-center items-center hover:bg-shadowbg focus:ring-primary_3 focus:ring-offset-primary_3 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 "
          >
            {!isAudio ? (
              <div>
                <VolumeUp />
                소리 켜짐
              </div>
            ) : (
              <div>
                <VolumeOff style={{ color: 'red' }} />
                소리 꺼짐
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={handleVideoButtonClick}
            className="py-2 px-4 h-10 rounded-lg  flex justify-center items-center hover:bg-shadowbg focus:ring-primary_3 focus:ring-offset-primary_3 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 "
          >
            {!isVideo ? (
              <div>
                <Videocam />
                카메라 켜짐
              </div>
            ) : (
              <div>
                <VideocamOff style={{ color: 'red' }} />
                카메라 꺼짐
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={handleBgmButtonClick}
            className="py-2 px-4 h-10 rounded-lg  flex justify-center items-center hover:bg-shadowbg focus:ring-primary_3 focus:ring-offset-primary_3 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 "
          >
            {isBgm ? (
              <div>
                <MusicNote />
                배경음악 켜짐
              </div>
            ) : (
              <div>
                <MusicOff style={{ color: 'red' }} />
                배경음악 꺼짐
              </div>
            )}
          </button>
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
          <BaseBtnPurple
            message="상담 시작하기"
            onClick={handleLiveStatusButtonClick}
          />
        ) : null}
      </Toolbar>
    </div>
  );
}

export default UnderBar;
