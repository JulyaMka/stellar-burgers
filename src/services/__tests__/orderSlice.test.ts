import orderReducer, {
  createOrder,
  clearOrder,
  initialState
} from '../slices/orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
  ingredients: ['1', '2']
};

describe('order slice', () => {
  it('возвращает начальное состояние', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('обрабатывает состояние создания заказа', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('обрабатывает успешное создание заказа', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: mockOrder }
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: null,
      orderModalData: mockOrder
    });
  });

  it('обрабатывает ошибку создания заказа', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Error creating order' }
    };
    const state = orderReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Error creating order',
      orderModalData: null
    });
  });

  it('обрабатывает очистку заказа', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: mockOrder,
      currentOrder: mockOrder,
      error: 'Some error'
    };

    const action = clearOrder();
    const state = orderReducer(stateWithOrder, action);

    expect(state).toEqual({
      ...initialState,
      orderModalData: null,
      currentOrder: null,
      error: null
    });
  });
});
