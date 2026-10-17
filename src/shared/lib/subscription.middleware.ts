import { useSessionStore } from 'entities/session';
import { queryClient } from 'shared/queryClient';
import { redirect } from 'react-router-dom';
import { pathKeys } from 'shared/routes';
import { currentSubscriptionQueryOptions, useSubscriptionStore } from 'entities/subscription';
import { delay } from '@auth/utils';

type MiddlewareArgs = {
  request: Request;
};

const isBillingPath = (pathname: string) =>
  pathname.replace(/\/+$/, '') === pathKeys.billing.root.replace(/\/+$/, '');

const isOnboardingPath = (pathname: string) =>
  pathname.replace(/\/+$/, '') === pathKeys.onboarding.replace(/\/+$/, '');

function waitForSessionReady(signal: AbortSignal) {
  const { loading } = useSessionStore.getState();

  if (!loading) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const unsubscribe = useSessionStore.subscribe((state) => {
      if (!state.loading) {
        unsubscribe();
        signal.removeEventListener('abort', onAbort);
        resolve();
      }
    });

    const onAbort = () => {
      unsubscribe();
      reject(signal.reason ?? new DOMException('Navigation aborted', 'AbortError'));
    };

    if (signal.aborted) {
      onAbort();
      return;
    }

    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export async function subscriptionMiddleware({ request }: MiddlewareArgs) {
  await waitForSessionReady(request.signal);

  const { user } = useSessionStore.getState();
  const pathname = new URL(request.url).pathname;

  // If user is not logged in or has no tenant, they won't have a subscription yet
  if (!user || !user.tenant_id) {
    return null;
  }

  const { setSubscriptionDetails, setLoading, setError, clearSubscription } =
    useSubscriptionStore.getState();

  try {
    setLoading(true);

    // Ensure we have current subscription data, fetching or using cached query data
    const response = await queryClient.ensureQueryData(currentSubscriptionQueryOptions());

    if (response && response.data) {
      setSubscriptionDetails(response.data);

      const status = response.data.subscription?.status;
      const hasActiveSubscription = status === 'active' || status === 'trialing';

      // If user has no active subscription and is not on the billing/onboarding page, redirect to billing
      if (!hasActiveSubscription && !isBillingPath(pathname) && !isOnboardingPath(pathname)) {
        return redirect(pathKeys.billing.root);
      }
    } else {
      clearSubscription();
      // No active subscription exists (returned null / 404). Redirect to billing if not already there.
      if (!isBillingPath(pathname) && !isOnboardingPath(pathname)) {
        return redirect(pathKeys.billing.root);
      }
    }
  } catch (error) {
    console.error('Failed to fetch subscription details in subscriptionMiddleware:', error);
    setError(error);
    clearSubscription();

    // In case of error, redirect to billing if not already there to prevent lockouts
    if (!isBillingPath(pathname) && !isOnboardingPath(pathname)) {
      return redirect(pathKeys.billing.root);
    }
  }

  return null;
}
