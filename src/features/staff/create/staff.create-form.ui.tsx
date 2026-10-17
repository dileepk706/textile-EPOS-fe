import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import { TextField } from 'shared/ui/text-field';
import { FactoryButton } from 'shared/ui';
import { Paper } from 'shared/ui/paper';
import { useStaffCreateForm } from './use-staff-create-form';
import { SharedStaffForm } from '../form/shared-staff-form.ui';

// ----------------------------------------------------------------------

export default function StaffCreateForm() {
  const {
    form,
    loading,
    mutationErrors,
    isError,
    onSubmit,
  } = useStaffCreateForm();

  return (
    <SharedStaffForm
      form={form}
      loading={loading}
      mutationErrors={mutationErrors}
      isError={isError}
      onSubmit={onSubmit}
      title="Create new staff"
      submitText="Create Staff"
    />
  );
}
