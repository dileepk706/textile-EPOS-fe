// import { useSessionStore } from 'entities/session';
// import { useGymStore } from '@stores/gym.store';
// import { gymByIdQueryOptions, gymsGlobalQueryOptions } from 'entities/gym/gym.api';
// import { queryClient } from 'shared/queryClient';
// import { redirect } from 'react-router-dom';
// import { pathKeys } from 'shared/routes';

// const isOnboardingPath = (pathname: string) =>
//   pathname.replace(/\/+$/, '') === pathKeys.onboarding.replace(/\/+$/, '');

// type MiddlewareArgs = {
//   request: Request;
// };

// function waitForSessionReady(signal: AbortSignal) {
//   const { loading } = useSessionStore.getState();

//   if (!loading) {
//     return Promise.resolve();
//   }

//   return new Promise<void>((resolve, reject) => {
//     const unsubscribe = useSessionStore.subscribe((state) => {
//       if (!state.loading) {
//         unsubscribe();
//         signal.removeEventListener('abort', onAbort);
//         resolve();
//       }
//     });

//     const onAbort = () => {
//       unsubscribe();
//       reject(signal.reason ?? new DOMException('Navigation aborted', 'AbortError'));
//     };

//     if (signal.aborted) {
//       onAbort();
//       return;
//     }

//     signal.addEventListener('abort', onAbort, { once: true });
//   });
// }

// export async function requireWorkspaceMiddleware({ request }: MiddlewareArgs) {
//   await waitForSessionReady(request.signal);

//   const { user: storedUser } = useSessionStore.getState();
//   const { clearSelectedGym, setSelectedGymId } = useGymStore.getState();

//   const pathname = new URL(request.url).pathname;
//   let user = storedUser;

//   if (!user) {
//     return null;
//   }

//   if (!user?.tenant_id) {
//     clearSelectedGym();
//     queryClient.removeQueries({ queryKey: ['gyms'] });

//     if (isOnboardingPath(pathname)) {
//       return null;
//     }

//     return redirect(pathKeys.onboarding);
//   }

//   if (isOnboardingPath(pathname)) {
//     return redirect(pathKeys.dashboard().root);
//   }

//   const gyms = await queryClient.ensureQueryData(gymsGlobalQueryOptions());
//   const persistedGymId = useGymStore.getState().selectedGymId;
//   const selectedGymId =
//     gyms.find((gym: any) => gym.id === persistedGymId)?.id ?? gyms[0]?.id ?? null;

//   setSelectedGymId(selectedGymId);

//   if (selectedGymId) {
//     await queryClient.ensureQueryData(gymByIdQueryOptions(selectedGymId));
//   }

//   return null;
// }

// export { requireWorkspaceMiddleware as LoadGyms };
