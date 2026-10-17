import { useState, useEffect } from 'react';
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
import { closeTill } from 'shared/api/api.services';
import { Till, useActiveTillStore } from 'entities/till';

// ----------------------------------------------------------------------

interface CloseTillDialogProps {
  open: boolean;
  onClose: () => void;
  till: Till | null;
  onClosed?: () => void;
}

export function CloseTillDialog({ open, onClose, till, onClosed }: CloseTillDialogProps) {
  const { enqueueSnackbar } = appSnackbar();
  const queryClient = useQueryClient();
  const { activeTillId, clearActiveTill } = useActiveTillStore();

  const [closingBalance, setClosingBalance] = useState<string>('');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const expectedCash = till?.cash_in_till ?? 0;
  const countedNum = parseFloat(closingBalance);
  const isValidCount = !Number.isNaN(countedNum);
  const discrepancy = isValidCount ? countedNum - expectedCash : null;

  useEffect(() => {
    if (till) {
      setClosingBalance(String(expectedCash));
      setPassword('');
      setNotes('');
      setErrorMsg(null);
    }
  }, [till, expectedCash, open]);

  const mutation = useMutation({
    mutationFn: (data: any) => closeTill(till!.id, data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['tills'] });
      if (activeTillId === till?.id) {
        clearActiveTill();
      }
      const disc = res?.data?.data?.till?.discrepancy;
      const discText =
        disc === 0 || disc === null || disc === undefined
          ? 'Exact cash match'
          : disc > 0
          ? `₹${disc} surplus`
          : `₹${Math.abs(disc)} shortage`;

      enqueueSnackbar(`Till "${till?.name}" closed successfully (${discText})`, {
        variant: 'success',
      });
      onClose();
      if (onClosed) {
        onClosed();
      }
    },
    onError: (err) => {
      const message = getErrorResponse(err) || 'Failed to close till';
      setErrorMsg(message);
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!till) return;

    if (!isValidCount || countedNum < 0) {
      setErrorMsg('Please enter a valid physical closing cash count (zero or positive)');
      return;
    }

    setErrorMsg(null);
    mutation.mutate({
      closing_balance: countedNum,
      password: password.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  if (!till) return null;

  return (
    <Dialog open={open} onClose={mutation.isPending ? undefined : onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:lock-keyhole-minimalistic-bold" width={24} sx={{ color: 'error.main' }} />
          <span>Close Shift & Count Cash</span>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
                border: (theme) => `1px dashed ${theme.palette.divider}`,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                {till.name} ({till.code})
              </Typography>
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  System Expected Cash in Till:
                </Typography>
                <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                  {fCurrency(expectedCash)}
                </Typography>
              </Stack>
            </Box>

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <TextField
              label="Physical Closing Cash Counted (₹) *"
              type="number"
              fullWidth
              value={closingBalance}
              onChange={(e) => setClosingBalance(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. 4850"
              helperText="Count all physical cash and bills currently in the drawer"
              required
            />

            {discrepancy !== null && (
              <Box>
                {discrepancy === 0 ? (
                  <Alert severity="success" icon={<Iconify icon="solar:check-circle-bold" />}>
                    <strong>Exact Match:</strong> Counted cash matches system records perfectly!
                  </Alert>
                ) : discrepancy < 0 ? (
                  <Alert severity="error" icon={<Iconify icon="solar:danger-triangle-bold" />}>
                    <strong>Cash Shortage:</strong> Counted cash is{' '}
                    <strong>{fCurrency(Math.abs(discrepancy))} short</strong> of expected drawer
                    balance.
                  </Alert>
                ) : (
                  <Alert severity="warning" icon={<Iconify icon="solar:bell-bold" />}>
                    <strong>Cash Surplus:</strong> Counted cash is{' '}
                    <strong>{fCurrency(discrepancy)} higher</strong> than expected drawer balance.
                  </Alert>
                )}
              </Box>
            )}

            <TextField
              label="Security PIN / Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={mutation.isPending}
              placeholder="Enter till PIN (if required)"
              helperText="Security PIN verification required to close this till shift"
            />

            <TextField
              label="Closing Audit Notes"
              fullWidth
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. Evening shift closed. Physical cash deposited in store vault."
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
            color="error"
            disabled={mutation.isPending}
            startIcon={
              mutation.isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Iconify icon="solar:lock-bold" />
              )
            }
          >
            {mutation.isPending ? 'Closing Shift...' : 'Lock Drawer & Close Shift'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CloseTillDialog;
