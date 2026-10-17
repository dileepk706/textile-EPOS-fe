import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorResponse } from '@utils/axios';
import { deleteProduct } from 'shared/api/api.services';

export const useDeleteProductMutation = (options?: {
  onSuccess?: () => void;
  onError?: (e: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (e) => {
      options?.onError && options?.onError(getErrorResponse(e));
    },
  });
};
