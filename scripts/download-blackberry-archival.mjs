#!/usr/bin/env node
/**
 * Material de ARCHIVO para el documental "La historia de BlackBerry" (yt-dlp, fair use).
 * Fragmentos breves de época con narración original -> transformativo, fin educativo.
 *
 * Requisitos en tu PC:  winget install yt-dlp   y   winget install ffmpeg
 * Uso (en cmd, dentro de la carpeta del proyecto):
 *   git pull
 *   node scripts/download-blackberry-archival.mjs
 *
 * Descarga solo el tramo indicado a public/archival-bb/<id>.mp4 (<=720p),
 * guarda fuentes en CREDITS-ARCHIVAL.txt. Reanudable (omite lo ya bajado).
 *
 * Si un clip baja mal (resultado equivocado), borra ese .mp4 y vuelve a correr;
 * o cambia la query "src" por una URL exacta de YouTube.
 */
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'archival-bb');
fs.mkdirSync(OUT, {recursive: true});

// section: "*inicio-fin" -> se descarga solo ese tramo del video fuente.
const CLIPS = [
  // --- Orígenes / RIM (Waterloo, Canadá) ---
  {id: 'rim-founders',        src: 'ytsearch1:mike lazaridis jim balsillie RIM blackberry founders interview archival', section: '*0:00-1:30', note: 'Fundadores de RIM'},
  {id: 'blackberry-850-1999', src: 'ytsearch1:blackberry 850 pager 1999 first device commercial', section: '*0:00-1:00', note: 'Primer BlackBerry 850 (1999)'},
  {id: 'two-way-pager-90s',   src: 'ytsearch1:two way pager 1990s email news report', section: '*0:00-1:00', note: 'Buscapersonas de dos vías (90s)'},
  // --- Auge / "CrackBerry" ---
  {id: 'blackberry-ad-2000s', src: 'ytsearch1:blackberry commercial 2000s bold curve advert', section: '*0:00-1:00', note: 'Anuncio BlackBerry (años 2000)'},
  {id: 'crackberry-news',     src: 'ytsearch1:crackberry addiction blackberry news report 2006', section: '*0:00-1:30', note: 'Adicción "CrackBerry" (noticiero)'},
  {id: 'blackberry-keyboard', src: 'ytsearch1:blackberry qwerty keyboard typing closeup review', section: '*0:00-1:00', note: 'Teclado QWERTY (primer plano)'},
  {id: 'bbm-messenger',       src: 'ytsearch1:blackberry messenger BBM 2008 review news', section: '*0:00-1:00', note: 'BlackBerry Messenger (BBM)'},
  {id: 'obama-blackberry',    src: 'ytsearch1:obama blackberry 2009 news president security', section: '*0:00-1:30', note: 'El BlackBerry de Obama (2009)'},
  {id: 'wall-street-bb',      src: 'ytsearch1:wall street traders blackberry business 2007 news', section: '*0:00-1:00', note: 'Wall Street / negocios con BlackBerry'},
  // --- El disruptor: iPhone ---
  {id: 'iphone-2007-keynote', src: 'ytsearch1:steve jobs iphone introduction 2007 keynote', section: '*0:00-2:00', note: 'Keynote iPhone 2007 (dominio de época / fair use)'},
  {id: 'rim-reaction-iphone', src: 'ytsearch1:blackberry executives reaction iphone 2007 news skeptical', section: '*0:00-1:30', note: 'Reacción de RIM al iPhone'},
  // --- Errores / caída ---
  {id: 'blackberry-storm',    src: 'ytsearch1:blackberry storm 2008 touchscreen review fail', section: '*0:00-1:30', note: 'BlackBerry Storm (táctil fallido)'},
  {id: 'bb-outage-2011',      src: 'ytsearch1:blackberry global outage 2011 news report', section: '*0:00-1:00', note: 'Caída global del servicio (2011)'},
  {id: 'rim-layoffs-news',    src: 'ytsearch1:research in motion layoffs stock decline 2012 news', section: '*0:00-1:30', note: 'Despidos / caída de la acción (2012)'},
  {id: 'blackberry-10-launch',src: 'ytsearch1:blackberry 10 z10 launch 2013 event', section: '*0:00-1:30', note: 'Lanzamiento BlackBerry 10 / Z10 (2013)'},
  {id: 'bb-stops-phones-2016',src: 'ytsearch1:blackberry stops making phones 2016 news report', section: '*0:00-1:30', note: 'BlackBerry deja de fabricar teléfonos (2016)'},
];

const CREDITS = path.join(OUT, 'CREDITS-ARCHIVAL.txt');
const creditLines = fs.existsSync(CREDITS) ? [fs.readFileSync(CREDITS, 'utf8')] : [
  'FUENTES DE ARCHIVO — uso legítimo (fair use): fragmentos breves con fines de\n' +
  'comentario, crítica y educación, acompañados de narración original. Fuentes:\n\n',
];

let ok = 0, fail = 0, skip = 0;
for (const clip of CLIPS) {
  const dest = path.join(OUT, `${clip.id}.mp4`);
  if (fs.existsSync(dest)) {console.log(`⏭  ${clip.id} (ya existe)`); skip++; continue;}
  console.log(`\n▶ ${clip.id} — ${clip.note}`);
  try {
    execSync(
      `yt-dlp "${clip.src}" ` +
      `-f "bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/b[height<=720]" ` +
      // (sin --max-filesize: con --download-sections compara el tamaño del video
      //  completo y abortaba casi todo; el tramo + 720p ya lo mantiene liviano)
      `--download-sections "${clip.section}" --force-keyframes-at-cuts ` +
      `--no-playlist --merge-output-format mp4 ` +
      `-o "${dest}" --print-to-file "%(title)s | %(uploader)s | %(webpage_url)s" "${CREDITS}.tmp"`,
      {stdio: 'inherit', timeout: 10 * 60 * 1000},
    );
    if (fs.existsSync(`${CREDITS}.tmp`)) {
      creditLines.push(`${clip.id}.mp4: ${fs.readFileSync(`${CREDITS}.tmp`, 'utf8').trim()}\n`);
      fs.unlinkSync(`${CREDITS}.tmp`);
    }
    ok++;
  } catch {console.log(`✗ Falló ${clip.id} — se continúa`); fail++;}
}
fs.writeFileSync(CREDITS, creditLines.join(''));
console.log(`\n✅ Listo: ${ok} descargados, ${skip} ya existían, ${fail} fallidos.`);
console.log('Revisa public/archival-bb/ y luego: git add public/archival-bb && git commit -m "Add BB archival" && git push');
