import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  DarkModeReadyProvider,
  useDarkModeReady,
} from '../DarkModeReadyContext';

const InnerComponent: React.FC = () => {
  const { isScreenReadyForDarkMode } = useDarkModeReady();
  return isScreenReadyForDarkMode
    ? 'Preparado para o modo escuro 🎑'
    : 'Só funciona no modo claro 🌅';
};

describe('DarkModeEnabledProvider', () => {
  it('renders properly when ready for dark mode', () => {
    const screen = render(
      <DarkModeReadyProvider>
        <InnerComponent />
      </DarkModeReadyProvider>
    );
    expect(screen.container).toHaveTextContent(
      'Preparado para o modo escuro 🎑'
    );
  });

  it('renders properly when not ready for dark mode', () => {
    const screen = render(<InnerComponent />);
    expect(screen.container).toHaveTextContent('Só funciona no modo claro 🌅');
  });
});
