import {Easing} from 'remotion';

// ---------------------------------------------------------------------------
// Fonts are loaded via ../revios/fonts.css (base64 data URIs) imported by the
// composition, so rendering never performs a network/disk fetch.
// ---------------------------------------------------------------------------
export const FONT_TITLE = 'Montserrat';
export const FONT_MONO = 'JetBrains Mono';

// ---------------------------------------------------------------------------
// Brand palette — Ghost Spectre = neon purple ghost on black.
// Key names mirror the shared theme so the component library works unchanged
// (theme.red = brand primary).
// ---------------------------------------------------------------------------
export const theme = {
  bg: '#08060C',
  red: '#B24BFF', // brand primary (neon purple)
  redDeep: '#6A1FB0',
  cyan: '#35E0FF', // contrast accent for callouts
  amber: '#FFC24B', // ACCENT — only for the single key value
  green: '#2FD07A', // success / OK
  warn: '#FF5A3C', // warning / caution
  text: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.72)',
  panel: 'rgba(14,10,22,0.86)',
  panelBorder: 'rgba(255,255,255,0.14)',
  chipBg: 'rgba(6,5,10,0.92)',
  gradient: 'linear-gradient(135deg, #C86BFF 0%, #7A25C8 50%, #2A0A4A 100%)',
  gradientDark: 'linear-gradient(160deg, #1A0A2E 0%, #08060C 60%, #000000 100%)',
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
