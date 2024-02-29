import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  DarkModeEnabledProvider,
  useDarkMode,
} from '../DarkModeEnabledContext';
import { type Theme, defaultTheme } from '../themes';

const ThemeDisplay = (): React.JSX.Element => {
  const { theme } = useDarkMode();
  return <p>Tema atual: {theme}</p>;
};

const ThemeToggle = (): React.JSX.Element => {
  const { theme, setTheme } = useDarkMode();
  return (
    <button
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light');
      }}
    >
      Trocar de tema
    </button>
  );
};

const getPersistedTheme = async (): Promise<Theme | null> => {
  return (await AsyncStorage.getItem('dsa_theme')) as Theme | null;
};

const setPersistedTheme = async (value: Theme): Promise<void> => {
  await AsyncStorage.setItem('dsa_theme', value);
};

const customRender = (): any => {
  return render(
    <DarkModeEnabledProvider
      getPersistedTheme={getPersistedTheme}
      setPersistedTheme={setPersistedTheme}
    >
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
  await AsyncStorage.setItem('dsa_theme', 'dark');

  const component = customRender();
  await waitFor(() => {
    expect(component.container).toHaveTextContent('Tema atual: dark');
  });

  fireEvent.click(component.getByText(/^Trocar de tema/));
  expect(component.getByText(/^Tema atual:/)).toHaveTextContent(
    'Tema atual: light'
  );

  expect(await AsyncStorage.getItem('dsa_theme')).toBe('light');
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
