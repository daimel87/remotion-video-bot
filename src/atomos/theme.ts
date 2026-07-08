import {Easing} from 'remotion';

// ---------------------------------------------------------------------------
// Fonts are loaded via ../revios/fonts.css (base64 data URIs) imported by the
// composition, so rendering never performs a network/disk fetch.
// ---------------------------------------------------------------------------
export const FONT_TITLE = 'Montserrat';
export const FONT_MONO = 'JetBrains Mono';

// ---------------------------------------------------------------------------
// Brand palette — AtomOS / Project Atom = electric blue on dark navy,
// with an orange "atom" accent. Key names mirror the ReviOS theme so the
// shared component library works unchanged (theme.red = brand primary).
// ---------------------------------------------------------------------------
export const theme = {
  bg: '#080B14',
  red: '#2E82FF', // brand primary (blue)
  redDeep: '#0B4FCC',
  cyan: '#35E0FF', // contrast accent for callouts
  amber: '#FF9A2E', // ACCENT — the atom orange, only for the single key value
  green: '#2FD07A', // success / OK
  warn: '#FF5A3C', // warning / caution
  text: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.72)',
  panel: 'rgba(10,14,26,0.86)',
  panelBorder: 'rgba(255,255,255,0.14)',
  chipBg: 'rgba(6,9,16,0.92)',
  gradient: 'linear-gradient(135deg, #35A0FF 0%, #0B4FCC 50%, #071233 100%)',
  gradientDark: 'linear-gradient(160deg, #0A1836 0%, #080B14 60%, #000000 100%)',
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
