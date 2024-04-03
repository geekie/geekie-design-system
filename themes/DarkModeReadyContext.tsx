import * as React from 'react';
import { type ReactNode, createContext, useContext } from 'react';

interface DarkModeReadyContextValue {
  isScreenReadyForDarkMode: boolean;
}

const DarkModeReadyContext = createContext<DarkModeReadyContextValue>({
  isScreenReadyForDarkMode: false,
});

const DarkModeReadyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <DarkModeReadyContext.Provider value={{ isScreenReadyForDarkMode: true }}>
      {children}
    </DarkModeReadyContext.Provider>
  );
};

const useDarkModeReady = (): DarkModeReadyContextValue =>
  useContext(DarkModeReadyContext);

export { DarkModeReadyProvider, useDarkModeReady };
