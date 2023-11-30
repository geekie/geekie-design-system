import * as defaultTokens from './built-tokens/js/tokens';
import * as darkTokens from './built-tokens/js/dark-tokens';

type ThemeType = 'dark' | 'light';

type ColorValue = any; // Tipagem de cor do stylesheet do react native

export function getAllThemeTokens(theme: ThemeType): typeof defaultTokens {
  if (theme === 'dark') {
    return {
      ...defaultTokens,
      ...darkTokens,
    } as unknown as typeof defaultTokens;
  }

  return { ...defaultTokens };
}

export function getThemeToken(
  theme: ThemeType,
  tokenName: keyof typeof darkTokens
): string | number | ColorValue {
  if (theme === 'dark') {
    return darkTokens[tokenName];
  }

  return defaultTokens[tokenName];
}
