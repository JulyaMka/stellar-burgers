import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, RootState } from './rootReducer';
import { socketMiddleware } from './middleware/socketMiddleware';
import { feedActions } from './slices/feedSlice';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const feedMiddleware = socketMiddleware({
  wsConnect: feedActions.wsConnect.type,
  wsDisconnect: feedActions.wsDisconnect.type,
  onOpen: feedActions.wsOnOpen.type,
  onClose: feedActions.wsOnClose.type,
  onError: feedActions.wsOnError.type,
  onMessage: feedActions.wsOnMessage.type
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware),
  devTools: process.env.NODE_ENV !== 'production'
});

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
