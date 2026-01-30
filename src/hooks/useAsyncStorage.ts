// src/hooks/useAsyncStorage.ts
// Hook for working with AsyncStorage

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseAsyncStorageReturn<T> {
  value: T | null;
  isLoading: boolean;
  error: Error | null;
  setValue: (value: T) => Promise<void>;
  removeValue: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook to read and write to AsyncStorage
 * @param key - The storage key
 * @param defaultValue - Default value if no stored value exists
 * @returns Object with value, loading state, and setter functions
 */
export function useAsyncStorage<T = string>(
  key: string,
  defaultValue: T | null = null,
): UseAsyncStorageReturn<T> {
  const [value, setValueState] = useState<T | null>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load value from storage
  const loadValue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stored = await AsyncStorage.getItem(key);

      if (stored !== null) {
        try {
          // Try to parse as JSON
          setValueState(JSON.parse(stored) as T);
        } catch {
          // If parsing fails, use as string
          setValueState(stored as unknown as T);
        }
      } else {
        setValueState(defaultValue);
      }
    } catch (err) {
      setError(err as Error);
      console.error(`Error loading ${key} from AsyncStorage:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  // Initial load
  useEffect(() => {
    loadValue();
  }, [loadValue]);

  // Set value to storage
  const setValue = useCallback(
    async (newValue: T) => {
      try {
        setError(null);
        const stringValue =
          typeof newValue === 'string' ? newValue : JSON.stringify(newValue);
        await AsyncStorage.setItem(key, stringValue);
        setValueState(newValue);
      } catch (err) {
        setError(err as Error);
        console.error(`Error saving ${key} to AsyncStorage:`, err);
        throw err;
      }
    },
    [key],
  );

  // Remove value from storage
  const removeValue = useCallback(async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setValueState(defaultValue);
    } catch (err) {
      setError(err as Error);
      console.error(`Error removing ${key} from AsyncStorage:`, err);
      throw err;
    }
  }, [key, defaultValue]);

  // Refresh value from storage
  const refresh = useCallback(async () => {
    await loadValue();
  }, [loadValue]);

  return {
    value,
    isLoading,
    error,
    setValue,
    removeValue,
    refresh,
  };
}
