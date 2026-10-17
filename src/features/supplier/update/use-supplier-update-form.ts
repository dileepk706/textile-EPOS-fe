import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate } from 'react-router-dom';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { Supplier } from 'entities/supplier';
import { updateSupplierFormSchema, UpdateSupplierFormDto } from './supplier.update.contracts';
import { useUpdateSupplierMutation } from './supplier.update.mutation';

export function useSupplierUpdateForm(currentSupplier: Supplier) {
  const navigate = useNavigate();
  const supplierId = currentSupplier.id || (currentSupplier as any)._id;

  const defaultValues: UpdateSupplierFormDto = {
    name: currentSupplier.name || '',
    contact_person: currentSupplier.contact_person || '',
    phone: currentSupplier.phone || '',
    email: currentSupplier.email || '',
    address: currentSupplier.address || '',
    gstin: currentSupplier.gstin || '',
    is_active: currentSupplier.is_active ?? true,
  };

  const form = useForm<UpdateSupplierFormDto>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(updateSupplierFormSchema),
    defaultValues,
    values: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [currentSupplier, form.reset]);

  const mutation = useUpdateSupplierMutation(supplierId, {
    onSuccess() {
      navigate(pathKeys.supplier.root);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (data: UpdateSupplierFormDto) => {
    const payload: Partial<UpdateSupplierFormDto> = {
      name: data.name.trim(),
      is_active: data.is_active ?? true,
    };

    if (data.contact_person !== undefined) {
      payload.contact_person = data.contact_person.trim();
    }
    if (data.phone !== undefined) {
      payload.phone = data.phone.trim();
    }
    if (data.email !== undefined) {
      payload.email = data.email.trim();
    }
    if (data.address !== undefined) {
      payload.address = data.address.trim();
    }
    if (data.gstin !== undefined) {
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
