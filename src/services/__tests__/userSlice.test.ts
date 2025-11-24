import userReducer, { loginUser, initialState } from '../slices/userSlice';

describe('userSlice reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  describe('асинхронные экшены', () => {
    it('устанавливает loading в true при loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('устанавливает пользователя и isAuthenticated при loginUser.fulfilled', () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Тестовый Пользователь'
      };
      const action = {
        type: loginUser.fulfilled.type,
        payload: {
          user: mockUser,
          accessToken: 'token',
          refreshToken: 'refresh'
        }
      };
      const state = userReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        user: mockUser,
        isAuthenticated: true,
        error: null
      });
    });

    it('устанавливает ошибку при loginUser.rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: errorMessage
      });
    });
  });
});
