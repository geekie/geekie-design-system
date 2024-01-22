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

const setStoredTheme = async (
  currentTheme: ThemeType
): Promise<string | undefined> => {
  try {
    await AsyncStorage.setItem('dsa_theme', currentTheme);
    return currentTheme;
  } catch (e) {
    console.log(e);
  }
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
    const setStoredTheme = async (): Promise<void> => {
      try {
        const storedTheme = await AsyncStorage.getItem('dsa_theme');
        const newTheme =
          storedTheme === null ? theme : (storedTheme as ThemeType);
        setTheme(newTheme);
      } catch (e) {
        console.log(e);
      }
    };
    setStoredTheme().catch((e) => {
      console.log(e);
    });
  }, []);

  const toggleDarkMode = (): void => {
    setTheme((prevTheme) => {
      const currentTheme = prevTheme === 'light' ? 'dark' : 'light';
      setStoredTheme(currentTheme).catch((e) => {
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
