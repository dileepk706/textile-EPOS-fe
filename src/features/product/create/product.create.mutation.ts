import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorResponse } from '@utils/axios';
import { createProduct } from 'shared/api/api.services';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';

export const useCreateProductMutation = (options?: {
  onSuccess?: (data?: any) => void;
  onError?: (e: any) => void;
}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = appSnackbar();

  return useMutation({
    mutationFn: (data: any) => createProduct(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      if (options?.onSuccess) {
        options.onSuccess(res);
      }
    },
    onError: (e) => {
      const err = getErrorResponse(e);
      enqueueSnackbar(err || 'Failed to create product', { variant: 'error' });
      options?.onError && options?.onError(err);
    },
  });
};
