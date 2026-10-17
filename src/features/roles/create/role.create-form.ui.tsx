import { useFormContext } from 'react-hook-form';
import { CreateRoleDto } from 'shared/api/api.types';
import { useCreateRoleMutation } from './role.create.mutation';
import { useRoleCreateForm } from './use-role-create-form';
import { SharedRoleForm } from '../form/shared-role-form.ui';

export function RoleCreateForm() {
  const form = useRoleCreateForm();
  const mutation = useCreateRoleMutation();

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <SharedRoleForm
      form={form}
      onSubmit={onSubmit}
      isPending={mutation.isPending}
      submitLabel="Create Role"
    />
  );
}