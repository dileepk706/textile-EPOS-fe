import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { fCurrency } from '@utils/format-number';
import { DataTable, ColumnDef } from 'shared/ui/data-table';
import Iconify from 'shared/ui/iconify';
import { icons } from 'shared/ui/iconify/icons';
import { RouterLink } from '@routes/components';
import { pathKeys } from 'shared/routes';
import { Product } from 'entities/product';
import { ProductDeleteButton } from 'features/product/delete';
import { ProductBatchDialog } from 'features/product/batch-dialog';

// ----------------------------------------------------------------------

interface ProductTableProps {
  rows: Product[];
  isLoading?: boolean;
}

export default function ProductTable({ rows, isLoading }: ProductTableProps) {
  const [selectedProductForBatch, setSelectedProductForBatch] = useState<Product | null>(null);

  const columns: ColumnDef<Product>[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 220,
      render: (row) => (
        <Stack spacing={0.25}>
          <Typography variant="body2" fontWeight={600}>
            {row.name}
          </Typography>
          {(row.sku || row.brand || row.categories || row.category) && (
            <Typography variant="caption" color="text.secondary">
              {[row.sku, row.brand, row.categories || row.category].filter(Boolean).join(' • ')}
            </Typography>
          )}
        </Stack>
      ),
    },
    // {
    //   id: 'price',
    //   label: 'Price',
    //   minWidth: 120,
    //   align: 'right',
    //   render: (row) => {
    //     const sellingPrice = row.price ?? row.selling_price;
    //     return (
    //       <Typography variant="body2" fontWeight={600} color="primary.main">
    //         {sellingPrice !== undefined ? fCurrency(sellingPrice) : '—'}
    //       </Typography>
    //     );
    //   },
    // },
    // {
    //   id: 'cost_price',
    //   label: 'Cost Price',
    //   minWidth: 120,
    //   align: 'right',
    //   render: (row) => {
    //     const costPrice = row.cost_price ?? row.costPrice;
    //     return (
    //       <Typography variant="body2" color="text.secondary">
    //         {costPrice !== undefined ? fCurrency(costPrice) : '—'}
    //       </Typography>
    //     );
    //   },
    // },
    {
      id: 'barcode',
      label: 'Barcode',
      minWidth: 150,
      render: (row) => (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <Iconify icon="solar:barcode-bold" width={18} sx={{ color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
            {row.barcode || '—'}
          </Typography>
        </Box>
      ),
    },
    {
      id: 'available_stock',
      label: 'Available Stock',
      minWidth: 140,
      align: 'center',
      render: (row) => {
        const stock = row.quantity_available ?? row.stock ?? 0;
        const unit = row.unit || 'pcs';

        let color: 'success' | 'warning' | 'error' = 'success';
        if (stock === 0) color = 'error';
        else if (stock <= 10) color = 'warning';

        return (
          <Chip
            label={`${stock} ${unit}`}
            size="small"
            variant="soft"
            color={color}
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      id: 'view_batch',
      label: 'View Batch',
      minWidth: 130,
      align: 'center',
      render: (row) => (
        <Button
          size="small"
          variant="outlined"
          color="info"
          startIcon={<Iconify icon="solar:layers-minimalistic-bold" width={16} />}
          onClick={() => setSelectedProductForBatch(row)}
          sx={{ fontSize: '0.75rem', py: 0.5, px: 1.25 }}
        >
          View Batch
        </Button>
      ),
    },
    {
      id: 'actions',
      label: 'Action',
      minWidth: 100,
      align: 'center',
      render: (row) => {
        const productId = row.id || (row as any)._id;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <IconButton
              component={RouterLink as any}
              to={`${pathKeys.product.updateFP}/${productId}`}
              size="small"
              color="primary"
              title="Edit product"
            >
              <Iconify icon={icons.edit} />
            </IconButton>
            <ProductDeleteButton productId={productId} productName={row.name} />
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <DataTable<Product>
        columns={columns}
        rows={rows || []}
        isLoading={isLoading}
        emptyText="No products found"
      />

      <ProductBatchDialog
        open={Boolean(selectedProductForBatch)}
        onClose={() => setSelectedProductForBatch(null)}
        product={selectedProductForBatch}
      />
    </>
  );
}
