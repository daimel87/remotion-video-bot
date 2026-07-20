import {Cue} from './healthCues';
import {Accent} from './theme';
import {variantsOf, hasMedia} from './assets';

// ============================================================
// EL CEREBRO: narración -> visuales + overlays.
// Video: "5 alimentos que SÍ + 5 que MEJOR dejar atrás (después de los 60)".
// Mapeo por SECCIONES (cada alimento con su imagen) + anti-repetición real
// (DIRECTIVA: nunca repetir el mismo archivo ni el mismo sujeto de cerca).
// ============================================================

export type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
export interface Shot {from: number; dur: number; base: string; seed: number; motion: Motion; src?: string; video?: boolean;}

export interface Overlay {
  from: number; dur: number;
  delay?: number; // segundos DENTRO del cue en que aparece (la frase no siempre está al inicio)
  kind: 'hook' | 'foodNum' | 'price' | 'card' | 'tip' | 'quote' | 'label';
  text?: string; accent?: Accent;
  num?: number; title?: string; foodKind?: 'good' | 'bad';
  value?: number; display?: string; prefix?: string; suffix?: string; label?: string;
  kicker?: string; headline?: string; dek?: string; imgBase?: string;
  term?: string; def?: string;
  quote?: string; author?: string;
  name?: string; role?: string;
}

// ---- Mapeo de la imagen por SECCIÓN del guion (rango de cues -> alimento) ----
const SECTION: [number, number, string][] = [
  [11, 14, 'oatmeal-bowl'],   // #1 avena
  [15, 17, 'lentils-beans'],  // #2 legumbres
  [18, 21, 'oily-fish'],      // #3 pescado azul
  [22, 24, 'leafy-greens'],   // #4 verduras verdes
  [25, 27, 'yogurt'],         // #5 yogur
  [30, 32, 'processed-meat'], // malo #1 embutidos
  [33, 34, 'sugary-drinks'],  // malo #2 bebidas azucaradas
  [35, 36, 'fried-food'],     // malo #3 frituras
  [37, 39, 'pastries'],       // malo #4 bollería
  [40, 41, 'salt-herbs'],     // malo #5 exceso de sal
];
// Overrides puntuales (intro, transición, cierre y frases concretas).
const OVERRIDE: Record<number, string> = {
  1: 'senior-portrait',   // "algo que noté con los años"
  2: 'leafy-greens',      // "comidas que te dejan con energía" -> comida sana
  3: 'fried-food',        // "y otras te dejan pesado, cansado" -> comida pesada/chatarra
  6: 'senior-portrait',   // "quédate, el número 3 sorprende"
  7: 'senior-portrait',   // "no soy médico"
  8: 'senior-portrait',
  28: 'processed-meat',   // "a la otra parte" -> adelanto de lo malo
  29: 'sugary-drinks',
  45: 'oatmeal-bowl',     // "mañana, un plato de avena"
};
// Para todo lo demás (intro/disclaimer/cierre): rota entre varias bases -> variación.
const GENERIC_POOL = ['senior-portrait', 'senior-cooking', 'grocery-budget', 'leafy-greens', 'oatmeal-bowl'];

const poolForCue = (i: number): string[] => {
  if (OVERRIDE[i]) return [OVERRIDE[i]];
  for (const [a, b, base] of SECTION) if (i >= a && i <= b) return [base];
  return GENERIC_POOL;
};

// Lista de alimentos (HUD + rótulos de número).
export const FOODS: {num: number; cue: number; title: string; kind: 'good' | 'bad'}[] = [
  {num: 1, cue: 11, title: 'Avena', kind: 'good'},
  {num: 2, cue: 15, title: 'Legumbres', kind: 'good'},
  {num: 3, cue: 18, title: 'Pescado azul', kind: 'good'},
  {num: 4, cue: 22, title: 'Verduras verdes', kind: 'good'},
  {num: 5, cue: 25, title: 'Yogur natural', kind: 'good'},
  {num: 1, cue: 30, title: 'Embutidos', kind: 'bad'},
  {num: 2, cue: 33, title: 'Bebidas azucaradas', kind: 'bad'},
  {num: 3, cue: 35, title: 'Frituras', kind: 'bad'},
  {num: 4, cue: 37, title: 'Bollería industrial', kind: 'bad'},
  {num: 5, cue: 40, title: 'Exceso de sal', kind: 'bad'},
];

