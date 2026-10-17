import { useCallback, useMemo } from 'react';
import { useSearchParams as _useSearchParams } from 'react-router-dom';
import { useRouter } from './use-router';

export default function useSearchParamsV2() {
  const [searchParams, setSearchParams] = _useSearchParams();
  const router = useRouter();

  // Read query param as object
  const query = useMemo(() => {
    const entries = Object.fromEntries(searchParams.entries());
    return entries;
  }, [searchParams]);

  // Set or update a single param
  const setParam = useCallback(
    (key: string, value: string | number | null) => {
      const newParams = new URLSearchParams(searchParams);
      if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  // Set multiple params at once
  const setParams = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const getParam = useCallback((key: string) => searchParams.get(key), [searchParams]);

  const replace = useCallback((url: string) => router.replace(url), []);

  return {
    query,
    setParam,
    setParams,
    getParam,
    replace,
  };
}
