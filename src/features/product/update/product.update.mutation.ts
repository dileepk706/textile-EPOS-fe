import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorResponse } from '@utils/axios';
import { updateProduct } from 'shared/api/api.services';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';

export const useUpdateProductMutation = (
  id: string,
  options?: {
    onSuccess?: (data?: any) => void;
    onError?: (e: any) => void;
  }
) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = appSnackbar();

  return useMutation({
    mutationFn: (data: any) => updateProduct(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'detail', id] });
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      if (options?.onSuccess) {
        options.onSuccess(res);
      }
    },
    onError: (e) => {
      const err = getErrorResponse(e);
      enqueueSnackbar(err || 'Failed to update product', { variant: 'error' });
      options?.onError && options?.onError(err);
    },
  });
};
