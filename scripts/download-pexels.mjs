#!/usr/bin/env node
/**
 * Descarga fotos y videos stock de Pexels (sin marca de agua, uso libre).
 *
 * Uso:
 *   PEXELS_KEY=tu_clave node scripts/download-pexels.mjs
 *
 * Configura las búsquedas y cantidades en CONFIG abajo.
 * Descarga a: public/stock/photos  y  public/stock/videos
 */

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PEXELS_KEY = process.env.PEXELS_KEY;
if (!PEXELS_KEY) {
  console.error('Falta la variable de entorno PEXELS_KEY');
  process.exit(1);
}

// ---- CONFIGURACIÓN: edita las búsquedas para tu video del CD ----
const CONFIG = {
  photos: {
    queries: [
      'compact disc',
      'cd disc',
      'vinyl record',
      'cassette tape',
      'walkman',
      'music store',
      'headphones vintage',
      'stereo system',
      'streaming music phone',
      'retro technology',
    ],
    perQuery: 5,        // cuántas fotos por búsqueda
    orientation: 'landscape', // landscape | portrait | square
    minWidth: 1920,     // filtra fotos con ancho suficiente para 1080p
  },
  videos: {
    queries: [
      'compact disc',
      'vinyl record player',
      'cassette tape',
      'headphones music',
      'music streaming',
      'retro technology',
    ],
    perQuery: 3,        // cuántos videos por búsqueda
    orientation: 'landscape',
    minWidth: 1920,
  },
};
// -----------------------------------------------------------------

const PHOTOS_DIR = path.join(ROOT, 'public', 'stock', 'photos');
const VIDEOS_DIR = path.join(ROOT, 'public', 'stock', 'videos');
fs.mkdirSync(PHOTOS_DIR, {recursive: true});
fs.mkdirSync(VIDEOS_DIR, {recursive: true});

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function api(url) {
  const res = await fetch(url, {headers: {Authorization: PEXELS_KEY}});
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Descarga ${res.status} de ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function fetchPhotos() {
  const {queries, perQuery, orientation, minWidth} = CONFIG.photos;
  const credits = [];
  for (const q of queries) {
    console.log(`\n📷  Fotos: "${q}"`);
    const data = await api(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}` +
      `&per_page=${perQuery}&orientation=${orientation}`
    );
    let i = 0;
    for (const photo of data.photos ?? []) {
      if (photo.width < minWidth) continue;
      i++;
      const dest = path.join(PHOTOS_DIR, `${slug(q)}-${i}.jpg`);
      const bytes = await download(photo.src.large2x || photo.src.original, dest);
      console.log(`   ✓ ${path.basename(dest)} (${(bytes / 1024).toFixed(0)} KB) — foto por ${photo.photographer}`);
      credits.push(`${path.basename(dest)}: foto por ${photo.photographer} (${photo.url})`);
    }
  }
  return credits;
}

async function fetchVideos() {
  const {queries, perQuery, orientation, minWidth} = CONFIG.videos;
  const credits = [];
  for (const q of queries) {
    console.log(`\n🎬  Videos: "${q}"`);
    const data = await api(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}` +
      `&per_page=${perQuery}&orientation=${orientation}`
    );
    let i = 0;
    for (const video of data.videos ?? []) {
      // elige el mejor archivo mp4 con ancho >= minWidth (o el más grande disponible)
      const files = (video.video_files ?? [])
        .filter((f) => f.file_type === 'video/mp4')
        .sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
      const chosen = files.find((f) => (f.width ?? 0) >= minWidth) || files[0];
      if (!chosen) continue;
      i++;
      const dest = path.join(VIDEOS_DIR, `${slug(q)}-${i}.mp4`);
      const bytes = await download(chosen.link, dest);
      console.log(`   ✓ ${path.basename(dest)} (${(bytes / 1024 / 1024).toFixed(1)} MB, ${chosen.width}x${chosen.height}) — video por ${video.user.name}`);
      credits.push(`${path.basename(dest)}: video por ${video.user.name} (${video.url})`);
    }
  }
  return credits;
}

(async () => {
  console.log('Descargando stock de Pexels (uso libre, sin marca de agua)...');
  const credits = [];
  credits.push(...await fetchPhotos());
  credits.push(...await fetchVideos());

  // Pexels no exige atribución, pero es buena práctica guardarla
  const creditsFile = path.join(ROOT, 'public', 'stock', 'CREDITS.txt');
  fs.writeFileSync(creditsFile,
    'Recursos de Pexels (https://www.pexels.com) — licencia libre, sin atribución obligatoria.\n\n' +
    credits.join('\n') + '\n');
  console.log(`\n✅  Listo. Créditos guardados en ${path.relative(ROOT, creditsFile)}`);
})().catch((err) => {
  console.error('\n❌  Error:', err.message);
  process.exit(1);
});
