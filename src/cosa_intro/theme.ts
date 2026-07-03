import {Easing} from 'remotion';

export const theme = {
  font: 'Helvetica, Arial, sans-serif',
  bg: '#0a0a12',
  accent: '#ff3c3c',
  accentGlow: 'rgba(255,60,60,0.7)',
  text: '#ffffff',
  textDim: '#cccccc',
  panel: 'rgba(10,12,25,0.86)',
  panelBorder: 'rgba(255,60,60,0.45)',
};

// Easing profesional: entradas ease-out, salidas ease-in
export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);

// Ciclo de vida: 0 antes de `inAt`, sube a 1 (ease-out), permanece, baja a 0 (ease-in)
export const lifecycle = (
  frame: number,
  inAt: number,
  inDur: number,
  outAt: number,
  outDur: number
): number => {
  if (frame < inAt) return 0;
  if (frame < inAt + inDur) {
    const t = (frame - inAt) / inDur;
    return easeOut(Math.min(1, Math.max(0, t)));
  }
  if (frame < outAt) return 1;
  if (frame < outAt + outDur) {
    const t = (frame - outAt) / outDur;
    return 1 - easeIn(Math.min(1, Math.max(0, t)));
  }
  return 0;
};
