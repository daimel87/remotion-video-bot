#!/usr/bin/env node
/**
 * PASO 2 — SRT -> tomas + plantilla de queries.
 *
 * Uso:  node scripts/auto/2-shots.mjs <nombre> [--target 4] [--min 2.5] [--max 6]
 *
 * Agrupa entradas consecutivas del SRT en "tomas" de ~target segundos SIN
 * partir ninguna entrada (el texto de cada toma son las palabras EXACTAS del
 * SRT en su ventana; los tiempos salen del SRT -> "el SRT es ley"). La suma de
 * durationSec = duracion del audio.
 *
 * Escribe:
 *   work/<nombre>/shots.json    -> [{id, text, startSec, durationSec}]
 *   work/<nombre>/queries.json  -> plantilla para que Claude ponga las queries
 *                                   visuales concretas por toma (paso IA).
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const name = process.argv[2];
if (!name) {
  console.error('Falta el nombre. Uso: node scripts/auto/2-shots.mjs <nombre>');
  process.exit(1);
}
const arg = (flag, def) => {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? Number(process.argv[i + 1]) : def;
};
const TARGET = arg('--target', 4);
const MIN = arg('--min', 2.5);
const MAX = arg('--max', 6);

const workDir = path.join(ROOT, 'work', name);
const srtPath = path.join(workDir, 'subtitles.srt');
if (!fs.existsSync(srtPath)) {
  console.error(`No existe ${srtPath}. Corre antes el paso 1.`);
  process.exit(1);
}

const toSec = (ts) => {
  const m = ts.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
};

// Parse SRT -> [{start, end, text}]
const raw = fs.readFileSync(srtPath, 'utf8').replace(/\r/g, '');
const entries = [];
for (const block of raw.split(/\n\n+/)) {
  const lines = block.split('\n').filter(Boolean);
  if (lines.length < 2) continue;
  const timeLine = lines.find((l) => l.includes('-->'));
  if (!timeLine) continue;
  const [a, b] = timeLine.split('-->');
  const textLines = lines.slice(lines.indexOf(timeLine) + 1);
  entries.push({start: toSec(a), end: toSec(b), text: textLines.join(' ').trim()});
}
if (entries.length === 0) {
  console.error('SRT vacio o no parseable.');
  process.exit(1);
}

// Agrupar entradas en tomas de ~TARGET sin partir entradas.
const shots = [];
let cur = null;
for (const e of entries) {
  if (!cur) {
    cur = {start: e.start, end: e.end, parts: [e.text]};
    continue;
  }
  const curDur = cur.end - cur.start;
  const wouldBe = e.end - cur.start;
  // Cierra la toma si ya paso el target y no nos pasamos del max,
  // o si anadir la siguiente romperia el max.
  if ((curDur >= TARGET && curDur >= MIN) || wouldBe > MAX) {
    shots.push(cur);
    cur = {start: e.start, end: e.end, parts: [e.text]};
  } else {
    cur.end = e.end;
    cur.parts.push(e.text);
  }
}
if (cur) shots.push(cur);

const out = shots.map((s, i) => ({
  id: `s${String(i + 1).padStart(3, '0')}`,
  text: s.parts.join(' ').replace(/\s+/g, ' ').trim(),
  startSec: +s.start.toFixed(3),
  durationSec: +(s.end - s.start).toFixed(3),
}));

fs.writeFileSync(path.join(workDir, 'shots.json'), JSON.stringify(out, null, 2));

// Plantilla de queries para el paso IA (Claude la rellena).
const queries = {
  name,
  // 'videos' = clips (recomendado para B-roll), 'photos' = imagenes fijas.
  defaultKind: 'videos',
  candidatesPerShot: 5,
  shots: out.map((s) => ({
    id: s.id,
    text: s.text,
    // Claude rellena: pool semantico + queries VISUALES CONCRETAS en INGLES.
    pool: '',
    kind: '',
    queries: [],
  })),
};
fs.writeFileSync(path.join(workDir, 'queries.json'), JSON.stringify(queries, null, 2));

const total = out.reduce((a, s) => a + s.durationSec, 0);
console.log(`✔ ${out.length} tomas -> work/${name}/shots.json`);
console.log(`✔ plantilla    -> work/${name}/queries.json  (rellenar queries)`);
console.log(`  duracion total: ${total.toFixed(2)}s`);
console.log(`\nSiguiente:  Claude rellena queries.json, luego  node scripts/auto/3-fetch.mjs ${name}`);
