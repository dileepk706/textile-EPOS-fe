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
import { getErrorResponse } from '@utils/axios';
import { blockTill } from 'shared/api/api.services';
import { Till } from 'entities/till';

// ----------------------------------------------------------------------

interface BlockTillDialogProps {
  open: boolean;
  onClose: () => void;
  till: Till | null;
}

export function BlockTillDialog({ open, onClose, till }: BlockTillDialogProps) {
  const { enqueueSnackbar } = appSnackbar();
  const queryClient = useQueryClient();

  const isCurrentlyBlocked = Boolean(till?.is_blocked);
  const targetBlocked = !isCurrentlyBlocked;

  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: any) => blockTill(till!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tills'] });
      enqueueSnackbar(
        `Till "${till?.name}" ${targetBlocked ? 'blocked / locked' : 'unblocked and restored'}`,
        { variant: 'success' }
      );
      onClose();
      setReason('');
      setErrorMsg(null);
    },
    onError: (err) => {
      const message = getErrorResponse(err) || 'Failed to update till block status';
      setErrorMsg(message);
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!till) return;

    setErrorMsg(null);
    mutation.mutate({
      is_blocked: targetBlocked,
      reason: reason.trim() || (targetBlocked ? 'Admin maintenance lockout' : 'Unlocked by admin'),
    });
  };

  if (!till) return null;

  return (
    <Dialog open={open} onClose={mutation.isPending ? undefined : onClose} maxWidth="xs" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify
            icon={targetBlocked ? 'solar:shield-warning-bold' : 'solar:shield-check-bold'}
            width={24}
            sx={{ color: targetBlocked ? 'warning.main' : 'success.main' }}
          />
          <span>{targetBlocked ? 'Lock / Freeze Counter' : 'Restore & Unlock Counter'}</span>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {targetBlocked
                ? `Locking "${till.name}" will prevent any cashiers from opening, linking, or billing on this till until unlocked.`
                : `Unlocking "${till.name}" will restore it to closed status so cashiers can start a new shift.`}
            </Typography>

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            {targetBlocked && (
              <TextField
                label="Reason for Lockout"
                fullWidth
                multiline
                rows={2}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={mutation.isPending}
                placeholder="e.g. Receipt printer hardware maintenance"
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={mutation.isPending} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color={targetBlocked ? 'warning' : 'primary'}
            disabled={mutation.isPending}
            startIcon={
              mutation.isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <Iconify icon={targetBlocked ? 'solar:lock-bold' : 'solar:lock-keyhole-bold'} />
              )
            }
          >
            {mutation.isPending ? 'Updating...' : targetBlocked ? 'Block Counter' : 'Unlock Counter'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default BlockTillDialog;
