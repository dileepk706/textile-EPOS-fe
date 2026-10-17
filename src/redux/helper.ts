import { logout } from './slices/auth';
import { persistor, useAppDispatch } from './store';

export const useReduxPersisterManage = () => {
  const dispatch = useAppDispatch();

  const clearPersistedState = () => {
    persistor.purge();
    dispatch(logout());
  };

  return { clearPersistedState };
};
