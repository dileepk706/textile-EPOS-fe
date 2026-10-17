import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';
import { TextField } from 'shared/ui/text-field';
import { FactoryButton } from 'shared/ui';
import { Paper } from 'shared/ui/paper';
import { CreateMembershipPlanFormValues } from '../create/membership-plan.create.contracts';

interface SharedMembershipPlanFormProps {
  form: UseFormReturn<CreateMembershipPlanFormValues>;
  loading: boolean;
  mutationErrors: string[];
  isError: boolean;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  title: string;
  submitText: string;
}

export function SharedMembershipPlanForm({
  form: {
    register,
    control,
    watch,
    formState: { errors },
  },
  loading,
  mutationErrors,
  isError,
  onSubmit,
  title,
  submitText,
}: SharedMembershipPlanFormProps) {
  const membershipType = watch('membership_type');

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

        <Stack spacing={3} sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="700">
            {title}
          </Typography>
        </Stack>

        <Stack spacing={2.5}>
          <TextField
            label="Plan Name"
            fullWidth
            placeholder="e.g. Gold Monthly Membership"
            error={!!errors.name}
            errorMessage={errors.name?.message}
            disabled={loading}
            {...register('name')}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            placeholder="Describe the plan benefits and terms (optional)"
            error={!!errors.description}
            errorMessage={errors.description?.message}
            disabled={loading}
            {...register('description')}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              name="membership_type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.membership_type}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Membership Type
                  </Typography>
                  <Select {...field} disabled={loading}>
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="family">Family</MenuItem>
                  </Select>
                  {errors.membership_type && (
                    <FormHelperText>{errors.membership_type.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="billing_type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.billing_type}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Billing Type
                  </Typography>
                  <Select {...field} disabled={loading}>
                    <MenuItem value="recurring">Recurring</MenuItem>
                    <MenuItem value="one_time">One-time</MenuItem>
                  </Select>
                  {errors.billing_type && (
                    <FormHelperText>{errors.billing_type.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Stack>

          {membershipType === 'family' && (
            <TextField
              label="Max Members"
              type="number"
              fullWidth
              placeholder="e.g. 4"
              error={!!errors.max_members}
              errorMessage={errors.max_members?.message}
              disabled={loading}
              {...register('max_members', { valueAsNumber: true })}
            />
          )}

          <TextField
            label="Price"
            type="number"
            fullWidth
            placeholder="0.00"
            inputProps={{ min: 0, step: 'any' }}
            error={!!errors.price}
            errorMessage={errors.price?.message}
            disabled={loading}
            {...register('price', { valueAsNumber: true })}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Controller
              name="billing_interval"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth size="small" error={!!errors.billing_interval}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Billing Interval
                  </Typography>
                  <Select {...field} disabled={loading}>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                  </Select>
                  {errors.billing_interval && (
                    <FormHelperText>{errors.billing_interval.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <TextField
              label="Billing Interval Count"
              type="number"
              fullWidth
              placeholder="e.g. 1"
              inputProps={{ min: 1, step: 1 }}
              error={!!errors.billing_interval_count}
              errorMessage={errors.billing_interval_count?.message}
              disabled={loading}
              {...register('billing_interval_count', { valueAsNumber: true })}
            />
          </Stack>

          <TextField
            label="Duration (Days)"
            type="number"
            fullWidth
            placeholder="e.g. 30"
            inputProps={{ min: 1, step: 1 }}
            error={!!errors.duration_days}
            errorMessage={errors.duration_days?.message}
            disabled={loading}
            {...register('duration_days', { valueAsNumber: true })}
          />
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <FactoryButton type="submit" size="medium" factoryVariant="primary" disabled={loading}>
            {loading ? <CircularProgress size={18} color="inherit" /> : submitText}
          </FactoryButton>
        </Box>
      </Box>
    </Paper>
  );
}
