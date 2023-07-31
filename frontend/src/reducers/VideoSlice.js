import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  micActive: false,
  audioActive: true,
  videoActive: false,
  screenShareActive: false,
  bgmActive: true,
  fullScreenActive: false,
  // 스위치 카메라 생략. 나중에 필요하면 구현
};

const videoSlice = createSlice({
  name: 'videoSlice',
  initialState,
  reducers: {
    changeMic: (state, action) => {
      state.micActive = !state.micActive;
    },
    changeAudio: (state, action) => {
      state.audioActive = !state.audioActive;
    },
    changeVideo: (state, action) => {
      state.videoActive = !state.videoActive;
    },
    changeScreenShare: (state, action) => {
      state.screenShareActive = !state.screenShareActive;
    },
    changeBgm: (state, action) => {
      state.bgmActive = !state.bgmActive;
    },
    changeFullScreen: (state, action) => {
      state.fullScreenActive = !state.fullScreenActive;
    },
  },
});

export default videoSlice;
export const {
  changeMic,
  changeAudio,
  changeVideo,
  changeScreenShare,
  changeBgm,
  changeFullScreen,
} = videoSlice.actions;
