import { Box, Stack, Grid, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField } from 'shared/ui/text-field';
import { FactoryButton } from 'shared/ui/factory-button';
import { Paper } from 'shared/ui/paper';
import { useGymStore, useTextilesStore } from 'entities/textile/textile.store';
import { useGymUpdate } from '../api/use-gym-update';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

const GeneralInfoSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  city: Yup.string().required('City is required'),
  state: Yup.string().required('State is required'),
  address: Yup.string().required('Address is required'),
  email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
});

export function GeneralInformationForm() {
  const { textile: currentGym } = useTextilesStore();
  const selectedGymId = useGymStore((state) => state.selectedGymId);
  const { mutateAsync, isPending } = useGymUpdate(selectedGymId || '');
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(GeneralInfoSchema),
    defaultValues: {
      name: '',
      city: '',
      state: '',
      address: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (currentGym) {
      reset({
        name: currentGym.name || '',
        city: currentGym.city || '',
        state: currentGym.state || '',
        address: currentGym.address || '',
        email: currentGym.email || '',
        phone: (currentGym as any).phone || '',
      });
    }
  }, [currentGym, reset]);

  const onSubmit = async (data: any) => {
    if (!selectedGymId) return;
    try {
      await mutateAsync(data);
      enqueueSnackbar('General information updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update general information', { variant: 'error' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Gym Name"
                fullWidth
                error={!!errors.name}
                errorMessage={errors.name?.message}
                {...register('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                error={!!errors.address}
                errorMessage={errors.address?.message}
                {...register('address')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="City"
                fullWidth
                error={!!errors.city}
                errorMessage={errors.city?.message}
                {...register('city')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="State"
                fullWidth
                error={!!errors.state}
                errorMessage={errors.state?.message}
                {...register('state')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                error={!!errors.email}
                errorMessage={errors.email?.message}
                {...register('email')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Phone"
                fullWidth
                error={!!errors.phone}
                errorMessage={errors.phone?.message}
                {...register('phone')}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
            <FactoryButton type="submit" size="large" disabled={isPending} factoryVariant="primary">
              {isPending ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
            </FactoryButton>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
