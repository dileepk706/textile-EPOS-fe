import { Box } from '@mui/material';
import { FormProvider } from 'react-hook-form';
import GymCreateForm from './gym-create-form.ui';
import { useOnboardingForm } from './use-onboarding-form';

export default function OnboardingForm() {
  const { methods, onSubmit, isError, mutationErrors, loading } = useOnboardingForm();

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={onSubmit} noValidate sx={{ width: '100%', mx: 'auto' }}>
        <GymCreateForm isError={isError} mutationErrors={mutationErrors} loading={loading} />
      </Box>
    </FormProvider>
  );
}
