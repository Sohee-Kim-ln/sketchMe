import React, { useState } from 'react';
import PropTypes from 'prop-types';
import OvVideoComponent from './ovVideo';

import {
  MicOff,
  VideocamOff,
  VolumeUp,
  VolumeOff,
  HighlightOff,
} from '@mui/icons-material';

import {
  FormControl,
  Input,
  InputLabel,
  IconButton,
  FormHelperText,
} from '@mui/material';

// import MicOff from '@material-ui/icons/MicOff';
// import VideocamOff from '@material-ui/icons/VideocamOff';
// import VolumeUp from '@material-ui/icons/VolumeUp';
// import VolumeOff from '@material-ui/icons/VolumeOff';
// import FormControl from '@material-ui/core/FormControl';
// import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
// import IconButton from '@material-ui/core/IconButton';
// import HighlightOff from '@material-ui/icons/HighlightOff';
// import FormHelperText from '@material-ui/core/FormHelperText';

function Stream({user}) {
  console.log(user);
  console.log(user.videoActive);
  const [nickname, setNickname] = useState(user.nickname);
  const [showForm, setShowForm] = useState(user.videoActive);
  const [mutedSound, setMutedSound] = useState(user.audioActive);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isLocal, setIsLocal] = useState(user.type === 'local');

  const handleChange = (event) => {
    setNickname(event.target.value);
    event.preventDefault();
  };

  const toggleNicknameForm = () => {
    if (isLocal) {
      setShowForm(!showForm);
    }
  };

  const toggleSound = () => {
    setMutedSound(!mutedSound);
  };

  // const handlePressKey = (event) => {
  //   if (event.key === 'Enter') {
  //     console.log(nickname);
  //     if (nickname.length >= 3 && nickname.length <= 20) {
  //       handleNickname(nickname);
  //       toggleNicknameForm();
  //       setIsFormValid(true);
  //     } else {
  //       setIsFormValid(false);
  //     }
  //   }
  // };

  return (
    <div className="OT_widget-container">
      <div className="pointer nickname">
        스트림테스트
      </div>
      {user !== undefined && user.streamManager !== undefined ? (
        <div className="streamComponent">
          <OvVideoComponent user={user} mutedSound={mutedSound} />
          <div id="statusIcons">
            {!user.videoActive ? (
              <div id="camIcon">
                <VideocamOff id="statusCam" />
              </div>
            ) : null}

            {!user.audioActive ? (
              <div id="micIcon">
                <MicOff id="statusMic" />
              </div>
            ) : null}
          </div>
          <div>
            {!isLocal && (
              <IconButton id="volumeButton" onClick={toggleSound}>
                {mutedSound ? <VolumeOff color="secondary" /> : <VolumeUp />}
              </IconButton>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Stream;