// 'delay' = segundos dentro del cue en que se DICE la frase (sincroniza el texto con la voz).
const OVERLAYS: Record<number, Overlay[]> = {
  1: [{kind: 'hook', from: 0, dur: 0, delay: 3.6, text: 'Después de los 60,\ntu cuerpo ya no come igual', accent: 'amber'}],
  4: [{kind: 'hook', from: 0, dur: 0, delay: 2.0, text: '5 que te caen bien\n5 que mejor dejar', accent: 'sage'}],
  6: [{kind: 'hook', from: 0, dur: 0, delay: 2.3, text: 'El número 3\nsorprende a muchos', accent: 'tomato'}],
  7: [{kind: 'card', from: 0, dur: 0, delay: 2.1, kicker: 'Antes de empezar', headline: 'Una charla entre nosotros, no una dieta', dek: 'No soy médico. Toma lo que te sirva y lo demás déjalo pasar.'}],

  11: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.2, num: 1, title: 'Avena', foodKind: 'good'}],
  13: [{kind: 'label', from: 0, dur: 0, delay: 2.0, name: 'Avena + canela', role: 'sin bajón a media mañana'}],
  15: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.3, num: 2, title: 'Legumbres', foodKind: 'good'}],
  16: [{kind: 'label', from: 0, dur: 0, delay: 0.6, name: 'Lentejas · garbanzos', role: 'económicas y rinden'}],
  18: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.4, num: 3, title: 'Pescado azul', foodKind: 'good'}],
  20: [{kind: 'tip', from: 0, dur: 0, delay: 1.3, term: 'Omega 3 barato', def: 'Una lata de sardinas es tan valiosa como un filete.', accent: 'sage'}],
  22: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.4, num: 4, title: 'Verduras verdes', foodKind: 'good'}],
  23: [{kind: 'label', from: 0, dur: 0, delay: 0.5, name: 'Espinaca · acelga', role: 'una porción al día'}],
  25: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.5, num: 5, title: 'Yogur natural', foodKind: 'good'}],
  26: [{kind: 'label', from: 0, dur: 0, delay: 0.6, name: 'Yogur natural', role: 'sin azúcar añadida'}],

  28: [{kind: 'hook', from: 0, dur: 0, delay: 0.4, text: 'Ahora, lo que\nmejor dejar atrás', accent: 'tomato'}],
  30: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.4, num: 1, title: 'Embutidos', foodKind: 'bad'}],
  31: [{kind: 'tip', from: 0, dur: 0, delay: 2.6, term: 'Demasiada sal', def: 'De vez en cuando no pasa; a diario, cae pesado.', accent: 'tomato'}],
  33: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.5, num: 2, title: 'Bebidas azucaradas', foodKind: 'bad'}],
  34: [{kind: 'label', from: 0, dur: 0, delay: 1.2, name: 'Mejor agua o té', role: 'tu cuerpo lo agradece', accent: 'sage'}],
  35: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.5, num: 3, title: 'Frituras', foodKind: 'bad'}],
  37: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.5, num: 4, title: 'Bollería industrial', foodKind: 'bad'}],
  38: [{kind: 'tip', from: 0, dur: 0, delay: 3.1, term: 'Azúcar sin energía', def: 'Un postre casero, hecho con calma, es mejor compañía.', accent: 'tomato'}],
  40: [{kind: 'foodNum', from: 0, dur: 0, delay: 0.4, num: 5, title: 'Exceso de sal', foodKind: 'bad'}],
  41: [{kind: 'label', from: 0, dur: 0, delay: 0.5, name: 'Hierbas y especias', role: 'en vez de tanta sal', accent: 'sage'}],

  42: [{kind: 'hook', from: 0, dur: 0, delay: 2.1, text: 'No es una dieta.\nEs volver a lo sencillo', accent: 'sage'}],
  45: [{kind: 'tip', from: 0, dur: 0, delay: 1.0, term: 'Empieza por uno', def: 'Mañana, un plato de avena. Y observa cómo te sientes.', accent: 'amber'}],
  46: [{kind: 'card', from: 0, dur: 0, delay: 1.8, kicker: 'Suscríbete', headline: 'Ideas sencillas para vivir con más energía', dek: 'Después de los 50 y los 60, sin complicaciones.'}],
  48: [{kind: 'hook', from: 0, dur: 0, delay: 1.8, text: '¿Cuál es tu favorito?', accent: 'amber'}],
};

