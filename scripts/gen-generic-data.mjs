#!/usr/bin/env node
// Escanea output/clips.json + output/transcripcion.json y genera
// src/generic/data.generated.ts -- mismo patron que
// scripts/gen-odisea-pools.mjs (pools.generated.ts): en vez de depender de
// props dinamicas en tiempo de render, se genera un archivo TS estatico que
// Root.tsx importa normal. Se re-corre en cada video (ver run-all.mjs),
// justo antes de `remotion render`.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CLIPS_IN = path.join(ROOT, 'output', 'clips.json');
const SEGMENTS_IN = path.join(ROOT, 'output', 'transcripcion.json');
const OUT = path.join(ROOT, 'src', 'generic', 'data.generated.ts');
// Ruta (relativa a public/) del audio ya copiado por run-all.mjs, ej.
// "audio-generic/current.mp3". Se pasa como argumento porque la extension
// depende del archivo que subio el usuario (mp3, wav, m4a...).
const AUDIO_SRC = process.argv[2] || 'audio-generic/current.mp3';
// Titulo para la card de apertura (ver TitleCard en components.tsx). Si no
// se pasa, la card de titulo simplemente no se muestra (GenericPipelineEdit
// la omite cuando title es undefined).
const TITLE = process.argv[3] || '';

if (!fs.existsSync(CLIPS_IN)) {
  console.error(`Error: falta ${path.relative(ROOT, CLIPS_IN)}. Corre antes download-generico.mjs.`);
  process.exit(1);
}
if (!fs.existsSync(SEGMENTS_IN)) {
  console.error(`Error: falta ${path.relative(ROOT, SEGMENTS_IN)}. Corre antes transcribe.py.`);
  process.exit(1);
}

const clips = JSON.parse(fs.readFileSync(CLIPS_IN, 'utf-8'));
const segments = JSON.parse(fs.readFileSync(SEGMENTS_IN, 'utf-8'));

const durationSec = Math.max(
  ...clips.map((c) => c.fin),
  ...segments.map((s) => s.fin),
);

const lines = [
  '// AUTO-GENERADO por scripts/gen-generic-data.mjs -- no editar a mano.',
  '// Se regenera en cada corrida del pipeline (ver scripts/run-all.mjs),',
  '// justo antes de `remotion render`, a partir de output/clips.json y',
  '// output/transcripcion.json.',
  "import type {Clip, Segment} from './GenericPipelineEdit';",
  `export const CLIPS: Clip[] = ${JSON.stringify(clips, null, 2)};`,
  `export const SEGMENTS: Segment[] = ${JSON.stringify(segments, null, 2)};`,
  `export const DURATION_SEC = ${durationSec};`,
  `export const AUDIO_SRC = ${JSON.stringify(AUDIO_SRC)};`,
  `export const TITLE = ${JSON.stringify(TITLE)};`,
  '',
];
fs.mkdirSync(path.dirname(OUT), {recursive: true});
fs.writeFileSync(OUT, lines.join('\n'));

console.log(`OK: ${clips.length} clips, ${segments.length} segmentos, ${durationSec.toFixed(1)}s -> ${path.relative(ROOT, OUT)}`);
