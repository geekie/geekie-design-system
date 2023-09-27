export * from './basic';
export * from './ludic';
export * from './reading';

export interface Preset {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  letterSpacing: number;
  lineHeight: number;
}

export type WebPreset = Omit<Preset, 'lineHeight'> & {
  lineHeight: string;
};
