#!/usr/bin/env node
/**
 * PASO 4 — picks.json -> cues.generated.ts + pools.generated.ts
 *
 * Uso:  node scripts/auto/4-emit.mjs <nombre>
 *
 * Lee:
 *   work/<nombre>/shots.json      (texto + durationSec reales del SRT)
 *   work/<nombre>/meta.json       (audio en public/)
 *   work/<nombre>/picks.json      (Claude eligio el clip que SI ilustra cada toma)
 *       -> [{id, file, kind}]  file = ruta relativa a public/
 *
 * Escribe src/auto/cues.generated.ts y src/auto/pools.generated.ts en el
 * formato que ya consume la composicion AutoStockEdit (buildPlan/pickFromPool).
 * Cada toma = su propio pool (1 archivo). Si varias tomas comparten pool en
 * picks.json (mismo campo pool), se agrupan y pickFromPool reparte sin repetir.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const name = process.argv[2];
if (!name) {
  console.error('Uso: node scripts/auto/4-emit.mjs <nombre>');
  process.exit(1);
}
const workDir = path.join(ROOT, 'work', name);
const shots = JSON.parse(fs.readFileSync(path.join(workDir, 'shots.json'), 'utf8'));
const meta = JSON.parse(fs.readFileSync(path.join(workDir, 'meta.json'), 'utf8'));
const picks = JSON.parse(fs.readFileSync(path.join(workDir, 'picks.json'), 'utf8'));

const pickList = Array.isArray(picks) ? picks : picks.picks;
const byId = new Map(pickList.map((p) => [p.id, p]));

// Construir pools: por defecto pool = id de la toma (1 archivo cada uno).
const pools = {};
const cues = shots.map((s) => {
  const p = byId.get(s.id);
  if (!p || !p.file) {
    throw new Error(`Falta pick para la toma ${s.id} ("${s.text.slice(0, 40)}...")`);
  }
  const poolName = p.pool || s.id;
  const kind = p.kind || (p.file.endsWith('.mp4') ? 'videos' : 'photos');
  if (!pools[poolName]) pools[poolName] = [];
  if (!pools[poolName].some((it) => it.file === p.file)) {
    pools[poolName].push({file: p.file, kind});
  }
  return {text: s.text, pool: poolName, durationSec: s.durationSec};
});

const cuesTs =
  `// AUTO-GENERADO por scripts/auto/4-emit.mjs -- no editar a mano.\n` +
  `// Cada cue = frase EXACTA del SRT + pool semantico + durationSec real.\n` +
  `import type {Cue} from './plan';\n\n` +
  `export const CUES: Cue[] = ${JSON.stringify(cues, null, 2)};\n\n` +
  `export const AUDIO_SRC = ${JSON.stringify(meta.audioRel || '')};\n`;

const poolsTs =
  `// AUTO-GENERADO por scripts/auto/4-emit.mjs -- no editar a mano.\n` +
  `export type PoolItem = {file: string; kind: 'photos' | 'videos'};\n` +
  `export const POOLS: Record<string, PoolItem[]> = ${JSON.stringify(pools, null, 2)};\n`;

const autoSrc = path.join(ROOT, 'src', 'auto');
fs.writeFileSync(path.join(autoSrc, 'cues.generated.ts'), cuesTs);
fs.writeFileSync(path.join(autoSrc, 'pools.generated.ts'), poolsTs);

const total = cues.reduce((a, c) => a + c.durationSec, 0);
console.log(`✔ src/auto/cues.generated.ts   (${cues.length} cues, ${total.toFixed(2)}s)`);
console.log(`✔ src/auto/pools.generated.ts  (${Object.keys(pools).length} pools)`);
console.log(`✔ audio: ${meta.audioRel}`);
console.log(`\nSiguiente:  npx remotion render AutoStockEdit renders/${name}.mp4`);
