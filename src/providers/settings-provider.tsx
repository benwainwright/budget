import { createContext, FC } from "react";
import { usePersistedState } from "../hooks/use-persisted-state";

export interface Settings {
  nextPayday?: Date;
  overdraft: number;
}

interface SettingsContext {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const defaultSettings = {
  overdraft: 0,
};

export const SettingsContext = createContext<SettingsContext>({
  settings: defaultSettings,
  setSettings: () => {},
});

const SETTINGS_KEY = "budget-settings";

export const SettingsProvider: FC = ({ children }) => {
  const [settings, setSettings] = usePersistedState(
    SETTINGS_KEY,
    defaultSettings
  );
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
