import { useSessionStore } from 'entities/session';
import { pathKeys } from 'shared/routes';
import { redirect, type DataStrategyFunction, type DataStrategyMatch, type DataStrategyResult } from 'react-router-dom';

export type RouteMiddlewareArgs = {
  request: Request;
  params: DataStrategyMatch['params'];
  match: DataStrategyMatch;
  context: unknown;
};

export type RouteMiddleware = (
  args: RouteMiddlewareArgs
) => Promise<Response | void> | Response | void;

export type RouteHandle = {
  middleware?: RouteMiddleware[];
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

function buildDashboardRedirect() {
  return redirect(pathKeys.dashboard().root);
}

export async function redirectAuthenticatedUsersMiddleware({ request }: RouteMiddlewareArgs) {
  await waitForSessionReady(request.signal);

  const { accessToken, user } = useSessionStore.getState();

  if (accessToken || user) {
    return buildDashboardRedirect();
  }

  return null;
}

async function runMiddlewareStack(matches: DataStrategyMatch[], args: Omit<RouteMiddlewareArgs, 'match' | 'params'>) {
  for (const match of matches) {
    const middlewares = (match.route.handle as RouteHandle | undefined)?.middleware ?? [];

    for (const middleware of middlewares) {
      const result = await middleware({
        ...args,
        match,
        params: match.params,
      });

      if (result instanceof Response && result.status >= 300 && result.status < 400) {
        return {
          [match.route.id]: {
            type: 'data',
            result,
          } satisfies DataStrategyResult,
        } as Record<string, DataStrategyResult>;
      }
    }
  }

  return null;
}

export const appDataStrategy: DataStrategyFunction = async ({ matches, request, context }) => {
  const middlewareResults = await runMiddlewareStack(matches, {
    request,
    context,
  });

  if (middlewareResults) {
    return middlewareResults;
  }

  const results: Record<string, DataStrategyResult> = {};

  await Promise.all(
    matches.map(async (match) => {
      if (!match.shouldLoad) {
        return;
      }

      results[match.route.id] = await match.resolve();
    })
  );

  return results;
};
