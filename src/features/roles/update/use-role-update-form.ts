import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateRoleDtoSchema } from 'shared/api/api.contracts';
import { CreateRoleDto } from 'shared/api/api.types';
import { Role } from 'entities/roles/roles.contract';

export function useRoleUpdateForm(defaultValues?: Partial<Role>) {
  return useForm<CreateRoleDto>({
    resolver: zodResolver(CreateRoleDtoSchema),
    defaultValues: {
      name: defaultValues?.name || '',
    },
  });
}