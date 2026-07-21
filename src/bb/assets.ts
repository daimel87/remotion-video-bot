import {staticFile} from 'remotion';

// ============================================================
// Resolvedor de material real para "La historia de BlackBerry".
// Mismo mecanismo del CD: fotos + videos de stock por 'base', y clips de
// ARCHIVO forzados por cue. Todas las variantes se reparten sin repetir.
// public/stock-bb/{photos,videos}/  y  public/archival-bb/
// ============================================================

// Fotos por base (4 cada una, según lo descargado).
const PHOTO_POOL: Record<string, number> = {
  'boardroom-execs': 4, 'business-phone': 4, 'canada-waterloo': 4, 'city-commuters': 4,
  'email-screen': 4, 'empty-office': 4, 'factory-tech': 4, 'office-corporate': 4,
  'old-phones': 4, 'qwerty-phone': 4, 'security-encryption': 4, 'server-room': 4,
  'smartphone-modern': 4, 'stock-market': 4, 'texting-hands': 4, 'wall-street': 4,
};
// Videos por base (2 cada una).
const VIDEO_POOL: Record<string, number> = {
  'business-phone': 2, 'city-commuters': 2, 'factory-tech': 2, 'office-corporate': 2,
  'server-room': 2, 'smartphone-modern': 2, 'stock-market': 2, 'texting-hands': 2,
};

export const hasPhoto = (base: string) => base in PHOTO_POOL;
export const hasVideo = (base: string) => base in VIDEO_POOL;

export const photoVariants = (base: string) =>
  Array.from({length: PHOTO_POOL[base] ?? 0}, (_, i) => staticFile(`stock-bb/photos/${base}-${i + 1}.jpg`));
export const videoVariants = (base: string) =>
  Array.from({length: VIDEO_POOL[base] ?? 0}, (_, i) => staticFile(`stock-bb/videos/${base}-${i + 1}.mp4`));

// Clips de ARCHIVO reales — id -> {duración total (s), mejor punto de inicio (s)}.
export const ARCHIVAL: Record<string, {dur: number; start: number}> = {
  'rim-founders': {dur: 90, start: 4},
  'blackberry-850-1999': {dur: 18, start: 1},
  'two-way-pager-90s': {dur: 60, start: 3},
  'blackberry-ad-2000s': {dur: 60, start: 3},
  'crackberry-news': {dur: 90, start: 4},
  'blackberry-keyboard': {dur: 60, start: 2},
  'bbm-messenger': {dur: 60, start: 3},
  'obama-blackberry': {dur: 46, start: 2},
  'wall-street-bb': {dur: 60, start: 3},
  'iphone-2007-keynote': {dur: 120, start: 3},
  'rim-reaction-iphone': {dur: 84, start: 3},
  'blackberry-storm': {dur: 90, start: 4},
  'bb-outage-2011': {dur: 60, start: 3},
  'rim-layoffs-news': {dur: 90, start: 4},
  'blackberry-10-launch': {dur: 90, start: 4},
  'bb-stops-phones-2016': {dur: 25, start: 1},
  // --- nuevos modelos (unboxings / eventos) ---
  'bb-bold-9000': {dur: 76, start: 0},
  'bb-pearl-8100': {dur: 68, start: 4},
  'bb-bold-9900': {dur: 150, start: 0},
  'bb-curve-8520': {dur: 140, start: 0},
  'bb-torch-9800': {dur: 150, start: 6},
};
export const archivalSrc = (id: string) => staticFile(`archival-bb/${id}.mp4`);
