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
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from 'shared/ui/text-field';
import Iconify from 'shared/ui/iconify';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';
import { fCurrency } from '@utils/format-number';
import { getErrorResponse } from '@utils/axios';
import { cashOutTill } from 'shared/api/api.services';
import { Till, useActiveTillStore } from 'entities/till';

// ----------------------------------------------------------------------

const QUICK_REASONS = [
  'Cash drop to main safe',
  'Mid-day excess cash skim',
  'Petty cash expense',
  'Vendor cash payment',
  'Bank deposit',
];

interface CashOutDialogProps {
  open: boolean;
  onClose: () => void;
  till: Till | null;
  onSuccess?: (updatedTill: Till) => void;
}

export function CashOutDialog({ open, onClose, till, onSuccess }: CashOutDialogProps) {
  const { enqueueSnackbar } = appSnackbar();
  const queryClient = useQueryClient();
  const { setActiveTill } = useActiveTillStore();

  const [amount, setAmount] = useState<string>('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('Cash drop to main safe');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentCash = till?.cash_in_till ?? 0;
  const numAmount = parseFloat(amount);
  const isValidAmount = !Number.isNaN(numAmount) && numAmount > 0;
  const isInsufficient = isValidAmount && numAmount > currentCash;
  const remainingBalance = isValidAmount && !isInsufficient ? currentCash - numAmount : currentCash;

  useEffect(() => {
    if (open) {
      setAmount('');
      setPassword('');
      setReason('Cash drop to main safe');
      setNotes('');
      setErrorMsg(null);
    }
  }, [open, till]);

  const mutation = useMutation({
    mutationFn: (data: { amount: number; password?: string; reason?: string; notes?: string }) =>
      cashOutTill(till!.id, data),
    onSuccess: (res: any) => {
      const updatedTill = res?.data?.data?.till || res?.data?.data || {
        ...till,
        cash_in_till: remainingBalance,
      };

      queryClient.invalidateQueries({ queryKey: ['tills'] });
      setActiveTill(updatedTill);

      enqueueSnackbar(
        `Withdrew ${fCurrency(numAmount)} from "${till?.name}". Remaining balance: ${fCurrency(updatedTill.cash_in_till)}`,
        { variant: 'success' }
      );

      onClose();
      if (onSuccess) {
        onSuccess(updatedTill);
      }
    },
    onError: (err) => {
      const message = getErrorResponse(err) || 'Failed to withdraw cash from till';
      setErrorMsg(message);
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!till) return;

    if (!isValidAmount) {
      setErrorMsg('Please enter a valid withdrawal amount greater than zero');
      return;
    }

    if (numAmount > currentCash) {
      setErrorMsg(`Insufficient funds in till. Available cash is only ${fCurrency(currentCash)}`);
      return;
    }

    setErrorMsg(null);
    mutation.mutate({
      amount: numAmount,
      password: password.trim() || undefined,
      reason: reason.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  if (!till) return null;

  return (
    <Dialog open={open} onClose={mutation.isPending ? undefined : onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: 'warning.lighter',
              color: 'warning.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:card-send-bold" width={22} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Take Cash Out (Withdraw)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Counter: <strong>{till.name}</strong> ({till.code})
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {/* Balance Calculation Card */}
            <Box
              sx={{
                p: 2,
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
                border: (theme) => `1px dashed ${theme.palette.divider}`,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Current Drawer Cash:
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {fCurrency(currentCash)}
                </Typography>
              </Stack>

              {isValidAmount && !isInsufficient && (
                <>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.75 }}>
                    <Typography variant="body2" color="error.main" fontWeight={600}>
                      - Cash Out Amount:
                    </Typography>
                    <Typography variant="subtitle2" color="error.main" fontWeight={700}>
                      -{fCurrency(numAmount)}
                    </Typography>
                  </Stack>

                  <Box sx={{ borderTop: (theme) => `1px dashed ${theme.palette.divider}`, my: 1 }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={700}>
                      Remaining Drawer Balance:
                    </Typography>
                    <Typography variant="subtitle1" color="primary.main" fontWeight={800}>
                      {fCurrency(remainingBalance)}
                    </Typography>
                  </Stack>
                </>
              )}
            </Box>

            {isInsufficient && (
              <Alert severity="warning" icon={<Iconify icon="solar:danger-triangle-bold" />}>
                <strong>Insufficient Drawer Balance:</strong> Requested amount ({fCurrency(numAmount)})
                exceeds the current drawer balance ({fCurrency(currentCash)}).
              </Alert>
            )}

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            {/* Amount input */}
            <TextField
              label="Cash Amount to Withdraw (₹) *"
              type="number"
              fullWidth
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. 300"
              error={isInsufficient}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
              required
            />

            {/* Quick Reason suggestions */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick Reasons:
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {QUICK_REASONS.map((r) => (
                  <Chip
                    key={r}
                    label={r}
                    size="small"
                    variant={reason === r ? 'filled' : 'outlined'}
                    color={reason === r ? 'warning' : 'default'}
                    onClick={() => setReason(r)}
                    clickable
                  />
                ))}
              </Stack>
            </Box>

            <TextField
              label="Reason *"
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={mutation.isPending}
              placeholder="Reason for cash withdrawal"
              required
            />

            <TextField
              label="Security PIN / Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={mutation.isPending}
              placeholder="Enter till PIN / password"
              helperText="Till authorization password or PIN"
            />

            <TextField
              label="Additional Notes (Optional)"
              fullWidth
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. Mid-day excess cash skim deposited to vault"
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
            color="warning"
            disabled={mutation.isPending || !isValidAmount || isInsufficient}
            startIcon={
              mutation.isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Iconify icon="solar:card-send-bold" />
              )
            }
          >
            {mutation.isPending ? 'Processing...' : 'Confirm Cash Out'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CashOutDialog;
