#!/usr/bin/env node
/**
 * Orquestador del pipeline completo: audio -> video.
 *
 *   transcribe.py -> generar-keywords.mjs -> download-generico.mjs ->
 *   gen-generic-data.mjs -> remotion render
 *
 * Uso CLI:
 *   node scripts/run-all.mjs <ruta_audio> [--model small] [--out output/video-final.mp4]
 *
 * Uso como modulo (lo usa scripts/server.mjs para la interfaz web):
 *   import {runPipeline} from './run-all.mjs';
 *   const videoPath = await runPipeline(audioPath, {onProgress: (e) => ...});
 *
 * Lee PEXELS_KEY / PIXABAY_KEY de un archivo .env en la raiz del proyecto
 * (si existe) o de variables de entorno ya seteadas -- no requiere la
 * libreria dotenv, Node 20+ trae process.loadEnvFile() nativo.
 */
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const ENV_FILE = path.join(ROOT, '.env');
if (fs.existsSync(ENV_FILE)) {
  process.loadEnvFile(ENV_FILE);
}

const OUTPUT_DIR = path.join(ROOT, 'output');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio-generic');

// Detecta un Python REAL instalado, no solo un nombre que exista en el PATH.
// En Windows, "python3"/"python" a veces resuelven a un stub de la Microsoft
// Store (el "App execution alias") que "where" SI encuentra pero que al
// ejecutarse solo abre la tienda y falla -- por eso no basta con `where`,
// hay que correr `--version` de verdad y confirmar que la salida es un
// numero de version de Python.
function looksLikePython(output) {
  return /Python \d+\.\d+/i.test(output);
}

function tryPythonCommand(cmd, extraArgs) {
  return new Promise((resolve) => {
    const child = spawn(cmd, [...extraArgs, '--version'], {shell: process.platform === 'win32'});
    let out = '';
    child.stdout?.on('data', (d) => (out += d));
    child.stderr?.on('data', (d) => (out += d));
    child.on('error', () => resolve(false));
    child.on('close', () => resolve(looksLikePython(out)));
  });
}

async function pickPython() {
  // "py" es el lanzador oficial de python.org en Windows y es el mas
  // confiable cuando existe; python3 es el estandar en Linux/Mac.
  const candidates =
    process.platform === 'win32'
      ? [{cmd: 'py', args: ['-3']}, {cmd: 'python', args: []}, {cmd: 'python3', args: []}]
      : [{cmd: 'python3', args: []}, {cmd: 'python', args: []}];
  for (const c of candidates) {
    if (await tryPythonCommand(c.cmd, c.args)) return c;
  }
  throw new Error(
    'No se encontro una instalacion real de Python (solo el alias de la Microsoft Store, si acaso). ' +
      'Instala Python desde https://python.org/downloads/ (NO desde la Microsoft Store) y marca ' +
      'la casilla "Add python.exe to PATH" durante la instalacion. Luego vuelve a intentar.',
  );
}

// Corre un comando y devuelve una promesa; cada linea de stdout/stderr se
// reenvia via onLine para que el caller (CLI o server web) pueda mostrar
// progreso en vivo sin esperar a que termine el paso completo.
function run(cmd, args, {onLine} = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {cwd: ROOT, shell: process.platform === 'win32'});
    let stderrBuf = '';
    const forward = (buf) => {
      const text = buf.toString();
      stderrBuf += text;
      for (const line of text.split(/\r?\n/)) {
        if (line.trim()) onLine?.(line);
      }
    };
    child.stdout.on('data', forward);
    child.stderr.on('data', forward);
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`"${cmd} ${args.join(' ')}" salio con codigo ${code}\n${stderrBuf.slice(-800)}`));
    });
  });
}

const STEPS = [
  {step: 'transcribiendo', message: 'Transcribiendo audio con Whisper (puede tardar unos minutos)...'},
  {step: 'keywords', message: 'Extrayendo keywords de la transcripcion...'},
  {step: 'descargando', message: 'Descargando video/fotos de Pexels y Pixabay...'},
  {step: 'preparando', message: 'Preparando datos para Remotion...'},
  {step: 'renderizando', message: 'Renderizando el video final...'},
];

/**
 * @param {string} audioPath ruta al archivo de audio de entrada
 * @param {object} opts
 * @param {(e: {step: string, message: string}) => void} [opts.onProgress]
 * @param {string} [opts.model] modelo de whisper (default "small")
 * @param {string} [opts.outFile] ruta del mp4 final (default output/video-final.mp4)
 * @param {string} [opts.title] titulo para la card de apertura (default: nombre del archivo)
 * @returns {Promise<string>} ruta absoluta del video final
 */
