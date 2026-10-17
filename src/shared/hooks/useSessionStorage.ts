import { useState, useEffect } from 'react';
import { sessionStorageAvailable } from '@utils/storage-available';
// utils

// ----------------------------------------------------------------------

export function useSessionStorage<ValueType>(key: string, defaultValue: ValueType) {
  const storageAvailable = sessionStorageAvailable();

  const [value, setValue] = useState<ValueType>(() => {
    const storedValue = storageAvailable ? sessionStorage.getItem(key) : null;
    return storedValue === null ? defaultValue : JSON.parse(storedValue);
  });

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.storageArea === sessionStorage && e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
      }
    };

    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key]);

  const setValueInSessionStorage = (newValue: ValueType | ((val: ValueType) => ValueType)) => {
    setValue((currentValue) => {
      const result =
        typeof newValue === 'function' ? (newValue as Function)(currentValue) : newValue;

      if (storageAvailable) {
        sessionStorage.setItem(key, JSON.stringify(result));
      }

      return result;
    });
  };

  return [value, setValueInSessionStorage] as const;
}

