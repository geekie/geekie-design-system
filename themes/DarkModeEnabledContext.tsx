import * as React from 'react';
import { createContext, useContext, useState, type ReactNode } from 'react';

import AsyncStorage from '@react-native-community/async-storage';

import { type ThemeType, defaultTheme } from './themes';

const toggleStoredTheme = async (
  currentTheme: ThemeType
): Promise<string | null | undefined> => {
  try {
    const theme = await AsyncStorage.getItem('theme');
    if (theme !== null) {
      if (theme === 'light') {
        await AsyncStorage.setItem('theme', 'dark');
      } else if (theme === 'dark') {
        await AsyncStorage.setItem('theme', 'light');
      }
    } else {
      await AsyncStorage.setItem('theme', currentTheme);
    }
    const newTheme = await AsyncStorage.getItem('theme');
    return newTheme;
  } catch (e) {
    // saving error
  }
};

interface DarkModeEnabledContextProps {
  theme: ThemeType;
  toggleDarkMode: () => void;
}

const DarkModeEnabledContext = createContext<DarkModeEnabledContextProps>({
  theme: defaultTheme,
  // eslint-disable-next-line no-void
  toggleDarkMode: () => void {},
});

const DarkModeEnabledProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);

  React.useEffect(() => {
    const setDefaultTheme = async (): Promise<void> => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        const newTheme =
          theme === null && storedTheme === null
            ? defaultTheme
            : storedTheme === null && (theme === 'light' || theme === 'dark')
            ? theme
            : (storedTheme as ThemeType);
        setTheme(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
      } catch (e) {
        // saving error
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setDefaultTheme();
  }, []);

  const toggleDarkMode = (): void => {
    setTheme((prevTheme) => {
      const currentTheme = prevTheme === 'light' ? 'dark' : 'light';
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      toggleStoredTheme(currentTheme);
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
