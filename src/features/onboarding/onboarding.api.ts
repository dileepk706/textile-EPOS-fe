import { onboardingCreateWorkSpace } from 'shared/api/api.services';
import { TOnboarding } from './onboarding.types';

export function onboardingRequest(onboardingData: TOnboarding) {
  return onboardingCreateWorkSpace(onboardingData);
}