export async function runPipeline(audioPath, opts = {}) {
  const {onProgress, model = 'small', outFile = path.join(OUTPUT_DIR, 'video-final.mp4')} = opts;
  const emit = (step, message) => onProgress?.({step, message});

  const absAudio = path.resolve(audioPath);
  if (!fs.existsSync(absAudio)) {
    throw new Error(`No existe el archivo de audio: ${absAudio}`);
  }

  // Titulo para la card de apertura: el que se pase explicitamente (ej. desde
  // el formulario web), o si no, el nombre del archivo prettificado
  // ("mi-video_final" -> "Mi Video Final").
  const title =
    opts.title?.trim() ||
    path
      .basename(audioPath, path.extname(audioPath))
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase());

  fs.mkdirSync(OUTPUT_DIR, {recursive: true});
  fs.mkdirSync(AUDIO_DIR, {recursive: true});

  // 1) copiar el audio a public/ (staticFile de Remotion solo sirve archivos
  // dentro de public/), conservando la extension original.
  const ext = path.extname(absAudio) || '.mp3';
  const audioRelPath = `audio-generic/current${ext}`;
  fs.copyFileSync(absAudio, path.join(ROOT, 'public', audioRelPath));

  // 2) transcribir
  emit(STEPS[0].step, STEPS[0].message);
  const python = await pickPython();
  await run(python.cmd, [
    ...python.args,
    path.join('scripts', 'transcribe.py'),
    absAudio,
    '--model', model,
    '--out', path.join('output', 'transcripcion.json'),
  ], {onLine: (l) => emit(STEPS[0].step, l)});

  // 3) keywords
  emit(STEPS[1].step, STEPS[1].message);
  await run('node', [path.join('scripts', 'generar-keywords.mjs')], {
    onLine: (l) => emit(STEPS[1].step, l),
  });

  // 4) descargar clips (requiere PEXELS_KEY y/o PIXABAY_KEY en el entorno/.env)
  emit(STEPS[2].step, STEPS[2].message);
  if (!process.env.PEXELS_KEY && !process.env.PIXABAY_KEY) {
    throw new Error(
      'Falta PEXELS_KEY y/o PIXABAY_KEY. Crea un archivo .env en la raiz del proyecto con:\n' +
        'PEXELS_KEY=tu_clave\nPIXABAY_KEY=tu_clave',
    );
  }
  await run('node', [path.join('scripts', 'download-generico.mjs')], {
    onLine: (l) => emit(STEPS[2].step, l),
  });

  // 5) generar data.generated.ts para la composicion de Remotion
  emit(STEPS[3].step, STEPS[3].message);
  await run('node', [path.join('scripts', 'gen-generic-data.mjs'), audioRelPath, title], {
    onLine: (l) => emit(STEPS[3].step, l),
  });

  // 6) render final
  emit(STEPS[4].step, STEPS[4].message);
  const absOut = path.resolve(outFile);
  fs.mkdirSync(path.dirname(absOut), {recursive: true});
  await run('npx', ['remotion', 'render', 'GenericPipelineEdit', absOut], {
    onLine: (l) => emit(STEPS[4].step, l),
  });

  emit('listo', `Video generado: ${absOut}`);
  return absOut;
}

// ---------------- CLI ----------------
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const audioPath = process.argv[2];
  if (!audioPath) {
    console.error('Uso: node scripts/run-all.mjs <ruta_audio> [--model small] [--out output/video-final.mp4] [--title "Mi titulo"]');
    process.exit(1);
  }
  const modelIdx = process.argv.indexOf('--model');
  const outIdx = process.argv.indexOf('--out');
  const titleIdx = process.argv.indexOf('--title');
  const model = modelIdx !== -1 ? process.argv[modelIdx + 1] : undefined;
  const outFile = outIdx !== -1 ? process.argv[outIdx + 1] : undefined;
  const title = titleIdx !== -1 ? process.argv[titleIdx + 1] : undefined;

  runPipeline(audioPath, {
    model,
    outFile,
    title,
    onProgress: (e) => console.log(`[${e.step}] ${e.message}`),
  })
    .then((videoPath) => {
      console.log(`\n✅ Listo: ${videoPath}`);
    })
    .catch((err) => {
      console.error(`\n❌ Error: ${err.message}`);
      process.exit(1);
    });
}
