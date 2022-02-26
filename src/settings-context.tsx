import { createContext } from "react";

export interface Settings {
  nextPayday?: Date;
  overdraft: number;
}

interface SettingsContext {
  settings: Settings
  setSettings: (settings: Settings) => void
}

export const SettingsContext = createContext<SettingsContext>({
  settings: {
    overdraft: 0
  },
  setSettings: () => {}
});
