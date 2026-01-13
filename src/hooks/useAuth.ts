import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, loginUser, logout, selectAuth } from '@/store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);

  const handleLogin = (username: string, password: string) => {
    return dispatch(loginUser({ username, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    ...auth,
    handleLogin,
    handleLogout,
    handleClearError,
  };
};
