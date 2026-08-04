#!/usr/bin/env node
/**
 * Descarga UN clip (video o foto) por cada bloque de output/keywords.json,
 * probando las keywords del bloque en orden hasta conseguir un resultado.
 * Basado en el mismo patron de fetch/reintento/limite de tamaño que
 * scripts/download-odisea.mjs, pero conducido por el JSON de keywords en
 * vez de una lista de busquedas escrita a mano.
 *
 * Orden de intento por bloque: Pexels video -> Pixabay video -> Pexels foto
 * -> Pixabay foto -> (si todo falla) una query generica de respaldo, para
 * que NUNCA quede un bloque sin material.
 *
 * Uso:
 *   node scripts/download-generico.mjs PEXELS_KEY PIXABAY_KEY
 *   # o por variables de entorno PEXELS_KEY / PIXABAY_KEY (recomendado: .env)
 *
 * Reanudable: si el bloque ya tiene su archivo descargado, se salta.
 * Salida: public/stock-generic/{photos,videos} + output/clips.json
 *   [{"inicio":0,"fin":6.5,"file":"stock-generic/videos/000-dark-ocean.mp4","kind":"videos"}]
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const PEXELS_KEY = args[0] || process.env.PEXELS_KEY || '';
const PIXABAY_KEY = args[1] || process.env.PIXABAY_KEY || '';
const KEYWORDS_IN = path.join(ROOT, 'output', 'keywords.json');
const CLIPS_OUT = path.join(ROOT, 'output', 'clips.json');
const MAX_BYTES = 25 * 1024 * 1024;
const FALLBACK_QUERIES = ['cinematic abstract background', 'slow motion clouds', 'soft light bokeh'];

const PHOTOS_DIR = path.join(ROOT, 'public', 'stock-generic', 'photos');
const VIDEOS_DIR = path.join(ROOT, 'public', 'stock-generic', 'videos');
fs.mkdirSync(PHOTOS_DIR, {recursive: true});
fs.mkdirSync(VIDEOS_DIR, {recursive: true});

// ---------------- helpers (mismo patron que download-odisea.mjs) ----------------
const sleepMs = (ms) => new Promise((r) => setTimeout(r, ms));
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const idx3 = (n) => String(n).padStart(3, '0');

async function fetchRetry(url, opts = {}, maxRetries = 4) {
  let attempt = 0;
  for (;;) {
    const res = await fetch(url, opts);
    if (res.status !== 429 || attempt >= maxRetries) return res;
    const ra = parseInt(res.headers.get('retry-after') || '', 10);
    const wait = Number.isFinite(ra) ? ra * 1000 : 3000 * Math.pow(2.2, attempt);
    console.log(`   ⏳ 429, esperando ${(wait / 1000).toFixed(0)}s y reintentando...`);
    await sleepMs(wait);
    attempt++;
  }
}

async function remoteSize(url) {
  try {
    const r = await fetchRetry(url, {method: 'HEAD'});
    const l = r.headers.get('content-length');
    return l ? parseInt(l, 10) : null;
  } catch {
    return null;
  }
}

async function downloadTo(url, dest, headers = {}) {
  const res = await fetchRetry(url, {headers});
  if (!res.ok) throw new Error(`descarga ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

// ---------------- busqueda por fuente: devuelven {url, credit} o null ----------------
async function pexelsVideo(q) {
  if (!PEXELS_KEY) return null;
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=6&orientation=landscape`;
  const res = await fetchRetry(url, {headers: {Authorization: PEXELS_KEY}});
  if (!res.ok) return null;
  const data = await res.json();
  for (const v of data.videos ?? []) {
    const files = (v.video_files ?? [])
      .filter((f) => f.file_type === 'video/mp4')
      .sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
    const ordered = [...files.filter((f) => (f.width ?? 0) >= 1280), ...files.filter((f) => (f.width ?? 0) < 1280)];
    for (const f of ordered) {
      const s = await remoteSize(f.link);
      if (s != null && s <= MAX_BYTES) {
        return {url: f.link, ext: 'mp4', kind: 'videos', credit: `Pexels/${v.user?.name} ${v.url}`};
      }
    }
  }
  return null;
}

async function pixabayVideo(q) {
  if (!PIXABAY_KEY) return null;
  const url = `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${encodeURIComponent(q)}&per_page=6`;
  const res = await fetchRetry(url);
  if (!res.ok) return null;
  const data = await res.json();
  for (const h of data.hits ?? []) {
    const cand = [h.videos?.large, h.videos?.medium, h.videos?.small].filter(Boolean);
    for (const c of cand) {
      const s = c.size ?? (await remoteSize(c.url));
      if (s != null && s <= MAX_BYTES) {
        return {url: c.url, ext: 'mp4', kind: 'videos', credit: `Pixabay/${h.user} ${h.pageURL}`};
      }
    }
  }
  return null;
}

async function pexelsPhoto(q) {
  if (!PEXELS_KEY) return null;
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=6&orientation=landscape`;
  const res = await fetchRetry(url, {headers: {Authorization: PEXELS_KEY}});
  if (!res.ok) return null;
  const data = await res.json();
  for (const p of data.photos ?? []) {
    if ((p.width ?? 0) < 1280) continue;
    return {
      url: p.src.large2x || p.src.large || p.src.original,
      ext: 'jpg',
      kind: 'photos',
      credit: `Pexels/${p.photographer} ${p.url}`,
    };
  }
  return null;
}

async function pixabayPhoto(q) {
  if (!PIXABAY_KEY) return null;
  const url = `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&min_width=1280&per_page=6`;
  const res = await fetchRetry(url);
  if (!res.ok) return null;
  const data = await res.json();
  for (const h of data.hits ?? []) {
    if (h.isAiGenerated) continue;
    return {
      url: h.largeImageURL || h.webformatURL,
      ext: 'jpg',
      kind: 'photos',
      credit: `Pixabay/${h.user} ${h.pageURL}`,
    };
  }
  return null;
}

const SOURCES = [pexelsVideo, pixabayVideo, pexelsPhoto, pixabayPhoto];

async function findClip(queries) {
  for (const q of queries) {
    for (const source of SOURCES) {
      try {
        const found = await source(q);
        if (found) return {...found, query: q};
      } catch (e) {
        console.log(`   ✗ ${source.name}("${q}"): ${e.message}`);
      }
      await sleepMs(400);
    }
  }
  return null;
}

function existingFileFor(i) {
  for (const [dir, kind] of [[VIDEOS_DIR, 'videos'], [PHOTOS_DIR, 'photos']]) {
    const hit = fs.readdirSync(dir).find((f) => f.startsWith(`${idx3(i)}-`));
    if (hit) return {file: `stock-generic/${kind}/${hit}`, kind};
  }
  return null;
}

// ---------------- run ----------------
(async () => {
  console.log('=== Descarga generica (por keywords.json) ===');
  console.log(`Pexels:  ${PEXELS_KEY ? 'OK' : 'SIN KEY (se salta)'}`);
  console.log(`Pixabay: ${PIXABAY_KEY ? 'OK' : 'SIN KEY (se salta)'}\n`);
  if (!PEXELS_KEY && !PIXABAY_KEY) {
    console.error('Error: falta PEXELS_KEY y PIXABAY_KEY (ninguna fuente disponible).');
    process.exit(1);
  }
  if (!fs.existsSync(KEYWORDS_IN)) {
    console.error(`Error: no existe ${path.relative(ROOT, KEYWORDS_IN)}. Corre antes generar-keywords.mjs.`);
    process.exit(1);
  }

  const blocks = JSON.parse(fs.readFileSync(KEYWORDS_IN, 'utf-8'));
  const credits = [];
  const clips = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const already = existingFileFor(i);
    if (already) {
      console.log(`[${idx3(i)}] ya descargado -> ${already.file} (se omite)`);
      clips.push({inicio: block.inicio, fin: block.fin, file: already.file, kind: already.kind});
      continue;
    }

    console.log(`\n[${idx3(i)}] [${block.inicio.toFixed(1)}-${block.fin.toFixed(1)}] keywords: ${block.keywords.join(', ')}`);
    const found = await findClip([...block.keywords, ...FALLBACK_QUERIES]);
    if (!found) {
      console.log(`   ✗ sin resultados en ninguna fuente para este bloque (revisa las keys/keywords)`);
      continue;
    }
    const dir = found.kind === 'videos' ? VIDEOS_DIR : PHOTOS_DIR;
    const filename = `${idx3(i)}-${slug(found.query)}.${found.ext}`;
    const dest = path.join(dir, filename);
    try {
      const bytes = await downloadTo(found.url, dest);
      const relFile = `stock-generic/${found.kind}/${filename}`;
      console.log(`   ✓ ${relFile} (${(bytes / 1024).toFixed(0)} KB) [${found.credit.split('/')[0]}] query="${found.query}"`);
      credits.push(`${filename}: ${found.credit}`);
      clips.push({inicio: block.inicio, fin: block.fin, file: relFile, kind: found.kind});
    } catch (e) {
      console.log(`   ✗ fallo la descarga: ${e.message}`);
    }
    await sleepMs(600);
  }

  fs.writeFileSync(CLIPS_OUT, JSON.stringify(clips, null, 2));
  fs.writeFileSync(
    path.join(ROOT, 'public', 'stock-generic', 'CREDITS.txt'),
    `Creditos del material — pipeline automatico\n\n${credits.join('\n')}\n`,
  );

  console.log(`\n=== LISTO === ${clips.length}/${blocks.length} bloques con material -> ${path.relative(ROOT, CLIPS_OUT)}`);
  if (clips.length < blocks.length) {
    console.log(`ADVERTENCIA: ${blocks.length - clips.length} bloque(s) quedaron sin material. Revisa las keys o vuelve a correr el script (es reanudable).`);
  }
})();
