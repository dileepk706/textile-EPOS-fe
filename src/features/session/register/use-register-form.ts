import { useState } from 'react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { useRouter } from '@routes/hook';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { RegisterUserSchema, TRegisterUser } from './register.contracts';
import { useRegisterMutation } from './register.mutation';

export function useRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<TRegisterUser>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(RegisterUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreedToTerms: false,
    },
  });

  const mutation = useRegisterMutation({
    onSuccess() {
      router.replace(pathKeys.root);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (registerData: TRegisterUser) => {
    mutation.mutate(registerData);
  };

  return {
    form,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    mutationErrors: getErrorMessages(mutation.error),
    isError: mutation.isError,
    onSubmit: form.handleSubmit(onValid),
  };
}
