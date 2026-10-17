import { useSessionStore } from 'entities/session';
import { redirect } from 'react-router-dom';
import { pathKeys } from 'shared/routes';

type MiddlewareArgs = {
  request: Request;
};

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

/**
 * RBAC Middleware for Admin Routes:
 * - Only ADMIN role has full access to Admin routes ('/').
 * - Other staff roles (e.g. CASHIER, MANAGER) are restricted from admin routes
 *   and redirected to the billing supplier page ('/billing/supplier').
 */
export async function adminRbacMiddleware({ request }: MiddlewareArgs) {
  await waitForSessionReady(request.signal);

  const { user } = useSessionStore.getState();

  // If user is authenticated and is NOT an ADMIN, redirect to billing suppliers page
  if (user && user.role?.toUpperCase() !== 'ADMIN') {
    return redirect(pathKeys.billing.supplierFP || '/billing/supplier');
  }

  return null;
}
