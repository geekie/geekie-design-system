import { type Preset } from '../token-presets';

const toPx = (value: number | string): string => {
  return `${value}px`;
};

// Essa função foi criada para resolver o uso do line-height em casos web-only
export const toWebToken = (token: number): string => {
  return toPx(token);
};

// Essa função foi criada para resolver o uso dos presets em casos web-only
export const toWebPreset = (preset: Preset): Preset => {
  const webPreset = { ...preset };

  (Object.keys(preset) as Array<keyof Preset>).map((style) => {
    if (
      style === 'fontSize' ||
      style === 'lineHeight' ||
      style === 'letterSpacing'
    ) {
      return (webPreset[style] = toPx(preset[style]));
    } else {
      return (webPreset[style] = preset[style]);
    }
  });

  return webPreset;
};
