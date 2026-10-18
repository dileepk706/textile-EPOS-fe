import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Tooltip,
  Badge,
} from '@mui/material';
import { fCurrency } from '@utils/format-number';
import Iconify from 'shared/ui/iconify';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { pathKeys } from 'shared/routes';
import { getProductsQueryOptions, Product } from 'entities/product';
import { usePurchaseCartStore, PurchaseCartItem } from 'entities/purchase';
import { usePurchaseSessionStore } from 'entities/supplier';
import { useActiveTillStore } from 'entities/till';

// ─────────────────────────────────────────────────
// Add-to-Cart Dialog (per product)
// ─────────────────────────────────────────────────
interface AddToCartDialogProps {
  open: boolean;
  product: Product | null;
  onClose: () => void;
  onAdd: (item: PurchaseCartItem) => void;
  existingItem?: PurchaseCartItem;
}

function AddToCartDialog({ open, product, onClose, onAdd, existingItem }: AddToCartDialogProps) {
  const [costPrice, setCostPrice] = useState(
    String(existingItem?.cost_price ?? product?.cost_price ?? '')
  );
  const [sellingPrice, setSellingPrice] = useState(
    String(existingItem?.selling_price ?? product?.selling_price ?? '')
  );
  const [mrp, setMrp] = useState(String(existingItem?.mrp ?? product?.price ?? ''));
  const [quantity, setQuantity] = useState(String(existingItem?.quantity ?? '1'));
  const [serialInput, setSerialInput] = useState('');
  const [serials, setSerials] = useState<string[]>(existingItem?.serial_numbers ?? []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!costPrice || Number(costPrice) < 0) errs.costPrice = 'Required';
    if (!sellingPrice || Number(sellingPrice) < 0) errs.sellingPrice = 'Required';
    if (!mrp || Number(mrp) < 0) errs.mrp = 'Required';
    if (!quantity || Number(quantity) <= 0) errs.quantity = 'Must be > 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddSerial = () => {
    const trimmed = serialInput.trim();
    if (trimmed && !serials.includes(trimmed)) {
      setSerials((prev) => [...prev, trimmed]);
      setSerialInput('');
    }
  };

  const handleRemoveSerial = (serial: string) => {
    setSerials((prev) => prev.filter((s) => s !== serial));
  };

  const handleSubmit = () => {
    if (!validate() || !product) return;
    const id = product.id || (product as any)._id;
    onAdd({
      product_id: id,
      product_name: product.name,
      product_code: product.barcode || product.sku || '',
      unit: product.unit,
      quantity: Number(quantity),
      cost_price: Number(costPrice),
      selling_price: Number(sellingPrice),
      mrp: Number(mrp),
      serial_numbers: serials,
    });
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {product.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {product.barcode || product.sku || '—'}
              {product.unit ? ` · ${product.unit}` : ''}
            </Typography>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Iconify icon="solar:close-circle-bold" />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} mt={2}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Cost Price (₹)"
              type="number"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              error={!!errors.costPrice}
              helperText={errors.costPrice}
              fullWidth
              inputProps={{ min: 0, step: '0.01' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <TextField
              label="Selling Price (₹)"
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              error={!!errors.sellingPrice}
              helperText={errors.sellingPrice}
              fullWidth
              inputProps={{ min: 0, step: '0.01' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="MRP (₹)"
              type="number"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              error={!!errors.mrp}
              helperText={errors.mrp}
              fullWidth
              inputProps={{ min: 0, step: '0.01' }}
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
              }}
            />
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              error={!!errors.quantity}
              helperText={errors.quantity}
              fullWidth
              inputProps={{ min: 1, step: 1 }}
            />
          </Stack>

          {/* Serial Numbers */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} gutterBottom>
              Serial Numbers (Optional)
            </Typography>
            <Stack direction="row" spacing={1} mt={0.5}>
              <TextField
                placeholder="Enter serial number and press Add"
                value={serialInput}
                onChange={(e) => setSerialInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSerial();
                  }
                }}
                size="small"
                fullWidth
              />
              <Button variant="outlined" size="small" onClick={handleAddSerial}>
                Add
              </Button>
            </Stack>
            {serials.length > 0 && (
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                {serials.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    size="small"
                    onDelete={() => handleRemoveSerial(s)}
                    sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                  />
                ))}
              </Box>
            )}
          </Box>

          {/* Preview total */}
          {costPrice && quantity && (
            <Paper
              variant="outlined"
              sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}
            >
              <Typography variant="body2" color="text.secondary">
                Total Cost: <strong>{fCurrency(Number(costPrice) * Number(quantity))}</strong>
                &nbsp;({quantity} × {fCurrency(Number(costPrice))})
              </Typography>
            </Paper>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          startIcon={<Iconify icon="solar:cart-plus-bold" />}
        >
          {existingItem ? 'Update Cart' : 'Add to Cart'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────
// Purchase Cart Page
// ─────────────────────────────────────────────────
export default function PurchaseCartPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedSupplier } = usePurchaseSessionStore();
  const { activeTill } = useActiveTillStore();
  const { items, addItem, removeItem, clearCart, setSupplier } = usePurchaseCartStore();

  // Resolve supplier from location state or store
  const supplier = (location.state as any)?.supplier ?? selectedSupplier;
  const supplierId =
    (location.state as any)?.supplierId || (supplier?.id ?? (supplier as any)?._id ?? null);
  const supplierName = supplier?.name ?? 'Unknown Supplier';

  const [search, setSearch] = useState('');
  const [dialogProduct, setDialogProduct] = useState<Product | null>(null);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(getProductsQueryOptions());

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const t = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(t) ||
        p.barcode?.toLowerCase().includes(t) ||
        p.sku?.toLowerCase().includes(t) ||
        p.brand?.toLowerCase().includes(t)
    );
  }, [products, search]);

  const cartTotal = items.reduce((s, i) => s + i.cost_price * i.quantity, 0);

  const handleOpenDialog = (product: Product) => {
    setDialogProduct(product);
  };

  const handleAddToCart = (item: PurchaseCartItem) => {
    if (supplierId) setSupplier(supplierId, supplierName);
    addItem(item);
  };

  const handleCheckout = () => {
    navigate(pathKeys.billing.purchaseCheckout, { state: { supplier } });
  };

  const existingItemFor = (product: Product) => {
    const id = product.id || (product as any)._id;
    return items.find((i) => i.product_id === id);
  };

  return (
    <>
      <Helmet>
        <title>Purchase — Add Products | POS</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 3, height: '100%' }}>
        <CustomBreadcrumbs
          heading="Purchase — Add Products"
          links={[
            { name: 'POS Billing', href: pathKeys.billing.root },
            { name: 'Select Supplier', href: pathKeys.billing.supplierFP },
            { name: supplierName },
          ]}
          sx={{ mb: 3 }}
        />

        {/* Supplier / Till info banner */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1.5,
                bgcolor: 'warning.lighter',
                color: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:box-bold" width={22} />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>
                Supplier: {supplierName}
              </Typography>
              {activeTill && (
                <Typography variant="caption" color="text.secondary">
                  Counter: <strong>{activeTill.name}</strong> &nbsp;·&nbsp; Cash:{' '}
                  <strong>{fCurrency(activeTill.cash_in_till)}</strong>
                </Typography>
              )}
            </Box>
          </Stack>
          <Chip
            label="Step 2 of 3: Select Products"
            color="warning"
            variant="soft"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Paper>

        {/* Main two-column layout */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          {/* ─── LEFT: Product List ─── */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Card sx={{ p: 2 }}>
              {/* Search */}
              <TextField
                fullWidth
                size="small"
                placeholder="Search products by name, barcode or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
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

              {/* Product grid list */}
              {!isError && (
                <Stack spacing={1}>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <Paper
                        key={i}
                        variant="outlined"
                        sx={{ p: 2, borderRadius: 1.5, opacity: 0.5 }}
                      >
                        <Typography variant="body2">Loading…</Typography>
                      </Paper>
                    ))
                  ) : filtered.length === 0 ? (
                    <Alert severity="info">
                      {search ? `No products matching "${search}"` : 'No products found.'}
                    </Alert>
                  ) : (
                    filtered.map((product) => {
                      const inCart = existingItemFor(product);
                      return (
                        <Paper
                          key={product.id || (product as any)._id}
                          variant="outlined"
                          sx={{
                            p: 1.5,
                            borderRadius: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            borderColor: inCart ? 'primary.main' : undefined,
                            bgcolor: inCart ? 'primary.lighter' : 'background.paper',
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Typography
                                variant="subtitle2"
                                fontWeight={700}
                                noWrap
                                sx={{ maxWidth: 260 }}
                              >
                                {product.name}
                              </Typography>
                              {product.unit && (
                                <Chip
                                  label={product.unit}
                                  size="small"
                                  sx={{ height: 18, fontSize: '0.68rem' }}
                                />
                              )}
                              {inCart && (
                                <Chip
                                  label={`In Cart ×${inCart.quantity}`}
                                  size="small"
                                  color="primary"
                                  variant="soft"
                                  sx={{ height: 18, fontSize: '0.68rem', fontWeight: 700 }}
                                />
                              )}
                            </Stack>
                            <Stack direction="row" spacing={1.5} alignItems="center" mt={0.25}>
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
                                  Stock: {product.available_stock}
                                </Typography>
                              )}
                            </Stack>
                          </Box>

                          <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                            {product.price != null && (
                              <Typography variant="body2" fontWeight={600} color="text.secondary">
                                {fCurrency(product.price)}
                              </Typography>
                            )}
                            <Button
                              variant={inCart ? 'outlined' : 'contained'}
                              color="primary"
                              size="small"
                              startIcon={
                                <Iconify
                                  icon={inCart ? 'solar:pen-bold' : 'solar:cart-plus-bold'}
                                />
                              }
                              onClick={() => handleOpenDialog(product)}
                            >
                              {inCart ? 'Edit' : 'Add'}
                            </Button>
                          </Stack>
                        </Paper>
                      );
                    })
                  )}
                </Stack>
              )}
            </Card>
          </Box>

          {/* ─── RIGHT: Cart Panel ─── */}
          <Box
            sx={{
              width: { xs: '100%', md: 360 },
              flexShrink: 0,
              position: { md: 'sticky' },
              top: { md: 80 },
            }}
          >
            <Card sx={{ p: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Badge badgeContent={items.length} color="primary">
                  <Iconify icon="solar:cart-bold" width={24} />
                </Badge>
                <Typography variant="subtitle1" fontWeight={700}>
                  Purchase Cart
                </Typography>
              </Stack>

              {items.length === 0 ? (
                <Alert severity="info" sx={{ borderRadius: 1.5 }}>
                  No products added yet. Select products from the list.
                </Alert>
              ) : (
                <>
                  <Stack spacing={1.5} mb={2}>
                    {items.map((item) => (
                      <Paper
                        key={item.product_id}
                        variant="outlined"
                        sx={{ p: 1.5, borderRadius: 1.5 }}
                      >
                        <Stack
                          direction="row"
                          alignItems="flex-start"
                          justifyContent="space-between"
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={700} noWrap>
                              {item.product_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {fCurrency(item.cost_price)} × {item.quantity} ={' '}
                              <strong>{fCurrency(item.cost_price * item.quantity)}</strong>
                            </Typography>
                            {item.serial_numbers.length > 0 && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                Serials: {item.serial_numbers.join(', ')}
                              </Typography>
                            )}
                          </Box>
                          <Tooltip title="Remove">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeItem(item.product_id)}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>

                  <Divider sx={{ mb: 2 }} />

                  <Stack direction="row" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Items
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {items.reduce((s, i) => s + i.quantity, 0)} units
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between" mb={2.5}>
                    <Typography variant="subtitle2" fontWeight={700}>
                      Total Cost
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="primary.main">
                      {fCurrency(cartTotal)}
                    </Typography>
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleCheckout}
                    startIcon={<Iconify icon="solar:bag-check-bold" />}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => clearCart()}
                    startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                  >
                    Clear Cart
                  </Button>
                </>
              )}
            </Card>
          </Box>
        </Stack>
      </Container>

      {/* Add-to-Cart Dialog */}
      <AddToCartDialog
        open={Boolean(dialogProduct)}
        product={dialogProduct}
        existingItem={dialogProduct ? existingItemFor(dialogProduct) : undefined}
        onClose={() => setDialogProduct(null)}
        onAdd={handleAddToCart}
      />
    </>
  );
}
