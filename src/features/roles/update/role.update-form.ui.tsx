import { CreateRoleDto } from 'shared/api/api.types';
import { useUpdateRoleMutation } from './role.update.mutation';
import { useRoleUpdateForm } from './use-role-update-form';
import { SharedRoleForm } from '../form/shared-role-form.ui';
import { Role } from 'entities/roles/roles.contract';

export function RoleUpdateForm({ role }: { role: Role }) {
  const form = useRoleUpdateForm(role);
  const mutation = useUpdateRoleMutation(role.id);

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <SharedRoleForm
      form={form}
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      submitLabel="Update Role"
    />
  );
}