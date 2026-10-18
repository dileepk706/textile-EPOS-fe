import { useSessionStore } from 'entities/session';
import { useActiveTillStore } from 'entities/till';
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

export async function tillMiddleware({ request }: MiddlewareArgs) {
  await waitForSessionReady(request.signal);

  const pathname = new URL(request.url).pathname;
  const isSetupTillPath =
    pathname === '/setup-till' ||
    pathname === '/billing/setup-till' ||
    pathname.endsWith('/setup-till') ||
    pathname.endsWith(pathKeys.setuptill);

  // If user is already accessing the setup-till page, allow through to avoid redirect loops
  if (isSetupTillPath) {
    return null;
  }

  const { activeTill, clearActiveTill } = useActiveTillStore.getState();

  // If no till is currently selected or the selected till is not in 'open' status
  if (!activeTill || activeTill.status !== 'open') {
    if (activeTill && activeTill.status !== 'open') {
      clearActiveTill();
    }
    return redirect(pathKeys.setuptill);
  }

  return null;
}

export const tillCheckMiddleware = tillMiddleware;
