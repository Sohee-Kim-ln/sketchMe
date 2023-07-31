import { configureStore } from '@reduxjs/toolkit';
import roodReducer from './reducers/RootReducer';
const store = configureStore({
  reducer: roodReducer,
});

export default store;
