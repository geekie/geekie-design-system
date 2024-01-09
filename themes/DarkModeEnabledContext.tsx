import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import { type ThemeType, defaultTheme } from './themes';

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
  const [theme, setTheme] = useState<ThemeType>('light');

  const toggleDarkMode = (): void => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <DarkModeEnabledContext.Provider value={{ theme, toggleDarkMode }}>
      {children}
    </DarkModeEnabledContext.Provider>
  );
};

const useDarkMode = (): DarkModeEnabledContextProps =>
  useContext(DarkModeEnabledContext);

export { DarkModeEnabledProvider, useDarkMode };
