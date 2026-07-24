import {staticFile} from 'remotion';
import {cues} from './cues';
import {photoVariants, videoVariants, hasPhoto, ARCHIVAL, archivalSrc} from './assets';

// ============================================================
// EL CEREBRO del documental "Un MEXICANO de 23 Años le Dio COLOR a tu TV"
// (Guillermo González Camarena). Misma mecánica del CD/BlackBerry, pero el
// MINUTO 1 (cues 1-12) es un STORYBOARD explícito, verificado cuadro por
// cuadro contra los clips reales, con cortes rápidos (estilo dinámico del
// video de referencia): cada cue se parte en 2-3 planos cortos con zooms
// punch, en vez de un solo plano lento. El resto del guion usa el pool
// genérico de respaldo hasta auditarlo igual.
//
// HALLAZGO CLAVE de la auditoría: los tres clips gc-* son cortes del MISMO
// documental animado (Deyadira Medina Lara). Sus primeros ~12s son cine de
// época que NO es GGC (aparece Cantinflas). Los segmentos que SÍ muestran a
// González Camarena (retrato animado) están marcados abajo con @segundo.
// ============================================================

export type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
export type Accent = 'amber' | 'teal' | 'red' | 'paper';

export interface StatDef {value?: number; display?: string; prefix?: string; suffix?: string; label?: string; decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;}
export interface Shot {from: number; dur: number; base: string; seed: number; motion: Motion; src?: string; video?: boolean; archival?: boolean; startFrom?: number; signalCut?: boolean; component?: 'patent';}
export interface Overlay {
  from: number; dur: number; delay?: number;
  kind: 'title' | 'chapter' | 'date' | 'fulltext' | 'stat' | 'newspaper' | 'quote' | 'definition' | 'name' | 'source';
  pre?: string; text?: string; num?: number; stat?: StatDef; accent?: Accent;
  headline?: string; dek?: string; quote?: string; author?: string;
  term?: string; pos?: string; def?: string; name?: string; role?: string;
  label?: string; sub?: string;
}

// Los textos se nudgean un pelín DESPUÉS del inicio de su cue para que caigan
// CON la frase hablada y nunca antes (la transcripción marca el inicio del
// segmento un poco antes de que arranque la voz).
const TEXT_NUDGE = 0.35;

// ---- Capítulos ----
const CHAPTERS = [
  {num: 1, cue: 12, title: 'Guadalajara, 1917'},
];

