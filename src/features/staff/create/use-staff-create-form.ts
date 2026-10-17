import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate } from 'react-router-dom';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { createUserSchema, CreateUserDto } from './staff.create.contracts';
import { useCreateStaffMutation } from './staff.create.mutation';

export function useStaffCreateForm() {
  const navigate = useNavigate();

  const form = useForm<CreateUserDto>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '' as any,
    },
  });

  const mutation = useCreateStaffMutation({
    onSuccess() {
      navigate(pathKeys.staff.root);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (data: CreateUserDto) => {
    // Strip optional empty string fields before submitting
    const payload: Partial<CreateUserDto> = {
      name: data.name,
      email: data.email,
      role: data.role,
    };

    if (data.phone && data.phone.trim() !== '') {
      payload.phone = data.phone.trim();
    }
    if (data.password && data.password.trim() !== '') {
      payload.password = data.password;
    }

    mutation.mutate(payload as CreateUserDto);
  };

  return {
    form,
    loading,
    mutationErrors: getErrorMessages(mutation.error),
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    onSubmit: form.handleSubmit(onValid),
  };
}
