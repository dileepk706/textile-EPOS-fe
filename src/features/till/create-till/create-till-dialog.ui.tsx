import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField } from 'shared/ui/text-field';
import Iconify from 'shared/ui/iconify';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';
import { getErrorResponse } from '@utils/axios';
import { createTill } from 'shared/api/api.services';

// ----------------------------------------------------------------------

interface CreateTillDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CreateTillDialog({ open, onClose }: CreateTillDialogProps) {
  const { enqueueSnackbar } = appSnackbar();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('1234');
  const [openingBalance, setOpeningBalance] = useState('500');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: any) => createTill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tills'] });
      enqueueSnackbar('New Till counter created successfully', { variant: 'success' });
      onClose();
      setName('');
      setCode('');
      setPassword('1234');
      setOpeningBalance('500');
      setNotes('');
      setErrorMsg(null);
    },
    onError: (err) => {
      const message = getErrorResponse(err) || 'Failed to create till';
      setErrorMsg(message);
      enqueueSnackbar(message, { variant: 'error' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Terminal counter name is required');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('A 4-digit security PIN is required');
      return;
    }

    setErrorMsg(null);
    mutation.mutate({
      name: name.trim(),
      code: code.trim() || undefined,
      password: password.trim(),
      opening_balance: parseFloat(openingBalance) || 0,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={mutation.isPending ? undefined : onClose} maxWidth="sm" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify icon="solar:calculator-minimalistic-bold" width={22} sx={{ color: 'primary.main' }} />
          <span>Add New POS Till Counter</span>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <TextField
              label="Counter Name *"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. Counter 2 - Express Billing"
              required
            />

            <TextField
              label="Counter Code"
              fullWidth
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. TILL-02 (auto-generated if empty)"
            />

            <TextField
              label="Security PIN (4 digits) *"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. 1234"
              helperText="Security PIN cashiers use to open or pair this till"
              required
            />

            <TextField
              label="Default Starting Cash Float (₹)"
              type="number"
              fullWidth
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. 500"
            />

            <TextField
              label="Counter Notes / Location"
              fullWidth
              multiline
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={mutation.isPending}
              placeholder="e.g. Express checkout counter on ground floor"
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
                <Iconify icon="solar:add-circle-bold" />
              )
            }
          >
            {mutation.isPending ? 'Creating...' : 'Create Counter'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default CreateTillDialog;
