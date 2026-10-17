import { useState } from 'react';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '@auth/hooks';
import { useRouter } from '@routes/hook';
import { getErrorMessages } from 'shared/api/api.lib';
import { pathKeys } from 'shared/routes';
import { OnboardingSchema } from './onboarding.contracts';
import { useOnboardingMutation } from './onboarding.mutation';
import { STEPS } from './onboarding-stepper.ui';
import { TOnboarding } from './onboarding.types';

export function useOnboardingForm() {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<TOnboarding>({
    mode: 'onTouched',
    resolver: standardSchemaResolver(OnboardingSchema),
    defaultValues: {
      name: '',
      gym_url: '',
      city: '',
      address: '',
    },
  });

  const { refreshProfile, setSession } = useAuthContext();
  const router = useRouter();

  const mutation = useOnboardingMutation({
    async onSuccess(data, variables, context) {
      await setSession({
        accessToken: data.accessToken,
        user: data.user,
      });
      router.push(pathKeys.billing);
    },
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const onSubmit = (data: TOnboarding) => {
    if (activeStep < STEPS.length - 1) {
      handleNext();
    } else {
      mutation.mutate(data);
    }
  };

  return {
    activeStep,
    methods,
    handleBack,
    isError: mutation.isError,
    mutationErrors: getErrorMessages(mutation.error),
    loading: mutation.isPending,
    onSubmit: methods.handleSubmit(onSubmit),
  };
}
