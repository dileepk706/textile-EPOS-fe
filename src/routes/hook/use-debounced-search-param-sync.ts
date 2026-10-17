import { useState } from 'react';
import { useSearchParams as _useSearchParams } from 'react-router-dom';
import { useDebounce } from 'shared/hooks/useDebounce';

export function useDebouncedSearchParamSync(paramKey: string, delay = 500) {
  const [localValue, setLocalValue] = useState('');

  const debouncedValue = useDebounce(localValue, 500);

  return {
    value: localValue,
    debouncedValue,
    setValue: setLocalValue,
  };
}