const cutMotions: Motion[] = ['punchIn', 'zoomIn', 'panRight', 'zoomOut', 'panLeft', 'zoomIn'];

export const buildPlan = (fps: number, total: number, cues: Cue[]) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  let shotSeed = 0;

  // DIRECTIVA ANTI-REPETICIÓN (determinista, sin Math.random):
  // no repetir el mismo ARCHIVO ni el mismo SUJETO dentro de una ventana amplia.
  const recentSrc: string[] = [];
  const recentBase: string[] = [];
  const pick = (pool: string[], seed: number): {base: string; src?: string; video?: boolean} => {
    // 1) elige la base menos usada recientemente dentro del pool
    let base = pool[0];
    if (pool.length > 1) {
      let bs = Infinity;
      for (let k = 0; k < pool.length; k++) {
        const b = pool[(seed + k) % pool.length];
        const ri = recentBase.lastIndexOf(b);
        const score = ri < 0 ? 0 : recentBase.length - ri;
        if (score < bs) {bs = score; base = b; if (score === 0) break;}
      }
    }
    // 2) elige la variante (archivo) menos usada recientemente de esa base
    const cands = hasMedia(base) ? variantsOf(base) : [];
    if (cands.length === 0) {recentBase.push(base); return {base};}
    let best = cands[0]; let bs2 = Infinity;
    for (let k = 0; k < cands.length; k++) {
      const c = cands[(seed + k) % cands.length];
      const ri = recentSrc.lastIndexOf(c.src);
      const score = ri < 0 ? 0 : recentSrc.length - ri;
      if (score < bs2) {bs2 = score; best = c; if (score === 0) break;}
    }
    recentBase.push(base); if (recentBase.length > 4) recentBase.shift();
    recentSrc.push(best.src); if (recentSrc.length > 12) recentSrc.shift();
    return {base, src: best.src, video: best.video};
  };

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);
    const pool = poolForCue(c.i);

    // Ritmo calmado (como el video de referencia): tomas de ~5 s.
    const target = 5.0 * fps;
    const n = Math.max(1, Math.round(dur / target));
    for (let k = 0; k < n; k++) {
      const sFrom = from + Math.round((k * dur) / n);
      const sTo = from + Math.round(((k + 1) * dur) / n);
      const chosen = pick(pool, shotSeed);
      shots.push({from: sFrom, dur: Math.max(1, sTo - sFrom), base: chosen.base, seed: shotSeed++, motion: cutMotions[(idx + k) % cutMotions.length], src: chosen.src, video: chosen.video});
    }

    const cap: Record<Overlay['kind'], number> = {hook: 3.6, foodNum: 3.2, price: 2.8, card: 4.4, tip: 4.2, quote: 3.6, label: 3.6};
    for (const o of (OVERLAYS[c.i] ?? [])) {
      const oFrom = from + Math.round((o.delay ?? 0) * fps);
      overlays.push({...o, from: oFrom, dur: Math.round(cap[o.kind] * fps)});
    }
  });

  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const items = FOODS.map((f) => ({from: cueFrom(f.cue), num: f.num, title: f.title, kind: f.kind}));

  return {shots, overlays, items};
};
