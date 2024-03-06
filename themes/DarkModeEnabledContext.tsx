import * as React from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { type ThemeType, defaultTheme } from './themes';

const storeToggledTheme = async (
  currentTheme: ThemeType,
  setPersistedTheme: (value: ThemeType) => Promise<void>
): Promise<void> => {
  await setPersistedTheme(currentTheme);
};

interface DarkModeEnabledContextProps {
  theme: ThemeType;
  toggleDarkMode: () => void;
}

const DarkModeEnabledContext = createContext<DarkModeEnabledContextProps>({
  theme: defaultTheme,
  toggleDarkMode: () => {},
});

const DarkModeEnabledProvider: React.FC<{
  children: ReactNode;
  setPersistedTheme: (value: ThemeType) => Promise<void>;
  getPersistedTheme: () => Promise<ThemeType | null>;
}> = ({ children, setPersistedTheme, getPersistedTheme }) => {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

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

  const toggleDarkMode = (): void => {
    setTheme((prevTheme) => {
      const currentTheme = prevTheme === 'light' ? 'dark' : 'light';
      storeToggledTheme(currentTheme, setPersistedTheme).catch((e) => {
        console.log(e);
      });
      return currentTheme;
    });
  };

  return (
    <DarkModeEnabledContext.Provider value={{ theme, toggleDarkMode }}>
      {children}
    </DarkModeEnabledContext.Provider>
  );
};

const useDarkMode = (): DarkModeEnabledContextProps =>
  useContext(DarkModeEnabledContext);

export { DarkModeEnabledProvider, useDarkMode, defaultTheme };
