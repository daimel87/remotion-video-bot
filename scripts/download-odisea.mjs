#!/usr/bin/env node
/**
 * Descarga TODO el material del documental de la Odisea desde varias fuentes:
 *   - Pexels        (fotos + videos)   -> necesita PEXELS_KEY
 *   - Pixabay       (fotos + videos)   -> necesita PIXABAY_KEY
 *   - Wikimedia Commons (fotos/arte)   -> SIN key (dominio público / CC)
 *
 * El material historico/artistico de la Odisea (estatuas, arte clasico, mapas,
 * grabados, bustos, tablillas hititas) sale sobre todo de Wikimedia Commons,
 * que es 100% limpio legalmente. Pexels/Pixabay aportan el AMBIENTE moderno
 * (mar, tormentas, ruinas, islas griegas, cielo estrellado, volcanes...).
 *
 * Uso (cmd, en la carpeta del proyecto):
 *   git pull
 *   node scripts/download-odisea.mjs   PEXELS_KEY   PIXABAY_KEY
 *   # o por variables de entorno:
 *   #   PEXELS_KEY=... PIXABAY_KEY=... node scripts/download-odisea.mjs
 *
 * Si falta una key, esa fuente se salta y las demas siguen. Es REANUDABLE:
 * vuelve a correrlo y solo baja lo que falte. Tope de 25 MB por video.
 *
 * Salida: public/stock-odisea/photos  y  public/stock-odisea/videos
 * Los archivos se nombran  <bloque>-<base>-<n>.<ext>  (ej. b2-troy-ruins-3.jpg)
 * para poder estructurar el render POR CAPITULOS.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// Args: las dos primeras que NO sean "bN" son las keys (pexels, pixabay).
// Cualquier arg tipo b1, b2... filtra para descargar SOLO ese/esos bloques.
//   node scripts/download-odisea.mjs PEXELS_KEY PIXABAY_KEY b1
//   node scripts/download-odisea.mjs PEXELS_KEY PIXABAY_KEY        (todo)
const rawArgs = process.argv.slice(2);
const chapterFilter = new Set(rawArgs.filter((a) => /^b\d+$/i.test(a)).map((a) => a.toLowerCase()));
const keyArgs = rawArgs.filter((a) => !/^b\d+$/i.test(a));
const PEXELS_KEY = keyArgs[0] || process.env.PEXELS_KEY || '';
const PIXABAY_KEY = keyArgs[1] || process.env.PIXABAY_KEY || '';
const MAX_BYTES = 25 * 1024 * 1024;

const PHOTOS_DIR = path.join(ROOT, 'public', 'stock-odisea', 'photos');
const VIDEOS_DIR = path.join(ROOT, 'public', 'stock-odisea', 'videos');
fs.mkdirSync(PHOTOS_DIR, {recursive: true});
fs.mkdirSync(VIDEOS_DIR, {recursive: true});

// Por defecto: cuantos por concepto. Se descarga DE SOBRA para tener variedad
// y no repetir tomas (regla del proyecto).
const DEF = {photo: 5, video: 2, commons: 5};

// ============================================================
// PLAN DE COBERTURA — por bloque del guion. src: pexels | pixabay | commons.
// commons SIEMPRE es foto. pexels/pixabay pueden ser foto o video.
// ============================================================
const PLAN = [
  // ---------- BLOQUE 1: HOOK + HOMERO ----------
  {ch: 'b1', base: 'stormy-sea-epic', src: 'pexels', type: 'video', q: 'dramatic stormy ocean waves dark'},
  {ch: 'b1', base: 'greek-gods-art', src: 'commons', q: 'ancient Greek gods mythology classical painting'},
  {ch: 'b1', base: 'greek-monster-art', src: 'commons', q: 'Greek mythology monster ancient vase painting'},
  {ch: 'b1', base: 'ancient-greek-ruins', src: 'pexels', type: 'photo', q: 'ancient greek temple ruins'},
  {ch: 'b1', base: 'mediterranean-coast', src: 'pexels', type: 'video', q: 'mediterranean sea rocky coast aerial'},
  {ch: 'b1', base: 'turkey-landscape', src: 'pixabay', type: 'photo', q: 'turkey anatolia landscape hills'},
  {ch: 'b1', base: 'homer-bust', src: 'commons', q: 'Homer Greek poet bust sculpture'},
  {ch: 'b1', base: 'odyssey-manuscript', src: 'commons', q: 'Odyssey Homer ancient manuscript papyrus'},
  {ch: 'b1', base: 'ancient-greece-map', src: 'commons', q: 'ancient Greece map Aegean antique'},
  {ch: 'b1', base: 'blind-poet-art', src: 'commons', q: 'Homer blind poet painting'},
  {ch: 'b1', base: 'ancient-greek-coin', src: 'commons', q: 'ancient Greek coin classical'},
  {ch: 'b1', base: 'old-book-candle', src: 'pixabay', type: 'photo', q: 'old book candle dark mystery'},

  // ---------- BLOQUE 2: SCHLIEMANN Y TROYA ----------
  {ch: 'b2', base: 'schliemann-portrait', src: 'commons', q: 'Heinrich Schliemann portrait'},
  {ch: 'b2', base: 'troy-excavation-old', src: 'commons', q: 'Troy Hisarlik excavation 19th century'},
  {ch: 'b2', base: 'priam-treasure', src: 'commons', q: 'Priam treasure Troy gold Schliemann'},
  {ch: 'b2', base: 'troy-ruins', src: 'commons', q: 'Troy ruins archaeological site Turkey'},
  {ch: 'b2', base: 'ancient-city-walls', src: 'pexels', type: 'photo', q: 'ancient stone city walls fortress ruins'},
  {ch: 'b2', base: 'archaeology-dig', src: 'pexels', type: 'video', q: 'archaeology excavation dig site brush'},
  {ch: 'b2', base: 'bronze-arrowhead', src: 'commons', q: 'bronze age arrowhead spearhead artifact'},
  {ch: 'b2', base: 'anatolia-map', src: 'commons', q: 'map Anatolia Bronze Age antique'},
  {ch: 'b2', base: 'excavation-layers', src: 'pixabay', type: 'photo', q: 'archaeological excavation soil layers'},
  {ch: 'b2', base: 'ruined-burnt-city', src: 'pexels', type: 'photo', q: 'ruined burnt ancient settlement stones'},

  // ---------- BLOQUE 3: QUE CUENTA LA ODISEA ----------
  {ch: 'b3', base: 'trojan-horse', src: 'commons', q: 'Trojan Horse painting classical'},
  {ch: 'b3', base: 'odysseus-art', src: 'commons', q: 'Odysseus Ulysses ancient Greek vase painting'},
  {ch: 'b3', base: 'greek-island', src: 'pexels', type: 'video', q: 'greek island aerial sea blue'},
  {ch: 'b3', base: 'wooden-ship-sailing', src: 'pexels', type: 'video', q: 'old wooden sailing ship sea'},
  {ch: 'b3', base: 'cyclops-polyphemus', src: 'commons', q: 'Polyphemus Cyclops Odysseus painting'},
  {ch: 'b3', base: 'circe-art', src: 'commons', q: 'Circe Odysseus painting swine'},
  {ch: 'b3', base: 'sirens-art', src: 'commons', q: 'Ulysses and the Sirens painting'},
  {ch: 'b3', base: 'whirlpool', src: 'pexels', type: 'video', q: 'ocean whirlpool water vortex'},
  {ch: 'b3', base: 'strait-messina', src: 'commons', q: 'Strait of Messina map Scylla Charybdis'},
  {ch: 'b3', base: 'blue-lotus-flower', src: 'commons', q: 'Nymphaea caerulea blue lotus Egyptian'},
  {ch: 'b3', base: 'underworld-art', src: 'commons', q: 'Odysseus underworld Hades ancient painting'},
  {ch: 'b3', base: 'elephant-skull', src: 'commons', q: 'dwarf elephant skull Deinotherium cyclops'},

  // ---------- BLOQUE 4: TRADICION ORAL ----------
  {ch: 'b4', base: 'greek-bard-lyre', src: 'commons', q: 'ancient Greek rhapsode musician lyre vase'},
  {ch: 'b4', base: 'greek-symposium', src: 'commons', q: 'ancient Greek symposium banquet fresco'},
  {ch: 'b4', base: 'african-griot', src: 'commons', q: 'griot West Africa musician kora'},
  {ch: 'b4', base: 'campfire-night', src: 'pexels', type: 'video', q: 'campfire night flames dark'},
  {ch: 'b4', base: 'wine-dark-sea', src: 'pexels', type: 'video', q: 'sea sunset dark red water horizon'},
  {ch: 'b4', base: 'papyrus-writing', src: 'commons', q: 'ancient papyrus Greek writing text'},
  {ch: 'b4', base: 'cortes-portrait', src: 'commons', q: 'Hernan Cortes portrait'},
  {ch: 'b4', base: 'pizarro-portrait', src: 'commons', q: 'Francisco Pizarro portrait conquistador'},
  {ch: 'b4', base: 'old-scroll', src: 'pixabay', type: 'photo', q: 'ancient scroll parchment old writing'},

  // ---------- BLOQUE 5: LA RUTA REAL / ASTRONOMIA ----------
  {ch: 'b5', base: 'solar-eclipse', src: 'pexels', type: 'video', q: 'total solar eclipse sun corona'},
  {ch: 'b5', base: 'star-chart', src: 'commons', q: 'antique star chart constellation map'},
  {ch: 'b5', base: 'night-sky-stars', src: 'pexels', type: 'video', q: 'night sky stars milky way timelapse'},
  {ch: 'b5', base: 'navigation-stars', src: 'pixabay', type: 'photo', q: 'starry night sky sea navigation'},
  {ch: 'b5', base: 'corfu-island', src: 'pexels', type: 'photo', q: 'corfu greek island coast'},
  {ch: 'b5', base: 'stromboli-volcano', src: 'pexels', type: 'video', q: 'volcano eruption lava night'},
  {ch: 'b5', base: 'volcanic-cliffs', src: 'pexels', type: 'photo', q: 'volcanic cliffs rocky island sea'},
  {ch: 'b5', base: 'sardinia-harbor', src: 'pexels', type: 'photo', q: 'natural harbor cliffs mediterranean narrow'},
  {ch: 'b5', base: 'mediterranean-map', src: 'commons', q: 'antique map Mediterranean sea Italy Sicily'},
  {ch: 'b5', base: 'astronomer-old', src: 'commons', q: 'ancient astronomy Ptolemy celestial'},

  // ---------- BLOQUE 6: EL MISTERIO DE ITACA ----------
  {ch: 'b6', base: 'ithaca-island', src: 'pexels', type: 'photo', q: 'ithaca greek island ionian sea'},
  {ch: 'b6', base: 'greek-village-white', src: 'pexels', type: 'video', q: 'greek village white houses hillside'},
  {ch: 'b6', base: 'olive-trees-goats', src: 'pexels', type: 'photo', q: 'olive trees greek countryside goats'},
  {ch: 'b6', base: 'ferry-boat', src: 'pexels', type: 'video', q: 'ferry boat greek islands sea'},
  {ch: 'b6', base: 'cephalonia-coast', src: 'pexels', type: 'photo', q: 'cephalonia kefalonia coast cliffs'},
  {ch: 'b6', base: 'earthquake-geology', src: 'pexels', type: 'photo', q: 'rock strata geology cliff layers'},
  {ch: 'b6', base: 'sea-cave', src: 'pexels', type: 'photo', q: 'sea cave rocky coast cavern'},
  {ch: 'b6', base: 'ancient-spring', src: 'pexels', type: 'photo', q: 'natural spring water rocks stone'},
  {ch: 'b6', base: 'ionian-aerial', src: 'pexels', type: 'video', q: 'ionian sea islands aerial drone'},

  // ---------- BLOQUE 7: ODISEO, HOMBRE REAL ----------
  {ch: 'b7', base: 'greek-warrior-helmet', src: 'commons', q: 'Mycenaean bronze age helmet warrior'},
  {ch: 'b7', base: 'mask-agamemnon', src: 'commons', q: 'Mask of Agamemnon gold Mycenae'},
  {ch: 'b7', base: 'mycenae-ruins', src: 'commons', q: 'Mycenae ruins lion gate archaeology'},
  {ch: 'b7', base: 'ancient-galley', src: 'commons', q: 'ancient Greek galley ship trireme relief'},
  {ch: 'b7', base: 'bronze-age-tomb', src: 'commons', q: 'Mycenaean tholos tomb archaeology'},
  {ch: 'b7', base: 'warrior-silhouette', src: 'pexels', type: 'video', q: 'warrior silhouette sunset sea lone'},
  {ch: 'b7', base: 'stormy-shipwreck', src: 'pexels', type: 'video', q: 'ship storm waves dramatic ocean'},
  {ch: 'b7', base: 'home-longing', src: 'pexels', type: 'photo', q: 'silhouette man looking sea horizon longing'},

  // ---------- BLOQUE 8: PAYOFF / CIERRE ----------
  // (El cliffhanger hitita se elimino: el guion cierra en "...obras mas
  // poderosas que ha producido la humanidad". El recap reutiliza material de
  // b1-b7; aqui solo se añade el plano epico de cierre.)
  {ch: 'b8', base: 'epic-sea-crescendo', src: 'pexels', type: 'video', q: 'epic ocean waves golden light aerial'},
  {ch: 'b8', base: 'greek-ruins-sunset', src: 'pexels', type: 'photo', q: 'greek temple ruins sunset golden'},
];

// ---------------- helpers ----------------
const sleepMs = (ms) => new Promise((r) => setTimeout(r, ms));

// fetch con reintento automatico si la API responde 429 (demasiadas
// peticiones). Respeta el header Retry-After si viene; si no, espera con
// backoff exponencial (3s, 8s, 20s). Sin esto, correr 20+ busquedas seguidas
// contra Wikimedia/Pexels/Pixabay termina en una pared de errores 429.
async function fetchRetry(url, opts = {}, maxRetries = 4) {
  let attempt = 0;
  for (;;) {
    const res = await fetch(url, opts);
    if (res.status !== 429 || attempt >= maxRetries) return res;
    const ra = parseInt(res.headers.get('retry-after') || '', 10);
    const wait = Number.isFinite(ra) ? ra * 1000 : 3000 * Math.pow(2.2, attempt);
    console.log(`   ⏳ 429 (demasiadas peticiones), esperando ${(wait / 1000).toFixed(0)}s y reintentando...`);
    await sleepMs(wait);
    attempt++;
  }
}

async function download(url, dest, headers = {}) {
  const res = await fetchRetry(url, {headers});
  if (!res.ok) throw new Error(`descarga ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}
async function remoteSize(url) {
  try {
    const r = await fetchRetry(url, {method: 'HEAD'});
    const l = r.headers.get('content-length');
    return l ? parseInt(l, 10) : null;
  } catch {
    return null;
  }
}
const complete = (dir, prefix, per, ext) => {
  for (let i = 1; i <= per; i++) if (!fs.existsSync(path.join(dir, `${prefix}-${i}.${ext}`))) return false;
  return true;
};

// ---------------- fuentes ----------------
async function fromPexels(item, prefix, per, credits) {
  if (!PEXELS_KEY) return;
  const isVid = item.type === 'video';
  const dir = isVid ? VIDEOS_DIR : PHOTOS_DIR;
  const ext = isVid ? 'mp4' : 'jpg';
  if (complete(dir, prefix, per, ext)) return;
  const url = isVid
    ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(item.q)}&per_page=${per + 4}&orientation=landscape`
    : `https://api.pexels.com/v1/search?query=${encodeURIComponent(item.q)}&per_page=${per + 3}&orientation=landscape`;
  const res = await fetchRetry(url, {headers: {Authorization: PEXELS_KEY}});
  if (!res.ok) throw new Error(`pexels ${res.status}`);
  const data = await res.json();
  let i = 0;
  if (isVid) {
    for (const v of data.videos ?? []) {
      if (i >= per) break;
      const files = (v.video_files ?? []).filter((f) => f.file_type === 'video/mp4').sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
      const ordered = [...files.filter((f) => (f.width ?? 0) >= 1280), ...files.filter((f) => (f.width ?? 0) < 1280)];
      let chosen = null;
      for (const f of ordered) {const s = await remoteSize(f.link); if (s != null && s <= MAX_BYTES) {chosen = f; break;}}
      if (!chosen) continue;
      i++;
      const dest = path.join(dir, `${prefix}-${i}.mp4`);
      if (fs.existsSync(dest)) continue;
      const b = await download(chosen.link, dest);
      console.log(`   ✓ ${prefix}-${i}.mp4 (${(b / 1048576).toFixed(1)} MB) [pexels]`);
      credits.push(`${prefix}-${i}.mp4: Pexels/${v.user?.name} ${v.url}`);
    }
  } else {
    for (const p of data.photos ?? []) {
      if (i >= per) break;
      if ((p.width ?? 0) < 1600) continue;
      i++;
      const dest = path.join(dir, `${prefix}-${i}.jpg`);
      if (fs.existsSync(dest)) continue;
      const b = await download(p.src.large2x || p.src.large || p.src.original, dest);
      console.log(`   ✓ ${prefix}-${i}.jpg (${(b / 1024).toFixed(0)} KB) [pexels]`);
      credits.push(`${prefix}-${i}.jpg: Pexels/${p.photographer} ${p.url}`);
    }
  }
}

async function fromPixabay(item, prefix, per, credits) {
  if (!PIXABAY_KEY) return;
  const isVid = item.type === 'video';
  const dir = isVid ? VIDEOS_DIR : PHOTOS_DIR;
  const ext = isVid ? 'mp4' : 'jpg';
  if (complete(dir, prefix, per, ext)) return;
  const url = isVid
    ? `https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${encodeURIComponent(item.q)}&per_page=${per + 4}`
    : `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(item.q)}&image_type=photo&orientation=horizontal&min_width=1600&per_page=${per + 4}`;
  const res = await fetchRetry(url);
  if (!res.ok) throw new Error(`pixabay ${res.status}`);
  const data = await res.json();
  let i = 0;
  for (const h of data.hits ?? []) {
    if (i >= per) break;
    if (isVid) {
      const cand = [h.videos?.large, h.videos?.medium, h.videos?.small].filter(Boolean);
      let chosen = null;
      for (const c of cand) {const s = c.size ?? (await remoteSize(c.url)); if (s != null && s <= MAX_BYTES) {chosen = c; break;}}
      if (!chosen) continue;
      i++;
      const dest = path.join(dir, `${prefix}-${i}.mp4`);
      if (fs.existsSync(dest)) continue;
      const b = await download(chosen.url, dest);
      console.log(`   ✓ ${prefix}-${i}.mp4 (${(b / 1048576).toFixed(1)} MB) [pixabay]`);
      credits.push(`${prefix}-${i}.mp4: Pixabay/${h.user} ${h.pageURL}`);
    } else {
      // Para un documental de "historia REAL": nada de imagenes generadas por IA.
      if (h.isAiGenerated) continue;
      i++;
      const dest = path.join(dir, `${prefix}-${i}.jpg`);
      if (fs.existsSync(dest)) continue;
      const b = await download(h.largeImageURL || h.webformatURL, dest);
      console.log(`   ✓ ${prefix}-${i}.jpg (${(b / 1024).toFixed(0)} KB) [pixabay]`);
      credits.push(`${prefix}-${i}.jpg: Pixabay/${h.user} ${h.pageURL}`);
    }
  }
}

async function fromCommons(item, prefix, per, credits) {
  const dir = PHOTOS_DIR;
  if (complete(dir, prefix, per, 'jpg')) return;
  // MediaWiki API: busca archivos (namespace 6) y pide thumb a 1920 de ancho.
  const api =
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search` +
    `&gsrsearch=${encodeURIComponent(item.q + ' filetype:bitmap')}&gsrnamespace=6&gsrlimit=${per + 6}` +
    `&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=1920`;
  const res = await fetchRetry(api, {headers: {'User-Agent': 'OdiseaDoc/1.0 (educational)'}});
  if (!res.ok) throw new Error(`commons ${res.status}`);
  const data = await res.json();
  const pages = Object.values(data.query?.pages ?? {});
  let i = 0;
  for (const pg of pages) {
    if (i >= per) break;
    const info = pg.imageinfo?.[0];
    if (!info) continue;
    const mime = info.mime || '';
    if (!/image\/(jpeg|png)/.test(mime)) continue;
    const src = info.thumburl || info.url;
    if (!src) continue;
    i++;
    const dest = path.join(dir, `${prefix}-${i}.jpg`);
    if (fs.existsSync(dest)) continue;
    try {
      const b = await download(src, dest, {'User-Agent': 'OdiseaDoc/1.0 (educational)'});
      const artist = (info.extmetadata?.Artist?.value || 'Wikimedia Commons').replace(/<[^>]+>/g, '').slice(0, 60);
      const lic = info.extmetadata?.LicenseShortName?.value || '';
      console.log(`   ✓ ${prefix}-${i}.jpg (${(b / 1024).toFixed(0)} KB) [commons ${lic}]`);
      credits.push(`${prefix}-${i}.jpg: Wikimedia Commons — ${artist} (${lic}) ${info.descriptionurl || ''}`);
    } catch (e) {
      i--;
      console.log(`   ✗ commons: ${e.message}`);
    }
  }
}

// ---------------- run ----------------
(async () => {
  console.log('=== Descarga Odisea (multi-fuente) ===');
  console.log(`Pexels:  ${PEXELS_KEY ? 'OK' : 'SIN KEY (se salta)'}`);
  console.log(`Pixabay: ${PIXABAY_KEY ? 'OK' : 'SIN KEY (se salta)'}`);
  console.log('Wikimedia Commons: OK (sin key)\n');

  if (chapterFilter.size) console.log(`Filtro de bloques: ${[...chapterFilter].join(', ')}\n`);

  const credits = [];
  for (const item of PLAN) {
    if (chapterFilter.size && !chapterFilter.has(item.ch)) continue;
    const per = item.per ?? (item.src === 'commons' ? DEF.commons : DEF[item.type]);
    const prefix = `${item.ch}-${item.base}`;
    const tag = item.src === 'commons' ? 'commons' : `${item.src}/${item.type}`;
    console.log(`\n[${prefix}]  "${item.q}"  (${tag}, x${per})`);
    try {
      if (item.src === 'pexels') await fromPexels(item, prefix, per, credits);
      else if (item.src === 'pixabay') await fromPixabay(item, prefix, per, credits);
      else if (item.src === 'commons') await fromCommons(item, prefix, per, credits);
      // Commons es la que mas rapido satura (limite mas estricto); pausa mayor.
      await sleepMs(item.src === 'commons' ? 2500 : 1200);
    } catch (e) {
      console.log(`   ✗ ${e.message}`);
    }
  }

  const nPhotos = fs.readdirSync(PHOTOS_DIR).filter((f) => f.endsWith('.jpg')).length;
  const nVideos = fs.readdirSync(VIDEOS_DIR).filter((f) => f.endsWith('.mp4')).length;
  fs.writeFileSync(
    path.join(ROOT, 'public', 'stock-odisea', 'CREDITS.txt'),
    `Creditos del material — documental Odisea\n\n${credits.join('\n')}\n`,
  );
  console.log(`\n=== LISTO ===  ${nPhotos} fotos, ${nVideos} videos en public/stock-odisea/`);
  console.log('Creditos guardados en public/stock-odisea/CREDITS.txt');
})();
