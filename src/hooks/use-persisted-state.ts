import { useEffect, useState } from "react";

interface RegularPayment {
  when: string;
  fromPot: boolean;
  name: string;
  id: string;
}

const getStored = <T>(key: string, defaultState: T): T => {
  try {
    const data = localStorage.getItem(key) ?? "";

    return JSON.parse(data);
  } catch {
    return defaultState;
  }
};

export const usePersistedState = <T>(key: string, defaultState: T) => {
  const [state, setState] = useState(getStored(key, defaultState));

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
};
