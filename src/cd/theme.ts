// Paleta y tipografía — cinematográfico oscuro estilo Lord Drawgr
export const FPS = 30;

export const COLORS = {
  bg: '#05070a',
  paper: '#ece7dc',    // crema/hueso (texto)
  ink: '#0a0d10',
  amber: '#e0a24a',    // ámbar apagado (luces)
  teal: '#2ea7a2',     // teal frío (sombras)
  red: '#c9483b',
  dim: 'rgba(236,231,220,0.6)',
};

// Tipografía elegante y sobria
export const FONT = `Georgia, 'Times New Roman', serif`;            // titulares serif
export const FONT_SANS = `'Helvetica Neue', Arial, sans-serif`;    // etiquetas
export const FONT_BODY = `'Helvetica Neue', Arial, sans-serif`;

export const accentColor = (a?: 'amber' | 'teal' | 'red' | 'paper') =>
  a === 'teal' ? COLORS.teal : a === 'red' ? COLORS.red : a === 'paper' ? COLORS.paper : COLORS.amber;
