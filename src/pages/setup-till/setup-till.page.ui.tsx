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
import Tooltip from '@mui/material/Tooltip';
import { useQuery } from '@tanstack/react-query';
import { DataTable, ColumnDef } from 'shared/ui/data-table';
import Iconify from 'shared/ui/iconify';
import { FactoryButton } from 'shared/ui';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { fCurrency } from '@utils/format-number';
import { pathKeys } from 'shared/routes';
import { getTillsQueryOptions, Till, useActiveTillStore } from 'entities/till';
import { OpenTillDialog, CloseTillDialog, CreateTillDialog } from 'features/till';
import LogoutButton from '@layouts/_common/LogoutButton';

// ----------------------------------------------------------------------

type FilterTab = 'all' | 'open' | 'closed';

export default function SetupTillPage() {
  const navigate = useNavigate();
  const { data: tills, isLoading, isError, error, refetch } = useQuery(getTillsQueryOptions());
  const { activeTill, activeTillId, setActiveTill } = useActiveTillStore();

  const [filter, setFilter] = useState<FilterTab>('all');
  const [openTillTarget, setOpenTillTarget] = useState<Till | null>(null);
  const [closeTillTarget, setCloseTillTarget] = useState<Till | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredTills = (tills || []).filter((till) => {
    if (filter === 'open') return till.status === 'open';
    if (filter === 'closed') return till.status === 'closed';
    return true;
  });

  const isActiveTillOpen = Boolean(activeTill && activeTill.status === 'open');

  const columns: ColumnDef<Till>[] = [
    {
      id: 'name',
      label: 'Counter Name & Code',
      minWidth: 240,
      render: (row) => {
        const isCurrentActive = activeTillId === row.id;
        return (
          <Stack spacing={0.5}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="subtitle2" fontWeight={700}>
                {row.name}
              </Typography>
              <Chip
                label={row.code}
                size="small"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  bgcolor: 'background.neutral',
                }}
              />
              {isCurrentActive && (
                <Chip
                  icon={<Iconify icon="solar:check-circle-bold" width={14} />}
                  label="Active Session"
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Stack>
            {row.notes && (
              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 260 }}>
                {row.notes}
              </Typography>
            )}
          </Stack>
        );
      },
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      render: (row) => {
        const isOpen = row.status === 'open';
        const isBlocked = Boolean(row.is_blocked || row.status === 'blocked');

        let color: 'success' | 'warning' | 'error' = 'warning';
        let label = 'CLOSED';

        if (isBlocked) {
          color = 'error';
          label = 'BLOCKED';
        } else if (isOpen) {
          color = 'success';
          label = 'OPEN';
        }

        return (
          <Chip label={label} size="small" variant="soft" color={color} sx={{ fontWeight: 700 }} />
        );
      },
    },
    {
      id: 'opening_balance',
      label: 'Opening Float',
      minWidth: 140,
      align: 'right',
      render: (row) => (
        <Typography variant="body2" color="text.secondary">
          {fCurrency(row.opening_balance ?? 0)}
        </Typography>
      ),
    },
    {
      id: 'cash_in_till',
      label: 'Cash in Drawer',
      minWidth: 150,
      align: 'right',
      render: (row) => {
        const isOpen = row.status === 'open';
        return (
          <Typography
            variant="subtitle2"
            fontWeight={700}
            color={isOpen ? 'success.main' : 'text.primary'}
          >
            {fCurrency(row.cash_in_till ?? 0)}
          </Typography>
        );
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 220,
      align: 'center',
      render: (row) => {
        const isOpen = row.status === 'open';
        const isBlocked = Boolean(row.is_blocked || row.status === 'blocked');

        if (isBlocked) {
          return (
            <Chip
              label="Counter Blocked"
              size="small"
              variant="outlined"
              color="error"
              sx={{ fontWeight: 600 }}
            />
          );
        }

        if (isOpen) {
          return (
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Iconify icon="solar:lock-keyhole-bold" />}
                onClick={() => setCloseTillTarget(row)}
              >
                Close Till
              </Button>
            </Stack>
          );
        }

        // Closed status -> Action to Open Till
        return (
          <Button
            variant="contained"
            color="success"
            size="small"
            startIcon={<Iconify icon="solar:key-minimalistic-bold" />}
            onClick={() => setOpenTillTarget(row)}
          >
            Open Till
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Setup Till & Billing Counters | POS</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Top Header */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h4" fontWeight={800}>
              Billing Counters & Registers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Open a till register with an initial cash float to begin billing transactions, or
              close an active shift.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <LogoutButton />
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:restart-bold" />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>

            <FactoryButton
              startIcon={<Iconify icon="solar:add-circle-bold" />}
              onClick={() => setShowCreateDialog(true)}
            >
              Add New Counter
            </FactoryButton>
          </Stack>
        </Box>

        {/* Error State */}
        {isError && (
          <ApiErrorView
            error={error}
            title="Failed to Load Tills"
            description="Could not retrieve the billing registers for this store."
            onRetry={() => refetch()}
            showBack={false}
          />
        )}

        {/* Table View */}
        {!isError && (
          <Card>
            <DataTable<Till>
              columns={columns}
              rows={filteredTills}
              isLoading={isLoading}
              emptyText={`No ${filter !== 'all' ? filter : ''} tills found`}
            />
          </Card>
        )}
      </Container>

      {/* Open Till Dialog with opening balance + password */}
      <OpenTillDialog
        open={Boolean(openTillTarget)}
        onClose={() => setOpenTillTarget(null)}
        till={openTillTarget}
        onOpened={(openedTill) => {
          setActiveTill(openedTill);
          navigate(pathKeys.billing.supplier);
        }}
      />

      {/* Close Till Dialog with closing balance + password */}
      <CloseTillDialog
        open={Boolean(closeTillTarget)}
        onClose={() => setCloseTillTarget(null)}
        till={closeTillTarget}
      />

      {/* Add New Counter Dialog */}
      <CreateTillDialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} />
    </>
  );
}
