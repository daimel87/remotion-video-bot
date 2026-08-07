#!/usr/bin/env node
/**
 * Stock video downloader for Magrux - Forja Interior
 * Downloads MULTIPLE clips per segment (one every CLIP_INTERVAL seconds)
 * so the background changes dynamically, then outputs FFmpeg concat commands.
 *
 * Usage:
 *   node scripts/download_stock.mjs
 *   node scripts/download_stock.mjs segments.json
 *   node scripts/download_stock.mjs --segment "persona mirando telefono" --duration 10 --out ./clips
 */

import fs   from 'fs';
import path from 'path';
import https from 'https';
import http  from 'http';
import { URL } from 'url';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const PEXELS_KEY     = 'Ae2sAZkgueMj3auCuLuZhpLBzz1mpITlEt165NnkDMSKBsVW8uy7v5sm';
const PIXABAY_KEY    = '23419683-105869979e02b679473a4e9eb';
const COVERR_KEY     = 'a1f778d2af7cade22655486615337bd0';
const CLIP_INTERVAL  = 5;   // seconds per clip before switching to next

// ── HELPERS ───────────────────────────────────────────────────────────────────

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const mod    = parsed.protocol === 'https:' ? https : http;
    const req    = mod.get(url, { headers }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location, headers).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error(`JSON parse error: ${data.slice(0, 120)}`)); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    console.log(`  ↓ ${path.basename(filePath)}`);
    const file = fs.createWriteStream(filePath);

    const doGet = (u) => {
      const parsed = new URL(u);
      const mod    = parsed.protocol === 'https:' ? https : http;
      mod.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return doGet(res.headers.location);
        }
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      }).on('error', err => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    };
    doGet(url);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function bestFile(files, targetDur) {
  const scored = files
    .filter(f => (f.link || f.url || f.mp4_url || '').endsWith('.mp4'))
    .map(f => {
      const url = f.link || f.url || f.mp4_url;
      const w   = f.width  || 0;
      const dur = f.duration || f.length || 0;
      const resScore = Math.min(w, 1920) / 1920;
      const durScore = 1 - Math.abs(dur - targetDur) / Math.max(targetDur, 1);
      return { score: resScore * 0.4 + durScore * 0.6, url, dur };
    });
  scored.sort((a, b) => b.score - a.score);
  return scored[0] || null;
}

// ── SOURCES ───────────────────────────────────────────────────────────────────

async function searchPexels(query, targetDur, page = 1) {
  try {
    const q    = encodeURIComponent(query);
    const data = await get(
      `https://api.pexels.com/videos/search?query=${q}&per_page=15&page=${page}&orientation=landscape`,
      { Authorization: PEXELS_KEY }
    );
    return (data.videos || []).flatMap(v => {
      const files = (v.video_files || []).map(f => ({
        link: f.link, width: f.width || 0, duration: v.duration || 0,
      }));
      const pick = bestFile(files, targetDur);
      return pick ? [{ source: 'pexels', ...pick }] : [];
    });
  } catch (e) {
    console.log(`  [Pexels] ${e.message}`);
    return [];
  }
}

async function searchPixabay(query, targetDur, page = 1) {
  try {
    const q    = encodeURIComponent(query);
    const data = await get(
      `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${q}&per_page=15&page=${page}&video_type=film`
    );
    return (data.hits || []).flatMap(v => {
      const files = ['large', 'medium', 'small'].flatMap(q => {
        const h = v.videos?.[q] || {};
        return h.url ? [{ url: h.url, width: h.width || 0, duration: v.duration || 0 }] : [];
      });
      const pick = bestFile(files, targetDur);
      return pick ? [{ source: 'pixabay', ...pick }] : [];
    });
  } catch (e) {
    console.log(`  [Pixabay] ${e.message}`);
    return [];
  }
}

async function searchCoverr(query, targetDur) {
  try {
    const q    = encodeURIComponent(query);
    const data = await get(
      `https://api.coverr.co/videos?query=${q}&per_page=15`,
      { Authorization: `Bearer ${COVERR_KEY}` }
    );
    return (data.hits || []).flatMap(v => {
      const url = v.urls?.mp4 || v.url || '';
      if (!url) return [];
      const dur      = v.duration || 0;
      const durScore = 1 - Math.abs(dur - targetDur) / Math.max(targetDur, 1);
      return [{ source: 'coverr', score: durScore, url, dur }];
    });
  } catch (e) {
    console.log(`  [Coverr] ${e.message}`);
    return [];
  }
}

// Returns up to `count` unique results for a query
async function findMultiple(query, targetDur, count) {
  console.log(`  Buscando ${count} clips: "${query}" (~${targetDur}s c/u)`);
  const [pexels1, pexels2, pixabay1, pixabay2, coverr] = await Promise.all([
    searchPexels(query, targetDur, 1),
    searchPexels(query, targetDur, 2),
    searchPixabay(query, targetDur, 1),
    searchPixabay(query, targetDur, 2),
    searchCoverr(query, targetDur),
  ]);

  const all = [...pexels1, ...pexels2, ...pixabay1, ...pixabay2, ...coverr];
  all.sort((a, b) => b.score - a.score);

  // Deduplicate by URL
  const seen = new Set();
  const unique = all.filter(r => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });

  return unique.slice(0, count);
}

// ── SEGMENT ───────────────────────────────────────────────────────────────────

