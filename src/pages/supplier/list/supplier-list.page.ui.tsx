import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import { SearchBar } from 'shared/ui/search-bar';
import { SupplierTable } from 'widgets/supplier-table';
import { Paper } from 'shared/ui/paper';
import { FactoryButton } from 'shared/ui';
import { RouterLink } from '@routes/components';
import { pathKeys } from 'shared/routes';
import TableActionsWrapper from 'shared/ui/table/TableActionsWrapper';
import { getSuppliersQueryOptions } from 'entities/supplier';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { ApiErrorView } from 'shared/ui/api-error-views';

// ----------------------------------------------------------------------

export default function SupplierListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery(
    getSuppliersQueryOptions({ search: searchQuery })
  );

  return (
    <>
      <Helmet>
        <title>Supplier List</title>
      </Helmet>

      <CustomBreadcrumbs heading="Supplier List" links={[{ name: 'Suppliers', href: '' }]} />

      <Paper>
        <TableActionsWrapper>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search suppliers by name, contact person, phone, email, or GSTIN…"
            debounceMs={500}
            sx={{ width: '100%' }}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1.5,
            }}
          >
            <FactoryButton component={RouterLink} to={pathKeys.supplier.createFP}>
              Create Supplier
            </FactoryButton>
          </Box>
        </TableActionsWrapper>

        {isError ? (
          <ApiErrorView
            error={error}
            title="Failed to Load Suppliers"
            onRetry={() => refetch()}
            showBack={false}
          />
        ) : (
          <SupplierTable rows={data || []} isLoading={isLoading} />
        )}
      </Paper>
    </>
  );
}
