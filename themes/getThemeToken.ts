import * as defaultTokens from '../built-tokens/js/semantic-tokens';
import * as darkTokens from '../built-tokens/js/dark-tokens';
import * as lightTokens from '../built-tokens/js/light-tokens';
import type { Theme } from './themes';

function getThemeToken(
  theme: Theme,
  tokenName: keyof typeof darkTokens
): string {
  if (theme === 'dark') {
    return darkTokens[tokenName];
  } else if (theme === 'light') {
    return lightTokens[tokenName];
  }

  return defaultTokens[tokenName];
}

export const getThemeTokenValue = (token: string, theme: Theme): string => {
  if (typeof token === 'string' && token.includes('DSA_COLOR')) {
    const regexpSize =
      /(DSA_COLOR_BACKGROUND_|DSA_COLOR_TEXT_|DSA_COLOR_BORDER_|DSA_COLOR_SPECIALPAGES_|DSA_COLOR_SUBJECTS_|DSA_COLOR_CONTENTBOX_|DSA_COLOR_HIGHLIGHT_|DSA_COLOR_BUTTON_|DSA_COLOR_FEEDBACK_)\w+/;
    const match = token.match(regexpSize);
    if (match !== null && match?.length > 0) {
      const value = getThemeToken(theme, match[0] as keyof typeof darkTokens);
      const tokenWithValue = token.replace(match[0], value);
      return tokenWithValue;
    }
  }
  return token;
};
