import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate } from 'react-router-dom';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { useUpdateStaffMutation } from './staff.update.mutation';
import { User } from 'entities/session';
import { CreateUserDto, createUserSchema } from '../create/staff.create.contracts';

export function useStaffUpdateForm(currentStaff: User) {
  const navigate = useNavigate();

  const form = useForm<CreateUserDto>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(createUserSchema),
    defaultValues: {
      name: currentStaff.name || '',
      email: currentStaff.email || '',
      phone: currentStaff.phone || '',
      role: (currentStaff.role as any) || '',
      password: '', // do not prepopulate password
    },
    values: {
      name: currentStaff.name || '',
      email: currentStaff.email || '',
      phone: currentStaff.phone || '',
      role: (currentStaff.role as any) || '',
      password: '',
    },
  });

  useEffect(() => {
    form.reset({
      name: currentStaff.name || '',
      email: currentStaff.email || '',
      phone: currentStaff.phone || '',
      role: (currentStaff.role as any) || '',
      password: '',
    });
  }, [currentStaff, form.reset]);

  const mutation = useUpdateStaffMutation(currentStaff.id, {
    onSuccess() {
      navigate(pathKeys.staff.root);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (data: CreateUserDto) => {
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

    mutation.mutate(payload);
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
