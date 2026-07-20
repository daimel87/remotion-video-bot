#!/usr/bin/env node
/**
 * Stock de COMIDA/SALUD para el canal de seniors (Pexels, uso libre, sin marca de agua).
 *
 * Uso:   node scripts/download-health-stock.mjs TU_CLAVE_DE_PEXELS
 *
 * Descarga a public/stock-health/{photos,videos}. Cada archivo se nombra por su
 * 'base' (la misma palabra clave que usa src/health/plan.ts), p.ej. lentil-soup-1.jpg,
 * para que el resolver de la plantilla lo encuentre directo.
 * Reanudable: omite lo ya descargado.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PEXELS_KEY = process.argv[2] || process.env.PEXELS_KEY;
if (!PEXELS_KEY) {console.error('Uso: node scripts/download-health-stock.mjs TU_CLAVE_DE_PEXELS'); process.exit(1);}

// {base, q} — base = palabra clave del plan; q = búsqueda en Pexels.
const PHOTOS = [
  {base: 'lentil-soup', q: 'lentil soup bowl'},
  {base: 'oatmeal-bowl', q: 'oatmeal porridge cinnamon'},
  {base: 'canned-fish', q: 'sardines canned fish toast'},
  {base: 'vegetable-soup', q: 'homemade vegetable soup pot'},
  {base: 'rice-chicken', q: 'rice chicken one pot meal'},
  {base: 'healthy-ingredients', q: 'fresh healthy ingredients table'},
  {base: 'grocery-budget', q: 'grocery budget shopping vegetables'},
  {base: 'pantry-stock', q: 'pantry canned goods shelf'},
  {base: 'vintage-kitchen', q: 'vintage kitchen cooking'},
  {base: 'senior-cooking', q: 'senior woman cooking kitchen'},
  {base: 'bone-health', q: 'older couple eating healthy'},
  {base: 'heart-health', q: 'healthy heart food vegetables'},
];
const VIDEOS = [
  {base: 'lentil-soup', q: 'soup simmering pot'},
  {base: 'vegetable-soup', q: 'chopping vegetables cutting board'},
  {base: 'oatmeal-bowl', q: 'stirring oatmeal breakfast'},
  {base: 'rice-chicken', q: 'cooking rice pan stove'},
  {base: 'senior-cooking', q: 'elderly person cooking'},
  {base: 'grocery-budget', q: 'hands counting coins money'},
  {base: 'healthy-ingredients', q: 'fresh vegetables kitchen'},
  {base: 'pantry-stock', q: 'grocery store aisle shelves'},
];
const PER = 3, MINW = 1920;

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
  const res = await fetch(url); if (!res.ok) throw new Error(`Descarga ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer()); fs.writeFileSync(dest, buf); return buf.length;
}
const complete = (dir, base, ext) => {
  for (let i = 1; i <= PER; i++) if (!fs.existsSync(path.join(dir, `${base}-${i}.${ext}`))) return false;
  return true;
};

(async () => {
  const credits = [];
  for (const {base, q} of PHOTOS) {
    if (complete(PHOTOS_DIR, base, 'jpg')) {console.log(`📷 ${base} ⏭`); continue;}
    console.log(`\n📷 ${base}  ("${q}")`);
    try {
      const data = await api(`https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${PER}&orientation=landscape`);
      let i = 0;
      for (const p of data.photos ?? []) {
        if (p.width < MINW) continue; i++;
        const dest = path.join(PHOTOS_DIR, `${base}-${i}.jpg`);
        if (fs.existsSync(dest)) continue;
        try {const b = await download(p.src.large2x || p.src.original, dest); console.log(`   ✓ ${base}-${i}.jpg (${(b/1024).toFixed(0)} KB) — ${p.photographer}`); credits.push(`${base}-${i}.jpg: ${p.photographer} (${p.url})`);} catch (e) {console.log(`   ✗ ${e.message}`);}
      }
    } catch (e) {console.log(`   ✗ ${e.message}`);}
  }
  for (const {base, q} of VIDEOS) {
    if (complete(VIDEOS_DIR, base, 'mp4')) {console.log(`🎬 ${base} ⏭`); continue;}
    console.log(`\n🎬 ${base}  ("${q}")`);
    try {
      const data = await api(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=${PER}&orientation=landscape`);
      let i = 0;
      for (const v of data.videos ?? []) {
        const files = (v.video_files ?? []).filter((f) => f.file_type === 'video/mp4').sort((a, b) => (a.width ?? 0) - (b.width ?? 0));
        const chosen = files.find((f) => (f.width ?? 0) >= MINW) || files[files.length - 1];
        if (!chosen) continue; i++;
        const dest = path.join(VIDEOS_DIR, `${base}-${i}.mp4`);
        if (fs.existsSync(dest)) continue;
        try {const b = await download(chosen.link, dest); console.log(`   ✓ ${base}-${i}.mp4 (${(b/1048576).toFixed(1)} MB, ${chosen.width}x${chosen.height}) — ${v.user.name}`); credits.push(`${base}-${i}.mp4: ${v.user.name} (${v.url})`);} catch (e) {console.log(`   ✗ ${e.message}`);}
      }
    } catch (e) {console.log(`   ✗ ${e.message}`);}
  }
  fs.writeFileSync(path.join(ROOT, 'public', 'stock-health', 'CREDITS.txt'),
    'Pexels (https://www.pexels.com) — licencia libre, atribución no obligatoria.\n\n' + credits.join('\n') + '\n');
  console.log('\n✅ Listo. Luego: git add public/stock-health && git commit && git push');
})().catch((e) => {console.error('❌', e.message); process.exit(1);});
