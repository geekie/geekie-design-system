import React from 'react';
import './styles.css';
import { getThemeTokenValue } from '../../tokens';
import {
  DarkModeEnabledProvider,
  useDarkMode,
} from '../../themes/DarkModeEnabledContext';
import { type ThemeType } from '../../themes/themes';
import * as allTokens from '../../built-tokens/js/tokens';

type FontStyle = 'normal' | 'italic' | 'oblique';

interface Token {
  name: string;
  value: FontStyle | ThemeType | string;
}
interface CustomDesignTokenDocBlockProps {
  blockType: 'table';
  presenter: 'font-style' | 'color';
  previewType: 'text' | 'semantic-color';
  tokens: Token[];
}

const ThemeSwitch: React.FC = () => {
  const { theme, toggleDarkMode } = useDarkMode();

  return (
    <div className="theme-switch">
      <h3>Tema Atual | {theme}</h3>
      <div className="switch">
        <b>Ativar dark mode </b>
        <input
          type="checkbox"
          id="switch"
          checked={theme === 'dark'}
          onChange={toggleDarkMode}
        />
        <label htmlFor="switch">Toggle dark mode</label>
      </div>
    </div>
  );
};

const Block: React.FC<CustomDesignTokenDocBlockProps> = (props) => {
  const { blockType, presenter, previewType, tokens } = props;

  const { theme } = useDarkMode();

  return (
    <div className="design-token-container">
      <div className="design-token-card">
        <div className="block-type-container">
          {blockType === 'table' ? (
            <table className="block-type-table">
              <thead className="docblock-argstable-head">
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {tokens.map((token) => {
                  const tokenValue =
                    previewType === 'semantic-color'
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
                      <td>
                        <span>
                          <span className="">{token.name}</span>
                          <div className="copy-icon-container">
                            <span>
                              <button
                                className="copy-icon"
                                onClick={() => {
                                  void navigator.clipboard.writeText(
                                    token.name
                                  );
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
                        </span>
                      </td>
                      <td>
                        <div className="css-79elbk">
                          <span title="32px" className="css-16nf6wl">
                            {previewType === 'semantic-color' ? (
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
                            ) : null}
                            {tokenValue}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={previewType === 'text' ? previewStyle : {}}>
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

const CustomDesignTokenDocBlock: React.FC<CustomDesignTokenDocBlockProps> = (
  props
) => {
  const { previewType } = props;

  return previewType === 'semantic-color' ? (
    <DarkModeEnabledProvider>
      <ThemeSwitch />
      <Block {...props} />
    </DarkModeEnabledProvider>
  ) : (
    <Block {...props} />
  );
};

export default CustomDesignTokenDocBlock;
