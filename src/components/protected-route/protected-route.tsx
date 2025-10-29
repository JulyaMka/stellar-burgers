import { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import { getUser } from '../../services/slices/userSlice';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = document.cookie.includes('accessToken');
    if (!user && accessToken) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  if (!user && loading) {
    return <div>Загрузка...</div>;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
