import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateRoleDtoSchema } from 'shared/api/api.contracts';
import { CreateRoleDto } from 'shared/api/api.types';

export function useRoleCreateForm() {
  return useForm<CreateRoleDto>({
    resolver: zodResolver(CreateRoleDtoSchema),
    defaultValues: {
      name: '',
    },
  });
}