// ============================================================
// STORYBOARD del MINUTO 1 — cada cue -> lista de planos cortos.
// Token de plano:
//   'a:ID@S'    clip de ARCHIVO ID, inicio FIJO en el segundo S (inicio verificado)
//   'v:base'    video de stock (elige variante sin repetir)
//   'img:base-n' foto puntual
//   'base'      fotos de esa base (elige variante sin repetir)
// motion por plano; si se omite, alterna punch/zoom para dar energía.
// ============================================================
type SB = {t: string; m?: Motion; w?: number; sc?: boolean};
const STORYBOARD: Record<number, SB[]> = {
  // 1 (0-5): "estás viendo esto en color, el rojo el verde el azul de tu pantalla"
  1:  [{t: 'v:rgb-pixels-macro', m: 'punchIn'}, {t: 'color-spectrum-prism', m: 'zoomIn'}],
  // 2 (5-9): "ese color no siempre estuvo ahí" -> del color al B/N
  2:  [{t: 'v:color-spectrum-prism', m: 'panRight'}, {t: 'old-black-white-tv', m: 'zoomIn'}],
  // 3 (9-14): "alguien tuvo que inventarlo... imaginar cómo meter todos los colores"
  3:  [{t: 'v:engineer-workshop', m: 'punchIn'}, {t: 'vintage-radio-parts', m: 'zoomIn'}],
  // 4 (14-18): "dentro de una caja de vidrio. no fue una gran corporación en Nueva York"
  4:  [{t: 'old-black-white-tv', m: 'zoomIn'}, {t: 'v:vintage-tv-workshop', m: 'panRight'}],
  // 5 (18-23): "no fue un laboratorio millonario en Londres" -> FULLTEXT sobre fondo calmo
  5:  [{t: 'v:engineer-workshop', m: 'zoomIn'}],
  // 6 (23-28): "fue un joven de Guadalajara, 23 años, con sus propias manos" -> GGC REAL
  6:  [{t: 'a:gc-historia-tv-color@18', m: 'zoomIn'}, {t: 'a:gc-historia-tv-color@62', m: 'punchIn'}],
  // 7 (28-33): "un país que salía de una revolución. Su nombre era Guillermo González"
  //   REGLA: cuando se dice el NOMBRE, sale GGC -> revolución primero, retrato al decir el nombre.
  7:  [{t: 'a:mexico-revolucion-1917@2', m: 'panRight'}, {t: 'a:gc-historia-tv-color@18', m: 'zoomIn'}],
  // 8 (33-38): "Camarena y aunque su invento tocó el mundo entero" -> GGC en la TV + alcance
  8:  [{t: 'a:gc-historia-tv-color@66', m: 'zoomIn'}, {t: 'v:broadcast-tower', m: 'panRight'}],
  // 9 (38-42): "esta es su historia, el muchacho que le dio color a la televisión" -> TÍTULO
  9:  [{t: 'a:gc-historia-tv-color@63', m: 'zoomIn'}],
  // 10 (42-47): "y del olvido que se lo tragó. Quédate hasta el final porque lo que le pasó"
  //   TEASER de la patente (gancho de "quédate hasta el final"), UNA sola vez y largo.
  10: [{t: 'c:patent'}],
  // 11 (47-52): "dice más sobre la justicia que cualquier libro. Todo empezó el 17 de"
  //   el hombre (justicia) -> y AL DECIR "todo empezó el 17 de" entra la tarjeta 17-feb.
  11: [{t: 'a:gc-historia-tv-color@62', m: 'zoomIn', w: 1.5}, {t: 'a:gc-documental@13.5', m: 'zoomIn', sc: true}],
  // 12 (52-58): "febrero de 1917, Guadalajara... la revolución" -> tarjeta continúa + Revolución
  12: [{t: 'a:gc-documental@13.5', m: 'zoomIn'}, {t: 'a:mexico-revolucion-1917@9', m: 'panRight'}],
  // 13 (58-64): "la revolución acababa de terminar, el país estaba roto, pobre" -> secuelas reales
  //   @6 = auto destruido (país roto); @13 = soldados. Evita 7.2-8.8 (una vitrina de
  //   tienda "Velvet" que NO es de la Revolución).
  13: [{t: 'a:mexico-revolucion-1917@6', m: 'zoomIn'}, {t: 'a:mexico-revolucion-1917@13', m: 'panLeft'}],
};

// ---- Ventanas buenas (para los cues NO cubiertos por el storyboard, y como
// respaldo). Verificadas cuadro por cuadro. ----
const WINDOWS: Record<string, [number, number][]> = {
  'gc-documental': [[13, 16], [18, 21]],
  'gc-historia-tv-color': [[18, 21], [62, 65], [66, 72], [74, 76]],
  // 1-5.5 jinetes; 5.8-7 auto destruido (país roto); 9-15 soldados. Evita 7.2-8.8
  // (una vitrina de tienda que NO es de la Revolución) y 17+ (aviones WWI, tarjeta canal).
  'mexico-revolucion-1917': [[1, 7], [9, 15]],
};

const DATES: Record<number, string> = {12: '1917'};

const FULLTEXT: Record<number, {text: string; accent?: Accent}> = {
  5: {text: 'No fue Nueva York.\nNo fue Londres.', accent: 'amber'},
};

const SOURCE: Record<number, {label: string; sub?: string}> = {
  12: {label: 'Documental biográfico', sub: 'Deyadira Medina Lara · Archivo Revolución Mexicana'},
};

