import { Middleware } from 'redux';
import { RootState } from '../rootReducer';

export type TWsActionTypes = {
  wsConnect: string;
  wsDisconnect: string;
  wsSendMessage?: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

export const socketMiddleware = (
  wsActions: TWsActionTypes
): Middleware<{}, RootState> =>
  ((store) => {
    let socket: WebSocket | null = null;

    return (next) => (action: any) => {
      const { dispatch } = store;
      const { type, payload } = action;
      const {
        wsConnect,
        wsDisconnect,
        wsSendMessage,
        onOpen,
        onClose,
        onError,
        onMessage
      } = wsActions;

      if (type === wsConnect) {
        try {
          socket = new WebSocket(payload);
        } catch (error) {
          dispatch({
            type: onError,
            payload: 'Failed to create WebSocket connection'
          });
          return next(action);
        }
      }

      if (socket) {
        socket.onopen = () => {
          dispatch({ type: onOpen, payload: null });
        };

        socket.onerror = () => {
          dispatch({ type: onError, payload: 'WebSocket connection error' });
        };

        socket.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            dispatch({ type: onMessage, payload: parsedData });
          } catch (error) {
            dispatch({
              type: onError,
              payload: 'Failed to parse WebSocket message'
            });
          }
        };

        socket.onclose = () => {
          dispatch({ type: onClose, payload: null });
        };

        if (type === wsSendMessage) {
          const message = payload;
          socket.send(JSON.stringify(message));
        }

        if (type === wsDisconnect) {
          socket.close();
          socket = null;
        }
      }

      next(action);
    };
  }) as Middleware;
