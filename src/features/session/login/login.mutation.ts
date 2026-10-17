import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useSessionStore } from 'entities/session';
import { loginRequest } from './login.api';
import { LoginUser } from './login.contracts';

type LoginResponse = Awaited<ReturnType<typeof loginRequest>>['data'];

export function useLoginMutation(
  options: Partial<UseMutationOptions<LoginResponse, DefaultError, LoginUser, unknown>> = {}
) {
  const setAccessToken = useSessionStore((state) => state.setAccessToken);
  const setUser = useSessionStore((state) => state.setUser);
  const setSessionExpired = useSessionStore((state) => state.setSessionExpired);
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['session', 'login-user', ...mutationKey],
    mutationFn: async (loginUserData: LoginUser) => {
      const response = await loginRequest(loginUserData);
      return response.data;
    },
    onMutate,
    onSuccess: async (data, variables, context) => {
      setAccessToken(data.data.accessToken);
      setSessionExpired(false);
      setUser(data.data.user);
      onSuccess?.(data, variables, context, undefined as any);
    },
    onError,
    onSettled,
  });
}
