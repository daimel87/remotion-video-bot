import {Easing} from 'remotion';

// ---------------------------------------------------------------------------
// Fonts are embedded as base64 data URIs in ./fonts.css (imported by the
// composition) so rendering never performs a network/disk fetch that could
// hang the headless browser. A FontGate waits for document.fonts.ready.
// ---------------------------------------------------------------------------
export const FONT_TITLE = 'Montserrat';
export const FONT_MONO = 'JetBrains Mono';

// ---------------------------------------------------------------------------
// Brand palette — ReviOS / Revision = bright red on near-black
// ---------------------------------------------------------------------------
export const theme = {
  bg: '#0A0A0C',
  red: '#FF2740', // brand primary
  redDeep: '#C40E20',
  cyan: '#28E0D8', // contrast accent for callouts over red UI
  amber: '#FFC24B', // ACCENT — only for the single key value per step
  green: '#2FD07A', // success / OK
  warn: '#FF5A3C', // warning / error
  text: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.72)',
  panel: 'rgba(16,14,20,0.86)',
  panelBorder: 'rgba(255,255,255,0.14)',
  chipBg: 'rgba(8,8,10,0.92)',
  gradient: 'linear-gradient(135deg, #FF2740 0%, #C40E20 45%, #1A0608 100%)',
  gradientDark: 'linear-gradient(160deg, #16060A 0%, #0A0A0C 60%, #000000 100%)',
} as const;

// Shared shadows / backdrop for legibility over busy screenshots
export const panelShadow = '0 12px 40px rgba(0,0,0,0.55)';
export const textShadow = '0 2px 10px rgba(0,0,0,0.75)';
export const panelBackdrop = 'blur(9px)';

// ---------------------------------------------------------------------------
// Easing helpers — professional in/out, never linear
// ---------------------------------------------------------------------------
export const easeOut = Easing.out(Easing.cubic); // entrances
export const easeIn = Easing.in(Easing.cubic); // exits
export const easeInOut = Easing.inOut(Easing.cubic);
export const backOut = Easing.out(Easing.back(1.5)); // snappy pop
