import {staticFile} from 'remotion';
import {cues} from '../data/cdCues';
import {photoVariants, videoVariants} from './assets';

type Accent = 'amber' | 'teal' | 'red' | 'paper';
export interface Shot {from: number; dur: number; src: string; video: boolean; motion: 'punchIn' | 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight'; startFrom?: number; archival?: boolean;}

// Clips de archivo real (verificados cuadro por cuadro) — id -> {duración total (s), mejor punto de inicio (s)}
const ARCHIVAL: Record<string, {dur: number; start: number}> = {
  'walkman-ad-1979': {dur: 30, start: 2},
  'cassette-dubbing': {dur: 90, start: 8},
  'cd-how-it-works': {dur: 120, start: 4}, // timeline LaserDisc->CD 1982->DVD->Blu-ray
  'cdp101-player': {dur: 90, start: 6},
  'cd-store-90s': {dur: 52, start: 5},
  'dialup-internet-90s': {dur: 90, start: 6},
  'rio-pmp300': {dur: 90, start: 10},
  'napster-news-1999': {dur: 24, start: 2},
  'shawn-fanning': {dur: 90, start: 6},
  'ulrich-senate-2000': {dur: 120, start: 20},
  'napster-shutdown': {dur: 90, start: 4},
  'kazaa-limewire': {dur: 90, start: 12},
  'ipod-keynote-2001': {dur: 26, start: 2},
  'itunes-store-2003': {dur: 150, start: 8},
  'iphone-2007': {dur: 120, start: 4},
  'tower-records-close': {dur: 72, start: 4},
  'spotify-ek': {dur: 90, start: 38},
  'vinyl-revival': {dur: 90, start: 3},
};
const archivalSrc = (id: string) => staticFile(`archival/${id}.mp4`);
export interface StatDef {value?: number; display?: string; prefix?: string; suffix?: string; label?: string; decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;}
export interface Overlay {
  from: number; dur: number;
  kind: 'title' | 'chapter' | 'stat' | 'chart' | 'slam' | 'question' | 'newspaper' | 'quote' | 'definition' | 'name' | 'date' | 'fulltext' | 'shrink' | 'network' | 'timeline';
  pre?: string; text?: string; num?: number; stat?: StatDef; chart?: 'growth' | 'decline'; accent?: Accent;
  headline?: string; dek?: string; img?: string; quote?: string; author?: string;
  term?: string; pos?: string; def?: string; name?: string; role?: string;
}
type Ed = {kind: 'newspaper' | 'quote' | 'definition' | 'name'; secs: number; headline?: string; dek?: string; imgBase?: string; quote?: string; author?: string; term?: string; pos?: string; def?: string; name?: string; role?: string;};

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const RULES: [RegExp, string][] = [
  [/gualman|walkman/, 'walkman'],
  [/pmp300|rio pmp|reproductor mp3|mp3 portatil/, 'mp3-player'],
  [/dos reproductores|duplicar|grabadora|doble/, 'dual-cassette-deck'],
  [/casete|cassette/, 'cassette-tape'],
  [/beatles|elvis|michael jackson|led zeppelin|catalogo/, 'vinyl-collection'],
  [/vinilo/, 'vinyl-record'],
  [/laser/, 'cd-player-laser'],
  [/reproductor de cd|mil dolares|reproductor/, 'cd-player-vintage'],
  [/disco compacto|12 centimetros|aluminio|disco de 12/, 'cd-disc-macro'],
  [/japon/, 'tokyo-neon-night'],
  [/bach|brandenburg|orquesta|conciertos de/, 'orchestra-classical-music'],
  [/fraunhofer|von hofer|ingenieros|codec|compresion|mpeg|audio la/, 'computer-code-programming'],
  [/modem/, 'dial-up-modem'],
  [/napster/, 'downloading-progress-bar'],
  [/kazaa|limewire|lamb guire|morpheus|bit torrent|bittorrent/, 'hacker-typing'],
  [/descarga|compartir|archivos mp3|intercambia/, 'downloading-progress-bar'],
  [/servidor|escribiendo un programa|programa en su|codigo/, 'typing-code-computer'],
  [/internet|foros|red academica/, 'old-computer'],
  [/universidad|estudiante|boston|sotanos|geeks|sueco|daniel ek/, 'college-student-laptop'],
  [/riaa|tribunal|demand|judiciales|fallo|acuerdos|pleito/, 'courtroom'],
  [/335|nombres de|documentos/, 'legal-documents'],
  [/metallica|baterista|lars|ulrich/, 'rock-drummer'],
  [/oceano/, 'ocean-waves'],
  [/ipod/, 'ipod'],
  [/itunes|99 centavos|90 centavos|musica digital|cancion que querias|catalogos/, 'music-streaming-app'],
  [/iphone|telefono/, 'smartphone-music'],
  [/spotify|streaming/, 'streaming-music-phone'],
  [/rootkit|software spy|software espia|virus|vulnerable|investigador de seguridad|parche|sistema operativo|monitore/, 'computer-virus-code'],
  [/sony bmg|escandal/, 'cybersecurity-hacker'],
  [/tower|towel|banca rota|bancarrota|tiendas|sellos|estudios de grabacion|cerrad/, 'empty-retail-store'],
  [/irrelevante|basura|bargain|centavos la pieza/, 'cd-bargain-bin'],
  [/suscribete|memes|burlas|odio/, 'subscribe-social-media'],
  [/bodega|grabaciones maestras|relanzamiento|transferir|archivo/, 'warehouse-archive'],
  [/audifonos|oido/, 'headphones'],
  [/dinero|dolares|precio|pagar|premium|acuerdos|estafa|codicia|acudicia/, 'cash-money'],
  [/edad de oro|concierto|consumidores|gente|publico|masivamente/, 'concert-crowd'],
  [/estudio|grabacion/, 'recording-studio'],
];

// 'v:' = video
const POOLS: Record<string, string[]> = {
  'walkman': ['walkman', 'headphones-vintage', 'v:cassette-tape-playing', 'cassette-tape'],
  'cassette-tape': ['cassette-tape', 'dual-cassette-deck', 'audio-cassette-player', 'v:cassette-tape-playing', 'walkman'],
  'dual-cassette-deck': ['dual-cassette-deck', 'cassette-tape', 'v:cassette-tape-playing', 'audio-cassette-player'],
  'cd-disc': ['cd-disc', 'cd-disc-macro', 'compact-disc', 'stack-of-cds', 'v:compact-disc-spinning', 'v:cd-player-laser'],
  'cd-disc-macro': ['cd-disc-macro', 'compact-disc', 'cd-disc', 'v:compact-disc-spinning', 'v:cd-player-laser', 'stack-of-cds'],
  'cd-player-vintage': ['cd-player-vintage', 'hifi-stereo-system', 'stereo-system', 'cd-disc', 'v:cd-player-laser'],
  'cd-player-laser': ['v:cd-player-laser', 'cd-disc-macro', 'v:compact-disc-spinning', 'compact-disc'],
  'vinyl-record': ['vinyl-record', 'vinyl-collection', 'vinyl-record-player', 'turntable', 'v:vinyl-record-player-spinning', 'v:turntable-closeup'],
  'vinyl-collection': ['vinyl-collection', 'vinyl-record', 'record-store', 'v:record-store-browsing', 'turntable'],
  'orchestra-classical-music': ['orchestra-classical-music', 'recording-studio', 'audio-mixing-console'],
  'recording-studio': ['recording-studio', 'audio-mixing-console', 'reel-to-reel-tape', 'v:recording-studio'],
  'warehouse-archive': ['warehouse-archive', 'reel-to-reel-tape', 'vinyl-collection', 'stack-of-cds'],
  'cash-money': ['cash-money', 'coins', 'stock-market-screen'],
  'coins': ['coins', 'cash-money'],
  'tokyo-neon-night': ['tokyo-neon-night', 'stereo-system', 'hifi-stereo-system'],
  'headphones': ['headphones', 'headphones-vintage', 'v:headphones-music'],
  'computer-code-programming': ['computer-code-programming', 'v:typing-code-computer', 'old-computer', 'retro-computer-1990s'],
  'old-computer': ['old-computer', 'retro-computer-1990s', 'dial-up-modem', 'v:old-computer-screen'],
  'dial-up-modem': ['dial-up-modem', 'old-computer', 'retro-computer-1990s', 'v:old-computer-screen'],
  'college-student-laptop': ['college-student-laptop', 'university-library', 'old-computer', 'v:typing-code-computer'],
  'downloading-progress-bar': ['v:downloading-progress-bar', 'computer-code-programming', 'v:old-computer-screen', 'v:hacker-typing'],
  'typing-code-computer': ['v:typing-code-computer', 'computer-code-programming', 'v:hacker-typing', 'old-computer'],
  'hacker-typing': ['v:hacker-typing', 'computer-virus-code', 'v:typing-code-computer', 'cybersecurity-hacker'],
  'mp3-player': ['mp3-player', 'ipod', 'headphones'],
  'courtroom': ['courtroom', 'judge-gavel', 'legal-documents', 'v:courtroom'],
  'legal-documents': ['legal-documents', 'courtroom', 'judge-gavel'],
  'rock-drummer': ['rock-drummer', 'v:concert-crowd', 'concert-crowd'],
  'concert-crowd': ['v:concert-crowd', 'concert-crowd', 'rock-drummer'],
  'ocean-waves': ['v:ocean-waves'],
  'ipod': ['ipod', 'mp3-player', 'v:headphones-music', 'smartphone-music'],
  'music-streaming-app': ['music-streaming-app', 'smartphone-music', 'v:smartphone-scrolling-music', 'v:music-streaming-phone'],
  'smartphone-music': ['smartphone-music', 'music-streaming-app', 'v:smartphone-scrolling-music', 'streaming-music-phone'],
  'streaming-music-phone': ['streaming-music-phone', 'v:music-streaming-phone', 'v:smartphone-scrolling-music', 'smartphone-music', 'v:city-street-people-walking'],
  'computer-virus-code': ['computer-virus-code', 'v:hacker-typing', 'cybersecurity-hacker', 'v:typing-code-computer'],
  'cybersecurity-hacker': ['cybersecurity-hacker', 'computer-virus-code', 'v:hacker-typing'],
  'empty-retail-store': ['empty-retail-store', 'closed-store', 'record-store', 'v:record-store-browsing'],
  'cd-bargain-bin': ['cd-bargain-bin', 'broken-cd', 'stack-of-cds'],
  'subscribe-social-media': ['subscribe-social-media', 'concert-crowd', 'v:city-street-people-walking'],
};

const resolveBase = (text: string): string => {
  const t = norm(text);
  for (const [re, base] of RULES) if (re.test(t)) return base;
  return 'cd-disc';
};
const poolFor = (base: string): string[] => POOLS[base] ?? [base];

// Clip de archivo forzado para cues específicos (verificados, prioridad sobre el pool de stock)
const ARCHIVAL_BY_CUE: Record<number, string> = {
  6: 'walkman-ad-1979', 7: 'cassette-dubbing', 8: 'cassette-dubbing',
  17: 'cd-how-it-works', 18: 'cd-how-it-works', 22: 'cdp101-player',
  38: 'dialup-internet-90s', 44: 'dialup-internet-90s',
  51: 'rio-pmp300',
  58: 'shawn-fanning', 59: 'shawn-fanning', 61: 'napster-news-1999',
  64: 'napster-news-1999', 65: 'napster-news-1999',
  69: 'napster-news-1999', 70: 'ulrich-senate-2000', 81: 'napster-shutdown',
  88: 'ipod-keynote-2001', 89: 'ipod-keynote-2001', 95: 'itunes-store-2003',
  113: 'tower-records-close', 114: 'tower-records-close',
  142: 'iphone-2007', 143: 'spotify-ek',
  155: 'kazaa-limewire', 156: 'kazaa-limewire', 157: 'vinyl-revival',
};

// Capítulos (por número de cue donde arrancan)
const CHAPTERS: {cue: number; num: number; title: string}[] = [
  {cue: 5, num: 1, title: 'El rey del casete'},
  {cue: 13, num: 2, title: 'El disco perfecto'},
  {cue: 27, num: 3, title: 'La mina de oro'},
  {cue: 38, num: 4, title: 'La rebelión'},
  {cue: 58, num: 5, title: 'Napster'},
  {cue: 88, num: 6, title: 'Apple lo cambia todo'},
  {cue: 117, num: 7, title: 'El lado oscuro'},
  {cue: 142, num: 8, title: 'El veredicto'},
];

// Cifras / gráficas (callouts numéricos)
const STATS: Record<number, StatDef> = {
  23: {value: 1000, prefix: '$', label: 'El primer reproductor'},
  65: {value: 25, suffix: ' M', label: 'usuarios en 12 meses'},
  66: {value: 80, suffix: ' M', label: 'usuarios', accent: 'red'},
  71: {value: 335000, format: 'comma', label: 'usuarios denunciados', accent: 'red'},
  91: {value: 5, suffix: ' GB', label: 'de música'},
  97: {display: '$0.99', label: 'por canción'},
  103: {value: 200000, format: 'comma', label: 'canciones · día 1'},
  104: {value: 1000000, format: 'comma', label: 'en la 1ª semana'},
  112: {display: '-70%', label: 'en una década', accent: 'red'},
  129: {value: 22, suffix: ' M', label: 'CDs infectados', accent: 'red'},
  157: {display: '#1', label: 'fuente de ingresos', accent: 'teal'},
};
const CHARTS: Record<number, 'growth' | 'decline'> = {35: 'growth', 111: 'decline'};

// Motion graphics especiales (fondo calmo detrás)
const GRAPHICS: Record<number, {kind: 'shrink' | 'network' | 'timeline'; secs: number; active?: string}> = {
  43: {kind: 'shrink', secs: 3.6},
  62: {kind: 'network', secs: 3.8},
  158: {kind: 'timeline', secs: 4.2, active: '2015'},
};

// Sellos de fecha (esquina)
const DATES: Record<number, string> = {
  18: '1982', 44: '1991', 46: '1993', 51: '1997', 59: '1999',
  81: '2001', 95: '2003', 120: '2005', 138: '2007', 156: '2012',
};
// Textos a pantalla completa (declaraciones dramáticas)
const FULLTEXT: Record<number, {text: string; accent?: Accent}> = {
  45: {text: 'Un error histórico', accent: 'red'},
  80: {text: 'La venganza del mercado', accent: 'amber'},
  94: {text: 'Lo que vino después', accent: 'paper'},
  119: {text: 'Algo más oscuro', accent: 'red'},
  159: {text: '¿Por qué murió el CD,\nrealmente?', accent: 'amber'},
  168: {text: 'No fue la tecnología.\nFue la codicia.', accent: 'red'},
};

// Capa editorial: periódicos, citas, definiciones y rótulos de nombre
const EDITORIAL: Record<number, Ed> = {
  9: {kind: 'definition', secs: 3.2, term: 'Piratería doméstica', pos: 'sustantivo', def: 'Copiar discos y casetes en casa, sin pagarle a la industria.'},
  10: {kind: 'newspaper', secs: 3.8, headline: 'Guerra a la copia casera', dek: 'Las discográficas presionan para prohibir las grabadoras.', imgBase: 'dual-cassette-deck'},
  40: {kind: 'definition', secs: 3.0, term: 'MP3', pos: 'formato de audio', def: 'Comprime una canción a una fracción de su tamaño, casi sin pérdida.'},
  54: {kind: 'newspaper', secs: 3.8, headline: 'La RIAA demanda al primer MP3', dek: 'La industria intenta frenar el reproductor Rio PMP300.', imgBase: 'legal-documents'},
  59: {kind: 'name', secs: 3.0, name: 'Shawn Fanning', role: 'Creador de Napster'},
  69: {kind: 'newspaper', secs: 3.8, headline: 'Demandan a Napster', dek: 'Las mayores discográficas del mundo van a los tribunales.', imgBase: 'courtroom'},
  70: {kind: 'name', secs: 3.0, name: 'Lars Ulrich', role: 'Batería de Metallica'},
  89: {kind: 'name', secs: 2.8, name: 'Steve Jobs', role: 'Apple'},
  90: {kind: 'quote', secs: 3.4, quote: '«Mil canciones en tu bolsillo.»', author: 'Steve Jobs'},
  101: {kind: 'quote', secs: 3.8, quote: '«O me dan sus catálogos a 99¢, o lo pierden todo.»', author: 'Steve Jobs'},
  114: {kind: 'newspaper', secs: 3.8, headline: 'Tower Records, en bancarrota', dek: '500 tiendas y 30 años de historia, cerradas en meses.', imgBase: 'empty-retail-store'},
  124: {kind: 'definition', secs: 3.2, term: 'Rootkit', pos: 'informática', def: 'Programa oculto que espía y controla tu computadora sin permiso.'},
  130: {kind: 'newspaper', secs: 4.0, headline: 'Sony ocultaba un «rootkit» en sus CDs', dek: 'Un investigador destapa el espionaje en 22 millones de discos.', imgBase: 'cybersecurity-hacker'},
  143: {kind: 'name', secs: 3.0, name: 'Daniel Ek', role: 'Fundador de Spotify'},
};

// Cold-open: cada línea muestra EXACTAMENTE lo que se narra (nada de hackers/conciertos sueltos)
const INTRO_POOLS: Record<number, string[]> = {
  // "En 1988, una sola canción en un solo disco vendió más copias..." -> CDs y ventas
  1: ['v:compact-disc-spinning', 'cd-disc-macro', 'compact-disc', 'stack-of-cds', 'cash-money'],
  // "El disco compacto llevaba 6 años y había matado a su competidor" -> CD vs casete
  2: ['cd-disc', 'v:cd-player-laser', 'cassette-tape', 'dual-cassette-deck', 'compact-disc'],
  // "el CD no murió... decidieron que era más rentable matarlo" -> oscuro, CD roto, codicia
  3: ['broken-cd', 'cd-disc-macro', 'cd-bargain-bin', 'cash-money'],
};

// Secuencia explícita de sujetos dentro de un cue: fuerza qué muestra cada sub-toma,
// en orden. Sirve para narrar visualmente una frase que cambia de tema a mitad
// (p.ej. "el CD... había matado a su competidor" -> CD y luego el casete que mató).
const SHOT_SEQ: Record<number, string[]> = {
  2: ['cd-disc', 'cassette-tape'], // "el disco compacto..." -> CD ; "...su competidor más certero" -> casete
};

// Correcciones puntuales: cues donde el resolvedor por palabra clave elige mal la imagen
const OVERRIDE_BASE: Record<number, string> = {
  27: 'warehouse-archive',           // "algo que la mayoría no sabe" (antesala de las bodegas)
  39: 'computer-code-programming',   // "MPEG-1 Audio Layer 3" (el codec)
  40: 'mp3-player',                  // "el mundo lo conocería como MP3"
  42: 'headphones',                  // "sin que el oído humano notara diferencia"
  90: 'ipod',                        // "Mil canciones en tu bolsillo"
  99: 'cash-money',                  // "querían seguir vendiendo álbumes a 15 dólares" (no era subscribe)
  101: 'cash-money',                 // ultimátum de Jobs sobre precios
  104: 'music-streaming-app',        // "en su primera semana, un millón" (iTunes)
  144: 'smartphone-music',           // "la gente quería música gratis" (no concierto)
};

type Cand = {src: string; video: boolean; base: string};
// Fotos + videos mezclados (ya es determinista → sin parpadeo).
const candidatesFor = (pool: string[]): Cand[] => {
  const out: Cand[] = [];
  for (const token of pool) {
    const isV = token.startsWith('v:');
    const base = isV ? token.slice(2) : token;
    for (const src of (isV ? videoVariants(base) : photoVariants(base))) out.push({src, video: isV, base});
  }
  if (out.length === 0) for (const src of photoVariants('cd-disc')) out.push({src, video: false, base: 'cd-disc'});
  return out;
};

export const buildPlan = (fps: number, total: number) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  const useCount: Record<string, number> = {};
  const baseCount: Record<string, number> = {};
  const recent: string[] = [];      // últimos archivos exactos usados
  const recentBase: string[] = [];  // últimos SUJETOS (base) usados — evita "mismo clip" con otra variante
  // Elige el candidato menos usado y no reciente. DETERMINISTA (sin Math.random,
  // que rompía el render de Remotion re-sorteando las imágenes en cada frame).
  // Penaliza fuerte repetir el mismo SUJETO en una ventana amplia: dos tomas del
  // "muchacho con la computadora" seguidas dan sensación de documental barato.
  const pickBest = (cands: Cand[]): Cand => {
    let best = cands[0]; let bestScore = Infinity;
    for (let k = 0; k < cands.length; k++) {
      const c = cands[k];
      const tie = (k * 2654435761) % 997 / 997; // desempate determinista para variar
      const idxInBase = recentBase.lastIndexOf(c.base); // cuán reciente es el sujeto
      const baseRecency = idxInBase === -1 ? 0 : 4000 - (recentBase.length - 1 - idxInBase) * 260;
      const score =
        (recent.includes(c.src) ? 6000 : 0) +   // mismo archivo exacto: casi prohibido
        baseRecency +                            // mismo sujeto reciente: fuerte penalización decreciente
        (baseCount[c.base] ?? 0) * 40 +          // sujeto muy usado en todo el video: penalización suave
        (useCount[c.src] ?? 0) * 8 +
        tie;
      if (score < bestScore) {bestScore = score; best = c;}
    }
    useCount[best.src] = (useCount[best.src] ?? 0) + 1;
    baseCount[best.base] = (baseCount[best.base] ?? 0) + 1;
    recent.push(best.src); if (recent.length > 10) recent.shift();
    recentBase.push(best.base); if (recentBase.length > 14) recentBase.shift();
    return best;
  };
  const cutMotions: Shot['motion'][] = ['punchIn', 'zoomIn', 'punchIn', 'zoomOut', 'panRight', 'punchIn', 'panLeft', 'zoomIn'];
  const archivalProgress: Record<string, number> = {}; // avanza el punto de lectura dentro de cada clip

