import { createContext, FC, useState } from "react";

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

export const SettingsProvider: FC = ({ children }) => {
  const [settings, setSettings] = useState(defaultSettings);
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
