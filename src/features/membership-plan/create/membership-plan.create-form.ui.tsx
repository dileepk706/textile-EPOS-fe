import { useMembershipPlanCreateForm } from './use-membership-plan-create-form';
import { SharedMembershipPlanForm } from '../form/shared-membership-plan-form.ui';

export default function MembershipPlanCreateForm() {
  const { form, loading, mutationErrors, isError, onSubmit } = useMembershipPlanCreateForm();

  return (
    <SharedMembershipPlanForm
      form={form}
      loading={loading}
      mutationErrors={mutationErrors}
      isError={isError}
      onSubmit={onSubmit}
      title="Create Membership Plan"
      submitText="Create Plan"
    />
  );
}
