import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateRole } from 'shared/api/api.services';
import { CreateRoleDto } from 'shared/api/api.types';


export function useUpdateRoleMutation(roleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDto) => updateRole(roleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', roleId] });
      
    },
    onError: () => {
      
    },
  });
}