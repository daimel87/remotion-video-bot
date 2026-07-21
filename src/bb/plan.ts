import {cues} from '../data/bbCues';
import {photoVariants, videoVariants, hasPhoto, ARCHIVAL, archivalSrc} from './assets';

// ============================================================
// EL CEREBRO del documental "La historia de BlackBerry".
// Réplica EXACTA de la mecánica del CD:
//   · base por sección del guion (+ overrides puntuales)
//   · POOLS de fotos/videos por base ('v:' = video)
//   · clips de ARCHIVO reales forzados por cue (ocupan todo el cue)
//   · pickBest determinista con DIRECTIVA anti-repetición (mismo archivo /
//     mismo sujeto de cerca = penalizado fuerte). Sin Math.random (sin parpadeo).
// ============================================================

export type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
export type Accent = 'amber' | 'teal' | 'red' | 'paper';

export interface StatDef {value?: number; display?: string; prefix?: string; suffix?: string; label?: string; decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;}
export interface Shot {from: number; dur: number; base: string; seed: number; motion: Motion; src?: string; video?: boolean; archival?: boolean; startFrom?: number;}
export interface Overlay {
  from: number; dur: number; delay?: number;
  kind: 'title' | 'chapter' | 'date' | 'fulltext' | 'stat' | 'newspaper' | 'quote' | 'definition' | 'name';
  pre?: string; text?: string; num?: number; stat?: StatDef; accent?: Accent;
  headline?: string; dek?: string; quote?: string; author?: string;
  term?: string; pos?: string; def?: string; name?: string; role?: string;
}

// ---- Capítulos (arco narrativo) ----
const CHAPTERS = [
  {num: 1, cue: 16, title: 'El rey de Waterloo'},
  {num: 2, cue: 24, title: 'El aparato que nadie pidió'},
  {num: 3, cue: 40, title: 'BBM: la religión'},
  {num: 4, cue: 57, title: 'CrackBerry'},
  {num: 5, cue: 80, title: 'La tormenta'},
  {num: 6, cue: 97, title: 'La jaula de oro'},
  {num: 7, cue: 120, title: 'El último pilar'},
  {num: 8, cue: 143, title: 'La lección'},
];

// ---- base por sección del guion (rango de cues -> base) ----
const SECTION: [number, number, string][] = [
  [1, 15, 'bb-device'],        // intro/gancho
  [16, 22, 'waterloo'],        // orígenes / RIM en Canadá
  [23, 39, 'qwerty'],          // el aparato raro, correo, teclado
  [40, 56, 'bbm'],             // BBM, PIN
  [57, 66, 'crowd'],           // CrackBerry, LatAm, apogeo
  [67, 79, 'corporate'],       // seguridad, gobiernos, modelos, soberbia
  [80, 96, 'iphone'],          // la tormenta: iPhone 2007
  [97, 119, 'decline'],        // jaula de oro, Storm, PlayBook
  [120, 142, 'whatsapp'],      // WhatsApp, colapso, 2016
  [143, 166, 'lesson'],        // la lección + suscríbete
];
// Overrides puntuales (frases concretas).
const OVERRIDE_BASE: Record<number, string> = {
  4: 'obama', 5: 'obama', 6: 'obama', 7: 'obama',
  36: 'corporate', 37: 'corporate', 38: 'corporate',
  67: 'security', 68: 'security', 69: 'security',
  71: 'obama',
  81: 'iphone', 82: 'iphone', 83: 'iphone',
  135: 'decline', 136: 'decline',
  155: 'competitors', 156: 'competitors', 157: 'competitors', 158: 'competitors',
};
const baseForCue = (i: number): string => {
  if (OVERRIDE_BASE[i]) return OVERRIDE_BASE[i];
  for (const [a, b, base] of SECTION) if (i >= a && i <= b) return base;
  return 'bb-device';
};

