import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMembershipPlan } from 'shared/api/api.services';
import { enqueueSnackbar } from 'notistack';

export const useDeleteMembershipPlanMutation = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMembershipPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
      enqueueSnackbar('Membership plan deleted successfully', { variant: 'success' });
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to delete membership plan';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
};
