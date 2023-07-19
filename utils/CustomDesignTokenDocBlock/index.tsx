import React from "react";
import "./styles.css";

type FontStyle = "normal" | "italic" | "oblique";

type Token = {
  name: string;
  value: string | number | FontStyle;
};

type CustomDesignTokenDocBlockProps = {
  blockType: "table";
  presenter: "font-style";
  previewType: "text";
  tokens: Array<Token>;
};

const CustomDesignTokenDocBlock = (props: CustomDesignTokenDocBlockProps) => {
  const { blockType, presenter, previewType, tokens } = props;

  return (
    <div className="design-token-container">
      <div className="design-token-card">
        <div className="block-type-container">
          {blockType === "table" ? (
            <table className="block-type-table">
              <thead className="docblock-argstable-head">
                <tr>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Preview</th>
                </tr>
              </thead>
              <tbody>
                {tokens
                  ? tokens.map((token) => {
                      const previewStyle =
                        presenter === "font-style"
                          ? { fontStyle: token.value as FontStyle }
                          : {};

                      return (
                        <tr>
                          <td>
                            <span>
                              <span className="">{token.name}</span>
                              <div className="copy-icon-container">
                                <span>
                                  <button
                                    className="copy-icon"
                                    onClick={() =>
                                      navigator.clipboard.writeText(token.name)
                                    }
                                  >
                                    <svg
                                      viewBox="0 0 14 14"
                                      width="14px"
                                      height="14px"
                                      className="css-149xqrd"
                                    >
                                      <path
                                        fill-rule="evenodd"
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
                                {token.value}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div style={previewStyle}>Lorem ipsum</div>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CustomDesignTokenDocBlock;
