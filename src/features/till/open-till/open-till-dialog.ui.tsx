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
import { getErrorResponse } from '@utils/axios';
import { openTill } from 'shared/api/api.services';
import { Till, useActiveTillStore } from 'entities/till';

// ----------------------------------------------------------------------

interface OpenTillDialogProps {
  open: boolean;
  onClose: () => void;
  till: Till | null;
  onOpened?: (openedTill: Till) => void;
}

export function OpenTillDialog({ open, onClose, till, onOpened }: OpenTillDialogProps) {
  const { enqueueSnackbar } = appSnackbar();
  const queryClient = useQueryClient();
  const { setActiveTill } = useActiveTillStore();

  const [openingBalance, setOpeningBalance] = useState<string>('1000');
  const [password, setPassword] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (till) {
      setOpeningBalance(String(till.opening_balance || till.cash_in_till || 1000));
      setPassword('');
      setNotes('Shift started');
      setErrorMsg(null);
    }
  }, [till, open]);

  const mutation = useMutation({
    mutationFn: (data: any) => openTill(till!.id, data),
    onSuccess: (res: any) => {
      const openedTill = res?.data?.data?.till || {
        ...till,
        status: 'open',
        opening_balance: Number(openingBalance),
      };
      queryClient.invalidateQueries({ queryKey: ['tills'] });
      setActiveTill(openedTill);
      enqueueSnackbar(`Till "${till?.name}" opened successfully`, { variant: 'success' });
      onClose();
      if (onOpened) {
        onOpened(openedTill);
      }
    },
    onError: (err) => {
      const message = getErrorResponse(err) || 'Failed to open till';
      setErrorMsg(message);
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!till) return;

    const balanceNum = parseFloat(openingBalance);
    if (Number.isNaN(balanceNum) || balanceNum < 0) {
      setErrorMsg('Please enter a valid starting cash balance (zero or positive)');
      return;
    }

    setErrorMsg(null);
    mutation.mutate({
      opening_balance: balanceNum,
      password: password.trim() || undefined,
      device_info: `Browser-POS-${window.navigator.userAgent.slice(0, 30)}`,
      notes: notes.trim() || undefined,
    });
  };

  if (!till) return null;

  return (
    <Dialog open={open} onClose={mutation.isPending ? undefined : onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:cash-out-bold" width={24} sx={{ color: 'primary.main' }} />
          <span>Open Till & Start Shift</span>
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
                {till.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Terminal Code: <strong>{till.code}</strong> • Status:{' '}
                <span style={{ textTransform: 'uppercase' }}>{till.status}</span>
              </Typography>
            </Box>

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <TextField
              label="Opening Cash Float (₹) *"
              type="number"
              fullWidth
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. 1000"
              helperText="Initial physical cash placed in the cash drawer at start of shift"
              required
            />

            <TextField
              label="Security PIN / Password"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={mutation.isPending}
              placeholder="Enter till PIN (if required)"
              helperText="Required if this counter has a 4-digit security PIN set"
            />

            <TextField
              label="Shift Notes"
              fullWidth
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. Morning shift opened with ₹1,000 float"
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
                <Iconify icon="solar:key-minimalistic-bold" />
              )
            }
          >
            {mutation.isPending ? 'Opening Shift...' : 'Open Till & Proceed'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default OpenTillDialog;