async function processSegment(seg, outDir, index) {
  const slug      = seg.id || `segment_${String(index).padStart(2, '0')}`;
  const query     = seg.query || seg.query_es || '';
  const dur       = parseFloat(seg.duration || 10);
  const clipCount = Math.ceil(dur / CLIP_INTERVAL);
  const prefix    = path.join(outDir, `${String(index).padStart(2, '0')}_${slug}`);

  console.log(`\n[${String(index).padStart(2, '0')}] ${seg.label || slug} — ${dur}s → ${clipCount} clips de ${CLIP_INTERVAL}s`);

  const clips = await findMultiple(query, CLIP_INTERVAL, clipCount);

  if (!clips.length) {
    const simple = query.split(' ').slice(0, 2).join(' ');
    console.log(`  → Sin resultados, reintentando con: "${simple}"`);
    const fallback = await findMultiple(simple, CLIP_INTERVAL, clipCount);
    clips.push(...fallback);
  }

  if (!clips.length) {
    console.log(`  ✗ No se encontraron clips.`);
    return { segment: seg.label || slug, files: [], ffmpeg: null };
  }

  const downloadedFiles = [];
  for (let i = 0; i < Math.min(clipCount, clips.length); i++) {
    const letter   = String.fromCharCode(97 + i); // a, b, c...
    const filePath = `${prefix}_${letter}.mp4`;

    if (fs.existsSync(filePath)) {
      console.log(`  → Ya existe: ${path.basename(filePath)}`);
      downloadedFiles.push(filePath);
      continue;
    }

    const clip = clips[i];
    console.log(`  ✓ [${i + 1}/${clipCount}] ${clip.source} (${clip.dur.toFixed(1)}s)`);
    await download(clip.url, filePath);
    await sleep(400);
    downloadedFiles.push(filePath);
  }

  // Build FFmpeg concat command for this segment
  const concatPath = `${prefix}_concat.txt`;
  const concatLines = downloadedFiles.map(f => `file '${f.replace(/\\/g, '/')}'`);
  fs.writeFileSync(concatPath, concatLines.join('\n'));

  const outMp4    = `${prefix}_combined.mp4`;
  const ffmpegCmd = `ffmpeg -f concat -safe 0 -i "${concatPath}" -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" -t ${dur} -c:v libx264 -crf 18 -preset fast -an "${outMp4}"`;

  return { segment: seg.label || slug, files: downloadedFiles, ffmpegCmd, outMp4 };
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args  = process.argv.slice(2);
const flags = {};
let posArgs = [];

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    flags[args[i].slice(2)] = args[i + 1];
    i++;
  } else {
    posArgs.push(args[i]);
  }
}

const outDir = flags.out || './clips';
fs.mkdirSync(outDir, { recursive: true });

let segments;

if (flags.segment) {
  segments = [{ id: 'clip', query: flags.segment, duration: flags.duration || 10 }];
} else if (posArgs[0]) {
  segments = JSON.parse(fs.readFileSync(posArgs[0], 'utf8'));
} else {
  // Segmentos del video "Hábitos Cotidianos que son Señales de Baja Inteligencia"
  segments = [
    { id: 'intro',    query: 'person phone bed dark room night',          duration: 10, label: 'INTRO — Gancho' },
    { id: 'habito_1', query: 'person scrolling phone passive mindless',   duration: 10, label: 'Hábito #1 — Consumo Pasivo' },
    { id: 'habito_2', query: 'person bored alone silence thinking',       duration: 10, label: 'Hábito #2 — Evitar el aburrimiento' },
    { id: 'habito_3', query: 'people talking meeting group conversation', duration: 10, label: 'Hábito #3 — Hablar más que escuchar' },
    { id: 'habito_4', query: 'person internet research computer typing',  duration: 10, label: 'Hábito #4 — Sesgo de confirmación' },
    { id: 'habito_5', query: 'impulsive decision phone angry typing',     duration: 10, label: 'Hábito #5 — Decisiones por impulso' },
    { id: 'habito_6', query: 'unfinished projects desk abandoned books',  duration: 10, label: 'Hábito #6 — No terminar lo que empiezas' },
    { id: 'cierre',   query: 'person looking horizon city reflection',    duration:  8, label: 'CIERRE' },
  ];
}

console.log(`\nDescargando ${segments.length} segmentos → ${outDir}`);
console.log(`Cada segmento = ${CLIP_INTERVAL}s por clip (cambio dinámico)\n`);

const results = [];
for (let i = 0; i < segments.length; i++) {
  const result = await processSegment(segments[i], outDir, i + 1);
  results.push(result);
}

// ── RESUMEN ───────────────────────────────────────────────────────────────────
console.log('\n── Resumen ──────────────────────────────────');
for (const r of results) {
  const ok = r.files.length > 0;
  console.log(`  ${ok ? '✓' : '✗'} ${r.segment}: ${r.files.length} clip(s)`);
}

// Save manifest + FFmpeg script
const manifestPath = path.join(outDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));

const ffmpegScript = results
  .filter(r => r.ffmpegCmd)
  .map(r => `# ${r.segment}\n${r.ffmpegCmd}`)
  .join('\n\n');
const ffmpegPath = path.join(outDir, 'combine.sh');
fs.writeFileSync(ffmpegPath, '#!/bin/bash\n\n' + ffmpegScript + '\n');

console.log(`\n→ Manifest:      ${manifestPath}`);
console.log(`→ FFmpeg script: ${ffmpegPath}`);
console.log(`\nPara combinar clips de cada segmento ejecuta:`);
console.log(`  bash ${ffmpegPath}`);
