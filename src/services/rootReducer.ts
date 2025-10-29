import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingriedientsSlice';
import constructorReducer from './slices/constructorSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;
