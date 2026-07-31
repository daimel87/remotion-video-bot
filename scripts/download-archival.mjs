#!/usr/bin/env node
/**
 * Descarga clips de ARCHIVO para el documental del CD usando yt-dlp.
 *
 * Requisitos en tu PC:
 *   1. Instalar yt-dlp:  winget install yt-dlp   (o: pip install yt-dlp)
 *   2. Tener ffmpeg (yt-dlp lo usa para cortar secciones):  winget install ffmpeg
 *
 * Uso:
 *   node scripts/download-archival.mjs
 *
 * Descarga a public/archival/<id>.mp4 (720p máx, solo la sección indicada)
 * y guarda las fuentes en public/archival/CREDITS-ARCHIVAL.txt (documentación fair use).
 *
 * Cada entrada usa búsqueda de YouTube (ytsearch1: = primer resultado).
 * Si un clip baja mal (resultado equivocado), bórralo y vuelve a correr con
 * otra query, o pega una URL exacta en el campo "src".
 */

import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'archival');
fs.mkdirSync(OUT, {recursive: true});

// ---------- MANIFIESTO: mapeado al guion "¿Por qué murió el CD?" ----------
// section: "*inicio-fin" (se descarga solo ese tramo del video fuente)
const CLIPS = [
  // Cap 1 — El rey del casete
  {id: 'walkman-ad-1979',      src: 'ytsearch1:sony walkman commercial 1979 original ad', section: '*0:00-1:00', note: 'Anuncio Walkman 1979'},
  {id: 'cassette-dubbing',     src: 'ytsearch1:cassette tape dubbing home recording 1980s', section: '*0:00-1:30', note: 'Copia casera de casetes'},
  // Cap 2 — El disco perfecto
  {id: 'cd-intro-1982',        src: 'ytsearch1:"compact disc" 1982 vintage news report archival footage launch', section: '*0:00-2:00', note: 'Presentación del CD 1982 (v2, evitar docu de fonógrafo Edison)'},
  {id: 'cd-how-it-works',      src: 'ytsearch1:how a cd works laser optical disc explained animation', section: '*0:00-2:00', note: 'Cómo funciona el CD / láser (v2)'},
  {id: 'cdp101-player',        src: 'ytsearch1:sony cdp-101 first cd player 1982', section: '*0:00-1:30', note: 'Primer reproductor CDP-101'},
  // Cap 3 — La mina de oro
  {id: 'cd-store-90s',         src: 'ytsearch1:record store cd shopping 1990s news footage', section: '*0:00-1:30', note: 'Tiendas de CDs años 90'},
  // Cap 4 — La rebelión (MP3 / internet)
  {id: 'mp3-fraunhofer',       src: 'ytsearch1:karlheinz brandenburg mp3 inventor interview documentary', section: '*0:00-2:00', note: 'Historia del MP3 (v2, la primera búsqueda falló al descargar)'},
  {id: 'dialup-internet-90s',  src: 'ytsearch1:internet 1995 dial up news report AOL', section: '*0:00-1:30', note: 'Internet de los 90'},
  {id: 'rio-pmp300',           src: 'ytsearch1:diamond rio pmp300 mp3 player 1998 review news', section: '*0:00-1:30', note: 'Rio PMP300'},
  // Cap 5 — Napster
  {id: 'napster-news-1999',    src: 'ytsearch1:napster news report 1999 2000 cnn', section: '*0:00-2:00', note: 'Noticiero Napster'},
  {id: 'shawn-fanning',        src: 'ytsearch1:shawn fanning napster founder news interview archive 2000', section: '*0:00-1:30', note: 'Shawn Fanning (v2, la anterior no se pudo confirmar)'},
  {id: 'ulrich-senate-2000',   src: 'ytsearch1:lars ulrich senate testimony napster 2000', section: '*0:00-2:00', note: 'Ulrich en el Senado (dominio público, obra del gob. EE.UU.)'},
  {id: 'napster-shutdown',     src: 'ytsearch1:napster shut down 2001 news report', section: '*0:00-1:30', note: 'Cierre de Napster'},
  {id: 'kazaa-limewire',       src: 'ytsearch1:kazaa limewire file sharing 2002 news', section: '*0:00-1:30', note: 'Kazaa/LimeWire'},
  // Cap 6 — Apple
  {id: 'ipod-keynote-2001',    src: 'ytsearch1:steve jobs introduces ipod 2001 1000 songs in your pocket', section: '*0:00-3:00', note: 'Keynote iPod 2001'},
  {id: 'itunes-store-2003',    src: 'ytsearch1:steve jobs itunes music store introduction 2003', section: '*0:00-2:30', note: 'Keynote iTunes Store 2003'},
  {id: 'iphone-2007',          src: 'ytsearch1:steve jobs iphone introduction 2007 keynote', section: '*0:00-2:00', note: 'Keynote iPhone 2007'},
  // Caída del CD / Tower
  {id: 'tower-records-close',  src: 'ytsearch1:tower records closing 2006 news report bankruptcy', section: '*0:00-2:00', note: 'Cierre de Tower Records'},
  // Cap 7 — Sony rootkit
  {id: 'sony-rootkit-2005',    src: 'ytsearch1:sony bmg rootkit cd scandal cnn abc nbc news 2005 archival', section: '*0:00-2:00', note: 'Escándalo rootkit Sony (v2, la anterior era un video moderno no de época)'},
  // Cap 8 — Streaming / veredicto
  {id: 'spotify-ek',           src: 'ytsearch1:daniel ek spotify founder ceo news interview launch', section: '*0:00-1:30', note: 'Daniel Ek / Spotify (v2, la anterior no se pudo confirmar identidad)'},
  {id: 'vinyl-revival',        src: 'ytsearch1:vinyl revival news report record sales comeback', section: '*0:00-1:30', note: 'Regreso del vinilo'},
];
// --------------------------------------------------------------------------

