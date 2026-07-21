#!/usr/bin/env node
/**
 * Material de ARCHIVO para el documental "La historia de BlackBerry" (yt-dlp, fair use).
 * Fragmentos breves de época con narración original -> transformativo, fin educativo.
 *
 * >>> OBJETIVO DE ESTA VERSIÓN: MÁS VARIEDAD REAL DE BLACKBERRY <<<
 * El problema no es la directiva anti-repetición, es que había pocos clips REALES
 * de BlackBerry y se repetían. Aquí se descargan MUCHOS clips distintos:
 * reviews / unboxings / anuncios de cada modelo (Bold, Curve, Pearl, Torch, Passport,
 * Classic, KEY2, Z10, Priv, Storm, PlayBook) + BBM + noticias. Los unboxings/hands-on
 * muestran el aparato de forma CONTINUA -> mucho metraje utilizable.
 *
 * Requisitos en tu PC:  winget install yt-dlp   y   winget install ffmpeg
 * Uso (cmd, dentro de la carpeta del proyecto):
 *   git pull
 *   node scripts/download-blackberry-archival.mjs
 *
 * Descarga a public/archival-bb/<id>.mp4 (<=720p, tramo indicado). Reanudable
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
const OUT = path.join(ROOT, 'public', 'archival-bb');
fs.mkdirSync(OUT, {recursive: true});

// =============================================================================
//  1) URLs EXACTAS  ->  lo más confiable. Pega aquí enlaces de YouTube que TÚ
//     hayas visto que muestran BlackBerry. section: "*inicio-fin" (tramo a bajar).
//     Ejemplo:  {id: 'bb-passport-hero', url: 'https://youtu.be/XXXX', section: '*0:10-2:30', note: '...'}
// =============================================================================
const URLS = [
  // {id: 'bb-bold-official-ad', url: 'https://www.youtube.com/watch?v=XXXXXXXX', section: '*0:00-1:30', note: 'Anuncio oficial Bold'},
];

// =============================================================================
//  2) BÚSQUEDAS (yt-dlp elige el 1er resultado). Sesgadas a review/unboxing/hands-on
//     /commercial -> muestran el APARATO. Tramos largos para tener de dónde cortar.
// =============================================================================
const SEARCHES = [
  // --- Modelos (unboxing / hands-on: aparato continuo en pantalla) ---
  {id: 'bb-bold-9900',     q: 'BlackBerry Bold 9900 unboxing hands on', section: '*0:00-2:30', note: 'Bold 9900 (unboxing)'},
  {id: 'bb-bold-9000',     q: 'BlackBerry Bold 9000 review 2008', section: '*0:20-2:30', note: 'Bold 9000 (review 2008)'},
  {id: 'bb-curve-8520',    q: 'BlackBerry Curve 8520 unboxing hands on', section: '*0:00-2:20', note: 'Curve 8520 (unboxing)'},
  {id: 'bb-pearl-8100',    q: 'BlackBerry Pearl 8100 review 2006', section: '*0:10-2:20', note: 'Pearl 8100 (2006)'},
  {id: 'bb-torch-9800',    q: 'BlackBerry Torch 9800 unboxing hands on', section: '*0:00-2:30', note: 'Torch 9800 (unboxing)'},
  {id: 'bb-passport',      q: 'BlackBerry Passport unboxing hands on', section: '*0:10-2:40', note: 'Passport (unboxing)'},
  {id: 'bb-classic-q20',   q: 'BlackBerry Classic Q20 unboxing hands on', section: '*0:10-2:30', note: 'Classic Q20 (unboxing)'},
  {id: 'bb-z10',           q: 'BlackBerry Z10 unboxing hands on', section: '*0:10-2:30', note: 'Z10 (unboxing)'},
  {id: 'bb-priv',          q: 'BlackBerry Priv unboxing hands on', section: '*0:10-2:30', note: 'Priv (unboxing)'},
  {id: 'bb-storm-9530',    q: 'BlackBerry Storm 9530 review 2008', section: '*0:10-2:30', note: 'Storm 9530 (review)'},
  {id: 'bb-playbook',      q: 'BlackBerry PlayBook tablet review 2011', section: '*0:10-2:20', note: 'PlayBook (review 2011)'},
  {id: 'bb-9700',          q: 'BlackBerry Bold 9700 review hands on', section: '*0:10-2:20', note: 'Bold 9700 (review)'},
  // --- El aparato / teclado en primer plano ---
  {id: 'bb-typing-closeup',q: 'BlackBerry keyboard typing closeup asmr', section: '*0:00-1:40', note: 'Teclado en primer plano'},
  {id: 'bb-broll-cinematic', q: 'BlackBerry phone cinematic b-roll', section: '*0:00-1:30', note: 'B-roll cinematográfico'},
  {id: 'bb-original-957',  q: 'BlackBerry 957 950 original pager device 2000', section: '*0:00-1:40', note: 'BlackBerry original (957/950)'},
  // --- BBM / mensajería ---
  {id: 'bbm-commercial',   q: 'BlackBerry Messenger BBM official commercial', section: '*0:00-1:30', note: 'Anuncio oficial BBM'},
  {id: 'bbm-promo-2010',   q: 'BlackBerry Messenger BBM promo 2010 features', section: '*0:00-1:40', note: 'BBM promo (funciones)'},
  // --- Anuncios oficiales de marca ---
  {id: 'bb-official-ad-2011', q: 'BlackBerry official commercial 2011 love what you do', section: '*0:00-1:20', note: 'Anuncio oficial 2011'},
  {id: 'bb-brand-ad',      q: 'BlackBerry commercial advert official 2010', section: '*0:00-1:20', note: 'Anuncio de marca'},
  // --- Cultura / CrackBerry / LatAm ---
  {id: 'crackberry-tv',    q: 'CrackBerry addiction tv news segment report', section: '*0:00-1:50', note: 'Adicción CrackBerry (TV)'},
  {id: 'bb-latam-noticia', q: 'BlackBerry popularidad Latinoamerica pin noticia', section: '*0:00-1:40', note: 'BlackBerry en LatAm (noticia)'},
  {id: 'bb-red-carpet',    q: 'celebrity holding blackberry red carpet 2009', section: '*0:00-1:20', note: 'Celebridades con BlackBerry'},
  // --- Historia / caída ---
  {id: 'rim-doc-riseandfall', q: 'rise and fall of BlackBerry documentary RIM', section: '*0:30-2:40', note: 'Auge y caída (documental)'},
  {id: 'bb-decline-news',  q: 'BlackBerry decline collapse news report 2013', section: '*0:00-1:50', note: 'La caída (noticia 2013)'},
  {id: 'obama-bb-news',    q: 'Obama BlackBerry security president news 2009', section: '*0:00-1:40', note: 'BlackBerry de Obama (noticia)'},
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

let ok = 0, fail = 0, skip = 0;
for (const clip of CLIPS) {
  const dest = path.join(OUT, `${clip.id}.mp4`);
  if (fs.existsSync(dest)) {console.log(`⏭  ${clip.id} (ya existe)`); skip++; continue;}
  console.log(`\n▶ ${clip.id} — ${clip.note}`);
  try {
    execSync(
      `yt-dlp "${clip.src}" ` +
      `-f "bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720][ext=mp4]/b[height<=720]" ` +
      // (sin --max-filesize: con --download-sections compara el video completo y aborta;
      //  el tramo + 720p ya lo mantiene liviano)
      `--download-sections "${clip.section}" --force-keyframes-at-cuts ` +
      `--no-playlist --merge-output-format mp4 ` +
      `-o "${dest}" --print-to-file "%(title)s | %(uploader)s | %(webpage_url)s" "${CREDITS}.tmp"`,
      {stdio: 'inherit', timeout: 12 * 60 * 1000},
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
console.log('Revisa las miniaturas en public/archival-bb/. Si alguno salió mal, bórralo');
console.log('y pega su URL exacta en el bloque URLS del script, o vuelve a correr.');
console.log('Luego: git add public/archival-bb && git commit -m "Mas archivo BB" && git push');
