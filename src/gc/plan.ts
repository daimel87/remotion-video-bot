import {staticFile} from 'remotion';
import {cues} from './cues';
import {photoVariants, videoVariants, hasPhoto, ARCHIVAL, archivalSrc} from './assets';

// ============================================================
// EL CEREBRO del documental "Un MEXICANO de 23 Años le Dio COLOR a tu TV"
// (Guillermo González Camarena). Misma mecánica del CD/BlackBerry.
//
// >>> ESTADO: solo el MINUTO 1 (cues 1-12) está verificado cuadro por cuadro
// contra contact-sheets reales de los clips de archivo. El resto del guion
// usa un pool genérico de respaldo (topic 'context') hasta que se audite
// igual de estricto al construir el documental completo. <<<
// ============================================================

export type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
export type Accent = 'amber' | 'teal' | 'red' | 'paper';

export interface StatDef {value?: number; display?: string; prefix?: string; suffix?: string; label?: string; decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;}
export interface Shot {from: number; dur: number; base: string; seed: number; motion: Motion; src?: string; video?: boolean; archival?: boolean; startFrom?: number; signalCut?: boolean;}
export interface Overlay {
  from: number; dur: number; delay?: number;
  kind: 'title' | 'chapter' | 'date' | 'fulltext' | 'stat' | 'newspaper' | 'quote' | 'definition' | 'name' | 'source';
  pre?: string; text?: string; num?: number; stat?: StatDef; accent?: Accent;
  headline?: string; dek?: string; quote?: string; author?: string;
  term?: string; pos?: string; def?: string; name?: string; role?: string;
  label?: string; sub?: string;
}

// ---- Capítulos (arco narrativo; solo el I confirmado para el minuto 1) ----
const CHAPTERS = [
  {num: 1, cue: 12, title: 'Guadalajara, 1917'},
];

// ============================================================
// DIRECTIVA palabra-por-palabra (cues 1-12, verificado cuadro por cuadro
// contra contact-sheets de gc-documental / gc-canal5-xhgc / mexico-revolucion-1917):
//   1: "viendo esto en color, rojo verde azul de tu pantalla" -> macro de píxeles reales
//   2: "ese color no siempre estuvo ahí"                      -> espectro/prisma (nace el color)
//   3: "alguien tuvo que inventarlo... imaginar"               -> taller de electrónica (inventor)
//   4: "caja de vidrio" (la tele antigua)                      -> TV en blanco y negro real
//   5: "no fue Nueva York... no fue Londres" (negación)        -> texto en pantalla, SIN metraje
//                                                                  falso de esas ciudades (no tenemos)
//   6: "un joven de Guadalajara, 23 años, con sus manos"       -> gc-documental (retrato de época)
//   7: "país que apenas salía de una revolución"               -> mexico-revolucion-1917 (jinetes reales)
//   8: "su invento tocó el mundo entero"                       -> torre de transmisión (alcance/señal)
//   9: "esta es su historia..."                                -> TÍTULO del documental
//   10: "el olvido que se lo tragó"                            -> archivo/documentos viejos
//   11: "Todo empezó el 17 de..."                              -> prensa vieja (antesala del capítulo)
//   12: "17 de febrero de 1917, Guadalajara... la revolución"  -> gc-documental (tarjeta "17 DE FEBRERO
//                                                                  DE 1917" real) + mexico-revolucion-1917
// ------------------------------------------------------------
const TOPIC_RANGES: [number, number, string][] = [
  [1, 1, 'pixels'],
  [2, 2, 'spectrum'],
  [3, 3, 'invent'],
  [4, 4, 'oldtv'],
  [5, 5, 'negation'],
  [6, 6, 'ggc-bio'],
  [7, 7, 'revolution'],
  [8, 8, 'reach'],
  [9, 9, 'title'],
  [10, 10, 'archive'],
  [11, 11, 'press'],
  [12, 12, 'chapter1'],
];
const topicFor = (i: number): string => {
  for (const [a, b, t] of TOPIC_RANGES) if (i >= a && i <= b) return t;
  return 'context'; // resto del guion: pool genérico de respaldo hasta auditar el video completo
};

