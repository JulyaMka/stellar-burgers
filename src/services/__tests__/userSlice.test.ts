import userReducer, { loginUser } from '../slices/userSlice';

describe('userSlice reducer', () => {
  const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  };

  describe('асинхронные экшены', () => {
    it('устанавливает loading в true при loginUser.pending', () => {
      const action = { type: loginUser.pending.type };
      const state = userReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
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

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    it('устанавливает ошибку при loginUser.rejected', () => {
      const errorMessage = 'Ошибка авторизации';
      const action = {
        type: loginUser.rejected.type,
        error: { message: errorMessage }
      };
      const state = userReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
