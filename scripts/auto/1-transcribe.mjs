#!/usr/bin/env node
/**
 * PASO 1 — Audio -> SRT real (Whisper local).
 *
 * Uso:
 *   node scripts/auto/1-transcribe.mjs <audio.mp3> [nombre] [--lang es]
 *   node scripts/auto/1-transcribe.mjs <audio.mp3> [nombre] --srt <existente.srt>
 *
 * - Si pasas --srt, se copia ese SRT (saltamos Whisper).
 * - Si no, intenta `whisper` (openai-whisper) o `faster-whisper` por CLI.
 *
 * Salida: work/<nombre>/subtitles.srt  y  copia del audio en public/audio/auto/
 * El <nombre> agrupa todos los artefactos de este video en el pipeline.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const args = process.argv.slice(2);
const audio = args[0];
if (!audio || !fs.existsSync(audio)) {
  console.error('Falta el audio. Uso: node scripts/auto/1-transcribe.mjs <audio.mp3> [nombre] [--lang es] [--srt existente.srt]');
  process.exit(1);
}
const name = args[1] && !args[1].startsWith('--') ? args[1] : path.basename(audio, path.extname(audio)).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
const langIdx = args.indexOf('--lang');
const lang = langIdx >= 0 ? args[langIdx + 1] : 'es';
const srtIdx = args.indexOf('--srt');
const providedSrt = srtIdx >= 0 ? args[srtIdx + 1] : null;

const workDir = path.join(ROOT, 'work', name);
fs.mkdirSync(workDir, {recursive: true});
const outSrt = path.join(workDir, 'subtitles.srt');

// Copiamos el audio a public/ para que Remotion lo sirva con staticFile().
const publicAudioDir = path.join(ROOT, 'public', 'audio', 'auto');
fs.mkdirSync(publicAudioDir, {recursive: true});
const audioPublic = path.join(publicAudioDir, `${name}${path.extname(audio)}`);
fs.copyFileSync(audio, audioPublic);
const audioRel = path.relative(path.join(ROOT, 'public'), audioPublic).split(path.sep).join('/');

if (providedSrt) {
  if (!fs.existsSync(providedSrt)) {
    console.error(`No existe el SRT: ${providedSrt}`);
    process.exit(1);
  }
  fs.copyFileSync(providedSrt, outSrt);
  console.log(`✔ SRT copiado: ${outSrt}`);
} else {
  let done = false;
  const tryCli = (cmd, cmdArgs) => {
    try {
      console.log(`Ejecutando: ${cmd} ${cmdArgs.join(' ')}`);
      execFileSync(cmd, cmdArgs, {stdio: 'inherit'});
      return true;
    } catch {
      return false;
    }
  };
  // openai-whisper: escribe <audio>.srt en --output_dir
  if (tryCli('whisper', [audio, '--model', 'small', '--language', lang, '--output_format', 'srt', '--output_dir', workDir])) {
    const gen = path.join(workDir, `${path.basename(audio, path.extname(audio))}.srt`);
    if (fs.existsSync(gen)) fs.renameSync(gen, outSrt);
    done = fs.existsSync(outSrt);
  }
  if (!done) {
    console.error('\nNo se pudo ejecutar Whisper. Opciones:');
    console.error('  pip install -U openai-whisper   (o faster-whisper)');
    console.error('  o pasa un SRT que ya tengas:  --srt ruta/al.srt');
    process.exit(1);
  }
  console.log(`✔ SRT generado: ${outSrt}`);
}

// Guardamos metadatos del video para los siguientes pasos.
const meta = {name, audioRel, srt: path.relative(ROOT, outSrt), lang};
fs.writeFileSync(path.join(workDir, 'meta.json'), JSON.stringify(meta, null, 2));
console.log(`✔ Audio en public/: ${audioRel}`);
console.log(`\nSiguiente:  node scripts/auto/2-shots.mjs ${name}`);
