import { Supplier } from 'entities/supplier';
import { useSupplierUpdateForm } from './use-supplier-update-form';
import { SharedSupplierForm } from '../form/shared-supplier-form.ui';

// ----------------------------------------------------------------------

interface SupplierUpdateFormProps {
  currentSupplier: Supplier;
}

export function SupplierUpdateForm({ currentSupplier }: SupplierUpdateFormProps) {
  const { form, loading, mutationErrors, isError, onSubmit } = useSupplierUpdateForm(currentSupplier);

  return (
    <SharedSupplierForm
      form={form}
      loading={loading}
      mutationErrors={mutationErrors}
      isError={isError}
      onSubmit={onSubmit}
      title="Update Supplier"
      submitText="Update Supplier"
      currentSupplier={currentSupplier}
    />
  );
}

export default SupplierUpdateForm;
