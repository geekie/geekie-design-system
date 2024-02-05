import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { act, fireEvent, render, screen } from '@testing-library/react';
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

beforeEach(async () => {
  await AsyncStorage.clear();
});

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

test('DarkModeEnabledProvider theme is stored at toggle', async () => {
  customRender();
  fireEvent.click(screen.getByText(/^Trocar de tema/));
  expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
    `Tema atual: dark`
  );

  await AsyncStorage.getItem('dsa_theme').then((theme) => {
    expect(theme).toBe('dark');
  });
});

test('DarkModeEnabledProvider uses stored theme as current', async () => {
  await AsyncStorage.setItem('dsa_theme', 'dark').then(async () => {
    await AsyncStorage.getItem('dsa_theme').then(async (theme) => {
      await act(async () => customRender()).then(() => {
        expect(theme).toBe('dark');

        setTimeout(() => {
          expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
            `Tema atual: dark`
          );
        }, 500);
      });
    });
  });

  fireEvent.click(screen.getByText(/^Trocar de tema/));
  expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
    `Tema atual: light`
  );
  await AsyncStorage.getItem('dsa_theme').then((theme) => {
    expect(theme).toBe('light');
  });
});

test('DarkModeEnabledProvider toggle back theme to light and persist correctly', async () => {
  customRender();
  fireEvent.click(screen.getByText(/^Trocar de tema/));
  expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
    `Tema atual: dark`
  );

  await AsyncStorage.getItem('dsa_theme').then((theme) => {
    expect(theme).toBe('dark');
  });

  fireEvent.click(screen.getByText(/^Trocar de tema/));
  expect(screen.getByText(/^Tema atual:/)).toHaveTextContent(
    `Tema atual: light`
  );

  await AsyncStorage.getItem('dsa_theme').then((theme) => {
    expect(theme).toBe('light');
  });
});
