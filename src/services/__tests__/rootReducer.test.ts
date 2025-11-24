import { rootReducer } from '../rootReducer';
import { RootState } from '../rootReducer';

describe('rootReducer', () => {
  it('возвращает начальное состояние для неизвестного действия', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        orders: [],
        loading: false,
        error: null,
        wsConnected: false
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null,
        wsConnected: false
      },
      user: {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      }
    });
  });
});
