#!/usr/bin/env node
/**
 * Material de ARCHIVO vintage para el canal de salud/cocina (yt-dlp, uso legítimo / fair use).
 * Fragmentos breves de época (cocinas antiguas, anuncios vintage, listas de precios)
 * acompañados de narración original -> transformativo, con fin educativo.
 *
 * Requisitos en tu PC:  winget install yt-dlp   y   winget install ffmpeg
 * Uso:                  node scripts/download-health-archival.mjs
 *
 * Descarga solo el tramo indicado a public/archival-health/<id>.mp4
 * y guarda las fuentes en CREDITS-ARCHIVAL.txt. Reanudable.
 *
 * NOTA: las queries de abajo son un punto de partida genérico. Mañana, con la
 * transcripción real, ajustaré la lista a los temas concretos del video.
 */
import {execSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'archival-health');
fs.mkdirSync(OUT, {recursive: true});

const CLIPS = [
  {id: 'vintage-kitchen-1950s', src: 'ytsearch1:1950s housewife cooking kitchen archival film', section: '*0:00-1:30', note: 'Cocina casera años 50'},
  {id: 'depression-era-cooking', src: 'ytsearch1:great depression era cooking frugal meals archival', section: '*0:00-1:30', note: 'Cocina de la Gran Depresión'},
  {id: 'vintage-grocery-prices', src: 'ytsearch1:1950s grocery store prices vintage advertisement', section: '*0:00-1:00', note: 'Precios de supermercado de época'},
  {id: 'vintage-food-ad', src: 'ytsearch1:vintage canned soup commercial 1960s', section: '*0:00-1:00', note: 'Anuncio de comida vintage'},
  {id: 'senior-health-vintage', src: 'ytsearch1:elderly nutrition public health film archival', section: '*0:00-1:30', note: 'Nutrición para mayores (film educativo)'},
];

const CREDITS = path.join(OUT, 'CREDITS-ARCHIVAL.txt');
const creditLines = fs.existsSync(CREDITS) ? [fs.readFileSync(CREDITS, 'utf8')] : [
  'FUENTES DE ARCHIVO — uso legítimo (fair use): fragmentos breves con fines de\n' +
  'comentario y educación, acompañados de narración original.\n\n',
];

let ok = 0, fail = 0, skip = 0;
for (const clip of CLIPS) {
  const dest = path.join(OUT, `${clip.id}.mp4`);
  if (fs.existsSync(dest)) {console.log(`⏭  ${clip.id} (ya existe)`); skip++; continue;}
  console.log(`\n▶ ${clip.id} — ${clip.note}`);
  try {
    execSync(
      `yt-dlp "${clip.src}" ` +
      // 480p máx (liviano); sin --max-filesize (con --download-sections aborta de más)
      `-f "bv*[height<=480][ext=mp4]+ba[ext=m4a]/b[height<=480][ext=mp4]/b[height<=480]" ` +
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
  } catch {console.log(`✗ Falló ${clip.id}`); fail++;}
}
fs.writeFileSync(CREDITS, creditLines.join(''));
console.log(`\n✅ Listo: ${ok} descargados, ${skip} ya existían, ${fail} fallidos.`);
