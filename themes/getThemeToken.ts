import * as defaultTokens from '../built-tokens/js/semantic-tokens';
import * as darkTokens from '../built-tokens/js/dark-tokens';
import * as lightTokens from '../built-tokens/js/light-tokens';
import type { ThemeType } from './themes';

function getThemeToken(
  theme: ThemeType,
  tokenName: keyof typeof darkTokens
): string {
  if (theme === 'dark') {
    return darkTokens[tokenName];
  } else if (theme === 'light') {
    return lightTokens[tokenName];
  }

  return defaultTokens[tokenName];
}

export const getThemeTokenValue = (token: string, theme: ThemeType): string => {
  if (typeof token === 'string' && token.includes('DSA_COLOR')) {
    const regexpSize = /(DSA_COLOR_TEXT_|DSA_COLOR_BG_|DSA_COLOR_BORDER_|DSA_COLOR_SUBJECT_)\w+/;
    const match = token.match(regexpSize);
    if (match !== null && match?.length > 0) {
      const value = getThemeToken(theme, match[0] as keyof typeof darkTokens);
      const tokenWithValue = token.replace(match[0], value);
      return tokenWithValue;
    }
  }
  return token;
};
