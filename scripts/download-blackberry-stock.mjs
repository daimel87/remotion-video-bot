#!/usr/bin/env node
/**
 * Stock (Pexels) para el documental de BlackBerry. Igual que el del CD/salud,
 * con TOPE DE 25 MB por archivo.
 *
 * Uso (cmd, en la carpeta del proyecto):
 *   git pull
 *   node scripts/download-blackberry-stock.mjs TU_CLAVE_DE_PEXELS
 *
 * Descarga a public/stock-bb/{photos,videos}, nombrado por 'base'. Reanudable.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PEXELS_KEY = process.argv[2] || process.env.PEXELS_KEY;
if (!PEXELS_KEY) {console.error('Uso: node scripts/download-blackberry-stock.mjs TU_CLAVE_DE_PEXELS'); process.exit(1);}

const MAX_BYTES = 25 * 1024 * 1024;

// NOTA: se subió perQuery (más variantes = menos repetición). Las bases nuevas
// 'blackberry-*' buscan el aparato de verdad (Pexels sí tiene fotos del Passport/
// Classic con teclado). Reanudable: si una base ya está completa, se omite.
const CONFIG = {
  photos: {
    perQuery: 6, orientation: 'landscape', minWidth: 1600,
    queries: [
      // --- BlackBerry de verdad (aparato con teclado físico) ---
      {base: 'blackberry-device', q: 'blackberry phone'},
      {base: 'blackberry-keyboard-closeup', q: 'blackberry keyboard qwerty phone'},
      {base: 'qwerty-phone', q: 'phone physical keyboard qwerty black'},
      {base: 'phone-in-hand-dark', q: 'black smartphone hand dark moody'},
      // --- Contexto ---
      {base: 'business-phone', q: 'businessman using phone suit'},
      {base: 'smartphone-modern', q: 'modern smartphone touchscreen hand'},
      {base: 'texting-hands', q: 'typing texting phone hands closeup'},
      {base: 'office-corporate', q: 'corporate office people working'},
      {base: 'boardroom-execs', q: 'executives boardroom meeting'},
      {base: 'stock-market', q: 'stock market chart screen red green'},
      {base: 'wall-street', q: 'wall street financial district traders'},
      {base: 'server-room', q: 'server room data center'},
      {base: 'factory-tech', q: 'electronics factory assembly line'},
      {base: 'city-commuters', q: 'city commuters business people walking'},
      {base: 'email-screen', q: 'email inbox computer screen'},
      {base: 'security-encryption', q: 'cybersecurity encryption padlock'},
      {base: 'empty-office', q: 'empty office abandoned desks'},
      {base: 'canada-waterloo', q: 'canada city skyline modern building'},
      {base: 'old-phones', q: 'old mobile phones collection retro'},
    ],
  },
  videos: {
    perQuery: 3, orientation: 'landscape', minWidth: 1280,
    queries: [
      {base: 'phone-in-hand-dark', q: 'black smartphone in hand close up dark'},
      {base: 'texting-hands', q: 'typing on smartphone closeup'},
      {base: 'business-phone', q: 'businessman walking phone city'},
      {base: 'smartphone-modern', q: 'scrolling touchscreen smartphone'},
      {base: 'office-corporate', q: 'busy office workers'},
      {base: 'stock-market', q: 'stock market chart moving'},
      {base: 'city-commuters', q: 'crowd people walking city street'},
      {base: 'server-room', q: 'data center servers lights'},
      {base: 'factory-tech', q: 'electronics manufacturing line'},
    ],
  },
};

const PHOTOS_DIR = path.join(ROOT, 'public', 'stock-bb', 'photos');
const VIDEOS_DIR = path.join(ROOT, 'public', 'stock-bb', 'videos');
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
  console.log('Descargando stock de BlackBerry (Pexels, uso libre, <25 MB por archivo)...');
  const credits = [];
  credits.push(...await fetchPhotos());
  credits.push(...await fetchVideos());
  fs.writeFileSync(path.join(ROOT, 'public', 'stock-bb', 'CREDITS.txt'),
    'Pexels (https://www.pexels.com) — licencia libre, atribución no obligatoria.\n\n' + credits.join('\n') + '\n');
  console.log('\n✅ Listo. Luego: git add public/stock-bb && git commit -m "Add BB stock" && git push');
})().catch((e) => {console.error('❌', e.message); process.exit(1);});
