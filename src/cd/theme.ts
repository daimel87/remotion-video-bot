// Paleta y tipografía del documental premium "¿Por qué desapareció el CD?"
export const FPS = 30;

export const COLORS = {
  bg: '#0a0a0c',
  ink: '#ffffff',
  red: '#ff2b2b',
  redDeep: '#c30f0f',
  gold: '#ffc333',
  dim: 'rgba(255,255,255,0.65)',
};

export const FONT = `'Arial Black', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
export const FONT_BODY = `'Helvetica Neue', Helvetica, Arial, sans-serif`;

export const accentColor = (a?: 'red' | 'gold' | 'white') =>
  a === 'gold' ? COLORS.gold : a === 'white' ? COLORS.ink : COLORS.red;
