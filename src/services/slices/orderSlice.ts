import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  orderBurgerApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../../utils/burger-api';

// WebSocket actions
export const wsConnect = 'profileOrders/wsConnect';
export const wsDisconnect = 'profileOrders/wsDisconnect';
export const onOpen = 'profileOrders/onOpen';
export const onClose = 'profileOrders/onClose';
export const onError = 'profileOrders/onError';
export const onMessage = 'profileOrders/onMessage';

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0];
  }
);

export const getOrders = createAsyncThunk('order/getAll', async () => {
  const response = await getOrdersApi();
  return response;
});

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  orders: TOrder[];
  loading: boolean;
  error: string | null;
  wsConnected: boolean;
};

export const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  orders: [],
  loading: false,
  error: null,
  wsConnected: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // WebSocket actions для истории заказов
    wsConnect: (state) => {
      state.loading = true;
    },
    wsDisconnect: (state) => {
      state.wsConnected = false;
      state.loading = false;
    },
    onOpen: (state) => {
      state.wsConnected = true;
      state.loading = false;
      state.error = null;
    },
    onClose: (state) => {
      state.wsConnected = false;
      state.loading = false;
    },
    onError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    onMessage: (state, action: PayloadAction<any>) => {
      const { orders } = action.payload;
      state.orders = orders;
      state.loading = false;
      state.error = null;
    },
    getOrder: (state) => {
      state.orderRequest = true;
    },
    getOrderSuccess: (state, action: PayloadAction<TOrder>) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
    },
    getOrderFailed: (state) => {
      state.orderRequest = false;
    },
    clearOrder: (state) => {
      state.orderModalData = null;
      state.currentOrder = null;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrders: (state) => {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orderModalData = action.payload.order;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказа';
        state.currentOrder = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentOrder = action.payload;
      })
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
        state.orders = [];
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = action.payload;
      });
  }
});

// Экспорт actions
export const {
  wsConnect: connectProfileOrders,
  wsDisconnect: disconnectProfileOrders,
  onOpen: openProfileOrders,
  onClose: closeProfileOrders,
  onError: errorProfileOrders,
  onMessage: messageProfileOrders,
  getOrder,
  getOrderSuccess,
  getOrderFailed,
  clearOrder,
  clearCurrentOrder,
  clearOrders
} = orderSlice.actions;

export default orderSlice.reducer;
