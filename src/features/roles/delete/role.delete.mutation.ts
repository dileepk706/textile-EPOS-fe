import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteRoleById } from 'shared/api/api.services';


export function useDeleteRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoleById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      
    },
    onError: () => {
      
    },
  });
}