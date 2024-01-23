import * as React from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

import { type ThemeType, defaultTheme } from './themes';

const storeToggledTheme = async (currentTheme: ThemeType): Promise<void> => {
  await AsyncStorage.setItem('dsa_theme', currentTheme);
};

interface DarkModeEnabledContextProps {
  theme: ThemeType;
  toggleDarkMode: () => void;
}

const DarkModeEnabledContext = createContext<DarkModeEnabledContextProps>({
  theme: defaultTheme,
  toggleDarkMode: () => {},
});

const DarkModeEnabledProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

  useEffect(() => {
    const setStoredThemeAsDefault = async (): Promise<void> => {
      const storedTheme = (await AsyncStorage.getItem(
        'dsa_theme'
      )) as ThemeType | null;
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
      storeToggledTheme(currentTheme).catch((e) => {
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
