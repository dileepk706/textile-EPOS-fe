import {
  useMutation,
  UseMutationOptions,
  DefaultError,
  useQueryClient,
} from '@tanstack/react-query';
import { CreateUserDto } from './staff.create.contracts';
import { createUser } from 'shared/api/api.services';

export function useCreateStaffMutation(
  options: Partial<UseMutationOptions<DefaultError, CreateUserDto, unknown>> = {}
) {
  const { mutationKey = [], onSuccess, onError, onSettled, onMutate } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['staff', 'create', ...mutationKey],
    mutationFn: async (dto: CreateUserDto) => {
      const response = await createUser(dto);
      return response.data;
    },
    onMutate,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      if (onSuccess) {
        onSuccess(data, variables, context, undefined as any);
      }
    },
    onError,
    onSettled,
  });
}
