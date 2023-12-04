import * as defaultTokens from './built-tokens/js/tokens';
import * as darkTokens from './built-tokens/js/dark-tokens';
import * as lightTokens from './built-tokens/js/light-tokens';

type ThemeType = 'dark' | 'light';

type ColorValue = any; // Tipagem de cor do stylesheet do react native

export function getThemeToken(
  theme: ThemeType,
  tokenName: keyof typeof darkTokens
): string | number | ColorValue {
  if (theme === 'dark') {
    return darkTokens[tokenName];
  }else if (theme === 'light') {
    return lightTokens[tokenName];
  }

  return defaultTokens[tokenName];
}
