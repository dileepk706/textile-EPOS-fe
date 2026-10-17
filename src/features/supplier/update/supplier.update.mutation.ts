import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getErrorResponse } from '@utils/axios';
import { updateSupplier } from 'shared/api/api.services';
import appSnackbar from 'shared/ui/snackbar/useAppSnackbar';

export const useUpdateSupplierMutation = (
  id: string,
  options?: {
    onSuccess?: (data?: any) => void;
    onError?: (e: any) => void;
  }
) => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = appSnackbar();

  return useMutation({
    mutationFn: (data: any) => updateSupplier(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', 'detail', id] });
      enqueueSnackbar('Supplier updated successfully', { variant: 'success' });
      if (options?.onSuccess) {
        options.onSuccess(res);
      }
    },
    onError: (e) => {
      const err = getErrorResponse(e);
      enqueueSnackbar(err || 'Failed to update supplier', { variant: 'error' });
      options?.onError && options?.onError(err);
    },
  });
};
