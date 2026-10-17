import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createRole } from 'shared/api/api.services';
import { CreateRoleDto } from 'shared/api/api.types';


export function useCreateRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleDto) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      
    },
    onError: () => {
      
    },
  });
}