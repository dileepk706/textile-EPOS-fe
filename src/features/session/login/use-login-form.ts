import { useState } from 'react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { useSearchParams, useRouter } from '@routes/hook';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { useLoginMutation } from './login.mutation';
import { LoginUser, LoginUserSchema } from './login.contracts';

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '';
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginUser>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(LoginUserSchema),
    defaultValues: { email: 'admin@textileshop.com', password: '123' },
  });

  const mutation = useLoginMutation({
    onSuccess() {
      router.replace(pathKeys.product.root);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (loginUser: LoginUser) => {
    mutation.mutate(loginUser);
  };

  return {
    form,
    showPassword,
    setShowPassword,
    loading,
    mutationErrors: getErrorMessages(mutation.error),
    isError: mutation.isError,
    onSubmit: form.handleSubmit(onValid),
  };
}
