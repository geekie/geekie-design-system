import * as defaultTokens from './built-tokens/js/semantic-tokens';
import * as darkTokens from './built-tokens/js/dark-tokens';
import * as lightTokens from './built-tokens/js/light-tokens';

type ThemeType = 'dark' | 'light';

export const themes: ThemeType[] = ['dark', 'light'];

type OpaqueColorValue = symbol & { __TYPE__: 'Color' };
export type ColorValue = string | OpaqueColorValue;

export function getThemeToken(
  theme: ThemeType,
  tokenName: keyof typeof darkTokens
): string | number | ColorValue {
  if (theme === 'dark') {
    return darkTokens[tokenName];
  } else if (theme === 'light') {
    return lightTokens[tokenName];
  }

  return defaultTokens[tokenName];
}
