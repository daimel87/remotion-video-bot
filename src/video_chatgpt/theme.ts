import {interpolate, spring} from 'remotion';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadJetBrains} from '@remotion/google-fonts/JetBrainsMono';

// Load brand fonts (async; fontFamily is usable immediately, glyphs swap in).
// Limit weights + subset to 'latin' (cubre acentos y ñ) para bajar peticiones.
export const montserrat = loadMontserrat('normal', {
  weights: ['700', '800', '900'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
}).fontFamily;
export const mono = loadJetBrains('normal', {
  weights: ['600', '700'],
  subsets: ['latin'],
  ignoreTooManyRequestsWarning: true,
}).fontFamily;

// ---- Brand identity: D-TECH USB (tech / dark / turquoise + amber) ----
export const theme = {
  bg: '#0A1020', // deep navy brand background
  panel: 'rgba(12, 18, 40, 0.86)', // legible backing over screenshots
  panelSolid: '#0C1228',
  border: 'rgba(34, 211, 238, 0.55)',
  primary: '#22D3EE', // turquoise — frames / graphics
  secondary: '#FFB020', // amber — secondary labels
  accent: '#FF3D71', // hot pink — SOLO el dato/valor clave de cada paso
  ok: '#22C55E', // éxito / verificación
  warn: '#F0483E', // aviso / error / "de pago"
  qwen: '#7C5CFF', // acento de la marca Qwen (botón enviar morado)
  text: '#EAF2FF',
  textDim: 'rgba(234, 242, 255, 0.75)',
  gradient: 'linear-gradient(135deg, #22D3EE 0%, #7C5CFF 100%)',
  shadow: '0 2px 8px rgba(0,0,0,0.6)',
  glow: (c: string) => `0 0 22px ${c}`,
};

export const F = {mont: montserrat, mono};

// ---- Easing helpers (nunca lineal) ----
export const animIn = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 200, stiffness: 170}});

// Ease-in salida al final de la sequence
export const animOut = (frame: number, dur: number, len = 10) =>
  interpolate(frame, [dur - len, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// Ciclo de vida completo entra/permanece/sale -> opacidad + desplazamiento
export const lifecycle = (
  frame: number,
  fps: number,
  dur: number,
  {delay = 0, outLen = 10}: {delay?: number; outLen?: number} = {}
) => {
  const enter = animIn(frame, fps, delay);
  const exit = animOut(frame, dur, outLen);
  return {enter, exit, opacity: enter * exit};
};
