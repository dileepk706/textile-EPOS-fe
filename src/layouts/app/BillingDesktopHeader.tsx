import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Iconify from 'shared/ui/iconify';
import { fCurrency } from '@utils/format-number';
import { pathKeys } from 'shared/routes';
import { useActiveTillStore, useTillCashPolling } from 'entities/till';
import { CloseTillDialog, CashInDialog, CashOutDialog } from 'features/till';

// ----------------------------------------------------------------------

export default function BillingDesktopHeader() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { activeTill } = useActiveTillStore();

  // Refresh cash in till data every 1 second in the Zustand store
  useTillCashPolling(1000);

  const [showCashIn, setShowCashIn] = useState(false);
  const [showCashOut, setShowCashOut] = useState(false);
  const [showCloseTill, setShowCloseTill] = useState(false);

  const isOpen = activeTill?.status === 'open';

  return (
    <>
      <Box
        component="header"
        sx={{
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: theme.zIndex.appBar - 1,
          bgcolor: 'background.paper',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: `0 1px 3px 0 ${alpha(theme.palette.common.black, 0.04)}`,
          px: { xs: 2, lg: 3 },
          py: { xs: 2, lg: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Left Side: Till Info */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1.25,
              bgcolor: 'primary.lighter',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Iconify icon="solar:shop-2-bold" width={24} />
          </Box>

          {activeTill ? (
            <Stack spacing={0.25}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle2" fontWeight={700} noWrap>
                  {activeTill.name}
                </Typography>

                <Chip
                  label={activeTill.code}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: 11,
                    height: 20,
                  }}
                />

                <Chip
                  label={isOpen ? 'OPEN' : activeTill.status?.toUpperCase() || 'CLOSED'}
                  size="small"
                  color={isOpen ? 'success' : 'error'}
                  variant="soft"
                  sx={{
                    fontWeight: 700,
                    fontSize: 11,
                    height: 20,
                  }}
                />
              </Stack>

              <Typography variant="caption" color="text.secondary" noWrap>
                Shift Active • Opening Float:{' '}
                <strong>{fCurrency(activeTill.opening_balance)}</strong>
              </Typography>
            </Stack>
          ) : (
            <Stack spacing={0.25}>
              <Typography variant="subtitle2" color="text.secondary">
                No Active Till Selected
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Select or open a counter to begin billing
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Right Side: Cash Display & Action Buttons */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          {activeTill ? (
            <>
              {/* Cash in Till Widget */}
              <Tooltip title="Current physical cash balance expected in drawer" arrow>
                <Box
                  sx={{
                    px: 1.75,
                    py: 0.75,
                    borderRadius: 1.25,
                    bgcolor: 'background.neutral',
                    border: `1px dashed ${theme.palette.divider}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.25,
                  }}
                >
                  <Iconify
                    icon="solar:wallet-money-bold"
                    width={22}
                    sx={{ color: 'success.main' }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: 9.5,
                        letterSpacing: 0.5,
                        display: 'block',
                        lineHeight: 1,
                      }}
                    >
                      Cash in Till
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        color: 'success.dark',
                        lineHeight: 1.2,
                        mt: 0.25,
                      }}
                    >
                      {fCurrency(activeTill.cash_in_till)}
                    </Typography>
                  </Box>
                </Box>
              </Tooltip>

              {/* Move Cash In button */}
              <Button
                variant="soft"
                color="success"
                size="small"
                startIcon={<Iconify icon="solar:card-recive-bold" width={18} />}
                onClick={() => setShowCashIn(true)}
                disabled={!isOpen}
                sx={{ fontWeight: 700, height: 34 }}
              >
                Cash In
              </Button>

              {/* Take Cash Out button */}
              <Button
                variant="soft"
                color="warning"
                size="small"
                startIcon={<Iconify icon="solar:card-send-bold" width={18} />}
                onClick={() => setShowCashOut(true)}
                disabled={!isOpen}
                sx={{ fontWeight: 700, height: 34 }}
              >
                Cash Out
              </Button>

              {/* Close Till button */}
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Iconify icon="solar:lock-keyhole-bold" width={18} />}
                onClick={() => setShowCloseTill(true)}
                sx={{ fontWeight: 700, height: 34 }}
              >
                Close Till
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<Iconify icon="solar:key-minimalistic-bold" />}
              onClick={() => navigate(pathKeys.setuptill)}
            >
              Setup / Open Till
            </Button>
          )}
        </Stack>
      </Box>

      {/* Action Dialogs */}
      <CashInDialog open={showCashIn} onClose={() => setShowCashIn(false)} till={activeTill} />

      <CashOutDialog open={showCashOut} onClose={() => setShowCashOut(false)} till={activeTill} />

      <CloseTillDialog
        open={showCloseTill}
        onClose={() => setShowCloseTill(false)}
        till={activeTill}
        onClosed={() => {
          navigate(pathKeys.setuptill);
        }}
      />
    </>
  );
}
