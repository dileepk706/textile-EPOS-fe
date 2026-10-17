import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { getSupplierByIdQueryOptions } from 'entities/supplier';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { pathKeys } from 'shared/routes';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { SupplierUpdateForm } from 'features/supplier/update';

// ----------------------------------------------------------------------

export default function SupplierUpdatePage() {
  const params = useParams();
  const supplierId = params.id as string;
  const { data: supplier, isLoading, isError, error, refetch } = useQuery(
    getSupplierByIdQueryOptions(supplierId)
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 360 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !supplier) {
    return (
      <ApiErrorView
        error={error}
        title={!supplier && !isError ? 'Supplier Not Found' : undefined}
        description={
          !supplier && !isError
            ? 'The requested supplier could not be found or may have been deleted.'
            : undefined
        }
        backHref={pathKeys.supplier.root}
        backLabel="Back to Suppliers"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Update Supplier : {supplier.name}</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Update Supplier"
        links={[
          {
            href: pathKeys.supplier.root,
            name: 'Suppliers',
          },
          {
            href: '',
            name: `Update Supplier: ${supplier.name}`,
          },
        ]}
      />

      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <SupplierUpdateForm key={supplier.id || (supplier as any)._id} currentSupplier={supplier} />
      </Box>
    </>
  );
}
