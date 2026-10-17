import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { onboardingRequest } from './onboarding.api';
import { TOnboarding } from './onboarding.types';
import { Tenant } from 'entities/tenant/tenant.type';
import { Gym } from 'entities/textile/textile.type';
import { User } from 'entities/session';

export function useOnboardingMutation(
  options: Partial<UseMutationOptions<any, DefaultError, TOnboarding, unknown>> = {}
) {
  const { mutationKey = [], onMutate, onError, onSettled, onSuccess } = options;

  return useMutation({
    mutationKey: ['session', 'onboarding-user', ...mutationKey],
    mutationFn: async (
      onboardingData: TOnboarding
    ): Promise<{
      accessToken: string;
      refreshToken: string;
      tenant: Tenant;
      gym: Gym;
      staff: any;
      user: User;
    }> => {
      const data = await onboardingRequest(onboardingData);
      return data.data.data;
    },
    onMutate,
    onSuccess: async (data, variables, context, mutation) => {
      onSuccess?.(data, variables, context, mutation);
    },
    onError,
    onSettled,
  });
}
