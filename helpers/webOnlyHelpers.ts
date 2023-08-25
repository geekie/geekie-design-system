const toPx = (value: number | string): string => {
  return `${value}px`;
};

// Essa função foi criada para resolver o uso do line-height em casos web-only
export const toWebToken = (token: number): string => {
  return toPx(token);
};

// Essa função foi criada para resolver o uso dos presets em casos web-only
export const toWebPreset = <Preset extends { lineHeight: number }>(
  preset: Preset
): Preset & { lineHeight: string } => {
  return { ...preset, lineHeight: toPx(preset.lineHeight) };
};
