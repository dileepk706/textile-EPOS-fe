import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useNavigate } from 'react-router-dom';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import {
  createMembershipPlanFormSchema,
  CreateMembershipPlanFormValues,
} from './membership-plan.create.contracts';
import { useCreateMembershipPlanMutation } from './membership-plan.create.mutation';
import { CreateMembershipPlanDto } from 'shared/api/api.types';

export function useMembershipPlanCreateForm() {
  const navigate = useNavigate();

  const form = useForm<CreateMembershipPlanFormValues>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(createMembershipPlanFormSchema),
    defaultValues: {
      name: '',
      description: '',
      membership_type: 'single',
      billing_type: 'recurring',
      price: 0,
      billing_interval: 'month',
      billing_interval_count: 1,
      duration_days: 30,
      max_members: null,
    },
  });

  const mutation = useCreateMembershipPlanMutation({
    onSuccess() {
      navigate(pathKeys.members(true).membership);
    },
  });

  const loading = mutation.isPending || form.formState.isSubmitting;

  const onValid = (data: CreateMembershipPlanFormValues) => {
    const payload: CreateMembershipPlanDto = {
      name: data.name.trim(),
      description: data.description && data.description.trim() !== '' ? data.description.trim() : null,
      membership_type: data.membership_type,
      billing_type: data.billing_type,
      price: Number(data.price),
      billing_interval: data.billing_interval,
      billing_interval_count: Number(data.billing_interval_count),
      duration_days: Number(data.duration_days),
      max_members:
        data.membership_type === 'family' && data.max_members !== null && data.max_members !== undefined && !isNaN(data.max_members)
          ? Number(data.max_members)
          : null,
    };

    mutation.mutate(payload);
  };

  return {
    form,
    loading,
    mutationErrors: getErrorMessages(mutation.error),
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    onSubmit: form.handleSubmit(onValid),
  };
}
