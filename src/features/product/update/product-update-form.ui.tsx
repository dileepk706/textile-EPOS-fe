import { Product } from 'entities/product';
import { useProductUpdateForm } from './use-product-update-form';
import { SharedProductForm } from '../form/shared-product-form.ui';

// ----------------------------------------------------------------------

interface ProductUpdateFormProps {
  currentProduct: Product;
}

export default function ProductUpdateForm({ currentProduct }: ProductUpdateFormProps) {
  const { form, loading, mutationErrors, isError, onSubmit } = useProductUpdateForm(currentProduct);

  return (
    <SharedProductForm
      form={form}
      loading={loading}
      mutationErrors={mutationErrors}
      isError={isError}
      onSubmit={onSubmit}
      title="Update Product"
      submitText="Update Product"
      currentProduct={currentProduct}
    />
  );
}
