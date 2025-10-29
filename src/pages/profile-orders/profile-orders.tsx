import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrders } from '../../services/slices/orderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state: any) => state.order.orders);
  const loading = useSelector((state: any) => state.order.loading);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (loading && orders.length === 0) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
