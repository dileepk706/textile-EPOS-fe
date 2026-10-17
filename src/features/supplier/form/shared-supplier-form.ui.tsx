import React from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
  Grid,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { UseFormReturn, Controller } from 'react-hook-form';
import { TextField } from 'shared/ui/text-field';
import { FactoryButton } from 'shared/ui';
import { Paper } from 'shared/ui/paper';
import { Supplier } from 'entities/supplier';

// ----------------------------------------------------------------------

interface SharedSupplierFormProps {
  form: UseFormReturn<any>;
  loading: boolean;
  mutationErrors: string[];
  isError: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  title: string;
  submitText: string;
  currentSupplier?: Supplier;
}

export function SharedSupplierForm({
  form: {
    register,
    control,
    formState: { errors },
  },
  loading,
  mutationErrors,
  isError,
  onSubmit,
  title,
  submitText,
  currentSupplier,
}: SharedSupplierFormProps) {
  return (
    <Paper sx={{ p: { xs: 2.5, md: 3 } }}>
      <Box component="form" onSubmit={onSubmit} noValidate>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {mutationErrors.map((err: string) => (
              <div key={err}>{err}</div>
            ))}
          </Alert>
        )}

        <Stack spacing={1} sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight="700">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentSupplier
              ? `Editing supplier: ${currentSupplier.name}`
              : 'Add a new vendor or textile supplier to your catalog'}
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              label="Supplier / Company Name *"
              fullWidth
              placeholder="e.g. Surat Weaving Mills Pvt Ltd"
              errorMessage={errors.name?.message as string}
              disabled={loading}
              {...register('name')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact Person"
              fullWidth
              placeholder="e.g. Rajesh Patel"
              errorMessage={errors.contact_person?.message as string}
              disabled={loading}
              {...register('contact_person')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              placeholder="e.g. +91 9876543210"
              errorMessage={errors.phone?.message as string}
              disabled={loading}
              {...register('phone')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email Address"
              fullWidth
              placeholder="e.g. sales@suratweaving.com"
              errorMessage={errors.email?.message as string}
              disabled={loading}
              {...register('email')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="GSTIN"
              fullWidth
              placeholder="e.g. 24AAAAA0000A1Z5"
              errorMessage={errors.gstin?.message as string}
              disabled={loading}
              {...register('gstin')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Address"
              multiline
              rows={3}
              fullWidth
              placeholder="e.g. Ring Road Textile Market, Surat, Gujarat"
              errorMessage={errors.address?.message as string}
              disabled={loading}
              {...register('address')}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="is_active"
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value !== false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label="Supplier is active"
                />
              )}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1.5 }}>
          <FactoryButton type="submit" size="medium" factoryVariant="primary" disabled={loading}>
            {loading ? <CircularProgress size={18} color="inherit" /> : submitText}
          </FactoryButton>
        </Box>
      </Box>
    </Paper>
  );
}

export default SharedSupplierForm;