// ---- Pool genérico de respaldo para cues 14+ (sin auditar aún). SOLO material
// temático de TV/color, neutro y sin anacronismos. PROHIBIDO: patent-document
// (resultó ser bocetos anatómicos de mano/ojos de Pexels), old-office-files
// (oficinas modernas), university-engineering (edificios extranjeros modernos),
// child-electronics (niños con robots modernos) — todo fuera de contexto. ----
const CONTEXT_POOL = ['v:broadcast-tower', 'old-black-white-tv', 'v:tv-static-noise', 'color-spectrum-prism'];

const cutMotions: Motion[] = ['punchIn', 'zoomIn', 'panRight', 'zoomOut', 'panLeft'];

type Cand = {src: string; video: boolean; base: string; archId?: string; fixedStart?: number; component?: 'patent'};
// resuelve UN token de plano a un candidato concreto (para storyboard).
const resolveToken = (t: string, pickVariant: (cands: Cand[]) => Cand): Cand => {
  const at = t.indexOf('@');
  if (t.startsWith('c:')) {           // componente motion-graphic (teaser, etc.)
    return {src: '', video: false, base: t, component: t.slice(2) as 'patent'};
  }
  if (t.startsWith('a:')) {
    const body = t.slice(2);
    const [id, s] = at >= 0 ? [body.slice(0, body.indexOf('@')), parseFloat(body.slice(body.indexOf('@') + 1))] : [body, undefined];
    return {src: archivalSrc(id), video: true, base: 'a:' + id, archId: id, fixedStart: s};
  }
  if (t.startsWith('v:')) {
    const base = t.slice(2);
    return pickVariant(videoVariants(base).map((src) => ({src, video: true, base})));
  }
  if (t.startsWith('img:')) {
    const name = t.slice(4);
    const base = name.replace(/-\d+$/, '');
    return {src: staticFile(`stock-gc/photos/${name}.jpg`), video: false, base};
  }
  return pickVariant(photoVariants(t).map((src) => ({src, video: false, base: t})));
};

