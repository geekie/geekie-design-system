import React, { type Dispatch, type SetStateAction } from 'react';
import { defaultTheme, type ThemeType } from './theme.config';

import * as defaultTokens from '../built-tokens/js/tokens';
import * as darkTokens from '../built-tokens/js/dark-tokens';

interface ThemeContextProps {
  theme: ThemeType;
  setCurrentTheme: Dispatch<SetStateAction<ThemeType>> | null;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
  theme: defaultTheme,
  setCurrentTheme: null,
});

interface Props {
  children: any;
}

export const ThemeProvider = ({ children }: Props): React.ReactElement => {
  const [currentTheme, setCurrentTheme] =
    React.useState<ThemeType>(defaultTheme);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setCurrentTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useTheme = () => React.useContext(ThemeContext);

export const tokens =
  useTheme().theme === 'light'
    ? defaultTokens
    : { ...defaultTokens, ...darkTokens };
