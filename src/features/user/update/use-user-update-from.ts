import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useSessionStore } from 'entities/session';
import { getErrorMessages } from 'shared/api/api.lib';
import { AccountSettingsInput, AccountSettingsSchema } from './user.update.contracts';
import { useUpdateSelfUserProfileMutation } from './user.update.mutation';

export function useAccountSettings() {
  const user = useSessionStore((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<AccountSettingsInput>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(AccountSettingsSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { reset, setValue } = form;

  // Sync form defaults when user data loads or changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  const mutation = useUpdateSelfUserProfileMutation({
    onSuccess() {
      setSuccessMessage('Profile updated successfully!');
      setValue('currentPassword', '');
      setValue('password', '');
      setValue('confirmPassword', '');
      // Auto-clear success message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    },
    onError() {
      setSuccessMessage(null);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (data: AccountSettingsInput) => {
    setSuccessMessage(null);

    // Clean up empty fields so we don't send empty strings to the API
    const payload: Record<string, any> = {
      id: user?.id || null,
    };

    if (data.name && data.name.trim() !== '') {
      payload.name = data.name.trim();
    }
    if (data.email && data.email.trim() !== '') {
      payload.email = data.email.trim();
    }
    if (data.password && data.password.trim() !== '') {
      payload.password = data.password;
    }
    if (data.currentPassword && data.currentPassword.trim() !== '') {
      payload.currentPassword = data.currentPassword;
    }

    mutation.mutate(payload as any);
  };

  return {
    form,
    showPassword,
    setShowPassword,
    loading,
    successMessage,
    setSuccessMessage,
    mutationErrors: getErrorMessages(mutation.error),
    isError: mutation.isError,
    onSubmit: form.handleSubmit(onValid),
  };
}
