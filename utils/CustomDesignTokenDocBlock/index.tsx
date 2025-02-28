import React from 'react';
import './styles.css';
import { getThemeTokenValue } from '../../tokens';
import {
  DarkModeEnabledProvider,
  useDarkMode,
} from '../../themes/DarkModeEnabledContext';
import { type Theme } from '../../themes/themes';
import * as allTokens from '../../built-tokens/js/tokens';
import AsyncStorage from '@react-native-community/async-storage';

type FontStyle = 'normal' | 'italic' | 'oblique';

interface Token {
  name: string;
  value: FontStyle | Theme | string;
}
interface CustomDesignTokenDocBlockProps {
  blockType: 'table';
  presenter: 'font-style' | 'color' | 'breakpoint';
  previewType: 'text' | 'semantic-color' | undefined;
  tokens: Token[];
  categories?: string[];
  useLeftCopyIcon: boolean;
}
interface CopyIconProps {
  token: Token;
}

interface ThemeSwitchProps {
  hideTitle: boolean;
}

const ThemeSwitch: React.FC<ThemeSwitchProps> = (props) => {
  const { hideTitle } = props;
  const { theme, setTheme } = useDarkMode();

  return (
    <div className="theme-switch">
      {!hideTitle ? (
        <h3>Tema Atual | {theme === 'light' ? 'modo claro' : 'modo escuro'}</h3>
      ) : (
        <div />
      )}
      <div className="switch">
        <b>{theme === 'light' ? 'Ativar' : 'Desativar'} modo escuro </b>
        <input
          type="checkbox"
          id="switch"
          checked={theme === 'dark'}
          onChange={() => {
            setTheme(theme === 'light' ? 'dark' : 'light');
          }}
        />
        <label htmlFor="switch">Ativar modo escuro</label>
      </div>
    </div>
  );
};

const CopyIcon: React.FC<CopyIconProps> = (props) => {
  const { token } = props;

  return (
    <div className="copy-icon-container">
      <span>
        <button
          className="copy-icon"
          onClick={() => {
            void navigator.clipboard.writeText(token.name);
          }}
        >
          <svg
            viewBox="0 0 14 14"
            width="14px"
            height="14px"
            className="css-149xqrd"
          >
            <path
              fillRule="evenodd"
              d="M11.75.07A.5.5 0 0 0 11.5 0h-6a.5.5 0 0 0-.5.5V3H.5a.5.5 0 0 0-.5.5v10c0 .28.22.5.5.5h8a.5.5 0 0 0 .5-.5V11h4.5a.5.5 0 0 0 .5-.5V2.51a.5.5 0 0 0-.15-.36l-2-2a.5.5 0 0 0-.1-.08ZM9 10h4V3h-1.5a.5.5 0 0 1-.5-.5V1H6v2h.5a.5.5 0 0 1 .36.15l1.99 2c.1.09.15.21.15.35v4.51ZM1 4v9h7V6H6.5a.5.5 0 0 1-.5-.5V4H1Z"
            ></path>
          </svg>
        </button>
      </span>
    </div>
  );
};

