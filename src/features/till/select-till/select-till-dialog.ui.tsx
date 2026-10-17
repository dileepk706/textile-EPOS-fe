import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from 'shared/ui/text-field';
import Iconify from 'shared/ui/iconify';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';
import { fCurrency } from '@utils/format-number';
import { getErrorResponse } from '@utils/axios';
import { linkTill } from 'shared/api/api.services';
import { Till, useActiveTillStore } from 'entities/till';

// ----------------------------------------------------------------------

interface SelectTillDialogProps {
  open: boolean;
  onClose: () => void;
  till: Till | null;
  onSelected?: (selectedTill: Till) => void;
}

export function SelectTillDialog({ open, onClose, till, onSelected }: SelectTillDialogProps) {
  const { enqueueSnackbar } = appSnackbar();
  const queryClient = useQueryClient();
  const { setActiveTill } = useActiveTillStore();

  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: any) => linkTill(till!.id, data),
    onSuccess: (res: any) => {
      const updated = res?.data?.data?.till || till;
      queryClient.invalidateQueries({ queryKey: ['tills'] });
      setActiveTill(updated);
      enqueueSnackbar(`Connected to "${till?.name}"`, { variant: 'success' });
      onClose();
      if (onSelected) {
        onSelected(updated);
      }
    },
    onError: (err) => {
      const message = getErrorResponse(err) || 'Invalid till PIN or connection failed';
      setErrorMsg(message);
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!till) return;

    if (password.trim()) {
      mutation.mutate({
        password: password.trim(),
        device_info: `Browser-POS-${window.navigator.userAgent.slice(0, 30)}`,
      });
    } else {
      // Direct select
      setActiveTill(till);
      enqueueSnackbar(`Selected "${till.name}" for billing`, { variant: 'success' });
      onClose();
      if (onSelected) {
        onSelected(till);
      }
    }
  };

  if (!till) return null;

  return (
    <Dialog open={open} onClose={mutation.isPending ? undefined : onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleConfirm}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:laptop-minimalistic-bold" width={22} sx={{ color: 'primary.main' }} />
          <span>Select Billing Counter</span>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
                border: (theme) => `1px dashed ${theme.palette.divider}`,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                {till.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Code: <strong>{till.code}</strong> • Drawer:{' '}
                <strong style={{ color: '#22c55e' }}>{fCurrency(till.cash_in_till)}</strong>
              </Typography>
            </Box>

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <TextField
              label="Counter PIN (Optional)"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={mutation.isPending}
              placeholder="Enter PIN if required to link"
              helperText="If this counter requires authorization, enter its 4-digit PIN"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={mutation.isPending} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={mutation.isPending}
            startIcon={
              mutation.isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Iconify icon="solar:check-circle-bold" />
              )
            }
          >
            {mutation.isPending ? 'Verifying...' : 'Select & Start Billing'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default SelectTillDialog;
