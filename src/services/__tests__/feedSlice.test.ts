import feedReducer, { initialState } from '../slices/feedSlice';

describe('feedSlice reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('WebSocket экшены', () => {
    it('устанавливает loading в true при wsConnect', () => {
      const action = { type: 'feed/wsConnect', payload: 'ws-url' };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('устанавливает wsConnected в true при wsOnOpen', () => {
      const action = { type: 'feed/wsOnOpen' };
      const state = feedReducer(initialState, action);

      expect(state.wsConnected).toBe(true);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('устанавливает данные фида при wsOnMessage', () => {
      const feedData = {
        orders: [],
        total: 100,
        totalToday: 10
      };

      const action = {
        type: 'feed/wsOnMessage',
        payload: feedData
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.total).toBe(100);
      expect(state.totalToday).toBe(10);
      expect(state.error).toBeNull();
    });

    it('устанавливает ошибку при wsOnError', () => {
      const errorMessage = 'Ошибка соединения WebSocket';
      const action = {
        type: 'feed/wsOnError',
        payload: errorMessage
      };
      const state = feedReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('устанавливает wsConnected в false при wsOnClose', () => {
      const action = { type: 'feed/wsOnClose' };
      const state = feedReducer(initialState, action);

      expect(state.wsConnected).toBe(false);
      expect(state.loading).toBe(false);
    });
  });
});
