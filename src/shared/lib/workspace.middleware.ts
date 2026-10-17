import { useSessionStore } from 'entities/session';
import { useTextilesStore } from 'entities/textile/textile.store';
import { getTextileQueryOptions } from 'entities/textile/textile.api';
import { queryClient } from 'shared/queryClient';

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

export async function workspaceMiddleware({ request }: MiddlewareArgs) {
  await waitForSessionReady(request.signal);

  const { user: storedUser } = useSessionStore.getState();
  const { setTextiles, clearTextile } = useTextilesStore.getState();

  const pathname = new URL(request.url).pathname;
  let user = storedUser;

  if (!user) {
    clearTextile();
    return null;
  }

  const textile = await queryClient.ensureQueryData(getTextileQueryOptions());
  setTextiles(textile);

  return null;
}

export { workspaceMiddleware as LoadTextile };