// ---- POOLS: fotos + videos por base ('v:' = video de stock) ----
const POOLS: Record<string, string[]> = {
  'bb-device':   ['old-phones', 'qwerty-phone', 'v:business-phone', 'business-phone'],
  'waterloo':    ['canada-waterloo', 'empty-office', 'old-phones'],
  'qwerty':      ['qwerty-phone', 'old-phones', 'email-screen', 'v:texting-hands', 'texting-hands'],
  'bbm':         ['v:texting-hands', 'texting-hands', 'email-screen', 'v:smartphone-modern', 'smartphone-modern'],
  'crowd':       ['v:city-commuters', 'city-commuters', 'v:texting-hands', 'texting-hands'],
  'corporate':   ['boardroom-execs', 'v:office-corporate', 'office-corporate', 'v:business-phone', 'business-phone', 'wall-street'],
  'obama':       ['boardroom-execs', 'business-phone', 'v:office-corporate', 'office-corporate'],
  'iphone':      ['v:smartphone-modern', 'smartphone-modern'],
  'decline':     ['v:stock-market', 'stock-market', 'empty-office', 'v:office-corporate', 'office-corporate'],
  'whatsapp':    ['v:smartphone-modern', 'smartphone-modern', 'v:texting-hands', 'texting-hands'],
  'lesson':      ['empty-office', 'old-phones', 'v:factory-tech', 'factory-tech', 'v:city-commuters'],
  'competitors': ['old-phones', 'v:factory-tech', 'factory-tech', 'empty-office'],
  'security':    ['security-encryption', 'v:server-room', 'server-room'],
};
const poolFor = (base: string) => POOLS[base] ?? ['old-phones'];

// ---- Clips de ARCHIVO forzados por cue (ocupan todo el cue, prioridad sobre stock) ----
const ARCHIVAL_BY_CUE: Record<number, string> = {
  // Obama no soltó su BlackBerry
  4: 'obama-blackberry', 5: 'obama-blackberry', 6: 'obama-blackberry',
  // Orígenes / RIM / Lazaridis / Waterloo
  16: 'rim-founders', 18: 'rim-founders', 19: 'rim-founders', 20: 'rim-founders', 21: 'rim-founders',
  // 1999: el aparato raro / busca-personas con correo
  23: 'blackberry-850-1999', 24: 'blackberry-850-1999', 25: 'two-way-pager-90s',
  // el teclado QWERTY
  27: 'blackberry-keyboard', 30: 'blackberry-keyboard', 34: 'blackberry-keyboard', 35: 'blackberry-keyboard',
  // el ejecutivo respondiendo desde cualquier lado (anuncio de época)
  36: 'blackberry-ad-2000s', 37: 'blackberry-ad-2000s',
  // BBM
  41: 'bbm-messenger', 44: 'bbm-messenger', 45: 'bbm-messenger', 53: 'bbm-messenger', 54: 'bbm-messenger',
  // CrackBerry / palabra del año 2006
  62: 'crackberry-news', 63: 'crackberry-news', 64: 'crackberry-news',
  // mundo corporativo / Wall Street
  66: 'wall-street-bb', 72: 'wall-street-bb',
  // iPhone 2007: Steve Jobs en el escenario
  80: 'iphone-2007-keynote', 81: 'iphone-2007-keynote', 82: 'iphone-2007-keynote', 83: 'iphone-2007-keynote',
  // en Canadá se rieron
  84: 'rim-reaction-iphone', 85: 'rim-reaction-iphone', 86: 'rim-reaction-iphone',
  // BlackBerry Storm (táctil fallido, 2008)
  104: 'blackberry-storm', 105: 'blackberry-storm', 106: 'blackberry-storm',
  // caída global del servicio (2011)
  116: 'bb-outage-2011',
  // BlackBerry 10 (2013)
  131: 'blackberry-10-launch', 132: 'blackberry-10-launch',
  // pérdidas / despidos / acción se desploma
  134: 'rim-layoffs-news', 135: 'rim-layoffs-news', 136: 'rim-layoffs-news',
  // deja de fabricar teléfonos (2016)
  139: 'bb-stops-phones-2016', 140: 'bb-stops-phones-2016', 141: 'bb-stops-phones-2016',
};

// ---- Estadísticas / fechas grandes ----
const STATS: Record<number, StatDef> = {
  9: {value: 85, suffix: ' millones', label: 'dependían de él', accent: 'amber'},
  65: {value: 85, suffix: ' millones', label: 'usuarios activos', accent: 'amber'},
  135: {display: '$1.000M', label: 'perdidos en un trimestre', accent: 'red'},
  142: {display: '85M → 0', label: 'en apenas 5 años', accent: 'red'},
};
const DATES: Record<number, string> = {
  18: '1984', 23: '1999', 40: '2005', 63: '2006', 80: '2007',
  104: '2008', 116: '2011', 120: '2010', 131: '2013', 139: '2016',
};

