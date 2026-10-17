import { Helmet } from 'react-helmet-async';
import Box from '@mui/material/Box';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { pathKeys } from 'shared/routes';
import { SupplierCreateForm } from 'features/supplier/create';

// ----------------------------------------------------------------------

export default function SupplierCreatePage() {
  return (
    <>
      <Helmet>
        <title>Create Supplier</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Create Supplier"
        links={[
          {
            href: pathKeys.supplier.root,
            name: 'Suppliers',
          },
          {
            href: '',
            name: 'Create Supplier',
          },
        ]}
      />

      <Box sx={{ maxWidth: 720, mx: 'auto' }}>
        <SupplierCreateForm />
      </Box>
    </>
  );
}
