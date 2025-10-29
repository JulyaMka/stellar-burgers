import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedActions } from '../../services/slices/feedSlice';
import { getWebSocketUrl } from '../../utils/burger-api';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state: any) => state.feed);

  useEffect(() => {
    const wsUrl = getWebSocketUrl('orders/all');
    dispatch(feedActions.wsConnect(wsUrl));

    return () => {
      dispatch(feedActions.wsDisconnect());
    };
  }, [dispatch]);

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => window.location.reload()} />
  );
};
