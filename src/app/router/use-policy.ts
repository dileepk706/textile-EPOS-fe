import { useSessionStore } from 'entities/session';

export function usePolicy() {
  const user = useSessionStore((state) => state.user);

  const can = (_permission: string) => Boolean(user);

  const hasFeature = (_feature: string) => Boolean(user);

  return {
    can,
    hasFeature,
  };
}
