import {Cue} from './healthCues';
import {Accent} from './theme';

// ============================================================
// EL CEREBRO: narración -> visuales + overlays.
// Video: "5 alimentos que SÍ + 5 que MEJOR dejar atrás (después de los 60)".
// Hoy renderiza FONDOS PROCEDURALES; cada toma lleva un 'base' (palabra clave)
// para mapear al stock real cuando esté descargado.
// ============================================================

export type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
export interface Shot {from: number; dur: number; base: string; seed: number; motion: Motion; video?: boolean; archival?: boolean;}

export interface Overlay {
  from: number; dur: number;
  kind: 'hook' | 'foodNum' | 'price' | 'card' | 'tip' | 'quote' | 'label';
  text?: string; accent?: Accent;
  num?: number; title?: string; foodKind?: 'good' | 'bad';    // foodNum
  value?: number; display?: string; prefix?: string; suffix?: string; label?: string; // price
  kicker?: string; headline?: string; dek?: string; imgBase?: string; // card
  term?: string; def?: string;                                // tip
  quote?: string; author?: string;                            // quote
  name?: string; role?: string;                               // label
}

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// Palabra clave -> base (query de stock). Primera coincidencia gana.
const RULES: [RegExp, string][] = [
  [/avena|canela|nueces|desayuno|media mañana|media manana/, 'oatmeal-bowl'],
  [/legumbre|lenteja|garbanzo|frijol/, 'lentils-beans'],
  [/pescado|salmon|sardina|azul|filete|lata/, 'oily-fish'],
  [/verdura|espinaca|acelga|lechuga|hoja verde|ensalada/, 'leafy-greens'],
  [/yogur|digestion|tentempi/, 'yogurt'],
  [/embutido|jamon|salchicha|carne procesada|procesad/, 'processed-meat'],
  [/refresco|bebida|jugo|azucarad|subidon|subidón/, 'sugary-drinks'],
  [/fritura|frito/, 'fried-food'],
  [/bolleria|pastelito|galleta|postre|dulce/, 'pastries'],
  [/\bsal\b|salado|snack|caldo|especias|hierbas/, 'salt-herbs'],
  [/agua|te\b|infusion/, 'water-tea'],
  [/medico|experiencia|charla|sentido comun|escuchar a tu cuerpo|conoces tu cuerpo/, 'senior-portrait'],
  [/mercado|super|comprar|despensa|economic|barat|rinde/, 'grocery-budget'],
  [/energia|salud|cuerpo|sentir|animo|animo|vivir/, 'senior-cooking'],
];
const resolveBase = (text: string): string => {
  const t = norm(text);
  for (const [re, base] of RULES) if (re.test(t)) return base;
  return 'senior-cooking';
};

// Lista de alimentos (para el HUD y los rótulos de número).
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

