import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  liveStatus: 0,
  productName: '',
  mySessionId: '',
  myUserName: '',
  session: undefined,
  mainStreamManager: undefined,
  publisher: undefined,
  subscribers: [],
  currentVideoDevice: undefined,
  OV: null,
};

const LiveSlice = createSlice({
  name: 'LiveSlice',
  initialState,
  reducers: {
    initAll:(state,action)=>{
      state=initialState;
    },
    addLiveStatus: (state, action) => {
      state.liveStatus += 1;
    },
    resetLiveStatus: (state, action) => {
      state.liveStatus = 0;
    },
    updateProductName: (state, action) => {
      state.productName = action.payload;
    },
    updateMySessionId: (state, action) => {
      state.mySessionId = action.payload;
    },
    updateMyUserName: (state, action) => {
      state.myUserName = action.payload;
    },
    updateSession: (state, action) => {
      state.session = action.payload;
    },
    updateMainStreamManager: (state, action) => {
      state.mainStreamManager = action.payload;
    },
    updatePublisher: (state, action) => {
      state.publisher = action.payload;
    },
    initSubscribers: (state, action) => {
      state.subscribers = [];
    },
    addSubscriber: (state, action) => {
      state.subscribers.push(action.payload);
    },
    deleteSubscriber: (state, action) => {
      const updated = subscribers.filter((subs) => subs !== action.payload);
      state.subscribers = updated;
    },
    updateCurrentVideoDevice: (state, action) => {
      state.currentVideoDevice = action.payload;
    },
    updateOV: (state, action) => {
      state.OV = action.payload;
    },
  },
});

export default LiveSlice;
export const {
  initAll,
  addLiveStatus,
  resetLiveStatus,
  updateProductName,
  updateMySessionId,
  updateMyUserName,
  updateSession,
  updateMainStreamManager,
  updatePublisher,
  initSubscribers,
  addSubscriber,
  deleteSubscriber,
  updateCurrentVideoDevice,
  updateOV,
} = LiveSlice.actions;
