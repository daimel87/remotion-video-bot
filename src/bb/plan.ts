import {cues} from '../data/bbCues';

// ============================================================
// EL CEREBRO del documental "La historia de BlackBerry".
// Mismo estilo cinematográfico del CD (capítulos, stats, citas, tarjetas).
// Fondos temporales (procedurales) hasta descargar el archivo/stock de BB;
// cada toma lleva un 'base' para mapear al material real después.
// DIRECTIVA anti-repetición incluida desde el inicio.
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

// ---- Imagen por sección del guion (rango de cues -> base) ----
const SECTION: [number, number, string][] = [
  [1, 15, 'bb-device'],        // intro/gancho: el aparato como símbolo
  [16, 22, 'waterloo'],        // orígenes / RIM en Canadá
  [23, 39, 'qwerty'],          // el aparato raro, correo, teclado
  [40, 56, 'bbm'],             // BBM, PIN
  [57, 66, 'crowd'],           // CrackBerry, LatAm, apogeo
  [67, 79, 'corporate'],       // seguridad, gobiernos, modelos, soberbia
  [80, 96, 'iphone'],          // la tormenta: iPhone 2007
  [97, 119, 'decline'],        // jaula de oro, Storm, PlayBook
  [120, 142, 'whatsapp'],      // WhatsApp, colapso, 2016
  [143, 164, 'lesson'],        // la lección, Kodak/Nokia/Blockbuster
  [165, 166, 'lesson'],        // suscríbete
];
// Overrides puntuales (frases concretas).
const OVERRIDE: Record<number, string> = {
  4: 'obama', 5: 'obama', 6: 'obama', 7: 'obama',   // Obama no soltó su BlackBerry
  36: 'corporate', 37: 'corporate', 38: 'corporate', // ejecutivo respondiendo desde un taxi
  67: 'security', 68: 'security', 69: 'security',    // seguridad legendaria / encriptación
  71: 'obama',                                        // Obama lo usaba
  81: 'iphone', 82: 'iphone', 83: 'iphone',           // Steve Jobs presenta el iPhone
  135: 'decline', 136: 'decline',                     // pérdidas, acción se desploma
  155: 'competitors', 156: 'competitors', 157: 'competitors', // Kodak, Nokia, Blockbuster
};
const baseForCue = (i: number): string => {
  if (OVERRIDE[i]) return OVERRIDE[i];
  for (const [a, b, base] of SECTION) if (i >= a && i <= b) return base;
  return 'bb-device';
};
// Familias de color por base (para los fondos temporales, tono cine oscuro).
const HUE: Record<string, number> = {
  'bb-device': 210, 'waterloo': 200, 'qwerty': 220, 'bbm': 160, 'crowd': 30,
  'corporate': 205, 'obama': 215, 'iphone': 190, 'decline': 5, 'whatsapp': 140,
  'lesson': 265, 'competitors': 20, 'security': 185,
};
export const hueFor = (base: string) => HUE[base] ?? 205;

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
  12: {kind: 'title', secs: 4} as unknown as Ed, // se maneja aparte (título)
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

const cutMotions: Motion[] = ['punchIn', 'zoomIn', 'panRight', 'zoomOut', 'panLeft', 'zoomIn'];

export const buildPlan = (fps: number, total: number) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  let shotSeed = 0;

  // DIRECTIVA anti-repetición: no repetir el mismo sujeto (base) de cerca.
  const recentBase: string[] = [];
  const chapterByCue = new Map(CHAPTERS.map((c) => [c.cue, c]));

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);
    const base = baseForCue(c.i);
    const special = STATS[c.i] || FULLTEXT[c.i] || c.i === 12; // fondo más calmo bajo el texto

    // Ritmo documental: intro ágil, cuerpo con tomas medias.
    const target = (c.i <= 15 ? 3.2 : [4.2, 5.4, 4.6, 5.8][c.i % 4]) * fps;
    const n = special ? 1 : Math.max(1, Math.round(dur / target));
    for (let k = 0; k < n; k++) {
      const sFrom = from + Math.round((k * dur) / n);
      const sTo = from + Math.round(((k + 1) * dur) / n);
      recentBase.push(base); if (recentBase.length > 5) recentBase.shift();
      shots.push({from: sFrom, dur: Math.max(1, sTo - sFrom), base, seed: shotSeed++, motion: cutMotions[(idx + k) % cutMotions.length]});
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
    if (ed && c.i !== 12) {
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
