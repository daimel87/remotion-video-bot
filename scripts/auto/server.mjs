#!/usr/bin/env node
/**
 * Interfaz web local del pipeline audio->video.
 *
 * Uso:
 *   PEXELS_KEY=xxx PIXABAY_KEY=yyy node scripts/auto/server.mjs
 *   -> abre http://localhost:7788
 *
 * No usa dependencias externas (solo http/fs/child_process de Node). Sirve la
 * UI (ui.html) y expone endpoints que corren los scripts 1..4 del pipeline y
 * leen/escriben los JSON de work/<nombre>/. El plato fuerte es el selector
 * visual de candidatos: ves el frame de cada clip y eliges con un clic el que
 * ilustra cada frase (escribe picks.json por ti).
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const WORK = path.join(ROOT, 'work');
const PORT = process.env.AUTO_UI_PORT || 7788;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.m4a': 'audio/mp4',
  '.mp4': 'video/mp4',
};

const send = (res, code, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, {'Content-Type': type, 'Cache-Control': 'no-store'});
  res.end(body);
};
const sendJson = (res, code, obj) => send(res, code, JSON.stringify(obj), MIME['.json']);

const readBody = (req) =>
  new Promise((resolve) => {
    let d = '';
    req.on('data', (c) => (d += c));
    req.on('end', () => {
      try {
        resolve(d ? JSON.parse(d) : {});
      } catch {
        resolve({});
      }
    });
  });

// Corre un script del pipeline y devuelve {ok, out}.
const run = (script, args, extraEnv = {}) =>
  new Promise((resolve) => {
    const child = spawn('node', [path.join(__dirname, script), ...args], {
      cwd: ROOT,
      env: {...process.env, ...extraEnv},
    });
    let out = '';
    child.stdout.on('data', (c) => (out += c));
    child.stderr.on('data', (c) => (out += c));
    child.on('close', (code) => resolve({ok: code === 0, code, out}));
  });

const readJsonSafe = (p) => {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
};

const listProjects = () => {
  if (!fs.existsSync(WORK)) return [];
  return fs
    .readdirSync(WORK, {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => {
      const dir = path.join(WORK, d.name);
      const has = (f) => fs.existsSync(path.join(dir, f));
      return {
        name: d.name,
        srt: has('subtitles.srt'),
        shots: has('shots.json'),
        queries: has('queries.json'),
        candidates: has('candidates.json'),
        picks: has('picks.json'),
      };
    });
};

// Sirve un archivo dentro de work/ o public/ de forma segura (sin salir de ROOT).
const serveFile = (res, rel) => {
  const abs = path.resolve(ROOT, rel);
  if (!abs.startsWith(ROOT) || !fs.existsSync(abs) || fs.statSync(abs).isDirectory()) {
    return send(res, 404, 'not found', 'text/plain');
  }
  const type = MIME[path.extname(abs).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {'Content-Type': type, 'Cache-Control': 'no-store'});
  fs.createReadStream(abs).pipe(res);
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;
  const q = url.searchParams;

  try {
    // --- UI ---
    if (p === '/' || p === '/index.html') {
      return serveFile(res, path.relative(ROOT, path.join(__dirname, 'ui.html')));
    }

    // --- Estado / proyectos ---
    if (p === '/api/state' && req.method === 'GET') {
      return sendJson(res, 200, {
        projects: listProjects(),
        hasPexels: Boolean(process.env.PEXELS_KEY),
        hasPixabay: Boolean(process.env.PIXABAY_KEY),
      });
    }

    // --- Leer JSON de un proyecto ---
    if (p === '/api/project' && req.method === 'GET') {
      const name = q.get('name');
      const dir = path.join(WORK, name || '');
      if (!name || !fs.existsSync(dir)) return sendJson(res, 404, {error: 'no existe'});
      return sendJson(res, 200, {
        name,
        meta: readJsonSafe(path.join(dir, 'meta.json')),
        shots: readJsonSafe(path.join(dir, 'shots.json')),
        queries: readJsonSafe(path.join(dir, 'queries.json')),
        candidates: readJsonSafe(path.join(dir, 'candidates.json')),
        picks: readJsonSafe(path.join(dir, 'picks.json')),
      });
    }

    // --- Servir un frame o el audio ---
    if (p === '/file' && req.method === 'GET') {
      const rel = q.get('path');
      if (!rel) return send(res, 400, 'falta path', 'text/plain');
      return serveFile(res, rel);
    }

    // --- Subir un audio desde el navegador (body = bytes del fichero) ---
    if (p === '/api/upload' && req.method === 'POST') {
      const fname = (q.get('filename') || 'audio').replace(/[^a-z0-9._-]+/gi, '_');
      const upDir = path.join(ROOT, 'uploads');
      fs.mkdirSync(upDir, {recursive: true});
      const dest = path.join(upDir, fname);
      const ws = fs.createWriteStream(dest);
      req.pipe(ws);
      await new Promise((r) => ws.on('close', r));
      return sendJson(res, 200, {ok: true, path: path.relative(ROOT, dest).split(path.sep).join('/')});
    }

    // --- Paso 1: transcribir ---
    if (p === '/api/transcribe' && req.method === 'POST') {
      const b = await readBody(req);
      if (!b.audio) return sendJson(res, 400, {error: 'falta audio (ruta en disco)'});
      const args = [b.audio];
      if (b.name) args.push(b.name);
      if (b.lang) args.push('--lang', b.lang);
      if (b.srt) args.push('--srt', b.srt);
      const r = await run('1-transcribe.mjs', args);
      return sendJson(res, r.ok ? 200 : 500, r);
    }

    // --- Paso 2: tomas ---
    if (p === '/api/shots' && req.method === 'POST') {
      const b = await readBody(req);
      const args = [b.name];
      if (b.target) args.push('--target', String(b.target));
      if (b.min) args.push('--min', String(b.min));
      if (b.max) args.push('--max', String(b.max));
      const r = await run('2-shots.mjs', args);
      return sendJson(res, r.ok ? 200 : 500, r);
    }

    // --- Guardar queries.json (editado en la UI o por Claude) ---
    if (p === '/api/queries' && req.method === 'POST') {
      const b = await readBody(req);
      const dir = path.join(WORK, b.name || '');
      if (!b.name || !fs.existsSync(dir)) return sendJson(res, 404, {error: 'no existe'});
      fs.writeFileSync(path.join(dir, 'queries.json'), JSON.stringify(b.queries, null, 2));
      return sendJson(res, 200, {ok: true});
    }

    // --- Paso 3: fetch (claves opcionales en el body) ---
    if (p === '/api/fetch' && req.method === 'POST') {
      const b = await readBody(req);
      const extra = {};
      if (b.pexels) extra.PEXELS_KEY = b.pexels;
      if (b.pixabay) extra.PIXABAY_KEY = b.pixabay;
      const r = await run('3-fetch.mjs', [b.name], extra);
      return sendJson(res, r.ok ? 200 : 500, r);
    }

    // --- Guardar picks.json (desde el selector visual) ---
    if (p === '/api/picks' && req.method === 'POST') {
      const b = await readBody(req);
      const dir = path.join(WORK, b.name || '');
      if (!b.name || !fs.existsSync(dir)) return sendJson(res, 404, {error: 'no existe'});
      fs.writeFileSync(path.join(dir, 'picks.json'), JSON.stringify(b.picks, null, 2));
      return sendJson(res, 200, {ok: true});
    }

    // --- Paso 4: emit ---
    if (p === '/api/emit' && req.method === 'POST') {
      const b = await readBody(req);
      const r = await run('4-emit.mjs', [b.name]);
      return sendJson(res, r.ok ? 200 : 500, r);
    }

    return send(res, 404, 'not found', 'text/plain');
  } catch (e) {
    return sendJson(res, 500, {error: String(e && e.message ? e.message : e)});
  }
});

server.listen(PORT, () => {
  console.log(`\n  Pipeline audio->video UI  ->  http://localhost:${PORT}\n`);
  console.log(`  Claves: PEXELS_KEY=${process.env.PEXELS_KEY ? 'ok' : '-'}  PIXABAY_KEY=${process.env.PIXABAY_KEY ? 'ok' : '-'}`);
  console.log(`  (tambien puedes ponerlas en la UI para el paso 3)\n`);
});
