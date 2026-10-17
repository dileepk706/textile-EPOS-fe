import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { pathKeys } from 'shared/routes';
import { ProductCreateForm } from 'features/product/create';

// ----------------------------------------------------------------------

export default function ProductCreatePage() {
  return (
    <>
      <Helmet>
        <title>Create Product</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Create Product"
        links={[
          {
            href: pathKeys.product.root,
            name: 'Products',
          },
          {
            href: '',
            name: 'Create Product',
          },
        ]}
      />

      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <ProductCreateForm />
      </Box>
    </>
  );
}
