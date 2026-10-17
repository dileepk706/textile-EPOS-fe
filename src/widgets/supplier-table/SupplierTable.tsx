import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { DataTable, ColumnDef } from 'shared/ui/data-table';
import Iconify from 'shared/ui/iconify';
import { icons } from 'shared/ui/iconify/icons';
import { RouterLink } from '@routes/components';
import { pathKeys } from 'shared/routes';
import { Supplier } from 'entities/supplier';
import { SupplierDeleteButton } from 'features/supplier/delete';

// ----------------------------------------------------------------------

interface SupplierTableProps {
  rows: Supplier[];
  isLoading?: boolean;
}

export default function SupplierTable({ rows, isLoading }: SupplierTableProps) {
  const columns: ColumnDef<Supplier>[] = [
    {
      id: 'name',
      label: 'Supplier Name',
      minWidth: 220,
      render: (row) => (
        <Stack spacing={0.25}>
          <Typography variant="body2" fontWeight={600}>
            {row.name}
          </Typography>
          {row.gstin && (
            <Typography variant="caption" color="text.secondary">
              GSTIN: {row.gstin}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      id: 'contact_person',
      label: 'Contact Person',
      minWidth: 160,
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {row.contact_person || '—'}
        </Typography>
      ),
    },
    {
      id: 'phone',
      label: 'Phone',
      minWidth: 150,
      render: (row) =>
        row.phone ? (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <Iconify icon="solar:phone-bold" width={16} sx={{ color: 'text.secondary' }} />
            <Typography variant="body2">{row.phone}</Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 200,
      render: (row) =>
        row.email ? (
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <Iconify icon="fluent:mail-20-regular" width={16} sx={{ color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {row.email}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      id: 'address',
      label: 'Address',
      minWidth: 200,
      render: (row) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {row.address || '—'}
        </Typography>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 110,
      align: 'center',
      render: (row) => {
        const isActive = row.is_active !== false;
        return (
          <Chip
            label={isActive ? 'Active' : 'Inactive'}
            size="small"
            variant="soft"
            color={isActive ? 'success' : 'default'}
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      id: 'actions',
      label: 'Action',
      minWidth: 100,
      align: 'center',
      render: (row) => {
        const supplierId = row.id || (row as any)._id;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <IconButton
              component={RouterLink as any}
              to={`${pathKeys.supplier.updateFP}/${supplierId}`}
              size="small"
              color="primary"
              title="Edit supplier"
            >
              <Iconify icon={icons.edit} />
            </IconButton>
            <SupplierDeleteButton supplierId={supplierId} supplierName={row.name} />
          </Box>
        );
      },
    },
  ];

  return (
    <DataTable<Supplier>
      columns={columns}
      rows={rows || []}
      isLoading={isLoading}
      emptyText="No suppliers found"
    />
  );
}
