import * as React from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { type Theme, defaultTheme } from './themes';

const storeToggledTheme = async (
  currentTheme: Theme,
  setPersistedTheme: (value: Theme) => Promise<void>
): Promise<void> => {
  await setPersistedTheme(currentTheme);
};

interface DarkModeEnabledContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const DarkModeEnabledContext = createContext<DarkModeEnabledContextProps>({
  theme: defaultTheme,
  setTheme: () => {},
});

const DarkModeEnabledProvider: React.FC<{
  children: ReactNode;
  setPersistedTheme: (value: Theme) => Promise<void>;
  getPersistedTheme: () => Promise<Theme | null>;
}> = ({ children, setPersistedTheme, getPersistedTheme }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  useEffect(() => {
    const setStoredThemeAsDefault = async (): Promise<void> => {
      const storedTheme = await getPersistedTheme();
      if (storedTheme !== null) {
        setTheme(storedTheme);
      }
    };
    setStoredThemeAsDefault().catch((e) => {
      console.log(e);
    });
  }, []);

  const setAndStoreTheme = (theme: Theme): void => {
    setTheme(theme);
    storeToggledTheme(theme, setPersistedTheme).catch((e) => {
      console.log(e);
    });
  };

  return (
    <DarkModeEnabledContext.Provider
      value={{ theme, setTheme: setAndStoreTheme }}
    >
      {children}
    </DarkModeEnabledContext.Provider>
  );
};

const useDarkMode = (): DarkModeEnabledContextProps =>
  useContext(DarkModeEnabledContext);

export { DarkModeEnabledContext, DarkModeEnabledProvider, useDarkMode };
