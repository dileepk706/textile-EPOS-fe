import { useState, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import { useQuery } from '@tanstack/react-query';
import { fCurrency } from '@utils/format-number';
import { fDate } from '@utils/format-time';
import Iconify from 'shared/ui/iconify';
import EmptyContent from 'shared/ui/empty-content';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { Product, ProductBatch, getProductBatchesQueryOptions } from 'entities/product';
import { SalesCartItem, useSalesCartStore } from 'entities/sales';

interface SelectBatchModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export function SelectBatchModal({ open, onClose, product }: SelectBatchModalProps) {
  const productId = product?.id || (product as any)?._id || '';

  const {
    data: batches = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...getProductBatchesQueryOptions(productId),
    enabled: open && !!productId,
  });

  const { items: cartItems, addItem } = useSalesCartStore();

  // Selected batch for picking variants/quantity
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);
  const [pickQuantity, setPickQuantity] = useState<number>(1);
  const [selectedSerials, setSelectedSerials] = useState<string[]>([]);
  const [discountAmount, setDiscountAmount] = useState<string>('0');

  // When opening a batch to pick
  const handleSelectBatch = (batch: ProductBatch) => {
    setSelectedBatch(batch);
    setPickQuantity(1);
    setSelectedSerials([]);
    setDiscountAmount('0');
  };

  const handleBackToBatches = () => {
    setSelectedBatch(null);
    setSelectedSerials([]);
  };

  const batchId = (b: ProductBatch) => b.id || b._id || '';
  const batchNumber = (b: ProductBatch) => b.batch_no || b.batch_number || 'BATCH';
  const getAvailableStock = (b: ProductBatch) =>
    b.quantity_available !== undefined
      ? b.quantity_available
      : b.quantity !== undefined
      ? b.quantity
      : 0;

  // Check how many of this batch are already in the cart
  const getCartQuantityForBatch = (bId: string) => {
    const itemKey = `${productId}_${bId}`;
    const cartItem = cartItems.find((i) => i.id === itemKey);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleAddBatchToCart = () => {
    if (!product || !selectedBatch) return;

    const bId = batchId(selectedBatch);
    const itemKey = `${productId}_${bId}`;
    const available = getAvailableStock(selectedBatch);
    const unitPrice = selectedBatch.selling_price || product.selling_price || product.price || 0;

    const newItem: SalesCartItem = {
      id: itemKey,
      batch_id: bId,
      batch_number: batchNumber(selectedBatch),
      product_id: productId,
      product_name: product.name,
      product_code: product.barcode || product.sku || '',
      unit: product.unit || 'pcs',
      quantity: pickQuantity,
      unit_price: unitPrice,
      cost_price: selectedBatch.cost_price,
      tax_rate: 0,
      discount: Number(discountAmount) || 0,
      serial_numbers: selectedSerials,
      available_batch_quantity: available,
      available_serials: selectedBatch.serial_numbers || [],
    };

    addItem(newItem);
    handleBackToBatches();
  };

  const toggleSerial = (serial: string) => {
    if (selectedSerials.includes(serial)) {
      setSelectedSerials((prev) => prev.filter((s) => s !== serial));
    } else {
      if (selectedSerials.length < pickQuantity) {
        setSelectedSerials((prev) => [...prev, serial]);
      } else {
        // Replace or expand
        setSelectedSerials((prev) => [...prev, serial]);
        setPickQuantity((prev) => prev + 1);
      }
    }
  };

  if (!product) return null;

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
        >
          <Box>
            <Typography variant="h6">{product.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              Barcode: {product.barcode || '—'} {product.sku ? `• SKU: ${product.sku}` : ''}
              {product.unit ? ` • Unit: ${product.unit}` : ''}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="text"
            color="inherit"
            startIcon={<Iconify icon="solar:restart-bold" />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2.5 }}>
        {isLoading ? (
          <Box
            sx={{
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
            }}
          >
            <CircularProgress size={36} />
            <Typography variant="body2" color="text.secondary">
              Loading available inventory batches...
            </Typography>
          </Box>
        ) : isError ? (
          <ApiErrorView
            error={error}
            title="Failed to Load Inventory Batches"
            description="Could not load stock batches for this product."
            onRetry={() => refetch()}
            showBack={false}
          />
        ) : batches.length === 0 ? (
          <Box sx={{ py: 4 }}>
            <EmptyContent
              filled
              title="No Available Batches"
              description={`There is currently no inventory in stock for "${product.name}". Please procure or record purchases first.`}
              sx={{ py: 4 }}
            />
          </Box>
        ) : selectedBatch ? (
          /* ─── Detail view for picking specific quantity & serial numbers ─── */
          <Stack spacing={2.5}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.neutral',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" fontWeight={700}>
                    {batchNumber(selectedBatch)}
                  </Typography>
                  <Chip
                    label={`Stock: ${getAvailableStock(selectedBatch)} ${product.unit || 'pcs'}`}
                    size="small"
                    color={getAvailableStock(selectedBatch) > 0 ? 'success' : 'error'}
                    variant="soft"
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Selling Price: <strong>{fCurrency(selectedBatch.selling_price || 0)}</strong>
                  {selectedBatch.mrp ? ` • MRP: ${fCurrency(selectedBatch.mrp)}` : ''}
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                color="inherit"
                startIcon={<Iconify icon="solar:arrow-left-bold" />}
                onClick={handleBackToBatches}
              >
                Change Batch
              </Button>
            </Paper>

            {/* Quantity Selector */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <Box sx={{ flex: 1, width: '100%' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Quantity to Sell
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    size="small"
                    disabled={pickQuantity <= 1}
                    onClick={() => {
                      const next = Math.max(1, pickQuantity - 1);
                      setPickQuantity(next);
                      if (selectedSerials.length > next) {
                        setSelectedSerials((prev) => prev.slice(0, next));
                      }
                    }}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <Iconify icon="solar:minus-bold" width={16} />
                  </IconButton>

                  <TextField
                    type="number"
                    size="small"
                    value={pickQuantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      const maxStock = getAvailableStock(selectedBatch);
                      const cartQty = getCartQuantityForBatch(batchId(selectedBatch));
                      const remainingAvailable = Math.max(0, maxStock - cartQty);
                      const clamped = Math.min(Math.max(1, val), remainingAvailable || maxStock);
                      setPickQuantity(clamped);
                      if (selectedSerials.length > clamped) {
                        setSelectedSerials((prev) => prev.slice(0, clamped));
                      }
                    }}
                    inputProps={{
                      min: 1,
                      max: getAvailableStock(selectedBatch),
                      style: { textAlign: 'center', width: 60, fontWeight: 700 },
                    }}
                  />

                  <IconButton
                    size="small"
                    disabled={
                      pickQuantity >=
                      getAvailableStock(selectedBatch) -
                        getCartQuantityForBatch(batchId(selectedBatch))
                    }
                    onClick={() => {
                      const maxStock = getAvailableStock(selectedBatch);
                      const cartQty = getCartQuantityForBatch(batchId(selectedBatch));
                      const remainingAvailable = maxStock - cartQty;
                      if (pickQuantity < remainingAvailable) {
                        setPickQuantity((prev) => prev + 1);
                      }
                    }}
                    sx={{ border: '1px solid', borderColor: 'divider' }}
                  >
                    <Iconify icon="solar:add-circle-bold" width={16} />
                  </IconButton>

                  <Typography variant="caption" color="text.secondary">
                    Max:{' '}
                    {getAvailableStock(selectedBatch) -
                      getCartQuantityForBatch(batchId(selectedBatch))}{' '}
                    available
                  </Typography>
                </Stack>
              </Box>

              {/* Item Discount */}
              <Box sx={{ width: { xs: '100%', sm: 180 } }}>
                <Typography variant="subtitle2" gutterBottom>
                  Discount (Optional)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  }}
                  inputProps={{ min: 0 }}
                />
              </Box>
            </Stack>

            {/* Serial Numbers Selection (if batch has serials) */}
            {selectedBatch.serial_numbers && selectedBatch.serial_numbers.length > 0 && (
              <Box>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle2">
                    Select Serial Numbers ({selectedSerials.length}/{pickQuantity} selected)
                  </Typography>
                  {selectedSerials.length > 0 && (
                    <Button size="small" color="inherit" onClick={() => setSelectedSerials([])}>
                      Clear Selected
                    </Button>
                  )}
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedBatch.serial_numbers.map((serial) => {
                    const isSelected = selectedSerials.includes(serial);
                    return (
                      <Chip
                        key={serial}
                        label={serial}
                        size="medium"
                        clickable
                        onClick={() => toggleSerial(serial)}
                        color={isSelected ? 'primary' : 'default'}
                        variant={isSelected ? 'filled' : 'outlined'}
                        sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                      />
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Total calculation preview */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Line Total
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {pickQuantity} × {fCurrency(selectedBatch.selling_price || 0)}
                    {Number(discountAmount) > 0 ? ` − ${fCurrency(Number(discountAmount))}` : ''}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary.main" fontWeight={700}>
                  {fCurrency(
                    Math.max(
                      0,
                      pickQuantity * (selectedBatch.selling_price || 0) - Number(discountAmount)
                    )
                  )}
                </Typography>
              </Stack>
            </Paper>
          </Stack>
        ) : (
          /* ─── List of batches table ─── */
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Batch No</TableCell>
                  <TableCell align="right">Available Qty</TableCell>
                  <TableCell align="right">Selling Price</TableCell>
                  <TableCell align="right">MRP</TableCell>
                  <TableCell align="center">Serials</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch, index) => {
                  const bId = batchId(batch);
                  const bNo = batchNumber(batch);
                  const available = batch.quantity;
                  const inCartQty = getCartQuantityForBatch(bId);
                  const remaining = getAvailableStock(batch);
                  const isOutOfStock = remaining <= 0;
                  console.log(batch);

                  return (
                    <TableRow key={bId || index} hover>
                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{ fontFamily: 'monospace' }}
                        >
                          {bNo}
                        </Typography>
                        {batch.created_at || batch.createdAt ? (
                          <Typography variant="caption" color="text.secondary">
                            Lot: {fDate(batch.created_at || batch.createdAt)}
                          </Typography>
                        ) : null}
                      </TableCell>

                      <TableCell align="right">
                        <Chip
                          label={`${remaining} / ${available} ${product.unit || 'pcs'}`}
                          size="small"
                          color={remaining > 0 ? 'success' : 'error'}
                          variant="soft"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700} color="primary.main">
                          {fCurrency(batch.selling_price || 0)}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {batch.mrp ? fCurrency(batch.mrp) : '—'}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        {batch.serial_numbers && batch.serial_numbers.length > 0 ? (
                          <Chip
                            label={`${batch.serial_numbers.length} Serials`}
                            size="small"
                            variant="outlined"
                            sx={{ fontFamily: 'monospace', fontSize: '0.72rem' }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <Button
                          variant={inCartQty > 0 ? 'outlined' : 'contained'}
                          color="primary"
                          size="small"
                          disabled={isOutOfStock}
                          startIcon={<Iconify icon="solar:cart-plus-bold" width={16} />}
                          onClick={() => handleSelectBatch(batch)}
                        >
                          {inCartQty > 0 ? `In Cart (${inCartQty})` : 'Select Batch'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
        {selectedBatch && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddBatchToCart}
            startIcon={<Iconify icon="solar:bag-check-bold" />}
          >
            Add {pickQuantity} to Cart
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default SelectBatchModal;
