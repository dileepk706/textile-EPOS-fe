import { useAuthContext } from '@auth/hooks';

export function usePolicy() {
  const auth = useAuthContext();

  const can = (permission: string) => auth.permissions.includes(permission);

  const hasFeature = (feature: string) => auth.features.includes(feature);

  return {
    can,
    hasFeature,
  };
}
