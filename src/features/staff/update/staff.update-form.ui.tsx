import { User } from 'entities/session';
import { SharedStaffForm } from '../form/shared-staff-form.ui';
import { useStaffUpdateForm } from './use-staff-update-form';

export interface StaffUpdateFormProps {
  currentStaff: User;
}

export default function StaffUpdateForm({ currentStaff }: StaffUpdateFormProps) {
  const { form, loading, mutationErrors, isError, onSubmit } = useStaffUpdateForm(currentStaff);

  return (
    <SharedStaffForm
      form={form}
      loading={loading}
      mutationErrors={mutationErrors}
      isError={isError}
      onSubmit={onSubmit}
      title="Update staff"
      submitText="Update Staff"
      currentStaff={currentStaff}
    />
  );
}
