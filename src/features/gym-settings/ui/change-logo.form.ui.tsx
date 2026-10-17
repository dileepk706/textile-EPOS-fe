import { Box, Stack, Typography, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FactoryButton } from 'shared/ui/factory-button';
import { Paper } from 'shared/ui/paper';
import { UploadAvatar } from 'shared/ui/upload';
import { useGymStore, useTextilesStore } from 'entities/textile/textile.store';
import { useGymUpdate } from '../api/use-gym-update';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';

const ChangeLogoSchema = Yup.object().shape({
  logo_url: Yup.mixed().required('Logo is required'),
});

export function ChangeLogoForm() {
  const { textile: currentGym } = useTextilesStore();
  const selectedGymId = useGymStore((state) => state.selectedGymId);
  const { mutateAsync, isPending } = useGymUpdate(selectedGymId || '');
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, setValue, reset } = useForm({
    resolver: yupResolver(ChangeLogoSchema),
    defaultValues: {
      logo_url: null as any,
    },
  });

  useEffect(() => {
    if (currentGym && (currentGym as any).logo_url) {
      reset({ logo_url: (currentGym as any).logo_url });
    }
  }, [currentGym, reset]);

  const onSubmit = async (data: any) => {
    if (!selectedGymId) return;
    try {
      const payload = { logo_url: data.logo_url?.preview || data.logo_url };
      await mutateAsync(payload);
      enqueueSnackbar('Logo updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update logo', { variant: 'error' });
    }
  };

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue(
        'logo_url',
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }) as any,
        { shouldValidate: true }
      );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ width: '100%' }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={4} alignItems="center">
          <Typography variant="subtitle1">Upload Gym Logo</Typography>

          <Controller
            name="logo_url"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <UploadAvatar
                file={field.value}
                onDrop={handleDrop}
                error={!!error}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: error ? 'error.main' : 'text.secondary',
                    }}
                  >
                    {error ? error.message : 'Allowed *.jpeg, *.jpg, *.png, *.gif'}
                  </Typography>
                }
              />
            )}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', pt: 2 }}>
            <FactoryButton type="submit" size="large" disabled={isPending} factoryVariant="primary">
              {isPending ? <CircularProgress size={24} color="inherit" /> : 'Save Logo'}
            </FactoryButton>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
