import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../../utils/burger-api';

export const getFeeds = createAsyncThunk('feed/getFeeds', async () => {
  const response = await getFeedsApi(); // ← ваш API метод
  return response;
});

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null,
  wsConnected: false
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // WebSocket actions
    wsConnect: (state, action: PayloadAction<string>) => {
      state.loading = true;
    },
    wsDisconnect: (state) => {
      state.wsConnected = false;
      state.loading = false;
    },
    wsOnOpen: (state) => {
      state.wsConnected = true;
      state.loading = false;
      state.error = null;
    },
    wsOnClose: (state) => {
      state.wsConnected = false;
      state.loading = false;
    },
    wsOnError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    wsOnMessage: (state, action: PayloadAction<any>) => {
      const { orders, total, totalToday } = action.payload;
      state.orders = orders;
      state.total = total;
      state.totalToday = totalToday;
      state.loading = false;
      state.error = null;
    }
  }
});

export const feedActions = feedSlice.actions;
export default feedSlice.reducer;
