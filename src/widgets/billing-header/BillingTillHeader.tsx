import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Iconify from 'shared/ui/iconify';
import { fCurrency } from '@utils/format-number';
import { Till, useActiveTillStore, useTillCashPolling } from 'entities/till';
import { CloseTillDialog, CashInDialog, CashOutDialog } from 'features/till';

// ----------------------------------------------------------------------

interface BillingTillHeaderProps {
  activeTill: Till;
}

export default function BillingTillHeader({ activeTill }: BillingTillHeaderProps) {
  const { clearActiveTill } = useActiveTillStore();
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showCashInDialog, setShowCashInDialog] = useState(false);
  const [showCashOutDialog, setShowCashOutDialog] = useState(false);

  const isOpen = activeTill.status === 'open';

  useTillCashPolling(1000);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 3,
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left Side: Till Info */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1.5,
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:calculator-bold" width={28} />
          </Box>

          <Stack spacing={0.25}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="h6" fontWeight={700}>
                {activeTill.name}
              </Typography>
              <Chip
                label={activeTill.code}
                size="small"
                sx={{ fontFamily: 'monospace', fontWeight: 700 }}
              />
              <Chip
                label={isOpen ? 'OPEN' : activeTill.status?.toUpperCase() || 'CLOSED'}
                size="small"
                color={isOpen ? 'success' : 'error'}
                variant="soft"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Active Shift • Opening Float: <strong>{fCurrency(activeTill.opening_balance)}</strong>
            </Typography>
          </Stack>
        </Stack>

        {/* Right Side: Cash in drawer & actions */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          {/* Cash Drawer Widget */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1.5,
              bgcolor: 'background.neutral',
              border: (theme) => `1px dashed ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Iconify icon="solar:cash-out-bold" width={20} sx={{ color: 'success.main' }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Drawer Cash
              </Typography>
              <Typography variant="subtitle2" fontWeight={800} color="success.main">
                {fCurrency(activeTill.cash_in_till)}
              </Typography>
            </Box>
          </Box>

          {/* Action buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="soft"
              color="success"
              size="medium"
              startIcon={<Iconify icon="solar:card-recive-bold" />}
              onClick={() => setShowCashInDialog(true)}
              disabled={!isOpen}
            >
              Cash In
            </Button>

            <Button
              variant="soft"
              color="warning"
              size="medium"
              startIcon={<Iconify icon="solar:card-send-bold" />}
              onClick={() => setShowCashOutDialog(true)}
              disabled={!isOpen}
            >
              Cash Out
            </Button>

            <Button
              variant="outlined"
              color="inherit"
              size="medium"
              startIcon={<Iconify icon="solar:transfer-horizontal-bold" />}
              onClick={clearActiveTill}
            >
              Switch
            </Button>

            <Button
              variant="contained"
              color="error"
              size="medium"
              startIcon={<Iconify icon="solar:lock-keyhole-bold" />}
              onClick={() => setShowCloseDialog(true)}
            >
              Close Shift
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <CashInDialog
        open={showCashInDialog}
        onClose={() => setShowCashInDialog(false)}
        till={activeTill}
      />

      <CashOutDialog
        open={showCashOutDialog}
        onClose={() => setShowCashOutDialog(false)}
        till={activeTill}
      />

      <CloseTillDialog
        open={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        till={activeTill}
      />
    </>
  );
}
