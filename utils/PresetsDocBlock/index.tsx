import React from 'react';
import './styles.css';
import * as tokens from '../../build/tokens/ts/tokens';
import * as presets from '../../token-presets';

import { toWebPreset } from '../../helpers/webOnlyHelpers';

interface PresetsDocBlockProps {
  name: string;
  preset: any;
}

const PresetsDocBlock: React.FC<PresetsDocBlockProps> = (props) => {
  const { name, preset } = props;

  return (
    <div className="presets-container">
      <div className="name">
        {name}
        <div className="token-name">
          {Object.keys(presets).map((key) => {
            if (presets[key] === preset) return key;
            return null;
          })}
        </div>
      </div>
      <div className="tokens">
        {Object.keys(preset).map((key) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div className="token">
              <div className="key">{key}:</div>
              <div className="value">
                {Object.keys(tokens).map((tokenKey) => {
                  if (
                    tokens[tokenKey] === preset[key] &&
                    tokenKey
                      .toLowerCase()
                      .replace(/_/g, '')
                      .includes(key.toLowerCase())
                  ) {
                    return tokenKey;
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="preview" style={toWebPreset(preset)}>
        almost before we knew it, we had left the ground.
      </div>
    </div>
  );
};

export default PresetsDocBlock;
