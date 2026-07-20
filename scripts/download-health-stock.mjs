#!/usr/bin/env node
/**
 * Descarga fotos y videos stock de Pexels para el CANAL DE SALUD (seniors 50+).
 * Mismo funcionamiento que el del CD, pero con TOPE DE 25 MB por archivo.
 *
 * Uso (en cmd, dentro de la carpeta del proyecto):
 *   git pull
 *   node scripts/download-health-stock.mjs TU_CLAVE_DE_PEXELS
 *
 * - La clave se pasa como argumento (o variable de entorno PEXELS_KEY).
 * - Cada archivo pesa MENOS de 25 MB: antes de bajar un video se consulta su
 *   tamaño (HEAD) y se elige la MEJOR calidad que quede bajo el tope.
 * - Reanudable: omite lo que ya esté descargado.
 * - Descarga a: public/stock-health/photos  y  public/stock-health/videos
 *   Cada archivo se nombra por su 'base' (la palabra clave de src/health/plan.ts),
 *   p.ej. oatmeal-bowl-1.jpg, para que la plantilla lo encuentre directo.
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// La clave se puede pasar como argumento:  node scripts/download-health-stock.mjs TU_CLAVE
const PEXELS_KEY = process.argv[2] || process.env.PEXELS_KEY;
if (!PEXELS_KEY) {
  console.error('Falta la clave de Pexels.');
  console.error('Uso:  node scripts/download-health-stock.mjs TU_CLAVE_DE_PEXELS');
  process.exit(1);
}

const MAX_BYTES = 25 * 1024 * 1024; // TOPE: 25 MB por archivo

// ---- CONFIGURACIÓN: búsquedas mapeadas al guion "5 alimentos que sí + 5 que no" ----
// {base, q}: base = palabra clave del plan; q = búsqueda en Pexels.
const CONFIG = {
  photos: {
    perQuery: 4,               // cuántas fotos por búsqueda
    orientation: 'landscape',
    minWidth: 1920,            // ancho suficiente para 1080p
    queries: [
      // --- 5 alimentos BUENOS ---
      {base: 'oatmeal-bowl', q: 'oatmeal porridge cinnamon fruit'},
      {base: 'lentils-beans', q: 'lentils beans chickpeas bowl'},
      {base: 'oily-fish', q: 'grilled salmon sardines plate'},
      {base: 'leafy-greens', q: 'spinach leafy greens vegetables'},
      {base: 'yogurt', q: 'plain yogurt bowl fruit'},
      // --- 5 alimentos a MODERAR ---
      {base: 'processed-meat', q: 'sausages ham cold cuts'},
      {base: 'sugary-drinks', q: 'soda sugary drinks glass'},
      {base: 'fried-food', q: 'fried food greasy'},
      {base: 'pastries', q: 'packaged pastries cookies sweets'},
      {base: 'salt-herbs', q: 'salt shaker herbs spices'},
      // --- apoyo / contexto ---
      {base: 'water-tea', q: 'glass of water herbal tea'},
      {base: 'senior-portrait', q: 'happy senior person portrait'},
      {base: 'grocery-budget', q: 'grocery shopping vegetables budget'},
      {base: 'senior-cooking', q: 'senior woman cooking kitchen'},
    ],
  },
  videos: {
    perQuery: 2,               // cuántos videos por búsqueda
    orientation: 'landscape',
    minWidth: 1280,            // permite HD 720p (más liviano) para caber bajo 25 MB
    queries: [
      {base: 'oatmeal-bowl', q: 'stirring oatmeal breakfast'},
      {base: 'lentils-beans', q: 'lentil soup simmering pot'},
      {base: 'oily-fish', q: 'cooking fish pan'},
      {base: 'leafy-greens', q: 'washing green vegetables'},
      {base: 'yogurt', q: 'spoon yogurt bowl'},
      {base: 'processed-meat', q: 'sausages frying pan'},
      {base: 'sugary-drinks', q: 'pouring soda glass'},
      {base: 'fried-food', q: 'deep frying food oil'},
      {base: 'senior-cooking', q: 'elderly person cooking kitchen'},
      {base: 'water-tea', q: 'pouring tea cup'},
    ],
  },
};
// -----------------------------------------------------------------

const PHOTOS_DIR = path.join(ROOT, 'public', 'stock-health', 'photos');
const VIDEOS_DIR = path.join(ROOT, 'public', 'stock-health', 'videos');
fs.mkdirSync(PHOTOS_DIR, {recursive: true});
fs.mkdirSync(VIDEOS_DIR, {recursive: true});

async function api(url) {
  const res = await fetch(url, {headers: {Authorization: PEXELS_KEY}});
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Descarga ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

// Tamaño remoto (Content-Length) sin descargar el archivo.
async function remoteSize(url) {
  try {
    const res = await fetch(url, {method: 'HEAD'});
    const len = res.headers.get('content-length');
    return len ? parseInt(len, 10) : null;
  } catch {
    return null;
  }
}

// ¿Ya están todos los archivos esperados de esta base? (para reanudar)
function baseComplete(dir, base, perQuery, ext) {
  for (let i = 1; i <= perQuery; i++) {
    if (!fs.existsSync(path.join(dir, `${base}-${i}.${ext}`))) return false;
  }
  return true;
}

async function fetchPhotos() {
  const {queries, perQuery, orientation, minWidth} = CONFIG.photos;
  const credits = [];
  for (const {base, q} of queries) {
    if (baseComplete(PHOTOS_DIR, base, perQuery, 'jpg')) {
      console.log(`\n📷  ${base}  ⏭  (ya descargadas)`);
      continue;
    }
    console.log(`\n📷  ${base}  ("${q}")`);
    try {
      const data = await api(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${perQuery}&orientation=${orientation}`);
      let i = 0;
      for (const photo of data.photos ?? []) {
        if (photo.width < minWidth) continue;
        i++;
        const dest = path.join(PHOTOS_DIR, `${base}-${i}.jpg`);
        if (fs.existsSync(dest)) continue;
        // 'large' (~1600px) pesa poco y sobra para 1080p; siempre bajo 25 MB.
        const url = photo.src.large2x || photo.src.large || photo.src.original;
        try {
          const bytes = await download(url, dest);
          console.log(`   ✓ ${base}-${i}.jpg (${(bytes / 1024).toFixed(0)} KB) — ${photo.photographer}`);
          credits.push(`${base}-${i}.jpg: foto por ${photo.photographer} (${photo.url})`);
        } catch (e) {
          console.log(`   ✗ Falló ${base}-${i}.jpg: ${e.message}`);
        }
      }
    } catch (e) {
      console.log(`   ✗ Falló "${q}": ${e.message}`);
    }
  }
  return credits;
}

async function fetchVideos() {
  const {queries, perQuery, orientation, minWidth} = CONFIG.videos;
  const credits = [];
  for (const {base, q} of queries) {
    if (baseComplete(VIDEOS_DIR, base, perQuery, 'mp4')) {
      console.log(`\n🎬  ${base}  ⏭  (ya descargados)`);
      continue;
    }
    console.log(`\n🎬  ${base}  ("${q}")`);
    try {
      const data = await api(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=${perQuery}&orientation=${orientation}`);
      let i = 0;
      for (const video of data.videos ?? []) {
        // renditions mp4 ordenadas de mayor a menor calidad
        const files = (video.video_files ?? [])
          .filter((f) => f.file_type === 'video/mp4')
          .sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
        if (!files.length) continue;

        // elige la MEJOR calidad (>= minWidth de preferencia) que quede bajo 25 MB
        let chosen = null, chosenBytes = 0;
        const preferred = files.filter((f) => (f.width ?? 0) >= minWidth);
        const ordered = [...preferred, ...files.filter((f) => (f.width ?? 0) < minWidth)];
        for (const f of ordered) {
          const size = await remoteSize(f.link);
          if (size == null) continue;         // sin tamaño conocido: probamos el siguiente
          if (size <= MAX_BYTES) {chosen = f; chosenBytes = size; break;}
        }
        if (!chosen) {
          console.log(`   ⚠ ${base}: ninguna versión quedó bajo 25 MB, se omite este clip`);
          continue;
        }
        i++;
        const dest = path.join(VIDEOS_DIR, `${base}-${i}.mp4`);
        if (fs.existsSync(dest)) continue;
        try {
          const bytes = await download(chosen.link, dest);
          console.log(`   ✓ ${base}-${i}.mp4 (${(bytes / 1048576).toFixed(1)} MB, ${chosen.width}x${chosen.height}) — ${video.user.name}`);
          credits.push(`${base}-${i}.mp4: video por ${video.user.name} (${video.url})`);
        } catch (e) {
          console.log(`   ✗ Falló ${base}-${i}.mp4: ${e.message}`);
        }
      }
    } catch (e) {
      console.log(`   ✗ Falló "${q}": ${e.message}`);
    }
  }
  return credits;
}

(async () => {
  console.log('Descargando stock de salud desde Pexels (uso libre, sin marca de agua, <25 MB por archivo)...');
  const credits = [];
  credits.push(...await fetchPhotos());
  credits.push(...await fetchVideos());

  const creditsFile = path.join(ROOT, 'public', 'stock-health', 'CREDITS.txt');
  fs.writeFileSync(creditsFile,
    'Recursos de Pexels (https://www.pexels.com) — licencia libre, atribución no obligatoria.\n\n' +
    credits.join('\n') + '\n');
  console.log(`\n✅  Listo. Créditos en ${path.relative(ROOT, creditsFile)}`);
  console.log('Luego:  git add public/stock-health && git commit -m "Add health stock" && git push');
})().catch((err) => {
  console.error('\n❌  Error:', err.message);
  process.exit(1);
});
