#!/usr/bin/env node
// Escanea public/stock-odisea y genera src/odisea/pools.generated.ts --
// agrupa los archivos por concepto (ej. "ancient-greek-ruins") para que
// plan.ts pueda elegir "el menos usado" dentro de cada pool. Se re-corre
// cada vez que se descarga material nuevo (ver scripts/download-odisea.mjs).
import fs from 'fs';
import path from 'path';

const ROOT = path.join(process.cwd(), 'public', 'stock-odisea');
const PHOTOS_DIR = path.join(ROOT, 'photos');
const VIDEOS_DIR = path.join(ROOT, 'videos');
const OUT = path.join(process.cwd(), 'src', 'odisea', 'pools.generated.ts');

function scan(dir, kind, ext) {
  if (!fs.existsSync(dir)) return {};
  const pools = {};
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(ext)) continue;
    const m = f.match(/^(b\d+)-(.+)-\d+\.\w+$/);
    if (!m) continue;
    const [, block, concept] = m;
    const key = concept; // pool por concepto, independiente del bloque
    pools[key] ??= [];
    pools[key].push({file: `stock-odisea/${kind}/${f}`, kind, block});
  }
  return pools;
}

const photoPools = scan(PHOTOS_DIR, 'photos', '.jpg');
const videoPools = scan(VIDEOS_DIR, 'videos', '.mp4');
const merged = {...photoPools, ...videoPools};

const lines = [
  '// AUTO-GENERADO por scripts/gen-odisea-pools.mjs -- no editar a mano.',
  "// Re-correr ese script cada vez que se descargue material nuevo (ver",
  '// scripts/download-odisea.mjs) para mantener esto sincronizado.',
  "export type PoolItem = {file: string; kind: 'photos' | 'videos'; block: string};",
  'export const POOLS: Record<string, PoolItem[]> = ' + JSON.stringify(merged, null, 2) + ' as const;',
  '',
];
fs.writeFileSync(OUT, lines.join('\n'));

const total = Object.values(merged).reduce((n, arr) => n + arr.length, 0);
console.log(`OK: ${Object.keys(merged).length} pools, ${total} archivos -> ${path.relative(process.cwd(), OUT)}`);
for (const [k, v] of Object.entries(merged)) console.log(`  ${k}: ${v.length}`);
