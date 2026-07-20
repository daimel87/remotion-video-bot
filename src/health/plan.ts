import {Cue} from './sampleCues';
import {Accent} from './theme';

// ============================================================
// EL CEREBRO del canal de salud: narración -> visuales + overlays.
// Hoy renderiza FONDOS PROCEDURALES (sin media). Cada toma ya lleva un
// 'base' (palabra clave de cocina) para que mañana, cuando descarguemos
// el stock/archivo, el cambio a KenBurns/VideoBG sea directo.
// ============================================================

export type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
export interface Shot {from: number; dur: number; base: string; seed: number; motion: Motion; video?: boolean; archival?: boolean;}

export interface Overlay {
  from: number; dur: number;
  kind: 'hook' | 'recipeNum' | 'price' | 'card' | 'tip' | 'quote' | 'label';
  text?: string; accent?: Accent;
  num?: number; title?: string;                          // recipeNum
  value?: number; display?: string; prefix?: string; suffix?: string; label?: string; // price
  kicker?: string; headline?: string; dek?: string; imgBase?: string; // card
  term?: string; def?: string;                           // tip
  quote?: string; author?: string;                       // quote
  name?: string; role?: string;                          // label
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Palabra clave -> base (query de stock futura). El orden importa (primera coincidencia).
const RULES: [RegExp, string][] = [
  [/lenteja|legumbre|frijol|garbanzo/, 'lentil-soup'],
  [/avena|canela|desayuno/, 'oatmeal-bowl'],
  [/sardina|pescado|omega|atun|lata/, 'canned-fish'],
  [/vegetal|verdura|sopa de vegetales|caldo|olla/, 'vegetable-soup'],
  [/arroz|pollo|guiso|cremosa|una sola olla/, 'rice-chicken'],
  [/hueso|calcio|osteoporosis|vitamina d/, 'bone-health'],
  [/corazon|colesterol|azucar|glucosa|presion/, 'heart-health'],
  [/hierro|fibra|proteina|nutric/, 'healthy-ingredients'],
  [/dolar|centavos|barat|precio|dinero|bolsillo|cuesta/, 'grocery-budget'],
  [/abuela|abuelo|antaño|antano|tiempos|humild/, 'vintage-kitchen'],
  [/mercado|super|comprar|despensa/, 'pantry-stock'],
  [/energia|salud|cuida|sano|saludable/, 'senior-cooking'],
];
const resolveBase = (text: string): string => {
  const t = norm(text);
  for (const [re, base] of RULES) if (re.test(t)) return base;
  return 'senior-cooking';
};

// Recetas del listicle (para el HUD y los rótulos de número).
const RECIPES = [
  {num: 1, cue: 4, title: 'Sopa de lentejas'},
  {num: 2, cue: 7, title: 'Avena con canela'},
  {num: 3, cue: 10, title: 'Sardinas + pan'},
  {num: 4, cue: 13, title: 'Sopa de vegetales'},
  {num: 5, cue: 16, title: 'Arroz con pollo'},
];

// Overlays puntuales por cue (demuestran todos los componentes del estilo).
const OVERLAYS: Record<number, Overlay[]> = {
  1: [{kind: 'hook', from: 0, dur: 0, text: 'Comer sano después de los 50\nno tiene por qué ser caro', accent: 'amber'}],
  2: [{kind: 'price', from: 0, dur: 0, display: '$2', label: 'al día', accent: 'sage'}],
  3: [{kind: 'card', from: 0, dur: 0, kicker: 'El plan', headline: '5 recetas de la abuela que la ciencia aprueba', dek: 'Humildes, nutritivas y baratas.'}],

  4: [{kind: 'recipeNum', from: 0, dur: 0, num: 1, title: 'Sopa de lentejas'}],
  5: [{kind: 'price', from: 0, dur: 0, display: '50¢', label: 'por plato', accent: 'amber'}],
  6: [{kind: 'label', from: 0, dur: 0, name: 'Hierro + fibra', role: 'azúcar estable'}],

  7: [{kind: 'recipeNum', from: 0, dur: 0, num: 2, title: 'Avena con canela'}],
  8: [{kind: 'tip', from: 0, dur: 0, term: 'Baja el colesterol', def: 'Y te mantiene lleno toda la mañana por muy poco dinero.', accent: 'sage'}],
  9: [{kind: 'label', from: 0, dur: 0, name: 'Canela', role: 'controla la glucosa'}],

  10: [{kind: 'recipeNum', from: 0, dur: 0, num: 3, title: 'Sardinas + pan integral'}],
  11: [{kind: 'label', from: 0, dur: 0, name: 'Omega 3 + Calcio', role: 'la fuente más barata'}],
  12: [{kind: 'tip', from: 0, dur: 0, term: 'Huesos fuertes', def: 'Ayuda a prevenir la osteoporosis.', accent: 'sage'}],

  13: [{kind: 'recipeNum', from: 0, dur: 0, num: 4, title: 'Sopa de vegetales'}],
  14: [{kind: 'price', from: 0, dur: 0, display: '$2', label: 'olla para días', accent: 'sage'}],
  15: [{kind: 'quote', from: 0, dur: 0, quote: 'Nada se desperdicia.', author: 'la cocina de antaño'}],

  16: [{kind: 'recipeNum', from: 0, dur: 0, num: 5, title: 'Arroz con pollo'}],
  17: [{kind: 'card', from: 0, dur: 0, kicker: 'Comodidad', headline: 'Una sola olla, sin carne cruda', dek: 'Cálida, cremosa e independiente.'}],

  18: [{kind: 'price', from: 0, dur: 0, display: '$7', label: 'toda la semana', accent: 'amber'}],
  19: [{kind: 'hook', from: 0, dur: 0, text: 'Cuida tu salud\ny tu bolsillo', accent: 'tomato'}],
};

const cutMotions: Motion[] = ['punchIn', 'zoomIn', 'panRight', 'zoomOut', 'panLeft', 'zoomIn'];

export const buildPlan = (fps: number, total: number, cues: Cue[]) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  let shotSeed = 0;

  // qué receta está activa en cada cue (para HUD)
  const recipeAtCue = (i: number) => {
    let cur = {num: 0, title: 'Intro'};
    for (const r of RECIPES) if (i >= r.cue) cur = r;
    return cur;
  };

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);
    const base = resolveBase(c.text);

    // Ritmo calmado (estilo del video de referencia): tomas de ~4.5–6.5 s.
    const target = 5.2 * fps;
    const n = Math.max(1, Math.round(dur / target));
    for (let k = 0; k < n; k++) {
      const sFrom = from + Math.round((k * dur) / n);
      const sTo = from + Math.round(((k + 1) * dur) / n);
      shots.push({from: sFrom, dur: Math.max(1, sTo - sFrom), base, seed: shotSeed++, motion: cutMotions[(idx + k) % cutMotions.length]});
    }

    // overlays de este cue: ocupan todo el cue (con tope de duración sensato por tipo)
    for (const o of (OVERLAYS[c.i] ?? [])) {
      const cap: Record<Overlay['kind'], number> = {hook: 3.6, recipeNum: 3.0, price: 2.8, card: 4.2, tip: 4.0, quote: 3.6, label: 3.4};
      overlays.push({...o, from, dur: Math.min(dur, Math.round((cap[o.kind]) * fps))});
    }
  });

  // marcas de receta para el HUD permanente
  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const recipeMarks = RECIPES.map((r) => ({from: cueFrom(r.cue), num: r.num, title: r.title}));

  return {shots, overlays, recipes: recipeMarks, recipeAtCue};
};
