import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate } from 'react-router-dom';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { Product } from 'entities/product';
import { updateProductFormSchema, UpdateProductFormDto } from './product.update.contracts';
import { useUpdateProductMutation } from './product.update.mutation';

export function useProductUpdateForm(currentProduct: Product) {
  const navigate = useNavigate();
  const productId = currentProduct.id || (currentProduct as any)._id;

  const defaultValues: UpdateProductFormDto = {
    name: currentProduct.name || '',
    barcode: currentProduct.barcode || '',
    sku: currentProduct.sku || '',
    brand: currentProduct.brand || '',
    unit: currentProduct.unit || 'pcs',
    price: currentProduct.price ?? currentProduct.selling_price ?? undefined,
    cost_price: currentProduct.cost_price ?? currentProduct.costPrice ?? undefined,
    description: currentProduct.description || '',
    is_active: currentProduct.is_active ?? true,
  };

  const form = useForm<UpdateProductFormDto>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(updateProductFormSchema) as any,
    defaultValues,
    values: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [currentProduct, form.reset]);

  const mutation = useUpdateProductMutation(productId, {
    onSuccess() {
      navigate(pathKeys.product.root);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (data: UpdateProductFormDto) => {
    const payload: Partial<UpdateProductFormDto> = {
      name: data.name.trim(),
      unit: data.unit || 'pcs',
      is_active: data.is_active ?? true,
    };

    if (data.barcode && data.barcode.trim()) {
      payload.barcode = data.barcode.trim();
    }
    if (data.sku !== undefined) {
      payload.sku = data.sku.trim();
    }
    if (data.brand !== undefined) {
      payload.brand = data.brand.trim();
    }
    if (data.description !== undefined) {
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
    onSubmit: form.handleSubmit(onValid as any),
  };
}
