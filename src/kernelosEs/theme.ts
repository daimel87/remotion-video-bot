import {Easing} from 'remotion';

// ---------------------------------------------------------------------------
// Fonts are loaded via ../revios/fonts.css (base64 data URIs) imported by the
// composition, so rendering never performs a network/disk fetch.
// ---------------------------------------------------------------------------
export const FONT_TITLE = 'Montserrat';
export const FONT_MONO = 'JetBrains Mono';

// ---------------------------------------------------------------------------
// Brand palette — KernelOS = the real in-app branding: a gold oni-mask
// mark on near-black, samurai/gaming aesthetic. Key names mirror the
// shared theme shape so the component library works unchanged
// (theme.red = brand primary).
// ---------------------------------------------------------------------------
export const theme = {
  bg: '#0A0806',
  red: '#D4AF37', // brand primary (metallic gold — matches the KernelOS mark)
  redDeep: '#8A6D1F',
  cyan: '#E63946', // contrast accent for callouts (blood red)
  amber: '#FFD700', // ACCENT — only for the single key value
  green: '#2ECC71', // success / OK
  warn: '#FF4B4B', // warning / caution
  text: '#FFFFFF',
  textDim: 'rgba(255,255,255,0.72)',
  panel: 'rgba(16,12,6,0.86)',
  panelBorder: 'rgba(255,255,255,0.14)',
  chipBg: 'rgba(10,8,6,0.92)',
  gradient: 'linear-gradient(135deg, #F0D060 0%, #D4AF37 50%, #6B5216 100%)',
  gradientDark: 'linear-gradient(160deg, #1C1608 0%, #0A0806 60%, #000000 100%)',
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
