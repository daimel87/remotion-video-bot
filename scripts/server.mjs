#!/usr/bin/env node
/**
 * Interfaz web local del pipeline audio -> video (ver PLAN.md, Prompt 3).
 *
 *   npm start
 *   -> abre http://localhost:3000, subes un audio, clic en "Generar video"
 *
 * Flujo:
 *   1. POST /generar (multipart, campo "audio") guarda el archivo subido y
 *      arranca runPipeline() en background. Responde de inmediato con un
 *      jobId (no bloquea la request mientras se genera el video).
 *   2. El navegador abre un EventSource a GET /eventos/:jobId (Server-Sent
 *      Events) para recibir el progreso en vivo linea por linea.
 *   3. Al terminar, el evento final trae la URL de descarga
 *      (GET /descargar/:jobId).
 *
 * Un solo usuario local, sin autenticacion -- no expone el puerto fuera de
 * localhost.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {EventEmitter} from 'node:events';
import {fileURLToPath} from 'node:url';
import express from 'express';
import multer from 'multer';
import {runPipeline} from './run-all.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

const UPLOADS_DIR = path.join(ROOT, 'uploads');
const OUTPUT_DIR = path.join(ROOT, 'output');
fs.mkdirSync(UPLOADS_DIR, {recursive: true});
fs.mkdirSync(OUTPUT_DIR, {recursive: true});

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname) || '.mp3'}`),
  }),
  limits: {fileSize: 300 * 1024 * 1024}, // 300MB, de sobra para un audio narrado
});

// ---------------- registro de jobs en memoria ----------------
// Un solo usuario local corriendo esto en su PC: no hace falta una cola
// persistente ni base de datos, un Map en memoria alcanza. Cada job guarda
// su historial de eventos (para que un cliente que reconecta el EventSource
// no pierda el progreso ya emitido) + un emitter para los eventos nuevos.
const jobs = new Map();

function createJob() {
  const id = crypto.randomUUID();
  const job = {id, status: 'corriendo', events: [], videoPath: null, error: null, emitter: new EventEmitter()};
  jobs.set(id, job);
  return job;
}

function pushEvent(job, event) {
  job.events.push(event);
  job.emitter.emit('event', event);
}

// ---------------- app ----------------
const app = express();
// Sirve public/index.html (y su CSS/JS). Es el mismo directorio "public/"
// que usa Remotion para staticFile() -- no hay conflicto, son dos procesos
// distintos leyendo la misma carpeta.
app.use(express.static(path.join(ROOT, 'public'), {index: 'index.html'}));

app.post('/generar', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({error: 'Falta el archivo de audio (campo "audio").'});
  }
  const job = createJob();
  res.json({jobId: job.id});

  runPipeline(req.file.path, {
    outFile: path.join(OUTPUT_DIR, `${job.id}.mp4`),
    onProgress: (e) => pushEvent(job, e),
  })
    .then((videoPath) => {
      job.status = 'listo';
      job.videoPath = videoPath;
      pushEvent(job, {step: 'listo', message: 'Video listo para descargar.', downloadUrl: `/descargar/${job.id}`});
    })
    .catch((err) => {
      job.status = 'error';
      job.error = err.message;
      pushEvent(job, {step: 'error', message: err.message});
    })
    .finally(() => {
      fs.unlink(req.file.path, () => {});
    });
});

app.get('/eventos/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job) return res.status(404).end();

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  const send = (event) => res.write(`data: ${JSON.stringify(event)}\n\n`);

  // reproduce lo que ya paso (por si el cliente reconecta a mitad de proceso)
  for (const e of job.events) send(e);
  if (job.status !== 'corriendo') return res.end();

  const onEvent = (e) => send(e);
  job.emitter.on('event', onEvent);
  req.on('close', () => job.emitter.off('event', onEvent));
});

app.get('/descargar/:jobId', (req, res) => {
  const job = jobs.get(req.params.jobId);
  if (!job || !job.videoPath || !fs.existsSync(job.videoPath)) {
    return res.status(404).send('Video no encontrado (¿ya se genero?).');
  }
  res.download(job.videoPath, 'video-final.mp4');
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor local corriendo: http://localhost:${PORT}`);
  console.log('   Deja esta ventana abierta y usa esa direccion en el navegador.\n');
});
