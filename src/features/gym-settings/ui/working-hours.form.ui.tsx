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

const WorkingHoursSchema = Yup.object().shape({
  opening_time: Yup.string().required('Opening time is required'),
  closing_time: Yup.string().required('Closing time is required'),
  maximum_capacity: Yup.number()
    .typeError('Maximum capacity must be a number')
    .min(1, 'Must be at least 1')
    .required('Maximum capacity is required'),
});

export function WorkingHoursForm() {
  const { textile: currentGym } = useTextilesStore();
  const selectedGymId = useGymStore((state) => state.selectedGymId);
  const { mutateAsync, isPending } = useGymUpdate(selectedGymId || '');
  const { enqueueSnackbar } = useSnackbar();

  console.log(currentGym);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(WorkingHoursSchema),
    defaultValues: {
      opening_time: '06:00',
      closing_time: '22:00',
      maximum_capacity: 100,
    },
  });

  useEffect(() => {
    if (currentGym) {
      reset({
        opening_time: (currentGym as any).opening_time || '06:00',
        closing_time: (currentGym as any).closing_time || '22:00',
        maximum_capacity: (currentGym as any).maximum_capacity || 100,
      });
    }
  }, [currentGym, reset]);

  const onSubmit = async (data: any) => {
    if (!selectedGymId) return;
    try {
      await mutateAsync(data);
      enqueueSnackbar('Working hours updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update working hours', { variant: 'error' });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Opening Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.opening_time}
                errorMessage={errors.opening_time?.message}
                {...register('opening_time')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Closing Time"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={!!errors.closing_time}
                errorMessage={errors.closing_time?.message}
                {...register('closing_time')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Maximum Capacity"
                type="number"
                fullWidth
                error={!!errors.maximum_capacity}
                errorMessage={errors.maximum_capacity?.message}
                {...register('maximum_capacity')}
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
