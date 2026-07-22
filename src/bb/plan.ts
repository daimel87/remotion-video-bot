import {staticFile} from 'remotion';
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
  4: 'obama', 5: 'obama', 6: 'bb-device', 7: 'bb-device', // 6-7: "version blindada/modificada" -> otros BlackBerry, no más Obama
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

// ---- POOLS por base. TOKENS:
//   'a:ID'      = clip de ARCHIVO real (verificado cuadro por cuadro)
//   'v:base'    = video de stock ; 'img:base-n' = foto puntual ; 'base' = todas las fotos
// REGLA (por lo que se auditó): las tomas del DISPOSITIVO usan BlackBerry REAL
// (archivo BB + la foto del Passport). El stock genérico solo va en momentos de
// CONTEXTO (multitudes, oficinas, Wall Street, competidores).
// Clips de archivo que SÍ muestran BlackBerry:
//   rim-reaction-iphone (BB clásico + pantalla MESSAGES), bb-stops-phones-2016 (BB Bold),
//   bbm-messenger, blackberry-keyboard, blackberry-storm, rim-layoffs-news, obama-blackberry,
//   crackberry-news ("Berry Addictive"), rim-founders (Balsillie), wall-street-bb (Bloomberg BB),
//   bb-outage-2011, blackberry-10-launch, iphone-2007-keynote.
// Descartados por búsqueda equivocada: blackberry-850-1999, blackberry-ad-2000s, two-way-pager-90s.
const POOLS: Record<string, string[]> = {
  'bb-device':   ['a:rim-reaction-iphone', 'a:bb-bold-9900', 'a:bbm-messenger', 'img:qwerty-phone-1', 'a:bb-torch-9800', 'a:bb-pearl-8100', 'a:bb-stops-phones-2016', 'a:blackberry-keyboard'],
  'waterloo':    ['a:rim-founders', 'canada-waterloo', 'a:bb-bold-9000', 'a:bb-stops-phones-2016', 'empty-office'],
  'qwerty':      ['a:blackberry-keyboard', 'a:bb-curve-8520', 'a:rim-reaction-iphone', 'a:bb-bold-9900', 'img:qwerty-phone-1', 'a:bb-pearl-8100', 'email-screen'],
  'bbm':         ['a:bbm-messenger', 'a:bb-pearl-8100', 'v:texting-hands', 'texting-hands', 'email-screen'],
  'crowd':       ['a:crackberry-news', 'a:bb-curve-8520', 'v:city-commuters', 'city-commuters', 'a:bbm-messenger', 'a:bb-pearl-8100', 'v:texting-hands'],
  'corporate':   ['a:wall-street-bb', 'a:bb-bold-9900', 'boardroom-execs', 'v:office-corporate', 'a:bb-bold-9000', 'office-corporate', 'v:business-phone'],
  'obama':       ['a:obama-blackberry', 'boardroom-execs', 'business-phone'],
  'iphone':      ['a:iphone-2007-keynote', 'v:smartphone-modern', 'smartphone-modern'],
  'decline':     ['a:blackberry-storm', 'a:bb-torch-9800', 'a:bb-outage-2011', 'v:stock-market', 'stock-market', 'empty-office'],
  'whatsapp':    ['a:rim-layoffs-news', 'v:smartphone-modern', 'smartphone-modern', 'a:bb-stops-phones-2016', 'v:texting-hands'],
  'lesson':      ['old-phones', 'empty-office', 'v:factory-tech', 'factory-tech', 'v:city-commuters'],
  'competitors': ['old-phones', 'v:factory-tech', 'factory-tech', 'empty-office'],
  'security':    ['security-encryption', 'v:server-room', 'server-room'],
};
const poolFor = (base: string) => POOLS[base] ?? ['img:qwerty-phone-1'];

