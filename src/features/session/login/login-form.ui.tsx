import { Alert, Box, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import { pathKeys } from 'shared/routes';
import { Button } from 'shared/ui/button';
import { TextField } from 'shared/ui/text-field';
import { IconsElement, icons } from 'shared/ui/iconify/icons';
import Iconify from 'shared/ui/iconify';
import CustomLink from 'shared/ui/link/CustomeLink';
import { LogoText } from 'shared/ui/logo';
import { useLoginForm } from './use-login-form';
import { FactoryButton } from 'shared/ui';

export default function LoginForm() {
  const {
    form: {
      register,
      formState: { errors },
    },
    showPassword,
    setShowPassword,
    loading,
    mutationErrors,
    isError,
    onSubmit,
  } = useLoginForm();

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}
    >
      <Stack spacing={3} sx={{ mb: 4, textAlign: 'center' }}>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight="700">
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to your Textile EPOS
          </Typography>
        </Stack>
      </Stack>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }} data-test="login-error">
          {mutationErrors.map((err: string) => (
            <div key={err}>{err}</div>
          ))}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <TextField
          label={' Email or Mobile Number'}
          fullWidth
          placeholder="Email or mobile number"
          error={!!errors.email}
          errorMessage={errors.email?.message}
          data-test="login-email"
          disabled={loading}
          startIcon={IconsElement.email}
          {...register('email')}
        />

        <TextField
          label={'Password'}
          fullWidth
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={!!errors.password}
          errorMessage={errors.password?.message}
          data-test="login-password"
          disabled={loading}
          startIcon={IconsElement.password}
          endIcon={
            <Iconify
              icon={showPassword ? icons.eyeOff : icons.eye}
              onClick={() => setShowPassword(!showPassword)}
              sx={{ cursor: 'pointer' }}
            />
          }
          {...register('password')}
        />

        <FactoryButton
          fullWidth
          type="submit"
          size="small"
          disabled={loading}
          data-test="login-submit"
          factoryVariant="primary"
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
        </FactoryButton>
      </Stack>
    </Box>
  );
}
