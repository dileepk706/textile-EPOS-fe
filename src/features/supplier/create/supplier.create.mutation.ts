import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorResponse } from '@utils/axios';
import { createSupplier } from 'shared/api/api.services';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';

export const useCreateSupplierMutation = (options?: {
  onSuccess?: (data?: any) => void;
  onError?: (e: any) => void;
}) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = appSnackbar();

  return useMutation({
    mutationFn: (data: any) => createSupplier(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      enqueueSnackbar('Supplier created successfully', { variant: 'success' });
      if (options?.onSuccess) {
        options.onSuccess(res);
      }
    },
    onError: (e) => {
      const err = getErrorResponse(e);
      enqueueSnackbar(err || 'Failed to create supplier', { variant: 'error' });
      options?.onError && options?.onError(err);
    },
  });
};
