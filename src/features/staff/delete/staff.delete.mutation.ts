import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorResponse } from '@utils/axios';
import { userDelete } from 'shared/api/api.services';

export const useDeleteStaffMutation = (options?: {
  onSuccess?: () => void;
  onError?: (e: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (e) => {
      options?.onError && options?.onError(getErrorResponse(e));
    },
  });
};
