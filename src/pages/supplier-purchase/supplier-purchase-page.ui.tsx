import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import { useQuery } from '@tanstack/react-query';
import { DataTable, ColumnDef } from 'shared/ui/data-table';
import Iconify from 'shared/ui/iconify';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { RouterLink } from '@routes/components';
import { pathKeys } from 'shared/routes';
import { getSuppliersQueryOptions, Supplier, usePurchaseSessionStore } from 'entities/supplier';
import { useActiveTillStore } from 'entities/till';
import { fCurrency } from '@utils/format-number';

// ----------------------------------------------------------------------

export default function SupplierPurchasePage() {
  const navigate = useNavigate();
  const {
    data: suppliers,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(getSuppliersQueryOptions());
  const { setSelectedSupplier } = usePurchaseSessionStore();
  const { activeTill } = useActiveTillStore();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredSuppliers = (suppliers || []).filter((supplier) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      supplier.name?.toLowerCase().includes(term) ||
      supplier.contact_person?.toLowerCase().includes(term) ||
      supplier.phone?.toLowerCase().includes(term) ||
      supplier.gstin?.toLowerCase().includes(term) ||
      supplier.email?.toLowerCase().includes(term)
    );
  });

  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    const supplierId = supplier.id || (supplier as any)._id;
    navigate(`${pathKeys.billing.purchaseCart}?supplier_id=${supplierId}`, {
      state: { supplier },
    });
  };

  const columns: ColumnDef<Supplier>[] = [
    {
      id: 'name',
      label: 'Supplier Details',
      minWidth: 240,
      render: (row) => (
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" fontWeight={700}>
            {row.name}
          </Typography>
          {row.gstin && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                GSTIN:
              </Typography>
              <Chip
                label={row.gstin}
                size="small"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.72rem',
                  height: 20,
                  bgcolor: 'background.neutral',
                }}
              />
            </Box>
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
            <Typography variant="body2" color="text.secondary">
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
      id: 'status',
      label: 'Status',
      minWidth: 100,
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
      minWidth: 160,
      align: 'center',
      render: (row) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Iconify icon="solar:cart-plus-bold" />}
          onClick={() => handleSelectSupplier(row)}
        >
          Select Supplier
        </Button>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Purchase — Select Supplier | POS</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Breadcrumbs Header */}
        <CustomBreadcrumbs
          heading="Purchase — Select Supplier"
          links={[
            { name: 'POS Billing', href: pathKeys.billing.root },
            { name: 'Purchase', href: pathKeys.billing.supplierFP },
            { name: 'Select Supplier' },
          ]}
          sx={{ mb: 3 }}
        />

        {/* Active Register Session Info */}
        {activeTill && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              bgcolor: 'background.paper',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 1.5,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:calculator-bold" width={22} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" fontWeight={700}>
                    Active Counter: {activeTill.name}
                  </Typography>
                  <Chip
                    label={activeTill.code}
                    size="small"
                    sx={{ fontFamily: 'monospace', fontWeight: 700 }}
                  />
                  <Chip
                    label="OPEN"
                    size="small"
                    color="success"
                    variant="soft"
                    sx={{ fontWeight: 700 }}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Cash in drawer: <strong>{fCurrency(activeTill.cash_in_till)}</strong>
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Step 1 of 2: Select a supplier to start purchase order
            </Typography>
          </Paper>
        )}

        {/* Error State */}
        {isError && (
          <ApiErrorView
            error={error}
            title="Failed to Load Suppliers"
            description="Could not load the supplier directory for purchase transactions."
            onRetry={() => refetch()}
            showBack={false}
          />
        )}

        {/* Supplier Table */}
        {!isError && (
          <Card>
            <DataTable<Supplier>
              columns={columns}
              rows={filteredSuppliers}
              isLoading={isLoading}
              emptyText={
                searchTerm
                  ? `No suppliers matching "${searchTerm}"`
                  : 'No suppliers found. Create a supplier first to record purchase orders.'
              }
            />
          </Card>
        )}
      </Container>
    </>
  );
}
