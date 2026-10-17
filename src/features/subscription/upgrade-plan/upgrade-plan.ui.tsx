import { useSubscriptionMutation } from 'features/subscription/upgrade-plan/subscription.mutation';
import { currentSubscriptionQueryOptions } from 'entities/subscription/subscription.api';
import { queryClient } from 'shared/queryClient';
import { FactoryButton } from 'shared/ui';
import Iconify from 'shared/ui/iconify';
import { IconsElement } from 'shared/ui/iconify/icons';

// ----------------------------------------------------------------------

type Props = {
  planId: string;
  isCurrent?: boolean;
  onSelect: (planId: string) => void;
};

export function UpgradePlanButton({ planId, isCurrent = false, onSelect }: Props) {
  const mutation = useSubscriptionMutation({
    async onSuccess() {
      await queryClient.fetchQuery(currentSubscriptionQueryOptions());
    },
  });

  const onSubmit = (selectedPlanId: string) => {
    onSelect(selectedPlanId);
    mutation.mutate({ plan_id: selectedPlanId });
  };

  if (isCurrent) {
    return (
      <FactoryButton fullWidth disabled factoryVariant="secondary">
        Selected plan
      </FactoryButton>
    );
  }

  return (
    <FactoryButton
      fullWidth
      factoryVariant="primary"
      disabled={mutation.isPending}
      onClick={() => onSubmit(planId)}
      startIcon={IconsElement.thunder}
    >
      {mutation.isPending ? 'Upgrading...' : 'Upgrade plan'}
    </FactoryButton>
  );
}
