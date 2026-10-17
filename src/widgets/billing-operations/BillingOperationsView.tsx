import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Iconify from 'shared/ui/iconify';
import { fCurrency } from '@utils/format-number';
import { Till, useActiveTillStore } from 'entities/till';
import { BillingTillHeader } from 'widgets/billing-header';

// ----------------------------------------------------------------------

interface BillingOperationsViewProps {
  activeTill: Till;
}

export default function BillingOperationsView({ activeTill }: BillingOperationsViewProps) {
  const { clearActiveTill } = useActiveTillStore();

  const workflowSteps = [
    {
      step: '01',
      title: 'Scan or Select Products',
      description: 'Use the USB/wireless barcode scanner or quick search to add garments and fabrics to cart.',
      icon: 'solar:barcode-bold',
      color: 'info.main',
    },
    {
      step: '02',
      title: 'Cart & Adjustments',
      description: 'Modify quantities, apply seasonal discounts, verify customer details and tax breakdowns.',
      icon: 'solar:cart-large-4-bold',
      color: 'warning.main',
    },
    {
      step: '03',
      title: 'Tender Payment',
      description: 'Accept split tenders across Cash, UPI QR code, Card machine, and customer store credit.',
      icon: 'solar:card-2-bold',
      color: 'primary.main',
    },
    {
      step: '04',
      title: 'Print Bill & Complete',
      description: 'Generate GST-compliant tax invoices, print thermal receipts, and automatically update stock.',
      icon: 'solar:printer-bold',
      color: 'success.main',
    },
  ];

  return (
    <Box sx={{ py: 1 }}>
      {/* Top Active Till Bar */}
      <BillingTillHeader activeTill={activeTill} />

      {/* POS Ready Status Banner */}
      <Alert
        severity="success"
        icon={<Iconify icon="solar:check-circle-bold" width={22} />}
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small" onClick={clearActiveTill}>
            Switch Counter
          </Button>
        }
      >
        <strong>Counter Active:</strong> You are currently operating <strong>{activeTill.name} ({activeTill.code})</strong>. Cash in drawer is synchronized at <strong>{fCurrency(activeTill.cash_in_till)}</strong>.
      </Alert>

      {/* Shift Overview Metrics */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:cash-out-bold" width={24} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Opening Cash Float
                </Typography>
                <Typography variant="h6" fontWeight={800}>
                  {fCurrency(activeTill.opening_balance)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  bgcolor: 'success.lighter',
                  color: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:wallet-money-bold" width={24} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Current Cash in Drawer
                </Typography>
                <Typography variant="h6" fontWeight={800} color="success.main">
                  {fCurrency(activeTill.cash_in_till)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  bgcolor: 'info.lighter',
                  color: 'info.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:laptop-minimalistic-bold" width={24} />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Terminal Workstation
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography variant="subtitle2" fontWeight={700}>
                    {activeTill.code}
                  </Typography>
                  <Chip label="Ready" size="small" color="success" variant="soft" />
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* POS Billing Process Layout Blueprint */}
      <Card sx={{ p: { xs: 2.5, md: 4 }, bgcolor: 'background.neutral' }}>
        <Stack spacing={1} sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="h5" fontWeight={800}>
              POS Billing Process
            </Typography>
            <Chip label="Counter Ready" color="primary" size="small" sx={{ fontWeight: 700 }} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Till is selected and open. The complete billing process (product lookup, cart, payment tender, and receipt generation) will operate on this active register session.
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          {workflowSteps.map((ws) => (
            <Grid item xs={12} sm={6} md={3} key={ws.step}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: 'background.neutral',
                      color: ws.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Iconify icon={ws.icon} width={22} />
                  </Box>
                  <Typography variant="overline" color="text.disabled" fontWeight={800}>
                    STEP {ws.step}
                  </Typography>
                </Stack>

                <Typography variant="subtitle1" fontWeight={700}>
                  {ws.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {ws.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
}
