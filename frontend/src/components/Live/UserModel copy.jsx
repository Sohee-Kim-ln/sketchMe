// import { useState } from 'react';

// function useUserModel() {
//   const [connectionId, setConnectionId] = useState('');
//   const [audioActive, setAudioActive] = useState(true);
//   const [videoActive, setVideoActive] = useState(true);
//   const [screenShareActive, setScreenShareActive] = useState(false);
//   const [nickname, setNickname] = useState('');
//   const [streamManager, setStreamManager] = useState(null);
//   const [type, setType] = useState('local');

//   const isAudioActive = () => {
//     return audioActive;
//   };

//   const isVideoActive = () => {
//     return videoActive;
//   };

//   const isScreenShareActive = () => {
//     return screenShareActive;
//   };

//   const getConnectionId = () => {
//     return connectionId;
//   };

//   const getNickname = () => {
//     return nickname;
//   };

//   const getStreamManager = () => {
//     return streamManager;
//   };

//   const isLocal = () => {
//     return type === 'local';
//   };

//   const isRemote = () => {
//     return !isLocal();
//   };

//   const updateAudioActive = () => {
//     setAudioActive(!audioActive);
//   };

//   const updateVideoActive = () => {
//     setVideoActive(!videoActive);
//   };

//   const updateScreenShareActive = () => {
//     setScreenShareActive(!screenShareActive);
//   };

//   const updateStreamManager = (newManager) => {
//     setStreamManager(newManager);
//   };

//   const updateConnectionId = (newConnectionId) => {
//     setConnectionId(newConnectionId);
//   };

//   const updateNickname = (newNickname) => {
//     setNickname(newNickname);
//   };

//   const updateType = (newType) => {
//     if (newType === 'local' || newType === 'remote') {
//       setType(newType);
//     }
//   };

//   return {
//     isAudioActive,
//     isVideoActive,
//     isScreenShareActive,
//     getConnectionId,
//     getNickname,
//     getStreamManager,
//     isLocal,
//     isRemote,
//     updateAudioActive,
//     updateVideoActive,
//     updateScreenShareActive,
//     updateStreamManager,
//     updateConnectionId,
//     updateNickname,
//     updateType,
//   };
// }

// export default useUserModel;
