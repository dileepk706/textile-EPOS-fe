import { Helmet } from 'react-helmet-async';
import { Box } from '@mui/material';
import { StaffCreateForm } from 'features/staff/create';
import { useLoaderData } from 'react-router';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { pathKeys } from 'shared/routes';
// ----------------------------------------------------------------------

export default function StaffCreatePage() {
  return (
    <>
      <Helmet>
        <title>Create Staff</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Create Staff"
        links={[
          {
            href: pathKeys.staff.root,
            name: 'Staff',
          },
          {
            href: '',
            name: 'Create Staff',
          },
        ]}
      />
      <Box sx={{ maxWidth: 560, mx: 'auto' }}>
        <StaffCreateForm />
      </Box>
    </>
  );
}
