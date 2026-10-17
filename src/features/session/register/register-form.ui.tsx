import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { pathKeys } from 'shared/routes';
import { Button } from 'shared/ui/button';
import { TextField, TextFieldLabel } from 'shared/ui/text-field';
import { IconsElement, icons } from 'shared/ui/iconify/icons';
import Iconify from 'shared/ui/iconify';
import CustomLink from 'shared/ui/link/CustomeLink';
import { useRegisterForm } from './use-register-form';
import { FactoryButton } from 'shared/ui';
import { LogoText } from 'shared/ui/logo';

export default function RegisterForm() {
  const {
    form: {
      register,
      formState: { errors },
    },
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    mutationErrors,
    isError,
    onSubmit,
  } = useRegisterForm();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}
    >
      <Stack spacing={3} sx={{ mb: 4, textAlign: 'center' }}>
        <LogoText />
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight="700">
            Create your account
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start your free trial or subscribe today
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
            label="Full Name"
            placeholder="John Doe"
            error={!!errors.name}
            errorMessage={errors.name?.message}
            disabled={loading}
            startIcon={<Iconify icon={icons.user} />}
            {...register('name')}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Email
          </Typography>
          <TextField
            fullWidth
            placeholder="you@example.com"
            error={!!errors.email}
            errorMessage={errors.email?.message}
            disabled={loading}
            startIcon={<Iconify icon={icons.email} />}
            {...register('email')}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            error={!!errors.password}
            errorMessage={errors.password?.message}
            disabled={loading}
            startIcon={<Iconify icon="solar:lock-bold-duotone" />}
            endIcon={
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? icons.eyeOff : icons.eye} />
              </IconButton>
            }
            {...register('password')}
          />
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Confirm Password
          </Typography>
          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            error={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
            disabled={loading}
            startIcon={<Iconify icon="solar:lock-bold-duotone" />}
            endIcon={
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                <Iconify icon={showConfirmPassword ? icons.eyeOff : icons.eye} />
              </IconButton>
            }
            {...register('confirmPassword')}
          />
        </Box>

        <Box>
          <FormControlLabel
            control={<Checkbox {...register('agreedToTerms')} />}
            label={
              <Typography variant="body2">
                I agree to the <Link sx={{ cursor: 'pointer' }}>Terms of Service</Link> and{' '}
                <Link sx={{ cursor: 'pointer' }}>Privacy Policy</Link>
              </Typography>
            }
          />
          {errors.agreedToTerms && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
              {errors.agreedToTerms.message}
            </Typography>
          )}
        </Box>

        <FactoryButton
          fullWidth
          type="submit"
          size="small"
          disabled={loading}
          factoryVariant="primary"
          endIcon={IconsElement.arrowRight}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Create your account'}
        </FactoryButton>
      </Stack>

      <Stack spacing={2} sx={{ mt: 3, textAlign: 'center' }}>
        <Stack flexDirection="row" justifyContent="center" alignItems="center" spacing={1}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Already have an account?{' '}
          </Typography>
          <CustomLink
            href={pathKeys.login}
            sx={{
              fontWeight: 600,
            }}
          >
            Sign in
          </CustomLink>
        </Stack>

        <Stack direction="row" spacing={3} justifyContent="center" sx={{ pt: 4 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify icon="solar:lock-bold-duotone" sx={{ color: 'text.disabled' }} />
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="left"
              sx={{ maxWidth: 100 }}
            >
              Your data is secure and encrypted
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Iconify
              icon="solar:users-group-rounded-bold-duotone"
              sx={{ color: 'text.disabled' }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              textAlign="left"
              sx={{ maxWidth: 100 }}
            >
              Trusted by 100+ gyms across India
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
