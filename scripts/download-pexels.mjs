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

// La clave se puede pasar como argumento:  node scripts/download-pexels.mjs TU_CLAVE
// o como variable de entorno PEXELS_KEY.
const PEXELS_KEY = process.argv[2] || process.env.PEXELS_KEY;
if (!PEXELS_KEY) {
  console.error('Falta la clave de Pexels.');
  console.error('Uso:  node scripts/download-pexels.mjs TU_CLAVE_DE_PEXELS');
  process.exit(1);
}

// ---- CONFIGURACIÓN: búsquedas mapeadas al guion "por qué desapareció el CD" ----
const CONFIG = {
  photos: {
    queries: [
      // --- El CD ---
      'compact disc',
      'cd disc macro',
      'stack of cds',
      'cd player vintage',
      'broken cd',
      'cd bargain bin',
      // --- Casete / Walkman ---
      'cassette tape',
      'audio cassette player',
      'walkman',
      'dual cassette deck',
      // --- Vinilo ---
      'vinyl record',
      'vinyl record player',
      'turntable',
      'vinyl collection',
      'record store',
      // --- Audio / estudio ---
      'headphones',
      'hifi stereo system',
      'recording studio',
      'audio mixing console',
      'reel to reel tape',
      'orchestra classical music',
      // --- Industria / dinero / archivos ---
      'warehouse archive',
      'financial growth chart',
      'declining graph',
      'stock market screen',
      'cash money',
      'coins',
      // --- Tecnología / internet 90s ---
      'old computer',
      'dial up modem',
      'retro computer 1990s',
      'computer code programming',
      'college student laptop',
      'university library',
      // --- Reproductores portátiles ---
      'mp3 player',
      'ipod',
      'smartphone music',
      'music streaming app',
      // --- Legal / escándalo ---
      'courtroom',
      'judge gavel',
      'legal documents',
      'computer virus code',
      'cybersecurity hacker',
      // --- Cultura / tiendas ---
      'rock drummer',
      'concert crowd',
      'closed store',
      'empty retail store',
      'thrift store',
      'tokyo neon night',
      'subscribe social media',
    ],
    perQuery: 4,        // cuántas fotos por búsqueda
    orientation: 'landscape', // landscape | portrait | square
    minWidth: 1920,     // filtra fotos con ancho suficiente para 1080p
  },
  videos: {
    queries: [
      'compact disc spinning',
      'cd player laser',
      'cassette tape playing',
      'vinyl record player spinning',
      'turntable closeup',
      'headphones music',
      'recording studio',
      'typing code computer',
      'old computer screen',
      'downloading progress bar',
      'smartphone scrolling music',
      'music streaming phone',
      'courtroom',
      'concert crowd',
      'stock market chart',
      'record store browsing',
      'hacker typing',
      'city street people walking',
      'ocean waves',
    ],
    perQuery: 2,        // cuántos videos por búsqueda
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
      // elige el mp4 más liviano que sea al menos Full HD (evita 4K gigantes)
      const files = (video.video_files ?? [])
        .filter((f) => f.file_type === 'video/mp4')
        .sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
      const chosen = files.find((f) => (f.width ?? 0) >= minWidth) || files[files.length - 1];
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
