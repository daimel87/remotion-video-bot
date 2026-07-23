#!/usr/bin/env node
/**
 * Material de ARCHIVO para el documental "Guillermo González Camarena"
 * (yt-dlp, fair use). Fragmentos breves de época con narración original ->
 * transformativo, fin educativo.
 *
 * Requisitos en tu PC:  winget install yt-dlp   y   winget install ffmpeg
 * Uso (cmd, dentro de la carpeta del proyecto):
 *   git pull
 *   node scripts/download-gc-archival.mjs
 *
 * Descarga a public/archival-gc/<id>.mp4 (<=720p, tramo indicado). Reanudable
 * (omite lo ya bajado). Guarda fuentes en CREDITS-ARCHIVAL.txt.
 *
 * ¿Un clip salió mal (resultado equivocado)? Borra ese .mp4 y:
 *   - vuelve a correr (reintenta la búsqueda), o
 *   - MEJOR: pega la URL EXACTA de YouTube en el bloque URLS de abajo.
 *     Las URLs exactas son lo más confiable (las búsquedas a veces traen basura).
 */
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'archival-gc');
fs.mkdirSync(OUT, {recursive: true});

// =============================================================================
//  1) URLs EXACTAS  ->  lo más confiable. Pega aquí enlaces de YouTube que TÚ
//     hayas visto y que sirvan (ej. algún documental de Canal 5/History Channel
//     Latinoamérica sobre González Camarena). section: "*inicio-fin".
//     Ejemplo:  {id: 'gc-doc-canal5', url: 'https://youtu.be/XXXX', section: '*0:10-2:30', note: '...'}
// =============================================================================
const URLS = [
  // {id: 'gc-doc-canal5', url: 'https://www.youtube.com/watch?v=XXXXXXXX', section: '*0:00-1:30', note: 'Documental Canal 5 sobre GGC'},
];

// =============================================================================
//  2) BÚSQUEDAS (yt-dlp elige el 1er resultado). Sesgadas a documental/noticia/
//     archivo de época -> muestran al personaje o la tecnología real.
// =============================================================================
const SEARCHES = [
  // --- Guillermo González Camarena directamente ---
  {id: 'gc-documental',        q: 'Guillermo Gonzalez Camarena documental biografia', section: '*0:00-2:30', note: 'Documental biográfico'},
  {id: 'gc-historia-tv-color', q: 'historia television a color mexico Gonzalez Camarena', section: '*0:00-2:00', note: 'Historia TV a color en México'},
  {id: 'gc-canal5-xhgc',       q: 'Canal 5 XHGC historia television mexicana', section: '*0:00-1:50', note: 'Historia Canal 5 / XHGC'},
  {id: 'gc-patente-noticia',   q: 'Guillermo Gonzalez Camarena patente television color noticia', section: '*0:00-1:40', note: 'Noticia sobre la patente'},
  // --- Sistema tricromático / disco giratorio (contexto técnico) ---
  {id: 'mechanical-color-disc', q: 'mechanical color television disc system demonstration vintage', section: '*0:00-1:40', note: 'Sistema de disco mecánico a color'},
  {id: 'cbs-goldmark-1940',    q: 'CBS field sequential color television 1940 Goldmark demonstration', section: '*0:00-1:40', note: 'Sistema CBS de Goldmark (1940)'},
  {id: 'rca-color-tv-1950s',   q: 'RCA color television commercial 1950s advertisement', section: '*0:00-1:20', note: 'RCA televisión a color (anuncio años 50)'},
  // --- Contexto histórico mexicano ---
  {id: 'mexico-revolucion-1917', q: 'Mexican Revolution 1917 archival footage Guadalajara', section: '*0:00-1:30', note: 'Revolución mexicana (archivo 1917)'},
  {id: 'mexico-city-1930s',    q: 'Mexico City 1930s archival footage street', section: '*0:00-1:30', note: 'Ciudad de México años 30 (archivo)'},
  {id: 'ipn-politecnico-historia', q: 'Instituto Politecnico Nacional historia archivo IPN', section: '*0:00-1:30', note: 'Historia del IPN/ESIME'},
  {id: 'vintage-tv-broadcast-mx', q: 'television mexicana 1950 1960 transmision archivo', section: '*0:00-1:40', note: 'Transmisión de TV mexicana de época'},
  // --- Cierre / mito NASA ---
  {id: 'voyager-nasa-images',  q: 'Voyager probe NASA space images broadcast archival', section: '*0:00-1:20', note: 'Sondas Voyager / NASA (para el mito, aclarado como no confirmado)'},
  // --- Huapango / música ---
  {id: 'huapango-mexicano',    q: 'huapango mexicano tradicional musica en vivo', section: '*0:00-1:20', note: 'Huapango tradicional (para "Río Colorado")'},
];

