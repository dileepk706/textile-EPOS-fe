import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { registerRequest } from './register.api';
import { TRegisterUser } from './register.contracts';

type RegisterResponse = Awaited<ReturnType<typeof registerRequest>>['data'];

export function useRegisterMutation(
  options: Partial<UseMutationOptions<RegisterResponse, DefaultError, TRegisterUser, unknown>> = {}
) {
  const { mutationKey = [], onMutate, onError, onSettled, onSuccess } = options;

  return useMutation({
    mutationKey: ['session', 'register-user', ...mutationKey],
    mutationFn: async (registerUserData: TRegisterUser) => {
      const response = await registerRequest(registerUserData);
      return response.data;
    },
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });
}
