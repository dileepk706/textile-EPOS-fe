import { useSupplierCreateForm } from './use-supplier-create-form';
import { SharedSupplierForm } from '../form/shared-supplier-form.ui';

// ----------------------------------------------------------------------

export function SupplierCreateForm() {
  const { form, loading, mutationErrors, isError, onSubmit } = useSupplierCreateForm();

  return (
    <SharedSupplierForm
      form={form}
      loading={loading}
      mutationErrors={mutationErrors}
      isError={isError}
      onSubmit={onSubmit}
      title="Create New Supplier"
      submitText="Create Supplier"
    />
  );
}

export default SupplierCreateForm;
