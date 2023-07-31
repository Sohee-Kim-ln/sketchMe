import React from 'react';
// import PropTypes from 'prop-types';

import { useSelector, useDispatch } from 'react-redux';

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
  ScreenShare,
  StopScreenShare,
  MusicNote,
  MusicOff,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';

import {
  changeMic,
  changeAudio,
  changeVideo,
  changeScreenShare,
  changeBgm,
  changeFullScreen,
} from '../../reducers/VideoSlice';

import { addLiveStatus } from '../../reducers/LiveSlice';

function UnderBar() {
  const thisLiveStatus = useSelector((state) => state.live.liveStatus);

  const isMic = useSelector((state) => state.video.micActive);
  const isAudio = useSelector((state) => state.video.audioActive);
  const isVideo = useSelector((state) => state.video.videoActive);
  const isScreenShare = useSelector((state) => state.video.screenShareActive);
  const isBgm = useSelector((state) => state.video.bgmActive);
  const isFullscreen = useSelector((state) => state.video.fullScreenActive);

  const dispatch = useDispatch();

  // 라이브 상태변수 핸들러
  const handleLiveStatusButtonClick = () => {
    dispatch(addLiveStatus());
  };

  // 마이크 버튼 핸들러
  const handleMicButtonClick = () => {
    dispatch(changeMic());
  };

  // 오디오 버튼 핸들러
  const handleAudioButtonClick = () => {
    dispatch(changeAudio());
  };

  // 비디오 버튼 핸들러
  const handleVideoButtonClick = () => {
    dispatch(changeVideo());
  };

  // 화면공유 버튼 핸들러
  const handleScreenShareButtonClick = () => {
    dispatch(changeScreenShare());
  };
  // Bgm 버튼 핸들러
  const handleBgmButtonClick = () => {
    dispatch(changeBgm());
  };

  // 풀스크린 버튼 핸들러
  const handleFullScreenButtonClick = () => {
    dispatch(changeFullScreen());
  };

  // const mySessionId = props.sessionId;
  // const localUser = props.user;

  return (
    <div>
      <Toolbar className="toolbar">
        <div className="buttonsContent">
          <IconButton
            color="inherit"
            className="navButton"
            id="navMicButton"
            onClick={handleMicButtonClick}
          >
            {isMic ? <Mic /> : <MicOff color="secondary" />}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            id="navSpeakerButton"
            onClick={handleAudioButtonClick}
          >
            {isAudio ? <VolumeUp /> : <VolumeOff color="secondary" />}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            id="navCamButton"
            onClick={handleVideoButtonClick}
          >
            {isVideo ? <Videocam /> : <VideocamOff color="secondary" />}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            onClick={handleScreenShareButtonClick}
          >
            {isScreenShare ? (
              <ScreenShare />
            ) : (
              <StopScreenShare color="secondary" />
            )}
            {/* {isScreenShare ? <PictureInPicture /> : <ScreenShare />} */}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            id="navBgmButton"
            onClick={handleBgmButtonClick}
          >
            {isBgm ? <MusicNote /> : <MusicOff color="secondary" />}
          </IconButton>

          {/* 카메라 전환 구현 안함 */}
          {/* <IconButton
            color="inherit"
            className="navButton"
            onClick={switchCamera}
          >
            <SwitchVideoIcon />
          </IconButton> */}

          <IconButton
            color="inherit"
            className="navButton"
            onClick={handleFullScreenButtonClick}
          >
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>

          {/* <IconButton
            color="secondary"
            className="navButton"
            onClick={leaveSession}
            id="navLeaveButton"
          >
            <PowerSettingsNew />
          </IconButton> */}

          {/* <IconButton color="inherit" onClick={toggleChat} id="navChatButton">
            {props.showNotification && <div id="point" className="" />}
            <Tooltip title="Chat">
              <QuestionAnswer />
            </Tooltip>
          </IconButton> */}
        </div>
      </Toolbar>
      <Button
        variant="contained"
        onClick={handleLiveStatusButtonClick}
      >
        {thisLiveStatus === 0 ? '드로잉 시작하기' : null}
        {thisLiveStatus === 1 ? '드로잉 완성하기' : null}
        {thisLiveStatus === 2 ? '라이브 종료' : null}
      </Button>
    </div>
  );

  // import MicOff from '@mui/icons-material/MicOff';
  // // import MicOff from '@material-ui/icons/MicOff';
  // import VideocamOff from '@mui/icons-material/VideocamOff';
  // import VolumeUp from '@mui/icons-material/VolumeUp';
  // import VolumeOff from '@mui/icons-material/VolumeOff';
  // import FormControl from '@material-ui/core/FormControl';
  // import Input from '@material-ui/core/Input';
  // import InputLabel from '@material-ui/core/InputLabel';
  // import IconButton from '@material-ui/core/IconButton';
  // import HighlightOff from '@mui/icons-material/HighlightOff';
  // import FormHelperText from '@material-ui/core/FormHelperText';

  // import MicOffIcon from '@mui/icons-material/MicOff';
  // import VideocamOffIcon from '@mui/icons-material/VideocamOff';
  // import VolumeUpIcon from '@mui/icons-material/VolumeUp';
  // import VolumeOffIcon from '@mui/icons-material/VolumeOff';
  // import FormControl from '@mui/material/FormControl';
  // import Input from '@mui/material/Input';
  // import InputLabel from '@mui/material/InputLabel';
  // import IconButton from '@mui/material/IconButton';
  // import HighlightOffIcon from '@mui/icons-material/HighlightOff';
  // import FormHelperText from '@mui/material/FormHelperText';

  // const [nickname, setNickname] = useState(user.getNickname());
  // const [showForm, setShowForm] = useState(false);
  // const [mutedSound, setMutedSound] = useState(false);
  // const [isFormValid, setIsFormValid] = useState(true);

  // const handleChange = (event) => {
  //   setNickname(event.target.value);
  //   event.preventDefault();
  // };

  // const toggleNicknameForm = () => {
  //   if (props.user.isLocal()) {
  //     setShowForm(!showForm);
  //   }
  // };

  // const toggleSound = () => {
  //   setMutedSound(!mutedSound);
  // };

  // const handlePressKey = (event) => {
  //   if (event.key === 'Enter') {
  //     console.log(nickname);
  //     if (nickname.length >= 3 && nickname.length <= 20) {
  //       props.handleNickname(nickname);
  //       toggleNicknameForm();
  //       setIsFormValid(true);
  //     } else {
  //       setIsFormValid(false);
  //     }
  //   }
  // };

  // return (
  //   <div className="OT_widget-container">
  //     <div className="pointer nickname">
  //       {showForm ? (
  //         <FormControl id="nicknameForm">
  //           <IconButton
  //             color="inherit"
  //             id="closeButton"
  //             onClick={toggleNicknameForm}
  //           >
  //             <HighlightOffIcon />
  //           </IconButton>
  //           <InputLabel htmlFor="name-simple" id="label">
  //             Nickname
  //           </InputLabel>
  //           <Input
  //             color="inherit"
  //             id="input"
  //             value={nickname}
  //             onChange={handleChange}
  //             onKeyPress={handlePressKey}
  //             required
  //           />
  //           {!isFormValid && nickname.length <= 3 && (
  //             <FormHelperText id="name-error-text">
  //               Nickname is too short!
  //             </FormHelperText>
  //           )}
  //           {!isFormValid && nickname.length >= 20 && (
  //             <FormHelperText id="name-error-text">
  //               Nickname is too long!
  //             </FormHelperText>
  //           )}
  //         </FormControl>
  //       ) : (
  //         <div onClick={toggleNicknameForm}>
  //           <span id="nickname">{props.user.getNickname()}</span>
  //           {props.user.isLocal() && <span id=""> (edit)</span>}
  //         </div>
  //       )}
  //     </div>

  //     {props.user !== undefined &&
  //     props.user.getStreamManager() !== undefined ? (
  //       <div className="streamComponent">
  //         <OvVideoComponent user={props.user} mutedSound={mutedSound} />
  //         <div id="statusIcons">
  //           {!props.user.isVideoActive() ? (
  //             <div id="camIcon">
  //               <VideocamOffIcon id="statusCam" />
  //             </div>
  //           ) : null}

  //           {!props.user.isAudioActive() ? (
  //             <div id="micIcon">
  //               <MicOffIcon id="statusMic" />
  //             </div>
  //           ) : null}
  //         </div>
  //         <div>
  //           {!props.user.isLocal() && (
  //             <IconButton id="volumeButton" onClick={toggleSound}>
  //               {mutedSound ? (
  //                 <VolumeOffIcon color="secondary" />
  //               ) : (
  //                 <VolumeUpIcon />
  //               )}
  //             </IconButton>
  //           )}
  //         </div>
  //       </div>
  //     ) : null}
  //   </div>
  // );
}

// UnderBar.propTypes = {
//   status: PropTypes.number.isRequired,
// };

export default UnderBar;
