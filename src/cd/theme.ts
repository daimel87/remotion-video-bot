// Paleta y tipografía — estilo MagnatesMedia adaptado al tema (audio vintage + digital)
export const FPS = 30;

export const COLORS = {
  bg: '#0d0b0a',        // negro cálido
  paper: '#f7f0e1',     // crema (texto claro)
  ink: '#14100c',       // tinta oscura (texto sobre ámbar)
  amber: '#ffb020',     // ámbar VU meter (acento principal)
  amberDeep: '#e8850c',
  teal: '#16c7c7',      // cian digital (acento secundario)
  red: '#ff3b30',
  dim: 'rgba(247,240,225,0.7)',
};

// Tipografía pesada/condensada tipo MagnatesMedia
export const FONT = `'Arial Black', 'Helvetica Neue', Impact, sans-serif`;
export const FONT_BODY = `'Helvetica Neue', Arial, sans-serif`;

export const accentColor = (a?: 'amber' | 'teal' | 'red' | 'paper') =>
  a === 'teal' ? COLORS.teal : a === 'red' ? COLORS.red : a === 'paper' ? COLORS.paper : COLORS.amber;
