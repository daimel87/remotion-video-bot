#!/usr/bin/env node
/**
 * Stock video downloader for Magrux - Forja Interior
 * Downloads UNIQUE high-quality clips that change every 5 seconds.
 * Each clip slot uses a different search query variation to guarantee diversity.
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
const PEXELS_KEY    = 'Ae2sAZkgueMj3auCuLuZhpLBzz1mpITlEt165NnkDMSKBsVW8uy7v5sm';
const PIXABAY_KEY   = '23419683-105869979e02b679473a4e9eb';
const COVERR_KEY    = 'a1f778d2af7cade22655486615337bd0';
const CLIP_INTERVAL = 5;    // seconds per clip
const MIN_WIDTH     = 1280; // reject anything below 720p wide
const MIN_CLIP_DUR  = 5;    // reject clips shorter than 5s

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
    req.setTimeout(20000, () => { req.destroy(); reject(new Error('Timeout')); });
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
      }).on('error', err => { fs.unlink(filePath, () => {}); reject(err); });
    };
    doGet(url);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Pick the best file from a video's file list — prefer 1080p, reject low-res
function bestFile(files, targetDur) {
  const candidates = files
    .filter(f => {
      const url = f.link || f.url || f.mp4_url || '';
      const w   = f.width || 0;
      const dur = f.duration || f.length || 0;
      return url.endsWith('.mp4') && w >= MIN_WIDTH && dur >= MIN_CLIP_DUR;
    })
    .map(f => {
      const url = f.link || f.url || f.mp4_url;
      const w   = f.width || 0;
      const dur = f.duration || f.length || 0;
      // Prefer 1920 width; penalise clips much longer than needed (waste)
      const resScore = Math.min(w, 1920) / 1920;
      const durScore = dur >= targetDur ? 1 : dur / targetDur;
      return { score: resScore * 0.5 + durScore * 0.5, url, dur, w };
    });
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0] || null;
}

// ── SOURCES ───────────────────────────────────────────────────────────────────

async function fromPexels(query, page = 1) {
  try {
    const data = await get(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=15&page=${page}&orientation=landscape`,
      { Authorization: PEXELS_KEY }
    );
    return (data.videos || []).flatMap(v => {
      const files = (v.video_files || []).map(f => ({
        link: f.link, width: f.width || 0, duration: v.duration || 0,
      }));
      const pick = bestFile(files, CLIP_INTERVAL);
      return pick ? [{ source: 'pexels', ...pick }] : [];
    });
  } catch (e) { console.log(`  [Pexels p${page}] ${e.message}`); return []; }
}

async function fromPixabay(query, page = 1) {
  try {
    const data = await get(
      `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&per_page=15&page=${page}&video_type=film`
    );
    return (data.hits || []).flatMap(v => {
      const files = ['large', 'medium'].flatMap(q => {
        const h = v.videos?.[q] || {};
        return h.url && (h.width || 0) >= MIN_WIDTH
          ? [{ url: h.url, width: h.width || 0, duration: v.duration || 0 }]
          : [];
      });
      const pick = bestFile(files, CLIP_INTERVAL);
      return pick ? [{ source: 'pixabay', ...pick }] : [];
    });
  } catch (e) { console.log(`  [Pixabay p${page}] ${e.message}`); return []; }
}

async function fromCoverr(query) {
  try {
    const data = await get(
      `https://api.coverr.co/videos?query=${encodeURIComponent(query)}&per_page=15`,
      { Authorization: `Bearer ${COVERR_KEY}` }
    );
    return (data.hits || []).flatMap(v => {
      const url = v.urls?.mp4 || v.url || '';
      const dur = v.duration || 0;
      if (!url || dur < MIN_CLIP_DUR) return [];
      return [{ source: 'coverr', score: 0.8, url, dur, w: 1920 }];
    });
  } catch (e) { console.log(`  [Coverr] ${e.message}`); return []; }
}

// Search all sources with a specific query, return sorted unique results
async function search(query) {
  const [p1, p2, p3, x1, x2, c] = await Promise.all([
    fromPexels(query, 1),
    fromPexels(query, 2),
    fromPexels(query, 3),
    fromPixabay(query, 1),
    fromPixabay(query, 2),
    fromCoverr(query),
  ]);
  const all = [...p1, ...p2, ...p3, ...x1, ...x2, ...c];
  all.sort((a, b) => b.score - a.score);
  const seen = new Set();
  return all.filter(r => { if (seen.has(r.url)) return false; seen.add(r.url); return true; });
}

// ── SEGMENT ───────────────────────────────────────────────────────────────────

async function processSegment(seg, outDir, index) {
  const slug      = seg.id || `segment_${String(index).padStart(2, '0')}`;
  const dur       = parseFloat(seg.duration || 10);
  const clipCount = Math.ceil(dur / CLIP_INTERVAL);
  const queries   = seg.queries || [seg.query || seg.query_es || ''];
  const prefix    = path.join(outDir, `${String(index).padStart(2, '0')}_${slug}`);

  console.log(`\n[${String(index).padStart(2, '0')}] ${seg.label || slug} — ${dur}s → ${clipCount} clips distintos`);

  // Download each clip slot using a DIFFERENT query variation
  const downloadedFiles = [];
  const usedUrls        = new Set();

  for (let i = 0; i < clipCount; i++) {
    const letter   = String.fromCharCode(97 + i); // a, b, c…
    const filePath = `${prefix}_${letter}.mp4`;

    if (fs.existsSync(filePath)) {
      console.log(`  [${i+1}/${clipCount}] Ya existe: ${path.basename(filePath)}`);
      downloadedFiles.push(filePath);
      usedUrls.add(filePath); // treat as used
      continue;
    }

    // Rotate through query variations per slot
    const q       = queries[i % queries.length];
    const results = await search(q);

    // Pick first result whose URL wasn't already downloaded this segment
    const pick = results.find(r => !usedUrls.has(r.url));

    if (!pick) {
      // Try simpler fallback query
      const simple  = q.split(' ').slice(0, 2).join(' ');
      const simple2 = q.split(' ').slice(2, 4).join(' ') || simple;
      const fallback = await search(simple2);
      const fp = fallback.find(r => !usedUrls.has(r.url));
      if (!fp) { console.log(`  ✗ [${i+1}] Sin clip único`); continue; }
      usedUrls.add(fp.url);
      console.log(`  ✓ [${i+1}/${clipCount}] ${fp.source} ${fp.w}p ${fp.dur.toFixed(1)}s (fallback)`);
      await download(fp.url, filePath);
      downloadedFiles.push(filePath);
    } else {
      usedUrls.add(pick.url);
      console.log(`  ✓ [${i+1}/${clipCount}] ${pick.source} ${pick.w}px ${pick.dur.toFixed(1)}s — "${q}"`);
      await download(pick.url, filePath);
      downloadedFiles.push(filePath);
    }
    await sleep(400);
  }

  if (!downloadedFiles.length) {
    return { segment: seg.label || slug, files: [], ffmpegCmd: null };
  }

  // Write concat list — each clip trimmed to exactly CLIP_INTERVAL seconds
  const concatPath = `${prefix}_concat.txt`;
  const lines = downloadedFiles.map(f => `file '${f.replace(/\\/g, '/')}'`);
  fs.writeFileSync(concatPath, lines.join('\n'));

  const outMp4 = `${prefix}_combined.mp4`;

  // FFmpeg: concat → scale/crop to 1920x1080 → trim to exact duration → no audio
  // Each input is force-trimmed to CLIP_INTERVAL before concat via filter_complex
  const inputs  = downloadedFiles.map((f, i) => `-ss 0.5 -t ${CLIP_INTERVAL} -i "${f.replace(/\\/g, '/')}"`).join(' ');
  const vfilter = downloadedFiles.map((_, i) => `[${i}:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[v${i}]`).join(';');
  const concat  = downloadedFiles.map((_, i) => `[v${i}]`).join('') + `concat=n=${downloadedFiles.length}:v=1:a=0[vout]`;

  const ffmpegCmd = [
    'ffmpeg',
    inputs,
    `-filter_complex "${vfilter};${concat}"`,
    `-map "[vout]"`,
    `-t ${dur}`,
    `-c:v libx264 -crf 17 -preset fast -an`,
    `"${outMp4.replace(/\\/g, '/')}"`,
  ].join(' ');

  return { segment: seg.label || slug, files: downloadedFiles, ffmpegCmd, outMp4 };
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const cliArgs = process.argv.slice(2);
const flags   = {};
let posArgs   = [];

for (let i = 0; i < cliArgs.length; i++) {
  if (cliArgs[i].startsWith('--')) { flags[cliArgs[i].slice(2)] = cliArgs[i + 1]; i++; }
  else posArgs.push(cliArgs[i]);
}

const outDir = flags.out || './clips';
fs.mkdirSync(outDir, { recursive: true });

let segments;

if (flags.segment) {
  segments = [{ id: 'clip', queries: [flags.segment], duration: flags.duration || 10 }];
} else if (posArgs[0]) {
  segments = JSON.parse(fs.readFileSync(posArgs[0], 'utf8'));
} else {
  // "Hábitos Cotidianos que son Señales de Baja Inteligencia"
  // Each segment has MULTIPLE query variations — one per clip slot — for guaranteed diversity
  segments = [
    {
      id: 'intro', duration: 10, label: 'INTRO — Gancho',
      queries: [
        'person staring phone dark bedroom night alone',
        'blue light screen face close up dark room',
      ],
    },
    {
      id: 'habito_1', duration: 10, label: 'Hábito #1 — Consumo Pasivo',
      queries: [
        'person scrolling social media phone addiction',
        'hand swiping smartphone screen close up',
      ],
    },
    {
      id: 'habito_2', duration: 10, label: 'Hábito #2 — Evitar el aburrimiento',
      queries: [
        'person sitting alone bored waiting restless',
        'empty room silence person thinking distracted',
      ],
    },
    {
      id: 'habito_3', duration: 10, label: 'Hábito #3 — Hablar más que escuchar',
      queries: [
        'group people talking conversation office meeting',
        'person talking gesture explaining animated',
      ],
    },
    {
      id: 'habito_4', duration: 10, label: 'Hábito #4 — Sesgo de confirmación',
      queries: [
        'person browsing internet laptop news search',
        'reading screen computer focused close up',
      ],
    },
    {
      id: 'habito_5', duration: 10, label: 'Hábito #5 — Decisiones por impulso',
      queries: [
        'person angry frustrated phone typing impulsive',
        'fast typing keyboard urgent stressed person',
      ],
    },
    {
      id: 'habito_6', duration: 10, label: 'Hábito #6 — No terminar lo que empiezas',
      queries: [
        'messy desk unfinished work abandoned books papers',
        'person giving up project frustrated quitting',
      ],
    },
    {
      id: 'cierre', duration: 8, label: 'CIERRE',
      queries: [
        'person looking horizon city thoughtful reflection',
        'sunrise city skyline calm contemplation',
      ],
    },
  ];
}

console.log(`\nDescargando ${segments.length} segmentos → ${outDir}`);
console.log(`Clip diferente cada ${CLIP_INTERVAL}s | Mínimo ${MIN_WIDTH}px de ancho\n`);

const results = [];
for (let i = 0; i < segments.length; i++) {
  const result = await processSegment(segments[i], outDir, i + 1);
  results.push(result);
}

console.log('\n── Resumen ──────────────────────────────────');
for (const r of results) {
  console.log(`  ${r.files.length > 0 ? '✓' : '✗'} ${r.segment}: ${r.files.length} clip(s)`);
}

const manifestPath = path.join(outDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));

// Write combine script (bash + bat)
const sh  = results.filter(r => r.ffmpegCmd).map(r => `# ${r.segment}\n${r.ffmpegCmd}`).join('\n\n');
const bat = results.filter(r => r.ffmpegCmd).map(r => `rem ${r.segment}\n${r.ffmpegCmd}`).join('\n\n');
fs.writeFileSync(path.join(outDir, 'combine.sh'),  '#!/bin/bash\n\n' + sh  + '\n');
fs.writeFileSync(path.join(outDir, 'combine.bat'), '@echo off\n\n'   + bat + '\n');

console.log(`\n→ Manifest:  ${manifestPath}`);
console.log(`→ Mac/Linux: bash ${path.join(outDir, 'combine.sh')}`);
console.log(`→ Windows:   ${path.join(outDir, 'combine.bat')}`);