  const chapterByCue = new Map(CHAPTERS.map((c) => [c.cue, c]));

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);
    const isIntro = c.i <= 3;
    const special = STATS[c.i] || CHARTS[c.i] || GRAPHICS[c.i] || FULLTEXT[c.i] || c.i === 4; // fondo calmo bajo el texto
    const archId = ARCHIVAL_BY_CUE[c.i];
    // pool de la toma: intro por-cue > override puntual > resolución por palabra clave
    const shotPool = (isIntro && INTRO_POOLS[c.i])
      ? INTRO_POOLS[c.i]
      : poolFor(OVERRIDE_BASE[c.i] ?? resolveBase(c.text));

    if (archId && !special) {
      // clip de archivo real: una sola toma que ocupa todo el cue, avanzando dentro del video fuente
      const meta = ARCHIVAL[archId];
      const already = archivalProgress[archId] ?? meta.start;
      const startFrom = Math.round(Math.min(already, meta.dur - dur / fps - 1) * fps);
      archivalProgress[archId] = already + dur / fps + 0.5;
      shots.push({
        from, dur, src: archivalSrc(archId), video: true, motion: 'zoomIn',
        startFrom: Math.max(0, startFrom), archival: true,
      });
    } else if (special) {
      const cands = candidatesFor(shotPool);
      shots.push({from, dur, ...pickBest(cands), motion: 'zoomIn'});
    } else {
      const cands = candidatesFor(shotPool);
      const seq = SHOT_SEQ[c.i];
      // ritmo variado y determinista: intro ágil, cuerpo alternando tomas medias/largas
      const varied = [4.0, 5.6, 4.6, 6.2][c.i % 4];
      const target = (isIntro ? 2.8 : varied) * fps;
      // si hay secuencia explícita, una toma por sujeto indicado; si no, según el ritmo
      const n = seq ? seq.length : Math.max(1, Math.round(dur / target));
      for (let k = 0; k < n; k++) {
        const sFrom = from + Math.round((k * dur) / n);
        const sTo = from + Math.round(((k + 1) * dur) / n);
        const kcands = seq ? candidatesFor(poolFor(seq[k % seq.length])) : cands;
        shots.push({from: sFrom, dur: Math.max(1, sTo - sFrom), ...pickBest(kcands), motion: cutMotions[(idx + k) % cutMotions.length]});
      }
    }

    // Overlays
    if (chapterByCue.has(c.i)) {
      const ch = chapterByCue.get(c.i)!;
      overlays.push({from, dur: Math.round(fps * 2.3), kind: 'chapter', num: ch.num, text: ch.title});
    }
    if (c.i === 4) overlays.push({from, dur, kind: 'title', pre: 'la historia real del', text: 'CD'});
    if (STATS[c.i]) overlays.push({from, dur, kind: 'stat', stat: STATS[c.i]});
    if (CHARTS[c.i]) overlays.push({from, dur, kind: 'chart', chart: CHARTS[c.i]});
    if (DATES[c.i]) overlays.push({from, dur: Math.round(fps * 2.4), kind: 'date', text: DATES[c.i]});
    if (GRAPHICS[c.i]) overlays.push({from, dur: Math.round(GRAPHICS[c.i].secs * fps), kind: GRAPHICS[c.i].kind, text: GRAPHICS[c.i].active});
    if (FULLTEXT[c.i]) overlays.push({from, dur: Math.min(dur, Math.round(fps * 3.2)), kind: 'fulltext', text: FULLTEXT[c.i].text, accent: FULLTEXT[c.i].accent});
    const ed = EDITORIAL[c.i];
    if (ed) {
      overlays.push({
        from, dur: Math.round(ed.secs * fps), kind: ed.kind,
        headline: ed.headline, dek: ed.dek, img: ed.imgBase ? photoVariants(ed.imgBase)[0] : undefined,
        quote: ed.quote, author: ed.author, term: ed.term, pos: ed.pos, def: ed.def, name: ed.name, role: ed.role,
      });
    }
  });

  // Cold-open: fecha + pregunta de curiosidad
  overlays.push({from: Math.round(0.6 * fps), dur: Math.round(2.2 * fps), kind: 'date', text: '1988'});
  overlays.push({from: Math.round(15.4 * fps), dur: Math.round(4.4 * fps), kind: 'fulltext', text: '¿Por qué murió\nel CD?', accent: 'red'});

  // Marcas de capítulo para el HUD permanente
  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const chapterMarks = CHAPTERS.map((ch) => ({from: cueFrom(ch.cue), num: ch.num, title: ch.title}));

  return {shots, overlays, chapters: chapterMarks};
};
