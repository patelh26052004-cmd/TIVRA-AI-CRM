"use client";

import { useEffect, useState } from "react";

export function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const savedValue = window.localStorage.getItem(key);

      if (savedValue !== null) {
        setState(JSON.parse(savedValue) as T);
      }
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error);
    }
  }, [key, state]);

  return [state, setState];
}