// Overlays por cue (mapeados a la narración real).
const OVERLAYS: Record<number, Overlay[]> = {
  1: [{kind: 'hook', from: 0, dur: 0, text: 'Después de los 60,\ntu cuerpo ya no come igual', accent: 'amber'}],
  4: [{kind: 'hook', from: 0, dur: 0, text: '5 que te caen bien\n5 que mejor dejar', accent: 'sage'}],
  6: [{kind: 'hook', from: 0, dur: 0, text: 'El número 3\nsorprende a muchos', accent: 'tomato'}],
  7: [{kind: 'card', from: 0, dur: 0, kicker: 'Antes de empezar', headline: 'Una charla entre nosotros, no una dieta', dek: 'No soy médico. Toma lo que te sirva y lo demás déjalo pasar.'}],

  11: [{kind: 'foodNum', from: 0, dur: 0, num: 1, title: 'Avena', foodKind: 'good'}],
  13: [{kind: 'label', from: 0, dur: 0, name: 'Avena + canela', role: 'sin bajón a media mañana'}],
  15: [{kind: 'foodNum', from: 0, dur: 0, num: 2, title: 'Legumbres', foodKind: 'good'}],
  16: [{kind: 'label', from: 0, dur: 0, name: 'Lentejas · garbanzos', role: 'económicas y rinden'}],
  18: [{kind: 'foodNum', from: 0, dur: 0, num: 3, title: 'Pescado azul', foodKind: 'good'}],
  20: [{kind: 'tip', from: 0, dur: 0, term: 'Omega 3 barato', def: 'Una lata de sardinas es tan valiosa como un filete.', accent: 'sage'}],
  22: [{kind: 'foodNum', from: 0, dur: 0, num: 4, title: 'Verduras verdes', foodKind: 'good'}],
  23: [{kind: 'label', from: 0, dur: 0, name: 'Espinaca · acelga', role: 'una porción al día'}],
  25: [{kind: 'foodNum', from: 0, dur: 0, num: 5, title: 'Yogur natural', foodKind: 'good'}],
  26: [{kind: 'label', from: 0, dur: 0, name: 'Yogur natural', role: 'sin azúcar añadida'}],

  28: [{kind: 'hook', from: 0, dur: 0, text: 'Ahora, lo que\nmejor dejar atrás', accent: 'tomato'}],
  30: [{kind: 'foodNum', from: 0, dur: 0, num: 1, title: 'Embutidos', foodKind: 'bad'}],
  31: [{kind: 'tip', from: 0, dur: 0, term: 'Demasiada sal', def: 'De vez en cuando no pasa; a diario, cae pesado.', accent: 'tomato'}],
  33: [{kind: 'foodNum', from: 0, dur: 0, num: 2, title: 'Bebidas azucaradas', foodKind: 'bad'}],
  34: [{kind: 'label', from: 0, dur: 0, name: 'Mejor agua o té', role: 'tu cuerpo lo agradece', accent: 'sage'}],
  35: [{kind: 'foodNum', from: 0, dur: 0, num: 3, title: 'Frituras', foodKind: 'bad'}],
  37: [{kind: 'foodNum', from: 0, dur: 0, num: 4, title: 'Bollería industrial', foodKind: 'bad'}],
  38: [{kind: 'tip', from: 0, dur: 0, term: 'Azúcar sin energía', def: 'Un postre casero, hecho con calma, es mejor compañía.', accent: 'tomato'}],
  40: [{kind: 'foodNum', from: 0, dur: 0, num: 5, title: 'Exceso de sal', foodKind: 'bad'}],
  41: [{kind: 'label', from: 0, dur: 0, name: 'Hierbas y especias', role: 'en vez de tanta sal', accent: 'sage'}],

  42: [{kind: 'hook', from: 0, dur: 0, text: 'No es una dieta.\nEs volver a lo sencillo', accent: 'sage'}],
  45: [{kind: 'tip', from: 0, dur: 0, term: 'Empieza por uno', def: 'Mañana, un plato de avena. Y observa cómo te sientes.', accent: 'amber'}],
  46: [{kind: 'card', from: 0, dur: 0, kicker: 'Suscríbete', headline: 'Ideas sencillas para vivir con más energía', dek: 'Después de los 50 y los 60, sin complicaciones.'}],
  48: [{kind: 'hook', from: 0, dur: 0, text: '¿Cuál es tu favorito?', accent: 'amber'}],
};

const cutMotions: Motion[] = ['punchIn', 'zoomIn', 'panRight', 'zoomOut', 'panLeft', 'zoomIn'];

export const buildPlan = (fps: number, total: number, cues: Cue[]) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  let shotSeed = 0;

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);
    const base = resolveBase(c.text);

    // Ritmo calmado (como el video de referencia): tomas de ~5 s.
    const target = 5.0 * fps;
    const n = Math.max(1, Math.round(dur / target));
    for (let k = 0; k < n; k++) {
      const sFrom = from + Math.round((k * dur) / n);
      const sTo = from + Math.round(((k + 1) * dur) / n);
      shots.push({from: sFrom, dur: Math.max(1, sTo - sFrom), base, seed: shotSeed++, motion: cutMotions[(idx + k) % cutMotions.length]});
    }

    const cap: Record<Overlay['kind'], number> = {hook: 3.6, foodNum: 3.2, price: 2.8, card: 4.4, tip: 4.2, quote: 3.6, label: 3.6};
    for (const o of (OVERLAYS[c.i] ?? [])) {
      overlays.push({...o, from, dur: Math.min(dur, Math.round(cap[o.kind] * fps))});
    }
  });

  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const items = FOODS.map((f) => ({from: cueFrom(f.cue), num: f.num, title: f.title, kind: f.kind}));

  return {shots, overlays, items};
};
