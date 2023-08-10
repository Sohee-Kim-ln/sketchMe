import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // live state
  liveStatus: 0,
  hasBeenUpdated: false,
  // layout: null,
  productName: '',
  mySessionId: 'tempSessionId',
  myUserName: 'tempUserName',
  meetingId: null,
  //
  token: null,
  localUser: undefined,
  localUserRole: 'artist', // 'artist' | 'guest'
  subscribers: [],
  currentVideoDevice: undefined,
  waitingActive: false,
  localUserAccessAllowed: false,
};

const LiveSlice = createSlice({
  name: 'LiveSlice',
  initialState,
  reducers: {
    // 전체 초기화
    initAll: (state, action) => {
      state = initialState;
    },
    // live state
    addLiveStatus: (state, action) => {
      state.liveStatus += 1;
    },
    resetLiveStatus: (state, action) => {
      state.liveStatus = 0;
    },
    updateHasBeenUpdated: (state, action) => {
      state.hasBeenUpdated = action.payload;
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
    updateOV: (state, action) => {
      console.log(state.OV);
      state.OV = action.payload;
      console.log('OV 삽입');
      console.log(state.OV);
    },
    updateSession: (state, action) => {
      console.log(state.session);
      state.session = action.payload;
      console.log('session 삽입');
      console.log(state.session);
    },
    updateToken: (state, action) => {
      state.token = action.payload;
    },
    updatePublisher: (state, action) => {
      state.publisher = action.payload;
    },
    updateLocalUser: (state, action) => {
      state.localUser = action.payload;
    },
    updateLocalUserRole: (state, action) => {
      state.localUserRole = action.payload;
    },
    initSubscribers: (state, action) => {
      state.subscribers = [];
    },
    addSubscriber: (state, action) => {
      state.subscribers.push(action.payload);
    },
    deleteSubscriber: (state, action) => {
      const updated = state.subscribers.filter(
        (subs) => subs.streamManager !== action.payload
      );
      state.subscribers = updated;
    },
    updateSubscribers: (state, action) => {
      state.subscribers = action.payload;
    },
    updateCurrentVideoDevice: (state, action) => {
      state.currentVideoDevice = action.payload;
    },
    updateWaitingActive: (state, action) => {
      state.waitingActive = action.payload;
    },
    changeLocalUserAccessAllowed: (state, action) => {
      state.localUserAccessAllowed = !state.localUserAccessAllowed;
    },
  },
});

export default LiveSlice;
export const {
  initAll,
  addLiveStatus,
  resetLiveStatus,
  updateHasBeenUpdated,
  updateProductName,
  updateMySessionId,
  updateMyUserName,
  updateOV,
  updateSession,
  updateToken,
  updatePublisher,
  updateLocalUser,
  updateLocalUserRole,
  initSubscribers,
  addSubscriber,
  deleteSubscriber,
  updateSubscribers,
  updateCurrentVideoDevice,
  updateWaitingActive,
  changeLocalUserAccessAllowed,
} = LiveSlice.actions;
