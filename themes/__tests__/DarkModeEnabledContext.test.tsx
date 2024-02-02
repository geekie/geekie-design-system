import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  DarkModeEnabledProvider,
  defaultTheme,
  useDarkMode,
} from '../DarkModeEnabledContext';

const ThemeDisplay = (): React.JSX.Element => {
  const { theme } = useDarkMode();
  return <p>Tema atual: {theme}</p>;
};

const ThemeToggle = (): React.JSX.Element => {
  const { toggleDarkMode } = useDarkMode();
  return <button onClick={toggleDarkMode}>Trocar de tema</button>;
};

const customRender = (): any => {
  return render(
    <DarkModeEnabledProvider>
      <ThemeDisplay />
      <ThemeToggle />
    </DarkModeEnabledProvider>,
    {}
  );
};

test('DarkModeEnabledProvider shows defaultTheme', () => {
  customRender();
  expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
    `Tema atual: ${defaultTheme}`
  );
});

test('DarkModeEnabledProvider toggle theme to dark', () => {
  customRender();
  fireEvent.click(screen.getByText(/^Trocar de tema/));
  expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
    `Tema atual: dark`
  );
});

test('DarkModeEnabledProvider toggle back theme to light', () => {
  customRender();
  fireEvent.click(screen.getByText(/^Trocar de tema/));
  expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
    `Tema atual: dark`
  );
  fireEvent.click(screen.getByText(/^Trocar de tema/));
  expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
    `Tema atual: light`
  );
});
