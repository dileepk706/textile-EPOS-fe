import { useParams } from 'react-router-dom';
import StaffUpdateForm from 'features/staff/update/staff.update-form.ui';
import { Helmet } from 'react-helmet-async';
import { Box, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getUserByIdQueryOptions } from 'entities/user';
import CustomBreadcrumbs from 'shared/ui/custom-breadcrumbs';
import { pathKeys } from 'shared/routes';
import { ApiErrorView } from 'shared/ui/api-error-views';

export default function StaffUpdatePage() {
  const params = useParams();
  const userId = params.id as string;
  const { data: user, isLoading, isError, error, refetch } = useQuery(getUserByIdQueryOptions(userId));

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !user) {
    return (
      <ApiErrorView
        error={error}
        title={!user && !isError ? 'Staff Member Not Found' : undefined}
        description={!user && !isError ? 'We could not find the staff member you are looking for.' : undefined}
        backHref={pathKeys.staff.root}
        backLabel="Back to Staff List"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Update staff : {user.name}</title>
      </Helmet>

      <CustomBreadcrumbs
        heading="Update Staff"
        links={[
          {
            href: pathKeys.staff.root,
            name: 'Staff',
          },
          {
            href: '',
            name: 'Update Staff: ' + user.name,
          },
        ]}
      />

      <Box sx={{ maxWidth: 560, mx: 'auto' }}>
        <StaffUpdateForm key={user.id} currentStaff={user} />
      </Box>
    </>
  );
}