// ---- Texto a pantalla completa (ganchos / declaraciones) ----
const FULLTEXT: Record<number, {text: string; accent?: Accent}> = {
  1: {text: 'No era un teléfono.\nEra un símbolo.', accent: 'amber'},
  10: {text: 'Y luego\ndesapareció.', accent: 'red'},
  88: {text: 'Confundieron su fortaleza\ncon una ley eterna.', accent: 'red'},
  128: {text: 'Cuando todos pueden entrar,\nel club deja de valer.', accent: 'teal'},
  160: {text: '¿De qué estás tan orgulloso\nque ya no puedes soltarlo?', accent: 'amber'},
  163: {text: 'Lo que te sube al trono\nes lo que un día te entierra.', accent: 'red'},
};

// ---- Capa editorial (citas, definiciones, tarjetas, nombres) ----
type Ed =
  | {kind: 'definition'; secs: number; delay?: number; term: string; pos?: string; def: string}
  | {kind: 'quote'; secs: number; delay?: number; quote: string; author?: string}
  | {kind: 'newspaper'; secs: number; delay?: number; headline: string; dek?: string}
  | {kind: 'name'; secs: number; delay?: number; name: string; role?: string};
const EDITORIAL: Record<number, Ed> = {
  29: {kind: 'definition', secs: 4.0, term: 'BlackBerry', pos: 'nombre', def: 'Las teclas apretadas parecían las semillas de una mora oscura.'},
  41: {kind: 'definition', secs: 3.8, delay: 1.0, term: 'BBM', pos: 'BlackBerry Messenger', def: 'Mensajes gratis e instantáneos entre BlackBerrys. Antes de WhatsApp.'},
  47: {kind: 'definition', secs: 4.0, delay: 1.0, term: 'PIN', pos: '8 caracteres', def: 'Tu código único. Para hablar contigo no hacía falta tu número.'},
  52: {kind: 'quote', secs: 3.6, quote: 'Pásame tu pin.', author: 'toda una generación'},
  62: {kind: 'definition', secs: 3.6, delay: 1.0, term: 'CrackBerry', pos: 'palabra del año · 2006', def: 'Enganchaba igual que una droga. Nadie podía soltarlo.'},
  71: {kind: 'name', secs: 3.0, name: 'Barack Obama', role: 'no soltó su BlackBerry'},
  84: {kind: 'newspaper', secs: 4.0, delay: 0.5, headline: 'En Canadá, se rieron', dek: '«Un teléfono de puro vidrio jamás lo tomarán en serio.»'},
  135: {kind: 'newspaper', secs: 4.0, headline: 'Pérdidas de casi $1.000 millones', dek: 'En un solo trimestre. Despiden a miles.'},
  139: {kind: 'newspaper', secs: 4.0, delay: 0.5, headline: 'BlackBerry deja de fabricar teléfonos', dek: '2016: el rey del teclado sale del juego que él creó.'},
  165: {kind: 'name', secs: 3.4, delay: 0.5, name: 'Crónicas Ilustradas', role: 'suscríbete'},
};

const cutMotions: Motion[] = ['punchIn', 'zoomIn', 'punchIn', 'zoomOut', 'panRight', 'punchIn', 'panLeft', 'zoomIn'];

type Cand = {src: string; video: boolean; base: string};
const candidatesFor = (pool: string[]): Cand[] => {
  const out: Cand[] = [];
  for (const token of pool) {
    const isV = token.startsWith('v:');
    const base = isV ? token.slice(2) : token;
    for (const src of (isV ? videoVariants(base) : photoVariants(base))) out.push({src, video: isV, base});
  }
  if (out.length === 0) for (const src of photoVariants('old-phones')) out.push({src, video: false, base: 'old-phones'});
  return out;
};