const candidatesFor = (pool: string[]): Cand[] => {
  const out: Cand[] = [];
  for (const token of pool) {
    if (token.startsWith('a:')) {
      const id = token.slice(2);
      out.push({src: archivalSrc(id), video: true, base: 'a:' + id, archId: id});
    } else if (token.startsWith('v:')) {
      const base = token.slice(2);
      for (const src of videoVariants(base)) out.push({src, video: true, base});
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
  const recentBase: string[] = [];
  const lastEndFrame: Record<string, number> = {};
  const recordUse = (src: string, base: string, from: number, dur: number) => {
    useCount[src] = (useCount[src] ?? 0) + 1;
    lastEndFrame[src] = from + dur;
    recentBase.push(base); if (recentBase.length > 12) recentBase.shift();
  };
  const pickVariant = (cands: Cand[]): Cand => {
    if (cands.length === 0) return {src: staticFile('stock-gc/photos/patent-document-1.jpg'), video: false, base: 'patent-document'};
    let best = cands[0]; let bestScore = Infinity;
    for (let k = 0; k < cands.length; k++) {
      const c = cands[k];
      const tie = ((k * 2654435761) % 997) / 997;
      const score = (useCount[c.src] ?? 0) * 100 + tie;
      if (score < bestScore) {bestScore = score; best = c;}
    }
    return best;
  };

  // avance por ventanas buenas (para archival del pool sin inicio fijo)
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
      if (cursor < acc + len) {let s = a + (cursor - acc); const maxS = Math.max(a, b - durSecs); if (s > maxS) s = maxS; startSec = s; break;}
      acc += len;
    }
    archCursor[id] = (archCursor[id] ?? 0) + Math.max(durSecs, 1.6);
    return Math.max(0, Math.round(startSec * fps));
  };

  const chapterByCue = new Map(CHAPTERS.map((c) => [c.cue, c]));

  const pushShot = (from: number, dur: number, c: Cand, motion: Motion, signalCut?: boolean) => {
    const startFrom = c.archId
      ? (c.fixedStart !== undefined ? Math.round(c.fixedStart * fps) : nextArchStart(c.archId, dur / fps))
      : undefined;
    shots.push({from, dur, base: c.base, seed: shotSeed++, src: c.src, video: c.video, motion, archival: !!c.archId, startFrom, signalCut, component: c.component});
    if (c.src) recordUse(c.src, c.base, from, dur);
  };

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);

    const sb = STORYBOARD[c.i];
    if (sb) {
      // reparte el cue entre los planos del storyboard (según peso w, default 1)
      const totalW = sb.reduce((s, p) => s + (p.w ?? 1), 0);
      let acc = 0;
      sb.forEach((p, k) => {
        const w = p.w ?? 1;
        const sFrom = from + Math.round((acc / totalW) * dur);
        const sTo = from + Math.round(((acc + w) / totalW) * dur);
        acc += w;
        const sdur = Math.max(1, sTo - sFrom);
        const cand = resolveToken(p.t, pickVariant);
        const motion = p.m ?? cutMotions[(idx + k) % cutMotions.length];
        // signalCut (corte de estática de TV) donde el storyboard lo pida
        pushShot(sFrom, sdur, cand, motion, !!p.sc);
      });
    } else {
      // pool genérico de respaldo, subdividido para no quedar lento
      const cands = candidatesFor(CONTEXT_POOL);
      const target = 4.0 * fps;
      const n = Math.max(1, Math.round(dur / target));
      for (let k = 0; k < n; k++) {
        const sFrom = from + Math.round((k * dur) / n);
        const sTo = from + Math.round(((k + 1) * dur) / n);
        const cand = pickVariant(cands);
        pushShot(sFrom, Math.max(1, sTo - sFrom), cand, cutMotions[(idx + k) % cutMotions.length]);
      }
    }

    // ---- Overlays (nudgeados para caer CON la frase) ----
    if (chapterByCue.has(c.i)) {
      const ch = chapterByCue.get(c.i)!;
      // "Guadalajara" se dice a mitad del cue 12 -> ancla ahí
      overlays.push({from, dur: Math.round(fps * 2.6), delay: 0.9, kind: 'chapter', num: ch.num, text: ch.title});
    }
    if (c.i === 9) overlays.push({from, dur: Math.round(fps * 4.2), delay: TEXT_NUDGE, kind: 'title', pre: 'la historia de', text: 'Guillermo González Camarena'});
    // (sin DateStamp "1917": la tarjeta de archivo ya muestra "17 DE FEBRERO DE 1917")
    if (FULLTEXT[c.i]) overlays.push({from, dur: Math.min(dur, Math.round(fps * 3.6)), delay: TEXT_NUDGE, kind: 'fulltext', text: FULLTEXT[c.i].text, accent: FULLTEXT[c.i].accent});
    if (SOURCE[c.i]) overlays.push({from, dur: Math.round(fps * 3.2), delay: 0.6, kind: 'source', label: SOURCE[c.i].label, sub: SOURCE[c.i].sub});
  });

  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const chapterMarks = CHAPTERS.map((ch) => ({from: cueFrom(ch.cue), num: ch.num, title: ch.title}));

  overlays.forEach((o) => {if (o.delay) o.from += Math.round(o.delay * fps);});

  return {shots, overlays, chapters: chapterMarks};
};

const HUE: Record<string, number> = {
  'a:gc-documental': 35, 'a:gc-historia-tv-color': 35, 'a:mexico-revolucion-1917': 25,
  'rgb-pixels-macro': 200, 'color-spectrum-prism': 280, 'engineer-workshop': 40,
  'old-black-white-tv': 210, 'vintage-radio-parts': 40, 'vintage-tv-workshop': 210,
  'broadcast-tower': 195, 'patent-document': 45, 'old-office-files': 40, 'university-engineering': 205,
};
export const hueFor = (base: string) => HUE[base] ?? 205;
export {hasPhoto};
