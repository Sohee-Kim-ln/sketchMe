const UserModel = () => {
  return {
    connectionId: '',
    micActive: true,
    audioActive: true,
    videoActive: true,
    screenShareActive: false,
    nickname: '',
    streamManager: null,
    type: null, // 'remote' | 'local'
    role: null, // 'artist' | 'guest' | 'canvas'
  };
};

export default UserModel;
