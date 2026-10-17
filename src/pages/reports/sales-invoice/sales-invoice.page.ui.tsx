import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import { fCurrency } from '@utils/format-number';
import { fDateTime } from '@utils/format-time';
import Iconify from 'shared/ui/iconify';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { pathKeys } from 'shared/routes';
import { getSalesInvoiceById } from 'shared/api/api.services';

export default function SalesInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isBillingContext = location.pathname.startsWith('/billing');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['sales-invoice', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing invoice identifier');
      const res = await getSalesInvoiceById(id);
      return res.data?.data;
    },
    enabled: !!id,
  });

  const invoice = data?.invoice;
  const items = data?.items || [];

  const handleBack = () => {
    navigate(isBillingContext ? pathKeys.billing.salesReport : pathKeys.reports.sales);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>{invoice?.invoice_number ? `Invoice ${invoice.invoice_number}` : 'Sales Invoice'} | POS</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <CustomBreadcrumbs
          heading="Sales Invoice Details"
          links={[
            { name: isBillingContext ? 'POS Billing' : 'Dashboard', href: isBillingContext ? pathKeys.billing.root : pathKeys.root },
            { name: 'Sales Report', href: isBillingContext ? pathKeys.billing.salesReport : pathKeys.reports.sales },
            { name: invoice?.invoice_number || id || 'Invoice' },
          ]}
          action={
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon="solar:arrow-left-bold" />}
                onClick={handleBack}
              >
                Back to Report
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Iconify icon="solar:printer-bold" />}
                onClick={handlePrint}
              >
                Print Invoice
              </Button>
            </Stack>
          }
          sx={{ mb: 3 }}
        />

        {isLoading ? (
          <Box sx={{ py: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">Loading invoice details...</Typography>
          </Box>
        ) : isError ? (
          <ApiErrorView
            error={error}
            title="Failed to Load Sales Invoice"
            onRetry={() => refetch()}
            showBack={true}
            onBack={handleBack}
          />
        ) : invoice ? (
          <Card sx={{ p: { xs: 2.5, md: 4 } }}>
            {/* Header info */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2} mb={3}>
              <Box>
                <Typography variant="overline" color="text.secondary">Tax Invoice / Cash Receipt</Typography>
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  {invoice.invoice_number}
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>
                  Date & Time: <strong>{invoice.sale_date ? fDateTime(invoice.sale_date) : '—'}</strong>
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={invoice.payment_status || 'PAID'}
                  color={invoice.payment_status === 'PAID' ? 'success' : 'warning'}
                  variant="filled"
                  sx={{ fontWeight: 800, px: 1 }}
                />
                <Chip
                  label={invoice.payment_method || 'CASH'}
                  color="info"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>
            </Stack>

            {/* Till & Staff Metadata */}
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mb: 3, bgcolor: 'background.neutral' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Cashier / Staff Name</Typography>
                  <Typography variant="subtitle2" fontWeight={700}>{invoice.staff_name || 'Staff'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Billing Counter</Typography>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {invoice.till?.name || 'Counter'} {invoice.till?.code ? `(${invoice.till.code})` : ''}
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Line items table */}
            <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
              Itemized Products ({items.length})
            </Typography>

            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product Details</TableCell>
                    <TableCell>Batch Number</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item: any, idx: number) => (
                    <TableRow key={item.id || idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700}>
                          {item.product_name}
                        </Typography>
                        {item.barcode && (
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                            Barcode: {item.barcode}
                          </Typography>
                        )}
                        {item.serial_numbers_sold && item.serial_numbers_sold.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {item.serial_numbers_sold.map((sn: string) => (
                              <Chip
                                key={sn}
                                label={sn}
                                size="small"
                                variant="outlined"
                                sx={{ fontFamily: 'monospace', fontSize: '0.68rem', height: 18 }}
                              />
                            ))}
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.batch_number || 'BATCH'}
                          size="small"
                          sx={{ fontFamily: 'monospace', fontSize: '0.72rem' }}
                        />
                      </TableCell>
                      <TableCell align="right">{fCurrency(item.unit_price)}</TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={700}>
                          {item.quantity} {item.unit || 'pcs'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700}>
                          {fCurrency(item.total_amount || item.subtotal || item.unit_price * item.quantity)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Financial Totals */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Box sx={{ width: { xs: '100%', sm: 320 } }}>
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Gross Subtotal</Typography>
                    <Typography variant="body2" fontWeight={600}>{fCurrency(invoice.total_amount || 0)}</Typography>
                  </Stack>
                  {Number(invoice.discount) > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Discount</Typography>
                      <Typography variant="body2" fontWeight={600} color="error.main">
                        − {fCurrency(invoice.discount)}
                      </Typography>
                    </Stack>
                  )}
                  {Number(invoice.tax_amount) > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Tax</Typography>
                      <Typography variant="body2" fontWeight={600}>+ {fCurrency(invoice.tax_amount)}</Typography>
                    </Stack>
                  )}
                  <Divider />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight={700}>Net Total</Typography>
                    <Typography variant="h6" fontWeight={800} color="primary.main">
                      {fCurrency(invoice.net_amount || invoice.total_amount || 0)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Total Paid</Typography>
                    <Typography variant="subtitle2" fontWeight={700} color="success.main">
                      {fCurrency(invoice.total_paid || invoice.net_amount || 0)}
                    </Typography>
                  </Stack>
                  {Number(invoice.balance_amount) > 0 && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" color="text.secondary">Balance Due</Typography>
                      <Typography variant="subtitle2" fontWeight={700} color="error.main">
                        {fCurrency(invoice.balance_amount)}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Box>

            {invoice.notes && (
              <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 1.5 }}>
                <Typography variant="caption" color="text.secondary">Notes</Typography>
                <Typography variant="body2">{invoice.notes}</Typography>
              </Box>
            )}
          </Card>
        ) : null}
      </Container>
    </>
  );
}
