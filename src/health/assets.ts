import {staticFile} from 'remotion';

// Conteo de variantes descargadas por 'base' (public/stock-health/).
// Fotos: 4 por base. Videos: 2 por base (solo en las bases con metraje).
const PHOTO_COUNT: Record<string, number> = {
  'fried-food': 4, 'grocery-budget': 4, 'leafy-greens': 4, 'lentils-beans': 4,
  'oatmeal-bowl': 4, 'oily-fish': 4, 'pastries': 4, 'processed-meat': 4,
  'salt-herbs': 4, 'senior-cooking': 4, 'senior-portrait': 4, 'sugary-drinks': 4,
  'water-tea': 4, 'yogurt': 4,
};
const VIDEO_COUNT: Record<string, number> = {
  'fried-food': 2, 'leafy-greens': 2, 'lentils-beans': 2, 'oatmeal-bowl': 2,
  'oily-fish': 2, 'processed-meat': 2, 'senior-cooking': 2, 'sugary-drinks': 2,
  'water-tea': 2, 'yogurt': 2,
};

const photoSrc = (base: string, n: number) =>
  staticFile(`stock-health/photos/${base}-${(n % (PHOTO_COUNT[base] || 1)) + 1}.jpg`);
const videoSrc = (base: string, n: number) =>
  staticFile(`stock-health/videos/${base}-${(n % (VIDEO_COUNT[base] || 1)) + 1}.mp4`);

// Resuelve una toma: intercala videos (primero, para dar movimiento) y luego fotos,
// ciclando por 'seed' (contador global) para no repetir la misma variante seguida.
export const mediaFor = (base: string, seed: number): {src: string; video: boolean} | null => {
  const vids = VIDEO_COUNT[base] ?? 0;
  const phts = PHOTO_COUNT[base] ?? 0;
  const total = vids + phts;
  if (total === 0) return null;
  const idx = seed % total;
  if (idx < vids) return {src: videoSrc(base, idx), video: true};
  return {src: photoSrc(base, idx - vids), video: false};
};
