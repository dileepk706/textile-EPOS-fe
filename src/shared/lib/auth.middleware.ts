import { useSessionStore } from 'entities/session';
import { redirect } from 'react-router-dom';
import { getUserProfile } from 'shared/api/api.services';
import { queryClient } from 'shared/queryClient';
import { pathKeys } from 'shared/routes';

type MiddlewareArgs = {
  request: Request;
};

function buildLoginRedirect(request: Request) {
  const url = new URL(request.url);
  const returnTo = url.pathname + url.search;
  const searchParams = new URLSearchParams({ returnTo }).toString();

  return redirect(`${pathKeys.login}?${searchParams}`);
}

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

export async function authMiddleware({ request }: MiddlewareArgs) {
  const { accessToken, user, setUser, clearSession } = useSessionStore.getState();

  await waitForSessionReady(request.signal);

  const session = useSessionStore.getState();

  if (!session.accessToken && !accessToken) {
    session.clearSession();
    return buildLoginRedirect(request);
  }

  if (!session.user || !user) {
    try {
      const response = await getUserProfile();
      const refreshedUser = response.data.data;
      useSessionStore.getState().setUser(refreshedUser);
    } catch (error) {
      console.error('Failed to fetch user profile in requireAuthMiddleware:', error);
      clearSession();
      // queryClient.removeQueries({ queryKey: ['gyms'] });
      return buildLoginRedirect(request);
    }
  }

  return null;
}