// ---- POOLS por tema. Tokens: 'a:ID' archivo real, 'v:base' video de stock,
// 'img:base-n' foto puntual, 'base' = todas las fotos de esa base. ----
const POOLS: Record<string, string[]> = {
  'pixels':     ['v:rgb-pixels-macro', 'rgb-pixels-macro'],
  'spectrum':   ['v:color-spectrum-prism', 'color-spectrum-prism'],
  'invent':     ['v:engineer-workshop', 'engineer-workshop', 'vintage-radio-parts', 'tube-radio'],
  'oldtv':      ['old-black-white-tv', 'v:vintage-tv-workshop'],
  'negation':   ['old-office-files', 'patent-document'], // fondo neutro bajo el texto de negación
  'ggc-bio':    ['a:gc-documental'],
  'revolution': ['a:mexico-revolucion-1917'],
  'reach':      ['v:broadcast-tower', 'broadcast-tower'],
  'title':      ['v:vintage-tv-workshop', 'old-black-white-tv'],
  // 'old-newspaper' se descarta: los recortes de Pexels traen titulares reales en
  // alemán/turco (WWII, Estambul) — fuera de contexto para una historia mexicana.
  'archive':    ['old-office-files'],
  'press':      ['old-office-files', 'patent-document'],
  'chapter1':   ['a:gc-documental', 'a:mexico-revolucion-1917'],
  // ---- respaldo genérico para el resto del guion (sin verificar aún) ----
  'context':    ['patent-document', 'old-newspaper', 'v:broadcast-tower', 'university-engineering'],
};
const poolFor = (topic: string) => POOLS[topic] ?? ['patent-document'];

// ---- Clips de ARCHIVO forzados por cue (ocupan todo el cue) ----
const ARCHIVAL_BY_CUE: Record<number, string> = {
  6: 'gc-documental',
  7: 'mexico-revolucion-1917',
  12: 'gc-documental', // el segundo shot del cue 12 fuerza mexico-revolucion-1917 (ver buildPlan)
};

// ---- VENTANAS BUENAS por clip (verificado cuadro por cuadro con contact-sheets) ----
const WINDOWS: Record<string, [number, number][]> = {
  // gc-documental: 0-10 retrato/foto de época en B/N (biografía); 13-19 tarjeta real
  // "17 DE FEBRERO DE 1917". Evita 25+ (motion graphics genéricos sin verificar aún).
  'gc-documental': [[1, 10], [13, 19]],
  // jinetes/tropas/soldados reales de la Revolución (verificado 1-15). Evita 17-21
  // (aviones biplano de la Primera Guerra Mundial, video genérico no-mexicano) y
  // 23+ (tarjeta "THE GREAT WAR" del canal, rompe la ilusión documental).
  'mexico-revolucion-1917': [[1, 15.5]],
};

// ---- Fechas / capítulo ----
const DATES: Record<number, string> = {12: '1917'};

// ---- Texto a pantalla completa ----
const FULLTEXT: Record<number, {text: string; accent?: Accent}> = {
  5: {text: 'No fue Nueva York.\nNo fue Londres.', accent: 'amber'},
};

// ---- Fuente citada bajo material de archivo real ----
const SOURCE: Record<number, {label: string; sub?: string}> = {
  12: {label: 'Documental biográfico', sub: 'Deyadira Medina Lara · Archivo Revolución Mexicana'},
};

const cutMotions: Motion[] = ['punchIn', 'zoomIn', 'panRight', 'zoomOut'];

