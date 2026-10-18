import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import { useQuery } from '@tanstack/react-query';
import { fCurrency } from '@utils/format-number';
import { fDate } from '@utils/format-time';
import EmptyContent from 'shared/ui/empty-content';
import Iconify from 'shared/ui/iconify';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { Product, ProductBatch, getProductBatchesQueryOptions } from 'entities/product';

// ----------------------------------------------------------------------

export interface ProductBatchDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductBatchDialog({ open, onClose, product }: ProductBatchDialogProps) {
  const productId = product?.id || (product as any)?._id || '';

  const {
    data: fetchedBatches,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...getProductBatchesQueryOptions(productId),
    enabled: open && !!productId,
  });

  if (!product) return null;

  // Use fetched batches if available, otherwise fall back to product.batches
  const batches: ProductBatch[] = fetchedBatches || product.batches || [];
  const hasBatches = batches.length > 0;

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={onClose}>
      <DialogTitle sx={{ pb: 1.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">{product.name}</Typography>
              <Chip
                label="FIFO Order"
                size="small"
                variant="soft"
                color="info"
                sx={{ fontWeight: 600, fontSize: '0.72rem' }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              Barcode: {product.barcode || '—'} {product.sku ? `• SKU: ${product.sku}` : ''}
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              label={`Unit: ${product.unit || 'pcs'}`}
              size="small"
              variant="outlined"
              color="primary"
            />
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
              Loading available batches...
            </Typography>
          </Box>
        ) : isError ? (
          <ApiErrorView
            error={error}
            title="Failed to Load Product Batches"
            description="Could not retrieve available batch inventory for this product."
            onRetry={() => refetch()}
            showBack={false}
          />
        ) : hasBatches ? (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Batch No</TableCell>
                  <TableCell align="right">Available Qty</TableCell>
                  <TableCell align="right">Cost Price</TableCell>
                  <TableCell align="right">Selling Price</TableCell>
                  <TableCell align="right">MRP</TableCell>
                  <TableCell align="center">Serial Numbers</TableCell>
                  <TableCell align="center">Mfg Date</TableCell>
                  <TableCell align="center">Expiry Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch, index) => {
                  const batchNo = batch.batch_no || batch.batch_number || `BATCH-${index + 1}`;
                  const availableQty =
                    batch.quantity_available !== undefined
                      ? batch.quantity_available
                      : batch.quantity !== undefined
                      ? batch.quantity
                      : 0;
                  const serials = batch.serial_numbers || [];

                  return (
                    <TableRow key={batch.id || batch._id || batchNo || index} hover>
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ fontFamily: 'monospace' }}
                          >
                            {batchNo}
                          </Typography>
                          {batch.created_at || batch.createdAt ? (
                            <Typography variant="caption" color="text.secondary">
                              Created: {fDate(batch.created_at || batch.createdAt)}
                            </Typography>
                          ) : null}
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        <Chip
                          label={`${availableQty} ${product.unit || 'pcs'}`}
                          size="small"
                          color={availableQty > 0 ? 'success' : 'error'}
                          variant="soft"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {fCurrency(batch.cost_price || 0)}
                        </Typography>
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
                        {serials.length > 0 ? (
                          <Tooltip
                            title={
                              <Box sx={{ p: 0.5 }}>
                                <Typography
                                  variant="caption"
                                  fontWeight={700}
                                  display="block"
                                  sx={{ mb: 0.5 }}
                                >
                                  Serial Numbers ({serials.length}):
                                </Typography>
                                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                  {serials.join(', ')}
                                </Typography>
                              </Box>
                            }
                            arrow
                          >
                            <Chip
                              label={`${serials.length} Serials`}
                              size="small"
                              variant="outlined"
                              color="info"
                              icon={<Iconify icon="solar:hashtag-bold" width={14} />}
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.72rem',
                                cursor: 'pointer',
                              }}
                            />
                          </Tooltip>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="caption" color="text.secondary">
                          {batch.mfg_date ? fDate(batch.mfg_date) : '—'}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="caption" color="text.secondary">
                          {batch.expiry_date ? fDate(batch.expiry_date) : '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ py: 4 }}>
            <EmptyContent
              filled
              title="No Batches Available"
              description={`There are currently no active batch lots recorded for "${product.name}".`}
              sx={{ py: 4 }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductBatchDialog;
