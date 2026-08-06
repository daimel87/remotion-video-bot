#!/usr/bin/env node
/**
 * PASO 3 — Descargar candidatos de Pexels + Pixabay + sacar frame de cada uno.
 *
 * Uso:
 *   PEXELS_KEY=xxx PIXABAY_KEY=yyy node scripts/auto/3-fetch.mjs <nombre>
 *
 * Lee work/<nombre>/queries.json (ya rellenado por Claude) y para CADA toma:
 *   - busca sus queries en Pexels y Pixabay (en el orden dado),
 *   - descarga hasta candidatesPerShot clips/fotos distintos,
 *   - extrae 1 frame de cada candidato (ffmpeg) para revision visual.
 *
 * Descarga a:  public/stock-auto/<nombre>/<shotId>/cand-*.mp4|jpg
 * Frames a:    work/<nombre>/candidates/<shotId>/*.jpg
 * Indice:      work/<nombre>/candidates.json
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const name = process.argv[2];
if (!name) {
  console.error('Uso: PEXELS_KEY=.. PIXABAY_KEY=.. node scripts/auto/3-fetch.mjs <nombre>');
  process.exit(1);
}
const PEXELS_KEY = process.env.PEXELS_KEY;
const PIXABAY_KEY = process.env.PIXABAY_KEY;
if (!PEXELS_KEY && !PIXABAY_KEY) {
  console.error('Faltan claves. Define PEXELS_KEY y/o PIXABAY_KEY en el entorno.');
  process.exit(1);
}

const workDir = path.join(ROOT, 'work', name);
const queries = JSON.parse(fs.readFileSync(path.join(workDir, 'queries.json'), 'utf8'));
const perShot = queries.candidatesPerShot ?? 5;
const ORIENTATION = 'landscape'; // 16:9 para YouTube horizontal

// ffmpeg del compositor de Remotion (o del sistema).
const FFMPEG =
  [
    path.join(ROOT, 'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg'),
    'ffmpeg',
  ].find((p) => {
    try {
      execFileSync(p, ['-version'], {stdio: 'ignore'});
      return true;
    } catch {
      return false;
    }
  }) || 'ffmpeg';

const dl = async (url, dest, headers = {}) => {
  const res = await fetch(url, {headers});
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
};

// --- Buscadores: devuelven [{url, provider, kind, id}] ---
async function searchPexels(term, kind) {
  if (!PEXELS_KEY) return [];
  const isVideo = kind === 'videos';
  const base = isVideo
    ? `https://api.pexels.com/videos/search`
    : `https://api.pexels.com/v1/search`;
  const url = `${base}?query=${encodeURIComponent(term)}&per_page=15&orientation=${ORIENTATION}`;
  const res = await fetch(url, {headers: {Authorization: PEXELS_KEY}});
  if (!res.ok) return [];
  const j = await res.json();
  if (isVideo) {
    return (j.videos || []).map((v) => {
      const file =
        (v.video_files || [])
          .filter((f) => f.width && f.width >= 1280 && f.width <= 1920)
          .sort((a, b) => a.width - b.width)[0] || (v.video_files || [])[0];
      return file ? {url: file.link, provider: 'pexels', kind, id: `pexels-${v.id}`} : null;
    }).filter(Boolean);
  }
  return (j.photos || []).map((p) => ({
    url: p.src?.large2x || p.src?.large,
    provider: 'pexels',
    kind,
    id: `pexels-${p.id}`,
  }));
}

async function searchPixabay(term, kind) {
  if (!PIXABAY_KEY) return [];
  const isVideo = kind === 'videos';
  const base = isVideo ? `https://pixabay.com/api/videos/` : `https://pixabay.com/api/`;
  const url = `${base}?key=${PIXABAY_KEY}&q=${encodeURIComponent(term)}&per_page=15&orientation=horizontal&safesearch=true`;
  const res = await fetch(url, {headers: {'User-Agent': 'remotion-video-bot'}});
  if (!res.ok) return [];
  const j = await res.json();
  return (j.hits || []).map((h) => {
    if (isVideo) {
      const v = h.videos?.large?.url || h.videos?.medium?.url;
      return v ? {url: v, provider: 'pixabay', kind, id: `pixabay-${h.id}`} : null;
    }
    return {url: h.largeImageURL, provider: 'pixabay', kind, id: `pixabay-${h.id}`};
  }).filter(Boolean);
}

const extractFrame = (media, frameOut, kind) => {
  try {
    if (kind === 'videos') {
      execFileSync(FFMPEG, ['-y', '-ss', '1', '-i', media, '-vframes', '1', '-vf', 'scale=640:-1', frameOut], {stdio: 'ignore'});
    } else {
      execFileSync(FFMPEG, ['-y', '-i', media, '-vf', 'scale=640:-1', frameOut], {stdio: 'ignore'});
    }
    return fs.existsSync(frameOut);
  } catch {
    return false;
  }
};

const main = async () => {
  const stockRoot = path.join(ROOT, 'public', 'stock-auto', name);
  const framesRoot = path.join(workDir, 'candidates');
  fs.mkdirSync(stockRoot, {recursive: true});
  fs.mkdirSync(framesRoot, {recursive: true});

  const index = {name, shots: []};
  for (const shot of queries.shots) {
    const kind = shot.kind || queries.defaultKind || 'videos';
    const shotDir = path.join(stockRoot, shot.id);
    const frameDir = path.join(framesRoot, shot.id);
    fs.mkdirSync(shotDir, {recursive: true});
    fs.mkdirSync(frameDir, {recursive: true});

    const seen = new Set();
    const candidates = [];
    for (const q of shot.queries || []) {
      if (candidates.length >= perShot) break;
      let results = [];
      try {
        results = [...(await searchPexels(q, kind)), ...(await searchPixabay(q, kind))];
      } catch (e) {
        console.warn(`  ! busqueda fallo (${q}): ${e.message}`);
      }
      for (const r of results) {
        if (candidates.length >= perShot) break;
        if (!r?.url || seen.has(r.id)) continue;
        seen.add(r.id);
        const ext = kind === 'videos' ? 'mp4' : 'jpg';
        const fileName = `cand-${candidates.length + 1}-${r.id}.${ext}`;
        const dest = path.join(shotDir, fileName);
        try {
          await dl(r.url, dest);
        } catch (e) {
          console.warn(`  ! descarga fallo: ${e.message}`);
          continue;
        }
        const frameName = `${path.basename(fileName, path.extname(fileName))}.jpg`;
        const frameOut = path.join(frameDir, frameName);
        const framed = extractFrame(dest, frameOut, kind);
        candidates.push({
          file: path.relative(path.join(ROOT, 'public'), dest).split(path.sep).join('/'),
          frame: framed ? path.relative(ROOT, frameOut) : null,
          provider: r.provider,
          kind,
          query: q,
        });
      }
    }
    console.log(`✔ ${shot.id}: ${candidates.length} candidatos  ("${shot.text.slice(0, 48)}...")`);
    index.shots.push({id: shot.id, text: shot.text, pool: shot.pool, kind, candidates});
  }

  fs.writeFileSync(path.join(workDir, 'candidates.json'), JSON.stringify(index, null, 2));
  console.log(`\n✔ indice -> work/${name}/candidates.json`);
  console.log(`✔ frames -> work/${name}/candidates/  (Claude los revisa y elige)`);
  console.log(`\nSiguiente:  Claude revisa los frames y escribe picks.json, luego  node scripts/auto/4-emit.mjs ${name}`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
