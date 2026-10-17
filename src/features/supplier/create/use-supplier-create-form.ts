import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate } from 'react-router-dom';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { createSupplierFormSchema, CreateSupplierFormDto } from './supplier.create.contracts';
import { useCreateSupplierMutation } from './supplier.create.mutation';

export function useSupplierCreateForm() {
  const navigate = useNavigate();

  const form = useForm<CreateSupplierFormDto>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(createSupplierFormSchema),
    defaultValues: {
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      gstin: '',
      is_active: true,
    },
  });

  const mutation = useCreateSupplierMutation({
    onSuccess() {
      navigate(pathKeys.supplier.root);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (data: CreateSupplierFormDto) => {
    const payload: Partial<CreateSupplierFormDto> = {
      name: data.name.trim(),
      is_active: data.is_active ?? true,
    };

    if (data.contact_person && data.contact_person.trim()) {
      payload.contact_person = data.contact_person.trim();
    }
    if (data.phone && data.phone.trim()) {
      payload.phone = data.phone.trim();
    }
    if (data.email && data.email.trim()) {
      payload.email = data.email.trim();
    }
    if (data.address && data.address.trim()) {
      payload.address = data.address.trim();
    }
    if (data.gstin && data.gstin.trim()) {
      payload.gstin = data.gstin.trim();
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
