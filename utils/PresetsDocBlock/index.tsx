import React from 'react';
import './styles.css';
import * as tokens from '../../built-tokens/js/tokens';
import * as presets from '../../token-presets';

import { toWebPreset } from '../../helpers/webOnlyHelpers';

const allPresets = { ...presets };

type PresetName = keyof typeof allPresets;

interface Preset {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  letterSpacing: number;
  lineHeight: number;
}

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
          {(Object.keys(allPresets) as PresetName[]).map((presetName) => {
            if (allPresets[presetName] === preset) return `$${presetName}`;
            return null;
          })}
        </div>
      </div>
      <div className="tokens">
        {(Object.keys(preset) as Array<keyof typeof preset>).map(
          (presetStyle) => {
            return (
              <div className="token" key={presetStyle}>
                <div className="key">{presetStyle}:</div>
                <div className="value">
                  {(Object.keys(tokens) as Array<keyof typeof tokens>).map(
                    (tokenName) => {
                      if (
                        tokens[tokenName] === preset[presetStyle] &&
                        tokenName
                          .toLowerCase()
                          .replace(/_/g, '')
                          .includes(presetStyle.toLowerCase())
                      ) {
                        return tokenName;
                      }
                      return null;
                    }
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
      <div className="preview" style={toWebPreset(preset)}>
        almost before we knew it, we had left the ground.
      </div>
    </div>
  );
};

export default PresetsDocBlock;
