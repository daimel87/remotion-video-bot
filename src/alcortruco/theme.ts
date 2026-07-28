import {Easing} from 'remotion';

// ---------------------------------------------------------------------------
// Fonts are loaded via ../revios/fonts.css (base64 data URIs) imported by the
// composition, so rendering never performs a network/disk fetch.
// ---------------------------------------------------------------------------
export const FONT_TITLE = 'Montserrat';
export const FONT_MONO = 'JetBrains Mono';

// ---------------------------------------------------------------------------
// Brand palette — Alcor Truco = repair-shop workbench: electric orange
// (solder / tool) primary, circuit-blue accent, dark graphite background.
// Key names mirror the shared theme so the component library works unchanged
// (theme.red = brand primary).
// ---------------------------------------------------------------------------
export const theme = {
  bg: '#07090D',
  red: '#FF7A1A', // brand primary (electric orange — tools/repair)
  redDeep: '#B34E00',
  cyan: '#29D3FF', // contrast accent (circuit blue)
  amber: '#FFD447', // ACCENT — only for the single key value (VID/PID)
  green: '#31E17A', // success / OK
  warn: '#FF3B3B', // warning / not detected / caution
  text: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.72)',
  panel: 'rgba(10,12,18,0.86)',
  panelBorder: 'rgba(255,255,255,0.14)',
  chipBg: 'rgba(5,6,10,0.92)',
  gradient: 'linear-gradient(135deg, #FFA34D 0%, #FF7A1A 50%, #7A2E00 100%)',
  gradientDark: 'linear-gradient(160deg, #12141C 0%, #07090D 60%, #000000 100%)',
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