const CLIPS = [
  ...URLS.map((u) => ({...u, src: u.url})),
  ...SEARCHES.map((s) => ({...s, src: `ytsearch1:${s.q}`})),
];

const CREDITS = path.join(OUT, 'CREDITS-ARCHIVAL.txt');
const creditLines = fs.existsSync(CREDITS) ? [fs.readFileSync(CREDITS, 'utf8')] : [
  'FUENTES DE ARCHIVO — uso legítimo (fair use): fragmentos breves con fines de\n' +
  'comentario, crítica y educación, acompañados de narración original. Fuentes:\n\n',
];

// limpia restos de descargas cortadas (.part / fragmentos) para no dejar archivos a medias
for (const f of fs.readdirSync(OUT)) {
  if (/\.(part|ytdl|part-Frag\d+|temp)$/.test(f)) {try {fs.unlinkSync(path.join(OUT, f));} catch {}}
}

let ok = 0, fail = 0, skip = 0;
for (const clip of CLIPS) {
  const dest = path.join(OUT, `${clip.id}.mp4`);
  if (fs.existsSync(dest)) {console.log(`⏭  ${clip.id} (ya existe)`); skip++; continue;}
  console.log(`\n▶ ${clip.id} — ${clip.note}`);
  try {
    execSync(
      `yt-dlp "${clip.src}" ` +
      `-f "bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/b[height<=720]" ` +
      `--download-sections "${clip.section}" --force-keyframes-at-cuts ` +
      `--socket-timeout 30 --retries 5 --fragment-retries 20 --retry-sleep 2 --concurrent-fragments 4 ` +
      `--no-playlist --merge-output-format mp4 ` +
      `-o "${dest}" --print-to-file "%(title)s | %(uploader)s | %(webpage_url)s" "${CREDITS}.tmp"`,
      {stdio: 'inherit', timeout: 8 * 60 * 1000}, // si un clip tarda >8 min, se corta y sigue con el siguiente
    );
    if (fs.existsSync(`${CREDITS}.tmp`)) {
      creditLines.push(`${clip.id}.mp4: ${fs.readFileSync(`${CREDITS}.tmp`, 'utf8').trim()}\n`);
      fs.unlinkSync(`${CREDITS}.tmp`);
    }
    ok++;
  } catch {
    for (const f of fs.readdirSync(OUT)) {
      if (f.startsWith(clip.id) && /\.(mp4|part|ytdl|temp)/.test(f)) {try {fs.unlinkSync(path.join(OUT, f));} catch {}}
    }
    console.log(`✗ Falló/atascó ${clip.id} — borrado el parcial, se continúa`); fail++;
  }
}
fs.writeFileSync(CREDITS, creditLines.join(''));
console.log(`\n✅ Listo: ${ok} descargados, ${skip} ya existían, ${fail} fallidos.`);
console.log('Revisa las miniaturas en public/archival-gc/. Si alguno salió mal, bórralo');
console.log('y pega su URL exacta en el bloque URLS del script, o vuelve a correr.');
console.log('Luego: git add public/archival-gc && git commit -m "Archivo GC" && git push');
