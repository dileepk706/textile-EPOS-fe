import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import { SearchBar } from 'shared/ui/search-bar';
import { ProductTable } from 'widgets/product-table';
import { Paper } from 'shared/ui/paper';
import { FactoryButton } from 'shared/ui';
import { RouterLink } from '@routes/components';
import { pathKeys } from 'shared/routes';
import TableActionsWrapper from 'shared/ui/table/TableActionsWrapper';
import { getProductsQueryOptions } from 'entities/product';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { ApiErrorView } from 'shared/ui/api-error-views';

// ----------------------------------------------------------------------

export default function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, error, refetch } = useQuery(
    getProductsQueryOptions({ search: searchQuery })
  );

  return (
    <>
      <Helmet>
        <title>Product List</title>
      </Helmet>

      <CustomBreadcrumbs heading="Product List" links={[{ name: 'Products', href: '' }]} />

      <Paper>
        <TableActionsWrapper>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search products by name, barcode, or description…"
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
            <FactoryButton component={RouterLink} to={pathKeys.product.createFP}>
              Create Product
            </FactoryButton>
          </Box>
        </TableActionsWrapper>

        {isError ? (
          <ApiErrorView
            error={error}
            title="Failed to Load Products"
            onRetry={() => refetch()}
            showBack={false}
          />
        ) : (
          <ProductTable rows={data || []} isLoading={isLoading} />
        )}
      </Paper>
    </>
  );
}
