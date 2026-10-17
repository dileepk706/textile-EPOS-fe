import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { fCurrency } from '@utils/format-number';
import { fDate } from '@utils/format-time';
import Iconify from 'shared/ui/iconify';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { DataTable, ColumnDef } from 'shared/ui/data-table';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { pathKeys } from 'shared/routes';
import { getSalesReport } from 'shared/api/api.services';

export default function SalesReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isBillingContext = location.pathname.startsWith('/billing');

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['sales-report', { page, limit, search, paymentStatus, paymentMethod, startDate, endDate }],
    queryFn: async () => {
      const res = await getSalesReport({
        page,
        limit,
        ...(search ? { search } : {}),
        ...(paymentStatus ? { payment_status: paymentStatus } : {}),
        ...(paymentMethod ? { payment_method: paymentMethod } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      });
      return res.data?.data;
    },
  });

  const sales = data?.sales || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const summary = data?.summary;

  const handleViewInvoice = (invoiceIdOrNumber: string) => {
    const targetUrl = isBillingContext
      ? pathKeys.billing.salesInvoice(invoiceIdOrNumber)
      : pathKeys.reports.salesInvoice(invoiceIdOrNumber);
    navigate(targetUrl);
  };

  const columns: ColumnDef<any>[] = [
    {
      id: 'invoice_number',
      label: 'Invoice No',
      minWidth: 170,
      render: (row) => (
        <Stack spacing={0.25}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
            {row.invoice_number}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.sale_date ? fDate(row.sale_date) : '—'}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'staff_name',
      label: 'Cashier / Staff',
      minWidth: 140,
      render: (row) => (
        <Typography variant="body2">{row.staff_name || 'Staff'}</Typography>
      ),
    },
    {
      id: 'till',
      label: 'Counter / Till',
      minWidth: 130,
      render: (row) => (
        <Chip
          label={row.till?.name || row.till?.code || row.till_id ? `Till: ${row.till?.name || row.till?.code || 'Assigned'}` : 'Counter'}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      id: 'items_count',
      label: 'Items & Qty',
      minWidth: 120,
      align: 'center',
      render: (row) => (
        <Typography variant="body2">
          {row.items_count || row.items?.length || 0} items ({row.total_quantity || 0} pcs)
        </Typography>
      ),
    },
    {
      id: 'payment_method',
      label: 'Payment Method',
      minWidth: 130,
      align: 'center',
      render: (row) => (
        <Chip
          label={row.payment_method || 'CASH'}
          size="small"
          color="info"
          variant="soft"
          sx={{ fontWeight: 600, fontSize: '0.72rem' }}
        />
      ),
    },
    {
      id: 'payment_status',
      label: 'Status',
      minWidth: 110,
      align: 'center',
      render: (row) => {
        const isPaid = row.payment_status === 'PAID';
        const isPartial = row.payment_status === 'PARTIAL';
        return (
          <Chip
            label={row.payment_status || 'PAID'}
            size="small"
            color={isPaid ? 'success' : isPartial ? 'warning' : 'error'}
            variant="soft"
            sx={{ fontWeight: 700 }}
          />
        );
      },
    },
    {
      id: 'net_amount',
      label: 'Net Total',
      minWidth: 130,
      align: 'right',
      render: (row) => (
        <Stack spacing={0.25} alignItems="flex-end">
          <Typography variant="subtitle2" fontWeight={700} color="primary.main">
            {fCurrency(row.net_amount ?? row.total_amount ?? 0)}
          </Typography>
          {row.discount > 0 && (
            <Typography variant="caption" color="error.main">
              disc: -{fCurrency(row.discount)}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      id: 'view_invoice',
      label: 'View Invoice',
      minWidth: 140,
      align: 'center',
      render: (row) => (
        <Button
          size="small"
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:document-text-bold" width={16} />}
          onClick={() => handleViewInvoice(row.invoice_number || row.id || row._id)}
          sx={{ fontSize: '0.75rem', py: 0.5, px: 1.25 }}
        >
          View Invoice
        </Button>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sales Report | POS</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <CustomBreadcrumbs
          heading="Sales Report"
          links={[
            { name: isBillingContext ? 'POS Billing' : 'Dashboard', href: isBillingContext ? pathKeys.billing.root : pathKeys.root },
            { name: 'Reports' },
            { name: 'Sales Report' },
          ]}
          action={
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:restart-bold" />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
          }
          sx={{ mb: 3 }}
        />

        {/* Summary Metric Cards */}
        {summary && (
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              mb: 3,
            }}
          >
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Total Invoices</Typography>
              <Typography variant="h5" fontWeight={700}>{summary.total_sales_count || total}</Typography>
              <Typography variant="caption" color="text.secondary">Total Qty: {summary.total_quantity || 0} pcs</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Total Sales Volume</Typography>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {fCurrency(summary.total_amount || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Gross sales</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Total Paid Amount</Typography>
              <Typography variant="h5" fontWeight={700} color="success.main">
                {fCurrency(summary.total_paid || summary.net_amount || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Collected in drawer</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">Discounts / Tax</Typography>
              <Typography variant="h6" fontWeight={700} color="text.secondary">
                -{fCurrency(summary.total_discount || 0)} / +{fCurrency(summary.total_tax || 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">Applied in sales</Typography>
            </Paper>
          </Box>
        )}

        {/* Filters Toolbar */}
        <Card sx={{ p: 2.5, mb: 3 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              size="small"
              placeholder="Search by invoice number or staff..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="solar:magnifer-bold" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1, width: '100%' }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              sx={{ minWidth: 130 }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="PAID">PAID</MenuItem>
              <MenuItem value="PARTIAL">PARTIAL</MenuItem>
              <MenuItem value="UNPAID">UNPAID</MenuItem>
            </TextField>

            <TextField
              select
              size="small"
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPage(1);
              }}
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="">All Methods</MenuItem>
              <MenuItem value="CASH">CASH</MenuItem>
              <MenuItem value="CARD">CARD</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
              <MenuItem value="BANK_TRANSFER">BANK TRANSFER</MenuItem>
              <MenuItem value="CREDIT">CREDIT</MenuItem>
            </TextField>

            <TextField
              size="small"
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            <TextField
              size="small"
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />

            {(search || paymentStatus || paymentMethod || startDate || endDate) && (
              <Button
                color="error"
                variant="text"
                size="small"
                onClick={() => {
                  setSearch('');
                  setPaymentStatus('');
                  setPaymentMethod('');
                  setStartDate('');
                  setEndDate('');
                  setPage(1);
                }}
              >
                Clear
              </Button>
            )}
          </Stack>
        </Card>

        {/* Data Table */}
        {isError ? (
          <ApiErrorView
            error={error}
            title="Failed to Load Sales Report"
            onRetry={() => refetch()}
            showBack={false}
          />
        ) : (
          <Card>
            <DataTable<any>
              columns={columns}
              rows={sales}
              isLoading={isLoading}
              emptyText="No sales records found"
            />

            {totalPages > 1 && (
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, val) => setPage(val)}
                  color="primary"
                />
              </Box>
            )}
          </Card>
        )}
      </Container>
    </>
  );
}
