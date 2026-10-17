import { useCheckoutMutation } from './checkout.mutation';
import { useCheckoutCompleteMutation } from './checkout-complete.mutation';
import { FactoryButton } from 'shared/ui';
import { IconsElement } from 'shared/ui/iconify/icons';
import { useRouter } from '@routes/hook';
import { pathKeys } from 'shared/routes';
import { useSnackbar } from 'notistack';

type Props = {
  planId: string;
};

export function CheckoutPlanButton({ planId }: Props) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const completeMutation = useCheckoutCompleteMutation({
    onSuccess: () => {
      enqueueSnackbar('Subscription successful!', { variant: 'success' });
      router.push(pathKeys.dashboard().root);
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to complete checkout', { variant: 'error' });
    },
  });

  const checkoutMutation = useCheckoutMutation({
    onSuccess: (data) => {
      const sessionId = data?.data?.session?.id;
      if (sessionId) {
        // Automatically complete checkout for now
        completeMutation.mutate({ sessionId });
      } else {
        enqueueSnackbar('Failed to initiate checkout', { variant: 'error' });
      }
    },
    onError: (error) => {
      enqueueSnackbar(error.message || 'Failed to initiate checkout', { variant: 'error' });
    },
  });

  const onSubmit = () => {
    checkoutMutation.mutate({ plan_id: planId });
  };

  const isPending = checkoutMutation.isPending || completeMutation.isPending;

  return (
    <FactoryButton
      fullWidth
      factoryVariant="primary"
      disabled={isPending}
      onClick={onSubmit}
      startIcon={IconsElement.thunder}
    >
      {isPending ? 'Processing...' : 'Subscribe'}
    </FactoryButton>
  );
}
