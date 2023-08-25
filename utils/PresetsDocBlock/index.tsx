import React from 'react';
import './styles.css';
import * as tokens from '../../built-tokens/js/tokens';
import * as presets from '../../token-presets';

import { toWebPreset } from '../../helpers/webOnlyHelpers';
import { type Preset } from '../../token-presets';

const allPresets = { ...presets };

type PresetNames = keyof typeof allPresets;

interface PresetsDocBlockProps {
  name: string;
  preset: Preset;
}

const PresetsDocBlock: React.FC<PresetsDocBlockProps> = (props) => {
  const { name, preset } = props;

  return (
    <div className="presets-container">
      <div className="name">
        {name}
        <div className="token-name">
          {(Object.keys(allPresets) as PresetNames[]).map((key) => {
            if (allPresets[key] === preset) return key;
            return null;
          })}
        </div>
      </div>
      <div className="tokens">
        {(Object.keys(preset) as PresetNames[]).map((key) => {
          return (
            <div className="token" key={key}>
              <div className="key">{key}:</div>
              <div className="value">
                {(Object.keys(tokens)).map((tokenKey) => {
                  if (
                    tokens[tokenKey as keyof typeof tokens] === preset[key as keyof typeof preset] &&
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
