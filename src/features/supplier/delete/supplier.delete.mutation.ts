import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorResponse } from '@utils/axios';
import { deleteSupplier } from 'shared/api/api.services';

export const useDeleteSupplierMutation = (options?: {
  onSuccess?: () => void;
  onError?: (e: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (e) => {
      options?.onError && options?.onError(getErrorResponse(e));
    },
  });
};
