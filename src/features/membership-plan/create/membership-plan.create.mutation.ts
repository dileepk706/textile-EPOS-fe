import {
  useMutation,
  UseMutationOptions,
  DefaultError,
  useQueryClient,
} from '@tanstack/react-query';
import { createMembershipPlan } from 'shared/api/api.services';
import { CreateMembershipPlanDto } from 'shared/api/api.types';
import { AxiosResponse } from 'axios';

export function useCreateMembershipPlanMutation(
  options: Partial<
    UseMutationOptions<AxiosResponse<unknown>, DefaultError, CreateMembershipPlanDto, unknown>
  > = {}
) {
  const { mutationKey = [], onSuccess, onError, onSettled, onMutate } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['membership-plans', 'create', ...mutationKey],
    mutationFn: async (dto: CreateMembershipPlanDto) => {
      const response = await createMembershipPlan(dto);
      return response;
    },
    onMutate,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['membership-plans'] });
      if (onSuccess) {
        onSuccess(data, variables, context, undefined as any);
      }
    },
    onError,
    onSettled,
  });
}
