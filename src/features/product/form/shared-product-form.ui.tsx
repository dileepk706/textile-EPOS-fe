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
import { Product } from 'entities/product';

// ----------------------------------------------------------------------

interface SharedProductFormProps {
  form: UseFormReturn<any>;
  loading: boolean;
  mutationErrors: string[];
  isError: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  title: string;
  submitText: string;
  currentProduct?: Product;
}

export function SharedProductForm({
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
  currentProduct,
}: SharedProductFormProps) {
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
            {currentProduct
              ? `Editing product: ${currentProduct.name}`
              : 'Add a new product to your inventory catalog'}
          </Typography>
        </Stack>

        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <TextField
              label="Product Name *"
              fullWidth
              placeholder="e.g. Kanchipuram Pure Silk Saree"
              errorMessage={errors.name?.message as string}
              disabled={loading}
              {...register('name')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Barcode"
              fullWidth
              placeholder="e.g. 8901234567890 (auto-generated if empty)"
              errorMessage={errors.barcode?.message as string}
              disabled={loading}
              {...register('barcode')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="SKU"
              fullWidth
              placeholder="e.g. SKU-SILK-001"
              errorMessage={errors.sku?.message as string}
              disabled={loading}
              {...register('sku')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Brand"
              fullWidth
              placeholder="e.g. Classic Weaves"
              errorMessage={errors.brand?.message as string}
              disabled={loading}
              {...register('brand')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Unit"
              fullWidth
              placeholder="e.g. pcs, meter, kg"
              errorMessage={errors.unit?.message as string}
              disabled={loading}
              {...register('unit')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Selling Price (₹)"
              type="number"
              fullWidth
              placeholder="0.00"
              errorMessage={errors.price?.message as string}
              disabled={loading}
              {...register('price')}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Cost Price (₹)"
              type="number"
              fullWidth
              placeholder="0.00"
              errorMessage={errors.cost_price?.message as string}
              disabled={loading}
              {...register('cost_price')}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              multiline
              rows={3}
              fullWidth
              placeholder="Enter product description or specifications..."
              errorMessage={errors.description?.message as string}
              disabled={loading}
              {...register('description')}
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
                  label="Product is active for sales"
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

export default SharedProductForm;
