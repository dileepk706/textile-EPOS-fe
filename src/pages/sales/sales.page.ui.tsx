import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  InputAdornment,
  IconButton,
  Alert,
  Tooltip,
  Badge,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import { fCurrency } from '@utils/format-number';
import Iconify from 'shared/ui/iconify';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { pathKeys } from 'shared/routes';
import { getProductsQueryOptions, Product } from 'entities/product';
import { useActiveTillStore } from 'entities/till';
import { useSalesCartStore, SalesCartItem } from 'entities/sales';
import { createSale } from 'shared/api/api.services';
import { SelectBatchModal } from 'features/sales/select-batch-modal';
import { Paper } from 'shared/ui/paper';
import { queryClient } from 'shared/queryClient';

const PAYMENT_METHODS = ['CASH', 'CARD', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT'];

export default function SalesPage() {
  const { activeTill } = useActiveTillStore();
  const { items, removeItem, updateQuantity, clearCart, totalQuantity, subtotalAmount } =
    useSalesCartStore();

  const [search, setSearch] = useState('');
  const [selectedProductForBatch, setSelectedProductForBatch] = useState<Product | null>(null);

  // Checkout form state
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [overallDiscount, setOverallDiscount] = useState('0');
  const [taxAmount, setTaxAmount] = useState('0');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('Counter sale');

  // Receipt popup state after successful checkout
  const [receiptData, setReceiptData] = useState<any | null>(null);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(getProductsQueryOptions());

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(term) ||
        p.barcode?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term) ||
        p.brand?.toLowerCase().includes(term)
    );
  }, [products, search]);

  const subtotal = subtotalAmount();
  const netTotal = Math.max(0, subtotal - Number(overallDiscount) + Number(taxAmount));

  // Count cart items per product
  const getProductCartCount = (productId: string) => {
    return items.filter((i) => i.product_id === productId).reduce((sum, i) => sum + i.quantity, 0);
  };

  // Complete Sale Mutation
  const { mutate: completeSale, isPending: isCheckingOut } = useMutation({
    mutationFn: async () => {
      if (items.length === 0) {
        throw new Error('No items in the sales cart.');
      }

      const payload = {
        till_id: activeTill?.id,
        payment_method: paymentMethod,
        total_paid: amountPaid !== '' ? Number(amountPaid) : netTotal,
        discount: Number(overallDiscount) || 0,
        tax_amount: Number(taxAmount) || 0,
        notes: notes || undefined,
        items: items.map((item) => ({
          batch_id: item.batch_id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_rate: item.tax_rate || 0,
          discount: item.discount || 0,
          serial_numbers: item.serial_numbers.length > 0 ? item.serial_numbers : undefined,
        })),
      };

      const headers: Record<string, string> = {};
      if (activeTill?.id) {
        headers['x-till-id'] = activeTill.id;
      }

      return createSale(payload, { headers });
    },
    onSuccess: (res) => {
      const data = res?.data?.data;
      enqueueSnackbar(
        `Sale completed successfully! Invoice #${data?.invoice?.invoice_number || ''}`,
        { variant: 'success' }
      );
      items.forEach((e) => {
        queryClient.invalidateQueries({ queryKey: ['products', 'batches', e.product_id] });
      });
      setReceiptData(data);
      clearCart();
      setAmountPaid('');
      setOverallDiscount('0');
      setTaxAmount('0');
      setNotes('Counter sale');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to complete sale';
      enqueueSnackbar(msg, { variant: 'error' });
    },
  });

  return (
    <>
      <Helmet>
        <title>POS Sales Billing | POS</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 3, height: '100%' }}>
        <CustomBreadcrumbs
          heading="Point of Sale — Billing"
          links={[{ name: 'POS Billing', href: pathKeys.billing.root }, { name: 'Sales' }]}
          sx={{ mb: 2 }}
        />

        {/* Main 2-column layout */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          {/* ─── LEFT: Products Catalog ─── */}
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <Paper sx={{ p: 2.5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products by name, barcode, brand or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:magnifer-bold" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch('')}>
                        <Iconify icon="solar:close-circle-bold" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {isError && (
                <ApiErrorView
                  error={error}
                  title="Failed to Load Products"
                  onRetry={refetch}
                  showBack={false}
                />
              )}

              {!isError && (
                <Stack spacing={1.25}>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Paper
                        key={i}
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 1.5, opacity: 0.5 }}
                      >
                        <Typography variant="body2">Loading products…</Typography>
                      </Paper>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 1.5 }}>
                      {search ? `No products matching "${search}"` : 'No products found.'}
                    </Alert>
                  ) : (
                    filteredProducts.map((product) => {
                      const productId = product.id || (product as any)._id;
                      const cartCount = getProductCartCount(productId);
                      const hasItemsInCart = cartCount > 0;

                      return (
                        <Paper
                          key={productId}
                          variant="outlined"
                          sx={{
                            p: 2,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            borderColor: hasItemsInCart ? 'primary.main' : undefined,
                            // bgcolor: hasItemsInCart ? 'primary.lighter' : 'background.paper',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography variant="subtitle2" fontWeight={700} noWrap>
                                {product.name}
                              </Typography>
                              {product.unit && (
                                <Chip
                                  label={product.unit}
                                  size="small"
                                  sx={{ height: 20, fontSize: '0.72rem' }}
                                />
                              )}
                              {hasItemsInCart && (
                                <Chip
                                  label={`In Cart: ${cartCount}`}
                                  size="small"
                                  color="primary"
                                  variant="soft"
                                  sx={{ height: 20, fontSize: '0.72rem', fontWeight: 700 }}
                                />
                              )}
                            </Stack>

                            <Stack direction="row" spacing={1.5} alignItems="center" mt={0.5}>
                              {product.barcode && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ fontFamily: 'monospace' }}
                                >
                                  {product.barcode}
                                </Typography>
                              )}
                              {product.sku && (
                                <Typography variant="caption" color="text.secondary">
                                  SKU: {product.sku}
                                </Typography>
                              )}
                              {product.available_stock !== undefined && (
                                <Typography variant="caption" color="text.secondary">
                                  Total Stock: <strong>{product.available_stock}</strong>
                                </Typography>
                              )}
                            </Stack>
                          </Box>

                          <Stack direction="row" spacing={1.5} alignItems="center" flexShrink={0}>
                            {product.selling_price || product.price ? (
                              <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                                {fCurrency(product.selling_price || product.price || 0)}
                              </Typography>
                            ) : null}

                            <Button
                              variant={hasItemsInCart ? 'outlined' : 'contained'}
                              color="primary"
                              size="small"
                              startIcon={
                                <Iconify icon="solar:layers-minimalistic-bold" width={16} />
                              }
                              onClick={() => setSelectedProductForBatch(product)}
                            >
                              Select Batch
                            </Button>
                          </Stack>
                        </Paper>
                      );
                    })
                  )}
                </Stack>
              )}
            </Paper>
          </Box>

          {/* ─── RIGHT: Sales Cart & Checkout Panel ─── */}
          <Box
            sx={{
              width: { xs: '100%', md: 400 },
              flexShrink: 0,
              position: { md: 'sticky' },
              top: { md: 80 },
            }}
          >
            <Paper sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Badge badgeContent={totalQuantity()} color="primary">
                    <Iconify icon="solar:cart-large-minimalistic-bold" width={24} />
                  </Badge>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Billing Cart
                  </Typography>
                </Stack>
                {items.length > 0 && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => clearCart()}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={14} />}
                  >
                    Clear
                  </Button>
                )}
              </Stack>

              {items.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 1.5, my: 2 }}>
                  Cart is empty. Click <strong>"Select Batch"</strong> on any product to pick
                  inventory lots.
                </Alert>
              ) : (
                <>
                  {/* Cart Item Rows */}
                  <Stack spacing={1.5} mb={2.5} sx={{ maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
                    {items.map((item) => (
                      <Paper
                        key={item.id}
                        variant="outlined"
                        sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                        >
                          <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                            <Typography variant="subtitle2" fontWeight={700} noWrap>
                              {item.product_name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" mt={0.25}>
                              <Chip
                                label={item.batch_number}
                                size="small"
                                sx={{ fontFamily: 'monospace', fontSize: '0.68rem', height: 18 }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                {fCurrency(item.unit_price)} / {item.unit || 'pcs'}
                              </Typography>
                            </Stack>
                            {item.serial_numbers.length > 0 && (
                              <Typography
                                variant="caption"
                                display="block"
                                color="text.secondary"
                                sx={{ fontFamily: 'monospace', mt: 0.5 }}
                              >
                                Serials: {item.serial_numbers.join(', ')}
                              </Typography>
                            )}
                          </Box>

                          <Tooltip title="Remove line item">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeItem(item.id)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        {/* Quantity Controls & Line Total */}
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          mt={1.5}
                          pt={1}
                          sx={{ borderTop: (theme) => `1px dashed ${theme.palette.divider}` }}
                        >
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                width: 26,
                                height: 26,
                              }}
                            >
                              <Iconify icon="solar:minus-bold" width={14} />
                            </IconButton>
                            <Typography variant="body2" fontWeight={700} sx={{ px: 1 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.available_batch_quantity}
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                width: 26,
                                height: 26,
                              }}
                            >
                              <Iconify icon="solar:add-circle-bold" width={14} />
                            </IconButton>
                          </Stack>

                          <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                            {fCurrency(item.unit_price * item.quantity - (item.discount || 0))}
                          </Typography>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  {/* Pricing Summary */}
                  <Stack spacing={0.75} mb={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">
                        Items Subtotal ({totalQuantity()} units)
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {fCurrency(subtotal)}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ my: 0.5 }}>
                      <TextField
                        size="small"
                        label="Bill Discount"
                        type="number"
                        value={overallDiscount}
                        onChange={(e) => setOverallDiscount(e.target.value)}
                        fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        size="small"
                        label="Tax Amount"
                        type="number"
                        value={taxAmount}
                        onChange={(e) => setTaxAmount(e.target.value)}
                        fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        inputProps={{ min: 0 }}
                      />
                    </Stack>

                    <Divider sx={{ my: 0.5 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="subtitle1" fontWeight={700}>
                        Total Payable
                      </Typography>
                      <Typography variant="h6" fontWeight={800} color="primary.main">
                        {fCurrency(netTotal)}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Checkout Fields */}
                  <Stack spacing={1.5} mb={2.5}>
                    <TextField
                      select
                      size="small"
                      label="Payment Method"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      fullWidth
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <MenuItem key={m} value={m}>
                          {m}
                        </MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      size="small"
                      label="Amount Paid"
                      type="number"
                      value={amountPaid}
                      placeholder={String(netTotal)}
                      onChange={(e) => setAmountPaid(e.target.value)}
                      fullWidth
                      InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                      }}
                      inputProps={{ min: 0 }}
                      helperText={
                        Number(amountPaid) > netTotal
                          ? `Change to return: ${fCurrency(Number(amountPaid) - netTotal)}`
                          : Number(amountPaid) < netTotal && amountPaid !== ''
                          ? `Due balance: ${fCurrency(netTotal - Number(amountPaid))}`
                          : `Full amount: ${fCurrency(netTotal)}`
                      }
                    />

                    <TextField
                      size="small"
                      label="Bill Notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      fullWidth
                    />
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isCheckingOut || items.length === 0}
                    onClick={() => completeSale()}
                    startIcon={
                      isCheckingOut ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <Iconify icon="solar:check-circle-bold" />
                      )
                    }
                    sx={{ py: 1.25, fontWeight: 700 }}
                  >
                    {isCheckingOut
                      ? 'Processing Checkout…'
                      : `Complete Sale • ${fCurrency(netTotal)}`}
                  </Button>
                </>
              )}
            </Paper>
          </Box>
        </Stack>
      </Container>

      {/* Product Batch Selection Modal */}
      <SelectBatchModal
        open={Boolean(selectedProductForBatch)}
        product={selectedProductForBatch}
        onClose={() => setSelectedProductForBatch(null)}
      />

      {/* Sale Success / Receipt Receipt Dialog */}
      {receiptData && (
        <Dialog
          open={Boolean(receiptData)}
          onClose={() => setReceiptData(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Iconify icon="solar:check-circle-bold" color="success.main" width={28} />
              <Typography variant="h6">Sale Completed</Typography>
            </Stack>
          </DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <Paper
                variant="outlined"
                sx={{ p: 2, borderRadius: 1.5, bgcolor: 'background.neutral' }}
              >
                <Typography variant="subtitle1" fontWeight={700}>
                  Receipt #{receiptData?.invoice?.invoice_number}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cashier: {receiptData?.invoice?.staff_name || 'Staff'} •{' '}
                  {receiptData?.invoice?.sale_date
                    ? new Date(receiptData.invoice.sale_date).toLocaleString()
                    : ''}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Payment Method</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {receiptData?.invoice?.payment_method}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Total Paid</Typography>
                  <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                    {fCurrency(
                      receiptData?.invoice?.total_paid || receiptData?.invoice?.net_amount || 0
                    )}
                  </Typography>
                </Stack>
              </Paper>

              <Typography variant="subtitle2">
                Itemized Products ({receiptData?.items?.length || 0})
              </Typography>
              <Stack spacing={1}>
                {receiptData?.items?.map((it: any) => (
                  <Paper
                    key={it.id || it.batch_id}
                    variant="outlined"
                    sx={{ p: 1.5, borderRadius: 1.5 }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {it.product_name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {it.batch_number} • Qty: {it.quantity} {it.unit || 'pcs'} ×{' '}
                          {fCurrency(it.unit_price)}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={700}>
                        {fCurrency(it.total_amount || it.subtotal)}
                      </Typography>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                setReceiptData(null);
                window.print();
              }}
              startIcon={<Iconify icon="solar:printer-bold" />}
            >
              Print Receipt
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => setReceiptData(null)}>
              Done
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
