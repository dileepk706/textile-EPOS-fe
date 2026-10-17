import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { checkout } from 'shared/api/api.services';
import { CheckoutDto, CheckoutSessionResponse } from 'shared/api/api.types';

export function useCheckoutMutation(
  options: Partial<UseMutationOptions<CheckoutSessionResponse, DefaultError, CheckoutDto, unknown>> = {}
) {
  const { mutationKey = [], onMutate, onError, onSettled, onSuccess } = options;

  return useMutation({
    mutationKey: ['create-checkout-session', ...mutationKey],
    mutationFn: async (checkoutData: CheckoutDto) => {
      const response = await checkout(checkoutData);
      return response.data;
    },
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });
}
