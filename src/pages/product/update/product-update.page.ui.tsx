import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useQuery } from '@tanstack/react-query';
import { getProductByIdQueryOptions } from 'entities/product';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { pathKeys } from 'shared/routes';
import { ApiErrorView } from 'shared/ui/api-error-views';
import { ProductUpdateForm } from 'features/product/update';

// ----------------------------------------------------------------------

export default function ProductUpdatePage() {
  const params = useParams();
  const productId = params.id as string;
  const { data: product, isLoading, isError, error, refetch } = useQuery(
    getProductByIdQueryOptions(productId)
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 360 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <ApiErrorView
        error={error}
        title={!product && !isError ? 'Product Not Found' : undefined}
        description={
          !product && !isError
            ? 'The requested product could not be found or may have been deleted.'
            : undefined
        }
        backHref={pathKeys.product.root}
        backLabel="Back to Products"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Update Product : {product.name}</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Update Product"
        links={[
          {
            href: pathKeys.product.root,
            name: 'Products',
          },
          {
            href: '',
            name: `Update Product: ${product.name}`,
          },
        ]}
      />

      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <ProductUpdateForm key={product.id || (product as any)._id} currentProduct={product} />
      </Box>
    </>
  );
}
