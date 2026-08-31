#!/usr/bin/env node
/**
 * Stock video downloader for Magrux - Forja Interior
 * Downloads MULTIPLE clips per segment across several keyword variations,
 * and outputs a manifest.json with the same shape used by the other
 * production pipeline: { id, texto, keywords, files }.
 *
 * Usage:
 *   node scripts/download_stock.mjs
 *   node scripts/download_stock.mjs segments.json
 *   node scripts/download_stock.mjs --out ./stock-habitos
 */

import fs   from 'fs';
import path from 'path';
import https from 'https';
import http  from 'http';
import { URL } from 'url';

// ── CONFIG ────────────────────────────────────────────────────────────────────
const PEXELS_KEY   = 'Ae2sAZkgueMj3auCuLuZhpLBzz1mpITlEt165NnkDMSKBsVW8uy7v5sm';
const PIXABAY_KEY  = '23419683-105869979e02b679473a4e9eb';
const COVERR_KEY   = 'a1f778d2af7cade22655486615337bd0';
const MIN_WIDTH    = 1280;
const MIN_CLIP_DUR = 4;
const PER_KEYWORD  = 3; // how many clips to try downloading per keyword

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
    console.log(`    ↓ ${path.basename(filePath)}`);
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

function bestFiles(files) {
  return files
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
      return { url, w, dur, score: Math.min(w, 1920) / 1920 };
    })
    .sort((a, b) => b.score - a.score);
}

// ── SOURCES ───────────────────────────────────────────────────────────────────

async function fromPexels(query) {
  try {
    const data = await get(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
      { Authorization: PEXELS_KEY }
    );
    return (data.videos || []).flatMap(v => {
      const files = (v.video_files || []).map(f => ({ link: f.link, width: f.width || 0, duration: v.duration || 0 }));
      return bestFiles(files).slice(0, 1).map(f => ({ source: 'pexels', ...f }));
    });
  } catch (e) { console.log(`    [Pexels] ${e.message}`); return []; }
}

async function fromPixabay(query) {
  try {
    const data = await get(
      `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&per_page=10&video_type=film`
    );
    return (data.hits || []).flatMap(v => {
      const files = ['large', 'medium'].flatMap(q => {
        const h = v.videos?.[q] || {};
        return h.url ? [{ url: h.url, width: h.width || 0, duration: v.duration || 0 }] : [];
      });
      return bestFiles(files).slice(0, 1).map(f => ({ source: 'pixabay', ...f }));
    });
  } catch (e) { console.log(`    [Pixabay] ${e.message}`); return []; }
}

async function fromCoverr(query) {
  try {
    const data = await get(
      `https://api.coverr.co/videos?query=${encodeURIComponent(query)}&per_page=10`,
      { Authorization: `Bearer ${COVERR_KEY}` }
    );
    return (data.hits || []).flatMap(v => {
      const url = v.urls?.mp4 || v.url || '';
      const dur = v.duration || 0;
      if (!url || dur < MIN_CLIP_DUR) return [];
      return [{ source: 'coverr', url, w: 1920, dur, score: 0.75 }];
    });
  } catch (e) { console.log(`    [Coverr] ${e.message}`); return []; }
}

async function searchKeyword(query) {
  const [p, x, c] = await Promise.all([fromPexels(query), fromPixabay(query), fromCoverr(query)]);
  const all = [...p, ...x, ...c];
  all.sort((a, b) => b.score - a.score);
  return all;
}

// ── SEGMENT ───────────────────────────────────────────────────────────────────

async function processSegment(seg, outDir, usedUrlsGlobal) {
  const dir = path.join(outDir, 'videos');
  fs.mkdirSync(dir, { recursive: true });

  console.log(`\n[${seg.id}] ${seg.texto.slice(0, 60)}...`);

  const files = [];
  let clipIndex = 1;

  for (const keyword of seg.keywords) {
    console.log(`  Buscando: "${keyword}"`);
    const results = await searchKeyword(keyword);

    let downloaded = 0;
    for (const r of results) {
      if (downloaded >= PER_KEYWORD) break;
      if (usedUrlsGlobal.has(r.url)) continue;

      const filePath = path.join(dir, `${seg.id}-${clipIndex}.mp4`);
      const relPath  = path.relative(outDir, filePath).replace(/\\/g, '/');

      if (fs.existsSync(filePath)) {
        console.log(`    → Ya existe: ${path.basename(filePath)}`);
        files.push(`${path.basename(outDir)}/${relPath}`);
        usedUrlsGlobal.add(r.url);
        clipIndex++;
        downloaded++;
        continue;
      }

      console.log(`    ✓ ${r.source} ${r.w}px ${r.dur.toFixed(1)}s`);
      await download(r.url, filePath);
      await sleep(350);

      files.push(`${path.basename(outDir)}/${relPath}`);
      usedUrlsGlobal.add(r.url);
      clipIndex++;
      downloaded++;
    }

    if (!downloaded) console.log(`    ✗ Sin resultados nuevos para "${keyword}"`);
  }

  return { id: seg.id, texto: seg.texto, keywords: seg.keywords, files };
}

