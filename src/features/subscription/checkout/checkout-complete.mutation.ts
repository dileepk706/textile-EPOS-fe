import { DefaultError, useMutation, UseMutationOptions } from '@tanstack/react-query';
import { checkoutComplete } from 'shared/api/api.services';
import { CheckoutCompleteDto, CheckoutCompleteResponse } from 'shared/api/api.types';

export function useCheckoutCompleteMutation(
  options: Partial<UseMutationOptions<CheckoutCompleteResponse, DefaultError, CheckoutCompleteDto, unknown>> = {}
) {
  const { mutationKey = [], onMutate, onError, onSettled, onSuccess } = options;

  return useMutation({
    mutationKey: ['complete-checkout-session', ...mutationKey],
    mutationFn: async (checkoutData: CheckoutCompleteDto) => {
      const response = await checkoutComplete(checkoutData);
      return response.data;
    },
    onMutate,
    onSuccess,
    onError,
    onSettled,
  });
}
