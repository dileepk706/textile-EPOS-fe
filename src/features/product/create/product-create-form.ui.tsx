import { useProductCreateForm } from './use-product-create-form';
import { SharedProductForm } from '../form/shared-product-form.ui';

// ----------------------------------------------------------------------

export default function ProductCreateForm() {
  const { form, loading, mutationErrors, isError, onSubmit } = useProductCreateForm();

  return (
    <SharedProductForm
      form={form}
      loading={loading}
      mutationErrors={mutationErrors}
      isError={isError}
      onSubmit={onSubmit}
      title="Create New Product"
      submitText="Create Product"
    />
  );
}
