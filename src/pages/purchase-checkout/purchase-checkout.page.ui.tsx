import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Card,
  Container,
  Typography,
  Stack,
  Button,
  TextField,
  Chip,
  Divider,
  Paper,
  MenuItem,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { fCurrency } from '@utils/format-number';
import Iconify from 'shared/ui/iconify';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { pathKeys } from 'shared/routes';
import { usePurchaseCartStore } from 'entities/purchase';
import { usePurchaseSessionStore } from 'entities/supplier';
import { useActiveTillStore } from 'entities/till';
import { createPurchase } from 'shared/api/api.services';
import { enqueueSnackbar } from 'notistack';

const PAYMENT_METHODS = ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT'];

export default function PurchaseCheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { items, supplierId, supplierName, clearCart } = usePurchaseCartStore();
  const { selectedSupplier, clearSelectedSupplier } = usePurchaseSessionStore();
  const { activeTill } = useActiveTillStore();

  // Resolve supplier
  const supplier = (location.state as any)?.supplier ?? selectedSupplier;
  const resolvedSupplierId = supplierId ?? supplier?.id ?? (supplier as any)?._id ?? '';
  const resolvedSupplierName = supplierName ?? supplier?.name ?? 'Unknown Supplier';

  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [totalPaid, setTotalPaid] = useState('');
  const [discount, setDiscount] = useState('0');
  const [taxAmount, setTaxAmount] = useState('0');
  const [notes, setNotes] = useState('');

  const cartTotal = items.reduce((s, i) => s + i.cost_price * i.quantity, 0);
  const netTotal = cartTotal - Number(discount) + Number(taxAmount);

  const { mutate: submitPurchase, isPending } = useMutation({
    mutationFn: async () => {
      if (!resolvedSupplierId) throw new Error('Supplier not selected');
      if (items.length === 0) throw new Error('Cart is empty');

      const payload: any = {
        supplier_id: resolvedSupplierId,
        supplier_invoice_number: invoiceNumber || undefined,
        till_id: activeTill?.id ?? undefined,
        payment_method: paymentMethod,
        total_paid: Number(totalPaid) || netTotal,
        discount: Number(discount),
        tax_amount: Number(taxAmount),
        notes: notes || undefined,
        items: items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          cost_price: item.cost_price,
          selling_price: item.selling_price,
          mrp: item.mrp,
          ...(item.serial_numbers.length > 0 && { serial_numbers: item.serial_numbers }),
        })),
      };

      const headers: Record<string, string> = {};
      if (activeTill?.id) headers['x-till-id'] = activeTill.id;

      return createPurchase(payload, { headers });
    },
    onSuccess: (res) => {
      const invoice = res?.data?.data?.invoice;
      enqueueSnackbar(
        `Purchase recorded successfully${invoice ? ` · Invoice: ${invoice.invoice_number}` : ''}`,
        { variant: 'success' }
      );
      clearCart();
      clearSelectedSupplier();
      navigate(pathKeys.billing.supplier);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? 'Failed to record purchase';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your purchase cart is empty. Please add products first.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(pathKeys.billing.purchaseCart)}
          startIcon={<Iconify icon="solar:arrow-left-bold" />}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Purchase — Checkout | POS</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <CustomBreadcrumbs
          heading="Purchase — Checkout"
          links={[
            { name: 'POS Billing', href: pathKeys.billing.root },
            { name: 'Select Supplier', href: pathKeys.billing.supplierFP },
            { name: 'Add Products', href: pathKeys.billing.purchaseCart },
            { name: 'Checkout' },
          ]}
          sx={{ mb: 3 }}
        />

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="flex-start">
          {/* ─── LEFT: Order Summary ─── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Order Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Cost</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {item.product_name}
                          </Typography>
                          {item.product_code && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontFamily: 'monospace' }}
                            >
                              {item.product_code}
                            </Typography>
                          )}
                          {item.serial_numbers.length > 0 && (
                            <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {item.serial_numbers.map((s) => (
                                <Chip
                                  key={s}
                                  label={s}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontFamily: 'monospace', fontSize: '0.7rem', height: 18 }}
                                />
                              ))}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">{fCurrency(item.cost_price)}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            MRP: {fCurrency(item.mrp)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ×{item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={700}>
                            {fCurrency(item.cost_price * item.quantity)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={0.75}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Subtotal
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {fCurrency(cartTotal)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Discount
                  </Typography>
                  <Typography variant="body2" fontWeight={600} color="error.main">
                    − {fCurrency(Number(discount))}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Tax
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    + {fCurrency(Number(taxAmount))}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle2" fontWeight={700}>
                    Net Total
                  </Typography>
                  <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                    {fCurrency(netTotal)}
                  </Typography>
                </Stack>
              </Stack>
            </Card>
          </Box>

          {/* ─── RIGHT: Payment Details Form ─── */}
          <Box sx={{ width: { xs: '100%', lg: 400 }, flexShrink: 0 }}>
            <Card sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Payment Details
              </Typography>

              {/* Supplier + Till info */}
              <Paper
                variant="outlined"
                sx={{ p: 1.5, borderRadius: 1.5, mb: 2.5, bgcolor: 'background.neutral' }}
              >
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Iconify icon="solar:box-bold" width={16} color="text.secondary" />
                    <Typography variant="body2">
                      Supplier: <strong>{resolvedSupplierName}</strong>
                    </Typography>
                  </Stack>
                  {activeTill && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon="solar:calculator-bold" width={16} color="text.secondary" />
                      <Typography variant="body2">
                        Counter: <strong>{activeTill.name}</strong>
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Paper>

              <Stack spacing={2}>
                <TextField
                  label="Supplier Invoice Number"
                  placeholder="e.g. INV-MILL-2024-001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  fullWidth
                  size="small"
                />

                <TextField
                  select
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  fullWidth
                  size="small"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Discount (₹)"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: '0.01' }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                  <TextField
                    label="Tax Amount (₹)"
                    type="number"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    fullWidth
                    size="small"
                    inputProps={{ min: 0, step: '0.01' }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
                  />
                </Stack>

                <TextField
                  label="Amount Paid (₹)"
                  type="number"
                  value={totalPaid}
                  onChange={(e) => setTotalPaid(e.target.value)}
                  placeholder={String(netTotal)}
                  fullWidth
                  size="small"
                  inputProps={{ min: 0, step: '0.01' }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  helperText={`Net total: ${fCurrency(netTotal)}. Leave blank to use net total.`}
                />

                <TextField
                  label="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  placeholder="e.g. Festival inventory procurement"
                />
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Stack spacing={1.5}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => submitPurchase()}
                  disabled={isPending}
                  startIcon={
                    isPending ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <Iconify icon="solar:check-circle-bold" />
                    )
                  }
                >
                  {isPending ? 'Recording Purchase…' : 'Confirm Purchase'}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate(pathKeys.billing.purchaseCart, { state: { supplier } })}
                  disabled={isPending}
                  startIcon={<Iconify icon="solar:arrow-left-bold" />}
                >
                  Back to Products
                </Button>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
