import { useCallback, useState } from 'react';
import { alpha } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from '@routes/hook';
import { pathKeys } from 'shared/routes';
import Iconify from 'shared/ui/iconify';
import { logoutUser } from 'shared/api/api.services';
import { queryClient } from 'shared/queryClient';
import { useSessionStore } from 'entities/session';
import { useTextilesStore } from 'entities/textile/textile.store';
import { useActiveTillStore } from 'entities/till';
import { usePurchaseCartStore } from 'entities/purchase';
import { usePurchaseSessionStore } from 'entities/supplier';

type Props = {
  mini?: boolean;
};

export default function LogoutButton({ mini = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { clearSession, setSessionExpired } = useSessionStore();
  const { clearTextile } = useTextilesStore();
  const { clearActiveTill } = useActiveTillStore();
  const { clearCart } = usePurchaseCartStore();
  const { clearSelectedSupplier } = usePurchaseSessionStore();

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log('logout error', error);
    } finally {
      queryClient.clear();

      // Clear all store states
      clearSession();
      setSessionExpired(false);
      clearTextile();
      clearActiveTill();
      clearCart();
      clearSelectedSupplier();

      // Clear persisted local/session storages
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('gym-storage');
      localStorage.removeItem('pos_active_till_session');
      sessionStorage.removeItem('pos_purchase_cart');
      sessionStorage.removeItem('pos_purchase_supplier_session');
    }
  }, [clearSession, setSessionExpired, clearTextile, clearActiveTill, clearCart, clearSelectedSupplier]);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await logout();
      router.replace(pathKeys.login);
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <ListItemButton
      onClick={handleLogout}
      disabled={loading}
      sx={{
        mx: mini ? 1 : 2,
        mt: 0.5,
        px: mini ? 0 : 1.5,
        py: mini ? 1.25 : 1,
        minHeight: mini ? 54 : 40,
        borderRadius: 1,
        color: 'grey.500',
        justifyContent: mini ? 'center' : 'flex-start',
        '&:hover': {
          color: 'common.white',
          bgcolor: alpha('#ffffff', 0.08),
        },
        '&.Mui-disabled': {
          color: 'grey.600',
        },
      }}
    >
      <ListItemIcon
        sx={{
          width: 24,
          height: 24,
          minWidth: mini ? 0 : 32,
          color: 'secondary.main',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <Iconify icon="solar:logout-3-outline" />
        )}
      </ListItemIcon>

      {!mini && (
        <ListItemText
          primary="Logout"
          primaryTypographyProps={{
            noWrap: true,
            typography: 'caption',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
          }}
        />
      )}
    </ListItemButton>
  );

  if (mini) {
    return (
      <Tooltip title="Logout" placement="right">
        {content}
      </Tooltip>
    );
  }

  return content;
}