type Cand = {src: string; video: boolean; base: string; archId?: string};
const candidatesFor = (pool: string[]): Cand[] => {
  const out: Cand[] = [];
  for (const token of pool) {
    if (token.startsWith('a:')) {
      const id = token.slice(2);
      out.push({src: archivalSrc(id), video: true, base: 'a:' + id, archId: id});
    } else if (token.startsWith('v:')) {
      const base = token.slice(2);
      for (const src of videoVariants(base)) out.push({src, video: true, base});
    } else if (token.startsWith('img:')) {
      const name = token.slice(4);
      const base = name.replace(/-\d+$/, '');
      out.push({src: staticFile(`stock-gc/photos/${name}.jpg`), video: false, base});
    } else {
      for (const src of photoVariants(token)) out.push({src, video: false, base: token});
    }
  }
  if (out.length === 0) out.push({src: staticFile('stock-gc/photos/patent-document-1.jpg'), video: false, base: 'patent-document'});
  return out;
};

export const buildPlan = (fps: number, total: number) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  let shotSeed = 0;

  const useCount: Record<string, number> = {};
  const baseCount: Record<string, number> = {};
  const recentBase: string[] = [];
  const lastEndFrame: Record<string, number> = {};
  const MIN_SEP = Math.round(45 * fps);
  const recordUse = (src: string, base: string, from: number, dur: number) => {
    useCount[src] = (useCount[src] ?? 0) + 1;
    baseCount[base] = (baseCount[base] ?? 0) + 1;
    lastEndFrame[src] = from + dur;
    recentBase.push(base); if (recentBase.length > 14) recentBase.shift();
  };
  const pickBest = (cands: Cand[], nowFrame: number): Cand => {
    let best = cands[0]; let bestScore = Infinity;
    for (let k = 0; k < cands.length; k++) {
      const c = cands[k];
      const tie = ((k * 2654435761) % 997) / 997;
      const idxInBase = recentBase.lastIndexOf(c.base);
      const baseRecency = idxInBase === -1 ? 0 : 4000 - (recentBase.length - 1 - idxInBase) * 260;
      const lastEnd = lastEndFrame[c.src];
      const elapsed = lastEnd === undefined ? MIN_SEP : nowFrame - lastEnd;
      const sepPenalty = elapsed >= MIN_SEP ? 0 : 500000 * (1 - elapsed / MIN_SEP);
      const score = sepPenalty + baseRecency + (baseCount[c.base] ?? 0) * 40 + (useCount[c.src] ?? 0) * 8 + tie;
      if (score < bestScore) {bestScore = score; best = c;}
    }
    return best;
  };

  const archCursor: Record<string, number> = {};
  const nextArchStart = (id: string, durSecs: number): number => {
    const meta = ARCHIVAL[id] ?? {dur: 30, start: 1};
    const segs = (WINDOWS[id] ?? [[meta.start, meta.start + meta.dur]]).map(([a, b]) => [a, Math.max(a + 0.6, b)] as [number, number]);
    const totalLen = segs.reduce((s, [a, b]) => s + (b - a), 0);
    if (totalLen <= 0) return Math.max(0, Math.round(segs[0][0] * fps));
    let cursor = (archCursor[id] ?? 0) % totalLen;
    let acc = 0, startSec = segs[0][0];
    for (const [a, b] of segs) {
      const len = b - a;
      if (cursor < acc + len) {
        let s = a + (cursor - acc);
        const maxS = Math.max(a, b - durSecs);
        if (s > maxS) s = maxS;
        startSec = s; break;
      }
      acc += len;
    }
    archCursor[id] = (archCursor[id] ?? 0) + Math.max(durSecs, 1.6);
    return Math.max(0, Math.round(startSec * fps));
  };
  const chapterByCue = new Map(CHAPTERS.map((c) => [c.cue, c]));

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);
    const special = !!FULLTEXT[c.i];
    const archId = ARCHIVAL_BY_CUE[c.i];
    const shotPool = poolFor(topicFor(c.i));

    if (c.i === 12) {
      // dos planos reales dentro del mismo cue: la tarjeta "17 DE FEBRERO DE 1917"
      // del documental (fijo, NO por el cursor compartido: esa fecha exacta debe
      // verse aquí, no en cualquier punto de la ventana [13,19]), seguida de
      // metraje real de la Revolución Mexicana.
      const d1 = Math.round(dur * 0.42);
      const d2 = dur - d1;
      shots.push({from, dur: d1, base: 'a:gc-documental', seed: shotSeed++, src: archivalSrc('gc-documental'), video: true, motion: 'zoomIn', archival: true, startFrom: Math.round(14 * fps), signalCut: true});
      recordUse(archivalSrc('gc-documental'), 'a:gc-documental', from, d1);
      shots.push({from: from + d1, dur: d2, base: 'a:mexico-revolucion-1917', seed: shotSeed++, src: archivalSrc('mexico-revolucion-1917'), video: true, motion: 'panRight', archival: true, startFrom: nextArchStart('mexico-revolucion-1917', d2 / fps)});
      recordUse(archivalSrc('mexico-revolucion-1917'), 'a:mexico-revolucion-1917', from + d1, d2);
    } else if (archId && !special) {
      const fsrc = archivalSrc(archId);
      shots.push({from, dur, base: 'a:' + archId, seed: shotSeed++, src: fsrc, video: true, motion: 'zoomIn', startFrom: nextArchStart(archId, dur / fps), archival: true});
      recordUse(fsrc, 'a:' + archId, from, dur);
    } else if (special) {
      const pick = pickBest(candidatesFor(shotPool), from);
      const isArch = !!pick.archId;
      shots.push({from, dur, base: pick.base, seed: shotSeed++, src: pick.src, video: pick.video, motion: 'zoomIn', archival: isArch, startFrom: isArch ? nextArchStart(pick.archId!, dur / fps) : undefined});
      recordUse(pick.src, pick.base, from, dur);
    } else {
      const cands = candidatesFor(shotPool);
      const pick = pickBest(cands, from);
      const isArch = !!pick.archId;
      shots.push({from, dur, base: pick.base, seed: shotSeed++, src: pick.src, video: pick.video, motion: isArch ? 'zoomIn' : cutMotions[idx % cutMotions.length], archival: isArch, startFrom: isArch ? nextArchStart(pick.archId!, dur / fps) : undefined});
      recordUse(pick.src, pick.base, from, dur);
    }

    // ---- Overlays ----
    if (chapterByCue.has(c.i)) {
      const ch = chapterByCue.get(c.i)!;
      overlays.push({from, dur: Math.round(fps * 2.4), kind: 'chapter', num: ch.num, text: ch.title});
    }
    if (c.i === 9) overlays.push({from, dur: Math.round(fps * 4.6), delay: 0.3, kind: 'title', pre: 'la historia de', text: 'Guillermo González Camarena'});
    if (DATES[c.i]) overlays.push({from, dur: Math.round(fps * 2.4), delay: (dur / fps) * 0.42, kind: 'date', text: DATES[c.i]});
    if (FULLTEXT[c.i]) overlays.push({from, dur: Math.min(dur, Math.round(fps * 3.6)), kind: 'fulltext', text: FULLTEXT[c.i].text, accent: FULLTEXT[c.i].accent});
    if (SOURCE[c.i]) overlays.push({from, dur: Math.round(fps * 3.4), delay: 0.3, kind: 'source', label: SOURCE[c.i].label, sub: SOURCE[c.i].sub});
  });

  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const chapterMarks = CHAPTERS.map((ch) => ({from: cueFrom(ch.cue), num: ch.num, title: ch.title}));

  overlays.forEach((o) => {if (o.delay) o.from += Math.round(o.delay * fps);});

  return {shots, overlays, chapters: chapterMarks};
};

const HUE: Record<string, number> = {
  'pixels': 200, 'spectrum': 280, 'invent': 40, 'oldtv': 210, 'negation': 30,
  'ggc-bio': 35, 'revolution': 25, 'reach': 195, 'title': 210, 'archive': 40,
  'press': 45, 'chapter1': 30, 'context': 205,
};
export const hueFor = (base: string) => HUE[base] ?? 205;
export {hasPhoto};
