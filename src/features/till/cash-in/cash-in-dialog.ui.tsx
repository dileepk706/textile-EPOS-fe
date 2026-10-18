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
import { cashInTill } from 'shared/api/api.services';
import { Till, useActiveTillStore } from 'entities/till';

// ----------------------------------------------------------------------

const QUICK_REASONS = [
  'Adding petty cash float',
  'Change replenishment',
  'Cash float adjustment',
  'Owner / Manager deposit',
];

interface CashInDialogProps {
  open: boolean;
  onClose: () => void;
  till: Till | null;
  onSuccess?: (updatedTill: Till) => void;
}

export function CashInDialog({ open, onClose, till, onSuccess }: CashInDialogProps) {
  const { enqueueSnackbar } = appSnackbar();
  const queryClient = useQueryClient();
  const { setActiveTill } = useActiveTillStore();

  const [amount, setAmount] = useState<string>('');
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('Adding petty cash float');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentCash = till?.cash_in_till ?? 0;
  const numAmount = parseFloat(amount);
  const isValidAmount = !Number.isNaN(numAmount) && numAmount > 0;
  const newBalance = isValidAmount ? currentCash + numAmount : currentCash;

  useEffect(() => {
    if (open) {
      setAmount('');
      setPassword('');
      setReason('Adding petty cash float');
      setNotes('');
      setErrorMsg(null);
    }
  }, [open, till]);

  const mutation = useMutation({
    mutationFn: (data: { amount: number; password?: string; reason?: string; notes?: string }) =>
      cashInTill(till!.id, data),
    onSuccess: (res: any) => {
      const updatedTill = res?.data?.data?.till || res?.data?.data || {
        ...till,
        cash_in_till: newBalance,
      };

      queryClient.invalidateQueries({ queryKey: ['tills'] });
      setActiveTill(updatedTill);

      enqueueSnackbar(
        `Added ${fCurrency(numAmount)} to "${till?.name}". New balance: ${fCurrency(updatedTill.cash_in_till)}`,
        { variant: 'success' }
      );

      onClose();
      if (onSuccess) {
        onSuccess(updatedTill);
      }
    },
    onError: (err) => {
      const message = getErrorResponse(err) || 'Failed to deposit cash into till';
      setErrorMsg(message);
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!till) return;

    if (!isValidAmount) {
      setErrorMsg('Please enter a valid deposit amount greater than zero');
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
              bgcolor: 'success.lighter',
              color: 'success.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:card-recive-bold" width={22} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Move Cash In (Deposit)
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

              {isValidAmount && (
                <>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.75 }}>
                    <Typography variant="body2" color="success.main" fontWeight={600}>
                      + Cash In Amount:
                    </Typography>
                    <Typography variant="subtitle2" color="success.main" fontWeight={700}>
                      +{fCurrency(numAmount)}
                    </Typography>
                  </Stack>

                  <Box sx={{ borderTop: (theme) => `1px dashed ${theme.palette.divider}`, my: 1 }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2" fontWeight={700}>
                      New Drawer Balance:
                    </Typography>
                    <Typography variant="subtitle1" color="success.dark" fontWeight={800}>
                      {fCurrency(newBalance)}
                    </Typography>
                  </Stack>
                </>
              )}
            </Box>

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            {/* Amount input */}
            <TextField
              label="Cash Amount to Add (₹) *"
              type="number"
              fullWidth
              autoFocus
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. 500"
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
                    color={reason === r ? 'primary' : 'default'}
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
              placeholder="Reason for cash deposit"
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
              placeholder="e.g. Received from store safe"
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
            color="success"
            disabled={mutation.isPending || !isValidAmount}
            startIcon={
              mutation.isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Iconify icon="solar:card-recive-bold" />
              )
            }
          >
            {mutation.isPending ? 'Processing...' : 'Confirm Cash In'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CashInDialog;
