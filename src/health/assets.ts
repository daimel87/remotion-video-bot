import {staticFile} from 'remotion';

// Conteo de variantes descargadas por 'base' (public/stock-health/).
// Fotos: 4 por base. Videos: 2 por base (solo en las bases con metraje).
// (Si re-descargas con más variantes, sube estos números y listo.)
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

const photoSrc = (base: string, n: number) => staticFile(`stock-health/photos/${base}-${n}.jpg`);
const videoSrc = (base: string, n: number) => staticFile(`stock-health/videos/${base}-${n}.mp4`);

export interface Variant {src: string; video: boolean;}

// Todas las variantes de una base (videos primero, para dar movimiento; luego fotos).
export const variantsOf = (base: string): Variant[] => {
  const out: Variant[] = [];
  for (let i = 1; i <= (VIDEO_COUNT[base] ?? 0); i++) out.push({src: videoSrc(base, i), video: true});
  for (let i = 1; i <= (PHOTO_COUNT[base] ?? 0); i++) out.push({src: photoSrc(base, i), video: false});
  return out;
};

export const hasMedia = (base: string) => (VIDEO_COUNT[base] ?? 0) + (PHOTO_COUNT[base] ?? 0) > 0;