// ── CLI ───────────────────────────────────────────────────────────────────────

const cliArgs = process.argv.slice(2);
const flags   = {};
let posArgs   = [];
for (let i = 0; i < cliArgs.length; i++) {
  if (cliArgs[i].startsWith('--')) { flags[cliArgs[i].slice(2)] = cliArgs[i + 1]; i++; }
  else posArgs.push(cliArgs[i]);
}

const outDir = flags.out || './stock-habitos-cotidianos';
fs.mkdirSync(path.join(outDir, 'videos'), { recursive: true });

let segments;

if (posArgs[0]) {
  segments = JSON.parse(fs.readFileSync(posArgs[0], 'utf8'));
} else {
  // "Hábitos Cotidianos que son Señales de Baja Inteligencia"
  segments = [
    {
      id: '00-intro',
      texto: '¿Te acuerdas de ese momento en que empezaste a notar que algo no encajaba? Hay hábitos que parecen normales, pero te hacen menos inteligente cada día.',
      keywords: [
        'person staring phone dark bedroom night alone',
        'blue light screen face close up dark room',
        'person lying bed scrolling phone night',
      ],
    },
    {
      id: '01-consumo-pasivo',
      texto: 'Hábito uno: consumo pasivo de contenido. Scrollear no descansa la mente, la acostumbra a la recompensa instantánea.',
      keywords: [
        'person scrolling social media phone addiction',
        'hand swiping smartphone screen close up',
        'person watching short videos phone endless',
      ],
    },
    {
      id: '02-evitar-aburrimiento',
      texto: 'Hábito dos: evitar el aburrimiento a toda costa. El aburrimiento es donde nace el pensamiento real.',
      keywords: [
        'person sitting alone bored waiting restless',
        'empty room silence person thinking distracted',
        'person staring window bored thoughtful',
      ],
    },
    {
      id: '03-hablar-mas-escuchar',
      texto: 'Hábito tres: hablar más de lo que escuchas. Mientras hablas no aprendes nada nuevo, mientras escuchas cambias.',
      keywords: [
        'group people talking conversation office meeting',
        'person talking gesture explaining animated',
        'two people conversation coffee shop',
      ],
    },
    {
      id: '04-sesgo-confirmacion',
      texto: 'Hábito cuatro: sesgo de confirmación. No buscas información, buscas confirmación de lo que ya piensas.',
      keywords: [
        'person browsing internet laptop news search',
        'reading screen computer focused close up',
        'person researching online frustrated laptop',
      ],
    },
    {
      id: '05-decisiones-impulso',
      texto: 'Hábito cinco: decisiones por impulso. La emoción actúa primero, la razón llega tarde.',
      keywords: [
        'person angry frustrated phone typing impulsive',
        'fast typing keyboard urgent stressed person',
        'person slamming laptop frustrated angry',
      ],
    },
    {
      id: '06-no-terminar',
      texto: 'Hábito seis: no terminar lo que empiezas. Cada abandono refuerza el siguiente.',
      keywords: [
        'messy desk unfinished work abandoned books papers',
        'person giving up project frustrated quitting',
        'pile of unread books desk dust',
      ],
    },
    {
      id: '99-cierre',
      texto: 'La inteligencia no es talento. Es el resultado de tus hábitos diarios. Cambia el hábito, cambia el cerebro.',
      keywords: [
        'person looking horizon city thoughtful reflection',
        'sunrise city skyline calm contemplation',
        'person walking away calm determined',
      ],
    },
  ];
}

console.log(`\nDescargando stock para ${segments.length} segmentos → ${outDir}`);
console.log(`Hasta ${PER_KEYWORD} clips únicos por keyword\n`);

const usedUrlsGlobal = new Set();
const manifest = [];

for (const seg of segments) {
  const result = await processSegment(seg, outDir, usedUrlsGlobal);
  manifest.push(result);
}

console.log('\n── Resumen ──────────────────────────────────');
for (const r of manifest) {
  console.log(`  ${r.files.length > 0 ? '✓' : '✗'} ${r.id}: ${r.files.length} clip(s)`);
}

const manifestPath = path.join(outDir, 'manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log(`\n→ Manifest: ${manifestPath}`);
console.log(`\nAhora dale el manifest.json + audio + transcripción a tu otra sesión para armar el video.`);
