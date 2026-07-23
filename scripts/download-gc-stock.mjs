#!/usr/bin/env node
/**
 * Stock (Pexels) para el documental de Guillermo González Camarena.
 * Igual patrón que BlackBerry/CD/salud, con TOPE DE 25 MB por archivo.
 *
 * Uso (cmd, en la carpeta del proyecto):
 *   git pull
 *   node scripts/download-gc-stock.mjs TU_CLAVE_DE_PEXELS
 *
 * Descarga a public/stock-gc/{photos,videos}, nombrado por 'base'. Reanudable.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PEXELS_KEY = process.argv[2] || process.env.PEXELS_KEY;
if (!PEXELS_KEY) {console.error('Uso: node scripts/download-gc-stock.mjs TU_CLAVE_DE_PEXELS'); process.exit(1);}

const MAX_BYTES = 25 * 1024 * 1024;

// NOTA: Pexels no tiene material histórico real de González Camarena ni de la
// Revolución mexicana (eso va por yt-dlp/archivo, ver download-gc-archival.mjs).
// Estas bases son CONTEXTO/AMBIENTE genérico pero de época o temáticamente afín:
// electrónica vintage, talleres, TV antigua, disco de colores, carretera, etc.
const CONFIG = {
  photos: {
    perQuery: 6, orientation: 'landscape', minWidth: 1600,
    queries: [
      // --- Electrónica / taller / radio (niñez, obsesión con el color) ---
      {base: 'vintage-radio-parts', q: 'vintage radio parts electronics'},
      {base: 'tube-radio', q: 'vintage tube radio old'},
      {base: 'engineer-workshop', q: 'electronics engineer workshop soldering'},
      {base: 'child-electronics', q: 'child playing with electronics toy'},
      // --- Televisión antigua / disco / test pattern ---
      {base: 'old-black-white-tv', q: 'old black and white television retro'},
      {base: 'tv-test-pattern', q: 'tv color bars test pattern screen'},
      {base: 'vintage-tv-workshop', q: 'vintage tv repair workshop'},
      {base: 'tv-static-noise', q: 'tv static noise screen'},
      {base: 'rgb-pixels-macro', q: 'screen pixels macro close up colorful'},
      {base: 'color-spectrum-prism', q: 'color spectrum prism light rgb'},
      {base: 'broadcast-tower', q: 'tv broadcast tower antenna'},
      // --- Documentos / patente / prensa ---
      {base: 'patent-document', q: 'patent document technical drawing'},
      {base: 'old-newspaper', q: 'vintage newspaper archive typography'},
      {base: 'vintage-typewriter', q: 'vintage typewriter keys office'},
      {base: 'old-office-files', q: 'old office files documents desk'},
      // --- México / contexto ---
      {base: 'mexico-flag', q: 'mexico flag waving'},
      {base: 'guadalajara-city', q: 'guadalajara mexico city street'},
      {base: 'mexico-city-skyline', q: 'mexico city aerial skyline'},
      {base: 'highway-mexico', q: 'mexico highway road countryside'},
      {base: 'family-tv-vintage', q: 'family watching television retro living room'},
      {base: 'mexican-musician', q: 'mexican musician guitar traditional'},
      {base: 'university-engineering', q: 'university engineering building campus'},
    ],
  },
  videos: {
    perQuery: 3, orientation: 'landscape', minWidth: 1280,
    queries: [
      {base: 'tv-static-noise', q: 'tv static noise screen'},
      {base: 'tv-test-pattern', q: 'color bars test pattern broadcast'},
      {base: 'vintage-tv-workshop', q: 'vintage tv repair workshop electronics'},
      {base: 'rgb-pixels-macro', q: 'screen pixels macro close up'},
      {base: 'broadcast-tower', q: 'tv broadcast tower antenna signal'},
      {base: 'highway-mexico', q: 'mexico highway road driving countryside'},
      {base: 'family-tv-vintage', q: 'family watching television retro'},
      {base: 'engineer-workshop', q: 'electronics soldering close up'},
      {base: 'color-spectrum-prism', q: 'color spectrum prism light'},
    ],
  },
};

const PHOTOS_DIR = path.join(ROOT, 'public', 'stock-gc', 'photos');
const VIDEOS_DIR = path.join(ROOT, 'public', 'stock-gc', 'videos');
fs.mkdirSync(PHOTOS_DIR, {recursive: true});
fs.mkdirSync(VIDEOS_DIR, {recursive: true});

async function api(url) {
  const res = await fetch(url, {headers: {Authorization: PEXELS_KEY}});
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}
async function download(url, dest) {
  const res = await fetch(url); if (!res.ok) throw new Error(`Descarga ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer()); fs.writeFileSync(dest, buf); return buf.length;
}
async function remoteSize(url) {
  try {const r = await fetch(url, {method: 'HEAD'}); const l = r.headers.get('content-length'); return l ? parseInt(l, 10) : null;} catch {return null;}
}
const baseComplete = (dir, base, per, ext) => {
  for (let i = 1; i <= per; i++) if (!fs.existsSync(path.join(dir, `${base}-${i}.${ext}`))) return false;
  return true;
};

async function fetchPhotos() {
  const {queries, perQuery, orientation, minWidth} = CONFIG.photos;
  const credits = [];
  for (const {base, q} of queries) {
    if (baseComplete(PHOTOS_DIR, base, perQuery, 'jpg')) {console.log(`\n📷 ${base} ⏭`); continue;}
    console.log(`\n📷 ${base}  ("${q}")`);
    try {
      const data = await api(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${perQuery}&orientation=${orientation}`);
      let i = 0;
      for (const p of data.photos ?? []) {
        if (p.width < minWidth) continue; i++;
        const dest = path.join(PHOTOS_DIR, `${base}-${i}.jpg`);
        if (fs.existsSync(dest)) continue;
        try {const b = await download(p.src.large2x || p.src.large || p.src.original, dest); console.log(`   ✓ ${base}-${i}.jpg (${(b/1024).toFixed(0)} KB) — ${p.photographer}`); credits.push(`${base}-${i}.jpg: ${p.photographer} (${p.url})`);} catch (e) {console.log(`   ✗ ${e.message}`);}
      }
    } catch (e) {console.log(`   ✗ ${e.message}`);}
  }
  return credits;
}
async function fetchVideos() {
  const {queries, perQuery, orientation, minWidth} = CONFIG.videos;
  const credits = [];
  for (const {base, q} of queries) {
    if (baseComplete(VIDEOS_DIR, base, perQuery, 'mp4')) {console.log(`\n🎬 ${base} ⏭`); continue;}
    console.log(`\n🎬 ${base}  ("${q}")`);
    try {
      const data = await api(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=${perQuery}&orientation=${orientation}`);
      let i = 0;
      for (const v of data.videos ?? []) {
        const files = (v.video_files ?? []).filter((f) => f.file_type === 'video/mp4').sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
        if (!files.length) continue;
        const ordered = [...files.filter((f) => (f.width ?? 0) >= minWidth), ...files.filter((f) => (f.width ?? 0) < minWidth)];
        let chosen = null;
        for (const f of ordered) {const s = await remoteSize(f.link); if (s != null && s <= MAX_BYTES) {chosen = f; break;}}
        if (!chosen) {console.log(`   ⚠ ${base}: sin versión bajo 25 MB, se omite`); continue;}
        i++;
        const dest = path.join(VIDEOS_DIR, `${base}-${i}.mp4`);
        if (fs.existsSync(dest)) continue;
        try {const b = await download(chosen.link, dest); console.log(`   ✓ ${base}-${i}.mp4 (${(b/1048576).toFixed(1)} MB, ${chosen.width}x${chosen.height}) — ${v.user.name}`); credits.push(`${base}-${i}.mp4: ${v.user.name} (${v.url})`);} catch (e) {console.log(`   ✗ ${e.message}`);}
      }
    } catch (e) {console.log(`   ✗ ${e.message}`);}
  }
  return credits;
}

(async () => {
  console.log('Descargando stock de González Camarena (Pexels, uso libre, <25 MB por archivo)...');
  const credits = [];
  credits.push(...await fetchPhotos());
  credits.push(...await fetchVideos());
  fs.writeFileSync(path.join(ROOT, 'public', 'stock-gc', 'CREDITS.txt'),
    'Pexels (https://www.pexels.com) — licencia libre, atribución no obligatoria.\n\n' + credits.join('\n') + '\n');
  console.log('\n✅ Listo. Luego: git add public/stock-gc && git commit -m "Add GC stock" && git push');
})().catch((e) => {console.error('❌', e.message); process.exit(1);});