// ---- Clips de ARCHIVO forzados por cue (ocupan todo el cue, un solo clip continuo).
// Solo para momentos NARRATIVAMENTE bloqueados donde debe verse ESE clip. Lo demás
// sale del pool (que ya trae archivo BB donde corresponde). Sin clips basura. ----
const ARCHIVAL_BY_CUE: Record<number, string> = {
  // Obama no soltó su BlackBerry (solo 4-5; 6-7 van al pool de dispositivos para no repetir el mismo clip)
  4: 'obama-blackberry', 5: 'obama-blackberry',
  // Orígenes / RIM / Lazaridis / Waterloo (Balsillie, edificio RIM)
  16: 'rim-founders', 18: 'rim-founders', 19: 'rim-founders', 20: 'rim-founders', 21: 'rim-founders',
  // 1999: el aparato raro, busca-personas con teclado que recibía correo (BB clásico + MESSAGES)
  23: 'rim-reaction-iphone', 24: 'rim-reaction-iphone', 25: 'rim-reaction-iphone', 26: 'rim-reaction-iphone',
  // el teclado QWERTY (primer plano del BB)
  30: 'blackberry-keyboard', 34: 'blackberry-keyboard', 35: 'blackberry-keyboard',
  // BBM (44/45 liberados al pool ampliado -> variedad; 53/54 fijos por las pantallas D/R)
  41: 'bbm-messenger', 53: 'bbm-messenger', 54: 'bbm-messenger',
  // CrackBerry / palabra del año 2006 ("Berry Addictive")
  62: 'crackberry-news', 63: 'crackberry-news', 64: 'crackberry-news',
  // mundo corporativo / Wall Street (Bloomberg BlackBerry)
  66: 'wall-street-bb',
  // iPhone 2007: Steve Jobs en el escenario (y la risa de RIM, por contraste)
  80: 'iphone-2007-keynote', 81: 'iphone-2007-keynote', 82: 'iphone-2007-keynote', 83: 'iphone-2007-keynote',
  84: 'iphone-2007-keynote', 85: 'iphone-2007-keynote',
  // BlackBerry Storm (táctil fallido, 2008 — unboxing Vodafone)
  104: 'blackberry-storm', 105: 'blackberry-storm', 106: 'blackberry-storm',
  // caída global del servicio (2011)
  116: 'bb-outage-2011',
  // BlackBerry 10 (2013)
  131: 'blackberry-10-launch', 132: 'blackberry-10-launch',
  // pérdidas / despidos / acción se desploma (BB Bold en mano + analista S&P)
  134: 'rim-layoffs-news', 135: 'rim-layoffs-news', 136: 'rim-layoffs-news',
  // deja de fabricar teléfonos (2016 — BB Bold en primer plano)
  139: 'bb-stops-phones-2016', 140: 'bb-stops-phones-2016', 141: 'bb-stops-phones-2016',
};

