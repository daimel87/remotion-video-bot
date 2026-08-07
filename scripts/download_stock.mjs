#!/usr/bin/env node
/**
 * Stock video downloader for Magrux - Forja Interior
 * Searches Pexels, Pixabay and Coverr and downloads the best match per segment.
 *
 * Usage:
 *   node scripts/download_stock.mjs
 *   node scripts/download_stock.mjs segments.json
 *   node scripts/download_stock.mjs --segment "persona mirando telefono" --duration 8 --out ./clips
 */

import fs   from 'fs';
import path from 'path';
import https from 'https';
import http  from 'http';
import { URL } from 'url';

// ── API KEYS ──────────────────────────────────────────────────────────────────
const PEXELS_KEY  = 'Ae2sAZkgueMj3auCuLuZhpLBzz1mpITlEt165NnkDMSKBsVW8uy7v5sm';
const PIXABAY_KEY = '23419683-105869979e02b679473a4e9eb';
const COVERR_KEY  = 'a1f778d2af7cade22655486615337bd0';

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

async function searchPexels(query, targetDur) {
  try {
    const q    = encodeURIComponent(query);
    const data = await get(
      `https://api.pexels.com/videos/search?query=${q}&per_page=10&orientation=landscape`,
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

async function searchPixabay(query, targetDur) {
  try {
    const q    = encodeURIComponent(query);
    const data = await get(
      `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${q}&per_page=10&video_type=film`
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
      `https://api.coverr.co/videos?query=${q}&per_page=10`,
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

async function findBest(query, targetDur) {
  console.log(`  Buscando: "${query}" (~${targetDur}s)`);
  const all = [
    ...await searchPexels(query, targetDur),
    ...await searchPixabay(query, targetDur),
    ...await searchCoverr(query, targetDur),
  ];
  if (!all.length) return null;
  all.sort((a, b) => b.score - a.score);
  const best = all[0];
  console.log(`  ✓ ${best.source} (${best.dur.toFixed(1)}s) → ${best.url.slice(0, 70)}...`);
  return best;
}

// ── SEGMENT ───────────────────────────────────────────────────────────────────

async function processSegment(seg, outDir, index) {
  const slug    = seg.id || `segment_${String(index).padStart(2, '0')}`;
  const query   = seg.query || seg.query_es || '';
  const dur     = parseFloat(seg.duration || 8);
  const outPath = path.join(outDir, `${String(index).padStart(2, '0')}_${slug}.mp4`);

  if (fs.existsSync(outPath)) {
    console.log(`[${index}] Ya existe: ${outPath}`);
    return outPath;
  }

  console.log(`\n[${String(index).padStart(2, '0')}] ${seg.label || slug}`);
  let result = await findBest(query, dur);

  if (!result) {
    const simple = query.split(' ').slice(0, 2).join(' ');
    console.log(`  → Reintentando con: "${simple}"`);
    result = await findBest(simple, dur);
  }

  if (!result) {
    console.log(`  ✗ No se encontró video.`);
    return null;
  }

  await download(result.url, outPath);
  await sleep(500);
  return outPath;
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const args    = process.argv.slice(2);
const flags   = {};
let posArgs   = [];

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
  segments = [{ id: 'clip', query: flags.segment, duration: flags.duration || 8 }];
} else if (posArgs[0]) {
  segments = JSON.parse(fs.readFileSync(posArgs[0], 'utf8'));
} else {
  // Default: segmentos del video "Hábitos Cotidianos"
  segments = [
    { id: 'intro',    query: 'person phone bed dark room night',          duration: 10, label: 'INTRO — Gancho' },
    { id: 'habito_1', query: 'person scrolling phone passive mindless',   duration: 10, label: 'Hábito #1 — Consumo Pasivo' },
    { id: 'habito_2', query: 'person bored alone silence thinking',       duration: 10, label: 'Hábito #2 — Evitar el aburrimiento' },
    { id: 'habito_3', query: 'people talking meeting group conversation', duration: 10, label: 'Hábito #3 — Hablar más que escuchar' },
    { id: 'habito_4', query: 'person internet research computer typing',  duration: 10, label: 'Hábito #4 — Sesgo de confirmación' },
    { id: 'habito_5', query: 'impulsive decision phone angry typing',     duration: 10, label: 'Hábito #5 — Decisiones por impulso' },
    { id: 'habito_6', query: 'unfinished projects desk abandoned books',  duration: 10, label: 'Hábito #6 — No terminar lo que empiezas' },
    { id: 'cierre',   query: 'person looking horizon city reflection',    duration: 8,  label: 'CIERRE' },
  ];
}

console.log(`\nProcesando ${segments.length} segmentos → ${outDir}\n`);

const results = [];
for (let i = 0; i < segments.length; i++) {
  const filePath = await processSegment(segments[i], outDir, i + 1);
  results.push({ segment: segments[i].label || segments[i].id, file: filePath });
}

console.log('\n── Resumen ──────────────────────────────────');
for (const r of results) {
  console.log(`  ${r.file ? '✓' : '✗'} ${r.segment}: ${r.file || 'NO DESCARGADO'}`);
}

const manifestPath = path.join(outDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));
console.log(`\n→ Manifest: ${manifestPath}`);