const CREDITS = path.join(OUT, 'CREDITS-ARCHIVAL.txt');
const creditLines = fs.existsSync(CREDITS) ? [fs.readFileSync(CREDITS, 'utf8')] : [
  'FUENTES DE MATERIAL DE ARCHIVO — documentación de uso legítimo (fair use)\n' +
  'Fragmentos breves usados con fines de comentario, crítica y educación,\n' +
  'acompañados de narración original. Fuentes:\n\n',
];

let ok = 0, fail = 0, skip = 0;
for (const clip of CLIPS) {
  const dest = path.join(OUT, `${clip.id}.mp4`);
  if (fs.existsSync(dest)) {console.log(`⏭  ${clip.id} (ya existe)`); skip++; continue;}
  console.log(`\n▶ Descargando: ${clip.id} — ${clip.note}`);
  try {
    // 720p máx, mp4, solo la sección indicada; --print para registrar la fuente real
    execSync(
      `yt-dlp "${clip.src}" ` +
      `-f "bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/b[height<=720]" ` +
      `--download-sections "${clip.section}" --force-keyframes-at-cuts ` +
      `--no-playlist --merge-output-format mp4 ` +
      `-o "${dest}" --print-to-file "%(title)s | %(uploader)s | %(webpage_url)s" "${CREDITS}.tmp"`,
      {stdio: 'inherit', timeout: 10 * 60 * 1000}
    );
    if (fs.existsSync(`${CREDITS}.tmp`)) {
      creditLines.push(`${clip.id}.mp4: ${fs.readFileSync(`${CREDITS}.tmp`, 'utf8').trim()}\n`);
      fs.unlinkSync(`${CREDITS}.tmp`);
    }
    ok++;
  } catch {
    console.log(`✗ Falló ${clip.id} — se continúa con el siguiente`);
    fail++;
  }
}
fs.writeFileSync(CREDITS, creditLines.join(''));
console.log(`\n✅ Listo: ${ok} descargados, ${skip} ya existían, ${fail} fallidos.`);
console.log('Revisa los clips en public/archival/ (borra y re-corre si alguno salió mal).');
console.log('Luego:  git add public/archival && git commit -m "Add archival clips" && git push');