export const buildPlan = (fps: number, total: number) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  let shotSeed = 0;

  // DIRECTIVA anti-repetición (idéntica al CD): mismo archivo casi prohibido,
  // mismo SUJETO reciente penalizado con fuerza decreciente. Determinista.
  const useCount: Record<string, number> = {};
  const baseCount: Record<string, number> = {};
  const recent: string[] = [];
  const recentBase: string[] = [];
  const pickBest = (cands: Cand[]): Cand => {
    let best = cands[0]; let bestScore = Infinity;
    for (let k = 0; k < cands.length; k++) {
      const c = cands[k];
      const tie = ((k * 2654435761) % 997) / 997;
      const idxInBase = recentBase.lastIndexOf(c.base);
      const baseRecency = idxInBase === -1 ? 0 : 4000 - (recentBase.length - 1 - idxInBase) * 260;
      const score =
        (recent.includes(c.src) ? 6000 : 0) +
        baseRecency +
        (baseCount[c.base] ?? 0) * 40 +
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

  const archivalProgress: Record<string, number> = {}; // avanza el punto de lectura dentro de cada clip
  const chapterByCue = new Map(CHAPTERS.map((c) => [c.cue, c]));

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);
    const isIntro = c.i <= 15;
    const special = STATS[c.i] || FULLTEXT[c.i] || c.i === 12; // fondo calmo bajo el texto
    const archId = ARCHIVAL_BY_CUE[c.i];
    const shotPool = poolFor(baseForCue(c.i));

    if (archId && !special) {
      const meta = ARCHIVAL[archId];
      const already = archivalProgress[archId] ?? meta.start;
      const startFrom = Math.round(Math.min(already, Math.max(0, meta.dur - dur / fps - 1)) * fps);
      archivalProgress[archId] = already + dur / fps + 0.5;
      shots.push({from, dur, base: baseForCue(c.i), seed: shotSeed++, src: archivalSrc(archId), video: true, motion: 'zoomIn', startFrom: Math.max(0, startFrom), archival: true});
    } else if (special) {
      const cands = candidatesFor(shotPool);
      const pick = pickBest(cands);
      shots.push({from, dur, base: pick.base, seed: shotSeed++, src: pick.src, video: pick.video, motion: 'zoomIn'});
    } else {
      const cands = candidatesFor(shotPool);
      const varied = [4.2, 5.6, 4.6, 6.0][c.i % 4];
      const target = (isIntro ? 3.4 : varied) * fps;
      const n = Math.max(1, Math.round(dur / target));
      for (let k = 0; k < n; k++) {
        const sFrom = from + Math.round((k * dur) / n);
        const sTo = from + Math.round(((k + 1) * dur) / n);
        const pick = pickBest(cands);
        shots.push({from: sFrom, dur: Math.max(1, sTo - sFrom), base: pick.base, seed: shotSeed++, src: pick.src, video: pick.video, motion: cutMotions[(idx + k) % cutMotions.length]});
      }
    }

    // ---- Overlays ----
    if (chapterByCue.has(c.i)) {
      const ch = chapterByCue.get(c.i)!;
      overlays.push({from, dur: Math.round(fps * 2.4), kind: 'chapter', num: ch.num, text: ch.title});
    }
    if (c.i === 12) overlays.push({from, dur: Math.round(fps * 4.4), delay: 0.4, kind: 'title', pre: 'la historia de', text: 'BlackBerry'});
    if (STATS[c.i]) overlays.push({from, dur: Math.round(fps * 3.0), kind: 'stat', stat: STATS[c.i]});
    if (DATES[c.i]) overlays.push({from, dur: Math.round(fps * 2.4), kind: 'date', text: DATES[c.i]});
    if (FULLTEXT[c.i]) overlays.push({from, dur: Math.min(dur, Math.round(fps * 3.4)), kind: 'fulltext', text: FULLTEXT[c.i].text, accent: FULLTEXT[c.i].accent});
    const ed = EDITORIAL[c.i];
    if (ed) {
      overlays.push({
        from, dur: Math.round(ed.secs * fps), delay: (ed as {delay?: number}).delay,
        kind: ed.kind,
        headline: (ed as {headline?: string}).headline, dek: (ed as {dek?: string}).dek,
        quote: (ed as {quote?: string}).quote, author: (ed as {author?: string}).author,
        term: (ed as {term?: string}).term, pos: (ed as {pos?: string}).pos, def: (ed as {def?: string}).def,
        name: (ed as {name?: string}).name, role: (ed as {role?: string}).role,
      });
    }
  });

  // Cold-open
  overlays.push({from: Math.round(0.5 * fps), dur: Math.round(2.2 * fps), kind: 'date', text: '2011'});

  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const chapterMarks = CHAPTERS.map((ch) => ({from: cueFrom(ch.cue), num: ch.num, title: ch.title}));

  // aplica 'delay' (segundos dentro del cue) a los overlays que lo tengan
  overlays.forEach((o) => {if (o.delay) o.from += Math.round(o.delay * fps);});

  return {shots, overlays, chapters: chapterMarks};
};

// se conserva para el fondo procedural de respaldo (por si falta una base)
const HUE: Record<string, number> = {
  'bb-device': 210, 'waterloo': 200, 'qwerty': 220, 'bbm': 160, 'crowd': 30,
  'corporate': 205, 'obama': 215, 'iphone': 190, 'decline': 5, 'whatsapp': 140,
  'lesson': 265, 'competitors': 20, 'security': 185,
};
export const hueFor = (base: string) => HUE[base] ?? 205;
export {hasPhoto};
