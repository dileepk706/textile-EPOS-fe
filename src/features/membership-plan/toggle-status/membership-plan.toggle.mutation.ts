import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleMembershipPlanStatus, updateMembershipPlan } from 'shared/api/api.services';
import { enqueueSnackbar } from 'notistack';

export function useToggleMembershipPlanStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      try {
        return await toggleMembershipPlanStatus(id, status);
      } catch (error) {
        // Fallback to PUT if status patch endpoint is not dedicated
        return await updateMembershipPlan(id, { status } as any);
      }
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
      enqueueSnackbar(`Plan ${status} successfully`, {
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to update plan status';
      enqueueSnackbar(message, { variant: 'error' });
    },
  });
}
