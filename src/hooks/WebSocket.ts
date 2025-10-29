import { useEffect, useRef } from 'react';
import { useDispatch } from '../services/store';

export const useWebSocket = (
  url: string,
  connectAction: any,
  disconnectAction: any
) => {
  const dispatch = useDispatch();
  const wsUrl = useRef(url);

  useEffect(() => {
    dispatch(connectAction(wsUrl.current));

    return () => {
      dispatch(disconnectAction());
    };
  }, [dispatch, connectAction, disconnectAction]);
};
