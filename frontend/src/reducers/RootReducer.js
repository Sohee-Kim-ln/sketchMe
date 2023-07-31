import { combineReducers } from '@reduxjs/toolkit';
import LiveSlice from './LiveSlice';
import VideoSlice from './VideoSlice';

const rootReducer = combineReducers({
  live: LiveSlice.reducer,
  video: VideoSlice.reducer,
});

//추가로 export 설정 필요한가? 찾아볼 것
export default rootReducer;
