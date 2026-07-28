import {staticFile} from 'remotion';

// ============================================================
// Resolvedor de material real para "Un MEXICANO de 23 Años le Dio COLOR a tu TV"
// (Guillermo González Camarena). Mismo mecanismo del CD/BlackBerry.
// public/stock-gc/{photos,videos}/  y  public/archival-gc/
// ============================================================

// Fotos por base (6 cada una).
const PHOTO_POOL: Record<string, number> = {
  'broadcast-tower': 6, 'child-electronics': 6, 'color-spectrum-prism': 6, 'engineer-workshop': 6,
  'family-tv-vintage': 6, 'guadalajara-city': 6, 'highway-mexico': 6, 'mexican-musician': 6,
  'mexico-city-skyline': 6, 'mexico-flag': 6, 'old-black-white-tv': 6, 'old-newspaper': 6,
  'old-office-files': 6, 'patent-document': 6, 'rgb-pixels-macro': 6, 'tube-radio': 6,
  'tv-static-noise': 6, 'tv-test-pattern': 6, 'university-engineering': 6, 'vintage-radio-parts': 6,
  'vintage-tv-workshop': 6, 'vintage-typewriter': 6,
};
// Videos por base (según lo realmente descargado; rgb-pixels-macro solo tiene 2).
const VIDEO_POOL: Record<string, number> = {
  'broadcast-tower': 3, 'color-spectrum-prism': 3, 'engineer-workshop': 3, 'family-tv-vintage': 3,
  'highway-mexico': 3, 'rgb-pixels-macro': 2, 'tv-static-noise': 3, 'tv-test-pattern': 3,
  'vintage-tv-workshop': 3,
};

export const hasPhoto = (base: string) => base in PHOTO_POOL;
export const hasVideo = (base: string) => base in VIDEO_POOL;

// LISTA NEGRA de variantes defectuosas (marca de agua, texto de stock, fuera de
// época o tema equivocado) detectadas en la revisión densa de frames.
const BLOCK_PHOTO: Record<string, number[]> = {
  'rgb-pixels-macro': [2, 3, 4, 6],       // "EDITORIAL ONLY", "Settings", videojuego, código
  'old-newspaper': [2, 4, 5, 6],          // "ISTANBUL", libro, diccionario, "Newspaper"
  'family-tv-vintage': [1, 2, 3, 5, 6],   // familias modernas (fuera de época); solo la 4 es de época
  'tv-test-pattern': [5],                 // gráfico de barras moderno
};
const BLOCK_VIDEO: Record<string, number[]> = {
  'family-tv-vintage': [1],               // pareja moderna
  'rgb-pixels-macro': [2],                // estática (mal etiquetada)
};

export const photoVariants = (base: string) =>
  Array.from({length: PHOTO_POOL[base] ?? 0}, (_, i) => i + 1)
    .filter((n) => !(BLOCK_PHOTO[base] ?? []).includes(n))
    .map((n) => staticFile(`stock-gc/photos/${base}-${n}.jpg`));
export const videoVariants = (base: string) =>
  Array.from({length: VIDEO_POOL[base] ?? 0}, (_, i) => i + 1)
    .filter((n) => !(BLOCK_VIDEO[base] ?? []).includes(n))
    .map((n) => staticFile(`stock-gc/videos/${base}-${n}.mp4`));

// Clips de ARCHIVO reales — id -> {duración total descargada (s), mejor punto de inicio (s)}.
// Todos verificados con contact-sheets (cuadro por cuadro) antes de usarse en el plan.
export const ARCHIVAL: Record<string, {dur: number; start: number}> = {
  'gc-documental': {dur: 150, start: 1},           // documental biográfico animado/archivo sobre GGC (incluye tarjeta "17 DE FEBRERO DE 1917" ~15s)
  'gc-historia-tv-color': {dur: 120, start: 1},
  'gc-canal5-xhgc': {dur: 110, start: 1},           // "Historia de la Televisión Mexicana" (VHS de época) + emblema XHGC Canal 5
  'gc-patente-noticia': {dur: 100, start: 1},
  'gc-tvunam': {dur: 100, start: 20},               // FOTOS REALES de GGC: trabajando (@20,@60), cara (@40), retrato de traje (@85)
  'gc-entrevista': {dur: 49, start: 10},            // Archivo General de la Nación: aparatos "construidos en México" (@20), laboratorio B/N (@30)
  'gc-canal5-1963': {dur: 38, start: 2},            // videotape REAL de la 1ra transmisión a color 1963 "Paraíso Infantil" XHGC (B/N)
  'mechanical-color-disc': {dur: 100, start: 1},
  'cbs-goldmark-1940': {dur: 100, start: 1},
  'rca-color-tv-1950s': {dur: 65, start: 1},
  'mexico-revolucion-1917': {dur: 90, start: 1},   // jinetes/tropas B/N reales (evitar >25s: aparece un presentador moderno)
  'mexico-city-1930s': {dur: 90, start: 1},
  'ipn-politecnico-historia': {dur: 90, start: 1},
  'vintage-tv-broadcast-mx': {dur: 100, start: 1},
  'voyager-nasa-images': {dur: 80, start: 1},
  'huapango-mexicano': {dur: 80, start: 1},
};
export const archivalSrc = (id: string) => staticFile(`archival-gc/${id}.mp4`);
