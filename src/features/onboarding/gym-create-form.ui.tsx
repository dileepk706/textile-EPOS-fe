import { useFormContext, useWatch } from 'react-hook-form';
import { Box, Stack, Typography, Button, Alert } from '@mui/material';
import { TextFieldLabel } from 'shared/ui/text-field';
import { LoadingButton } from 'shared/ui/button';
import { IconsElement } from 'shared/ui/iconify/icons';
import Iconify from 'shared/ui/iconify';
import { HOST_URL } from 'config-global';
import { TOnboarding } from './onboarding.types';

export default function GymCreateForm({
  isError,
  mutationErrors,
  loading,
}: {
  isError: boolean;
  mutationErrors: string[];
  loading: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TOnboarding>();

  const gymUrl = useWatch({ name: 'gym_url' });

  return (
    <Box>
      <Stack spacing={3} sx={{ mb: 4, textAlign: 'center' }}>
        <Stack spacing={1}>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>
            Step 1 of 3
          </Typography>
          <Typography variant="h4" fontWeight="700">
            Tell us about your gym
          </Typography>

          <Typography variant="body2" color="text.secondary">
            This information helps us set up your dashboard
          </Typography>
        </Stack>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {mutationErrors.map((err: string) => (
            <div key={err}>{err}</div>
          ))}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <Box>
          <TextFieldLabel
            fullWidth
            label="Gym Name"
            placeholder="FitZone Gym"
            startIcon={IconsElement.building}
            error={!!errors.name}
            errorMessage={errors.name?.message}
            {...register('name')}
          />
        </Box>

        <Box>
          <TextFieldLabel
            fullWidth
            label="Gym URL"
            placeholder="your-gym"
            error={!!errors.gym_url}
            errorMessage={errors.gym_url?.message}
            {...register('gym_url')}
          />
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
            Your gym URL:{' '}
            <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {HOST_URL}
              {gymUrl || 'your-gym'}
            </Box>
          </Typography>
        </Box>

        <Box>
          <TextFieldLabel
            fullWidth
            label="City"
            placeholder="Select your city"
            startIcon={IconsElement.city}
            error={!!errors.city}
            errorMessage={errors.city?.message}
            {...register('city')}
          />
        </Box>

        <Box>
          <TextFieldLabel
            fullWidth
            label="Address (Optional)"
            placeholder="Enter your gym's full address"
            error={!!errors.address}
            errorMessage={errors.address?.message}
            multiline
            rows={4}
            {...register('address')}
          />
        </Box>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Button
            size="large"
            color="inherit"
            startIcon={<Iconify icon="solar:arrow-left-outline" />}
            sx={{ fontWeight: 700, textTransform: 'none' }}
          >
            Back
          </Button>

          <LoadingButton
            fullWidth
            type="submit"
            size="large"
            appearance="primary"
            endIcon={IconsElement.arrowRight}
            loading={loading}
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 1.5,
              py: 1.5,
            }}
          >
            Continue
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
}
