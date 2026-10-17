import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate } from 'react-router-dom';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { createProductFormSchema, CreateProductFormDto } from './product.create.contracts';
import { useCreateProductMutation } from './product.create.mutation';

export function useProductCreateForm() {
  const navigate = useNavigate();

  const form = useForm<CreateProductFormDto>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(createProductFormSchema),
    defaultValues: {
      name: '',
      barcode: '',
      sku: '',
      brand: '',
      unit: 'pcs',
      price: undefined,
      cost_price: undefined,
      description: '',
      is_active: true,
    },
  });

  const mutation = useCreateProductMutation({
    onSuccess() {
      navigate(pathKeys.product.root);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (data: CreateProductFormDto) => {
    const payload: Partial<CreateProductFormDto> = {
      name: data.name.trim(),
      unit: data.unit || 'pcs',
      is_active: data.is_active ?? true,
    };

    if (data.barcode && data.barcode.trim()) {
      payload.barcode = data.barcode.trim();
    }
    if (data.sku && data.sku.trim()) {
      payload.sku = data.sku.trim();
    }
    if (data.brand && data.brand.trim()) {
      payload.brand = data.brand.trim();
    }
    if (data.description && data.description.trim()) {
      payload.description = data.description.trim();
    }
    if (data.price !== undefined && !Number.isNaN(data.price)) {
      payload.price = Number(data.price);
    }
    if (data.cost_price !== undefined && !Number.isNaN(data.cost_price)) {
      payload.cost_price = Number(data.cost_price);
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
