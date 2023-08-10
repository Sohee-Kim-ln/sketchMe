import React from 'react';

import { MicOff, VideocamOff, VolumeOff } from '@mui/icons-material';
import OvVideoComponent from './ovVideo';
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

function Stream({ user }) {
  // const [nickname, setNickname] = useState(user.nickname);
  // const [showForm, setShowForm] = useState(user.videoActive);
  // const [mutedSound, setMutedSound] = useState(user.audioActive);
  // const [isFormValid, setIsFormValid] = useState(true);
  // const [isLocal, setIsLocal] = useState(user.type === 'local');

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
      {user !== undefined && user.streamManager !== undefined ? (
        <div className="streamComponent">
          <OvVideoComponent user={user} mutedSound={user.micActive} />
          <div className="nickname">{user.nickname}</div>
          <div id="statusIcons">
            {!user.micActive ? <MicOff color="secondary" /> : null}
            {!user.audioActive ? <VolumeOff color="secondary" /> : null}
            {!user.videoActive ? <VideocamOff color="secondary" /> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Stream;