// ---- VENTANAS BUENAS por clip (segundos [inicio, fin] donde SÍ se ve BlackBerry).
// Verificado cuadro por cuadro: estos clips son reviews/documentales que mezclan
// el dispositivo con cabezas parlantes, iPhone o calle. El avance dentro del clip
// solo gira por estos segmentos, nunca por las zonas malas. ----
const WINDOWS: Record<string, [number, number][]> = {
  'obama-blackberry':     [[0, 15]],                    // Obama sosteniendo el aparato (0-8) + BB Bold closeup/UI (10-15); evita iPhone/analistas (16+)
  'blackberry-keyboard':  [[8, 29], [32, 39], [50, 58]],// KEY2 en soporte/mano (evita al reseñador en el sofá)
  'rim-reaction-iphone':  [[4, 11], [22, 35]],          // BB clásico monocromo + teclado redondo (evita bigotón / iPhone)
  'bb-stops-phones-2016': [[2, 17]],                    // letrero BlackBerry + BB Bold + evento (evita teléfono moderno)
  'bbm-messenger':        [[2, 9], [18, 22], [24, 42]], // BB Torch + letrero RIM + Lazaridis + pantallas BBM (evita calle/Apple)
  'rim-founders':         [[6, 57]],                    // Balsillie + letrero RIM + edificio + BB + cifras (evita hockey/MRI)
  'crackberry-news':      [[27, 30], [42, 54], [57, 88]],// "Berry Addictive" + gente con BB + closeups
  'wall-street-bb':       [[9, 52]],                    // Bloomberg "BlackBerry" + BB en mano (continuo, oro puro)
  'iphone-2007-keynote':  [[6, 118]],                   // Steve Jobs en el escenario (revelación iPhone)
  'blackberry-storm':     [[27, 88]],                   // unboxing del Storm (caja + dispositivo en mano)
  'bb-outage-2011':       [[3, 9], [24, 40]],           // BB en mano + letrero + PlayBook (evita analistas)
  'blackberry-10-launch': [[0, 42]],                    // demos "BlackBerry Keyboard" + BB10 en mano
  'rim-layoffs-news':     [[6, 21], [39, 46], [60, 72]],// BB Bold/BB10 en mano + campus RIM (evita analista S&P)
  // --- nuevos modelos (verificado cuadro por cuadro) ---
  'bb-bold-9000':         [[0, 6], [42, 72]],           // Bold en pantalla "OUR INNOVATION" + escenario de marca
  'bb-pearl-8100':        [[4, 60]],                    // Pearl en mano mostrando la interfaz (oscuro)
  'bb-bold-9900':         [[0, 34], [42, 148]],         // caja "BLACKBERRY BOLD" + unboxing del aparato (evita bumper 36s)
  'bb-curve-8520':        [[0, 23], [44, 60], [102, 120]],// caja BlackBerry + Curve 8520 en mano
  'bb-torch-9800':        [[6, 18], [36, 72], [136, 148]],// caja "Torch 9800" + aparato deslizante revelado
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

type Cand = {src: string; video: boolean; base: string; archId?: string};
const candidatesFor = (pool: string[]): Cand[] => {
  const out: Cand[] = [];
  for (const token of pool) {
    if (token.startsWith('a:')) {           // clip de archivo
      const id = token.slice(2);
      out.push({src: archivalSrc(id), video: true, base: 'a:' + id, archId: id});
    } else if (token.startsWith('v:')) {    // video de stock
      const base = token.slice(2);
      for (const src of videoVariants(base)) out.push({src, video: true, base});
    } else if (token.startsWith('img:')) {  // foto puntual (base-n)
      const name = token.slice(4);
      const base = name.replace(/-\d+$/, '');
      out.push({src: staticFile(`stock-bb/photos/${name}.jpg`), video: false, base});
    } else {                                // todas las fotos de la base
      for (const src of photoVariants(token)) out.push({src, video: false, base: token});
    }
  }
  if (out.length === 0) out.push({src: staticFile('stock-bb/photos/qwerty-phone-1.jpg'), video: false, base: 'qwerty-phone'});
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
  const recentBase: string[] = [];
  const lastEndFrame: Record<string, number> = {}; // frame en que dejó de verse cada src
  const MIN_SEP = Math.round(60 * fps); // DIRECTIVA: mínimo 1 minuto entre reapariciones del mismo clip
  // registra que un src ocupó [from, from+dur]. Se llama para TODA toma (pool y forzada)
  // para que ningún clip del pool caiga a menos de 1 min de la última vez que se vio ese mismo clip.
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
      // castigo fuerte si el mismo clip quiere volver antes de 1 min; decae a 0 al cumplirse la separación.
      // Si el pool es pequeño y todos incumplen, se elige el de mayor separación (degradación elegante).
      const sepPenalty = elapsed >= MIN_SEP ? 0 : 500000 * (1 - elapsed / MIN_SEP);
      const score =
        sepPenalty +
        baseRecency +
        (baseCount[c.base] ?? 0) * 40 +
        (useCount[c.src] ?? 0) * 8 +
        tie;
      if (score < bestScore) {bestScore = score; best = c;}
    }
    return best;
  };

  const archCursor: Record<string, number> = {}; // avanza por la línea de tiempo VIRTUAL (solo segmentos buenos)
  // devuelve el startFrom (frames) girando SOLO por las ventanas buenas del clip,
  // de modo que cada frame mostrado tiene BlackBerry garantizado.
  const nextArchStart = (id: string, durSecs: number): number => {
    const meta = ARCHIVAL[id] ?? {dur: 30, start: 1};
    const segs = (WINDOWS[id] ?? [[meta.start, meta.start + meta.dur]])
      .map(([a, b]) => [a, Math.max(a + 0.6, b)] as [number, number]);
    const totalLen = segs.reduce((s, [a, b]) => s + (b - a), 0);
    if (totalLen <= 0) return Math.max(0, Math.round(segs[0][0] * fps));
    let cursor = (archCursor[id] ?? 0) % totalLen;
    let acc = 0, startSec = segs[0][0];
    for (const [a, b] of segs) {
      const len = b - a;
      if (cursor < acc + len) {
        let s = a + (cursor - acc);
        const maxS = Math.max(a, b - durSecs);   // que la toma no se salga del segmento
        if (s > maxS) s = maxS;
        startSec = s; break;
      }
      acc += len;
    }
    archCursor[id] = (archCursor[id] ?? 0) + Math.max(durSecs, 1.6); // avanza para variar la próxima
    return Math.max(0, Math.round(startSec * fps));
  };
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
      // clip forzado: un solo plano continuo por todo el cue
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
      const varied = [4.2, 5.6, 4.6, 6.0][c.i % 4];
      const target = (isIntro ? 3.4 : varied) * fps;
      const n = Math.max(1, Math.round(dur / target));
      for (let k = 0; k < n; k++) {
        const sFrom = from + Math.round((k * dur) / n);
        const sTo = from + Math.round(((k + 1) * dur) / n);
        const sdur = Math.max(1, sTo - sFrom);
        const pick = pickBest(cands, sFrom);
        const isArch = !!pick.archId;
        shots.push({from: sFrom, dur: sdur, base: pick.base, seed: shotSeed++, src: pick.src, video: pick.video, motion: isArch ? 'zoomIn' : cutMotions[(idx + k) % cutMotions.length], archival: isArch, startFrom: isArch ? nextArchStart(pick.archId!, sdur / fps) : undefined});
        recordUse(pick.src, pick.base, sFrom, sdur);
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
