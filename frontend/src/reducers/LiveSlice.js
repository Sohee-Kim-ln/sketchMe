/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // live state
  liveStatus: 0,
  // liveStatus: 1,

  hasBeenUpdated: false,
  productName: '',
  mySessionId: 'tempSessionId',
  myUserName: 'tempUserName',
  meetingId: null,

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
    initAll: (state) => {
      state = initialState;
    },
    // live state
    addLiveStatus: (state) => {
      state.liveStatus += 1;
    },
    resetLiveStatus: (state) => {
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
      state.OV = action.payload;
    },
    updateSession: (state, action) => {
      state.session = action.payload;
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
    initSubscribers: (state) => {
      state.subscribers = [];
    },
    addSubscriber: (state, action) => {
      state.subscribers.push(action.payload);
    },
    deleteSubscriber: (state, action) => {
      const updated = state.subscribers.filter(
        (subs) => subs.streamManager !== action.payload,
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
    changeLocalUserAccessAllowed: (state) => {
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