const Block: React.FC<CustomDesignTokenDocBlockProps> = (props) => {
  const { blockType, presenter, previewType, tokens, useLeftCopyIcon } = props;

  const { theme } = useDarkMode();

  const isSemantic = previewType === 'semantic-color';
  const hasPreview = previewType !== undefined;

  return (
    <div className="design-token-container">
      <div className="design-token-card">
        <div className="block-type-container">
          {blockType === 'table' ? (
            <table className="block-type-table">
              <thead className="docblock-argstable-head">
                <tr>
                  <th className={isSemantic ? 'isSemantic' : ''}>Name</th>
                  {isSemantic ? (
                    <th className={isSemantic ? 'isSemantic' : ''}>
                      Core Token
                    </th>
                  ) : null}
                  <th className={isSemantic ? 'isSemantic' : ''}>Value</th>
                  {hasPreview && (
                    <th className={isSemantic ? 'isSemantic' : ''}>Preview</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => {
                  const tokenValue = isSemantic
                    ? getThemeTokenValue(token.value, theme)
                    : token.value;

                  const previewStyle =
                    presenter === 'font-style'
                      ? { fontStyle: tokenValue }
                      : presenter === 'color'
                      ? {
                          backgroundColor: tokenValue,
                        }
                      : {};

                  return (
                    <tr key={token.name}>
                      <td className={isSemantic ? 'isSemantic' : ''}>
                        <span>
                          {useLeftCopyIcon ? <CopyIcon token={token} /> : null}
                          <span className="">{token.name}</span>
                          {!useLeftCopyIcon ? <CopyIcon token={token} /> : null}
                        </span>
                      </td>
                      {isSemantic ? (
                        <td className={isSemantic ? 'isSemantic' : ''}>
                          <div className="css-79elbk">
                            <span className="css-16nf6wl">
                              <div className="tokenName">
                                {(
                                  Object.keys(allTokens) as Array<
                                    keyof typeof allTokens
                                  >
                                ).map((tokenName) => {
                                  if (allTokens[tokenName] === tokenValue) {
                                    return `$${tokenName}`;
                                  }
                                  return null;
                                })}
                              </div>
                            </span>
                          </div>
                        </td>
                      ) : null}
                      <td className={isSemantic ? 'isSemantic' : ''}>
                        <div className="css-79elbk">
                          <span title="32px" className="css-16nf6wl">
                            {tokenValue}
                          </span>
                        </div>
                      </td>
                      {hasPreview && (
                        <td className={isSemantic ? 'isSemantic' : ''}>
                          <div
                            style={previewType === 'text' ? previewStyle : {}}
                          >
                            {previewType === 'text' ? (
                              'Lorem ipsum'
                            ) : previewType === 'semantic-color' ? (
                              <div className="color-block-container">
                                <div
                                  className="color-block"
                                  style={previewStyle}
                                />
                              </div>
                            ) : null}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const BlockWithCategory: React.FC<CustomDesignTokenDocBlockProps> = (props) => {
  const { categories, tokens } = props;

  if (
    categories !== null &&
    categories !== undefined &&
    categories.length > 0
  ) {
    return categories.map((category) => {
      const formattedCategory = [
        ...category
          .replaceAll('DSA_COLOR_', '')
          .replaceAll('_', '')
          .toLowerCase(),
      ];
      formattedCategory[0] = formattedCategory[0].toUpperCase();
      let categoryName = formattedCategory.join('');
      if (category === 'DSA_COLOR_SPECIALPAGES_') {
        categoryName = 'Special Pages';
      } else if (category === 'DSA_COLOR_CONTENTBOX_') {
        categoryName = 'Content Box';
      }
      return (
        <div key={category} style={{ marginTop: 20 }}>
          <h3
            style={
              categories.indexOf(category) > 0
                ? { marginBottom: -60, marginTop: 40 }
                : {}
            }
          >
            {categoryName} Color
          </h3>
          {categories.indexOf(category) > 0 ? <ThemeSwitch hideTitle /> : null}
          <Block
            {...props}
            tokens={tokens.filter((token) => token.name.startsWith(category))}
          />
        </div>
      );
    });
  } else {
    return <Block {...props} />;
  }
};

const CustomDesignTokenDocBlock: React.FC<CustomDesignTokenDocBlockProps> = (
  props
) => {
  const { previewType } = props;

  const getPersistedTheme = async (): Promise<Theme | null> => {
    return (await AsyncStorage.getItem('dsa_theme')) as Theme | null;
  };

  const setPersistedTheme = async (value: Theme): Promise<void> => {
    await AsyncStorage.setItem('dsa_theme', value);
  };

  return previewType === 'semantic-color' ? (
    <DarkModeEnabledProvider
      getPersistedTheme={getPersistedTheme}
      setPersistedTheme={setPersistedTheme}
    >
      <ThemeSwitch hideTitle={false} />

      <BlockWithCategory {...props} />
    </DarkModeEnabledProvider>
  ) : (
    <Block {...props} />
  );
};

export default CustomDesignTokenDocBlock;
