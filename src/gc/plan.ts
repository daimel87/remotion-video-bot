import {staticFile} from 'remotion';
import {cues} from './cues';
import {photoVariants, videoVariants, hasPhoto, ARCHIVAL, archivalSrc} from './assets';

// ============================================================
// EL CEREBRO del documental "Un MEXICANO de 23 Años le Dio COLOR a tu TV"
// (Guillermo González Camarena). STORYBOARD explícito cue por cue, verificado
// contra los clips reales (contact-sheets), con cortes rápidos tipo el video
// de referencia. Reglas:
//   · Cada frase se ilustra con material que la representa (nada fuera de contexto).
//   · Cuando se MENCIONA el nombre (Guillermo/González Camarena) -> sale su retrato.
//   · Componentes propios: PatentTeaser (patente), ColorWheelDiagram (disco RGB),
//     ScreenOff (apagón "como pantalla a la que le cortan la señal"), SourceCard.
//
// Los tres clips gc-* son el MISMO documental animado (Deyadira Medina Lara);
// sus primeros ~12s son cine de época (Cantinflas) — PROHIBIDOS. Segmentos con
// GGC marcados con @segundo. Ventanas verificadas en WINDOWS.
// ============================================================

export type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
export type Accent = 'amber' | 'teal' | 'red' | 'paper';
type Comp = 'patent' | 'patent-full' | 'colorwheel' | 'screenoff';

export interface StatDef {value?: number; display?: string; prefix?: string; suffix?: string; label?: string; decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;}
export interface Shot {from: number; dur: number; base: string; seed: number; motion: Motion; src?: string; video?: boolean; archival?: boolean; startFrom?: number; signalCut?: boolean; component?: Comp;}
export interface Overlay {
  from: number; dur: number; delay?: number;
  kind: 'title' | 'chapter' | 'date' | 'fulltext' | 'stat' | 'newspaper' | 'quote' | 'definition' | 'name' | 'source';
  pre?: string; text?: string; num?: number; stat?: StatDef; accent?: Accent;
  headline?: string; dek?: string; quote?: string; author?: string;
  term?: string; pos?: string; def?: string; name?: string; role?: string;
  label?: string; sub?: string;
}

const TEXT_NUDGE = 0.35;

// ---- Capítulos (arco narrativo). delay = segundos DENTRO del cue en que el
// título entra (para que caiga CON la frase del tema, no antes). ----
const CHAPTERS = [
  {num: 1, cue: 12, title: 'Guadalajara, 1917', delay: 0.9},
  {num: 2, cue: 15, title: 'El niño que lo desarmaba todo', delay: 1.6},
  {num: 3, cue: 24, title: 'La obsesión del color', delay: 1.4},   // "él quería color"
  {num: 4, cue: 32, title: 'El disco giratorio', delay: 1.2},      // "diseñó un disco giratorio"
  {num: 5, cue: 37, title: 'La patente', delay: 1.2},              // "le otorgó la patente"
  {num: 6, cue: 47, title: 'La misma luz', delay: 1.6},            // "un sistema parecido"
  {num: 7, cue: 58, title: 'El olvido', delay: 1.8},               // "empieza a torcerse"
  {num: 8, cue: 74, title: 'XHGC', delay: 1.8},                    // "su gran día"
  {num: 9, cue: 85, title: 'El último golpe', delay: 1.4},
  {num: 10, cue: 95, title: 'La verdad documentada', delay: 1.4},
];

// ============================================================
// STORYBOARD — cada cue -> lista de planos cortos.
// Token: 'a:ID@S' archivo (inicio fijo S) · 'v:base' video · 'img:base-n' foto
//        'base' fotos de la base · 'c:comp' componente motion-graphic.
// sc: corte de estática de TV al entrar. w: peso (reparto del cue).
// ============================================================
type SB = {t: string; m?: Motion; w?: number; sc?: boolean};

// retratos de GGC para el minuto 1 (tokens fijos ya aprobados por el usuario)
const GGC_CATEDRAL = 'a:gc-historia-tv-color@18';
const GGC_CARA = 'a:gc-historia-tv-color@62';
const GGC_TV = 'a:gc-historia-tv-color@66';
const GGC_PENSANDO = 'a:gc-historia-tv-color@74';

// ============================================================
// POOLS temáticos. Un token 'p:nombre' en el storyboard se resuelve al miembro
// del pool MENOS usado recientemente (anti-repetición con separación mínima),
// para APROVECHAR todo el material descargado y no repetir las mismas tomas.
// ============================================================
const POOLS: Record<string, string[]> = {
  // 11 retratos DISTINTOS de GGC (los 3 clips del documental animado + segmentos)
  ggc: [
    'a:gc-historia-tv-color@18', 'a:gc-historia-tv-color@62', 'a:gc-historia-tv-color@74',
    'a:gc-patente-noticia@18', 'a:gc-patente-noticia@62', 'a:gc-patente-noticia@74',
    'a:gc-documental@18', 'a:gc-historia-tv-color@66', 'a:gc-patente-noticia@68',
    'a:gc-patente-noticia@98', 'a:gc-documental@96',
  ],
  // GGC en su laboratorio / con aparatos (invención)
  'ggc-lab': ['a:gc-patente-noticia@98', 'a:gc-documental@96', 'a:gc-documental@33', 'a:gc-historia-tv-color@66'],
  // sistema de color / disco tricromático (cbs-goldmark FUERA: a partir de ~2.6s
  // el clip muestra un loro con la ventana del reproductor; usamos disco propio)
  disco: ['c:colorwheel', 'a:mechanical-color-disc@26', 'a:mechanical-color-disc@38', 'a:mechanical-color-disc@88'],
  // RGB / espectro / píxeles a color
  color: ['v:color-spectrum-prism', 'color-spectrum-prism', 'v:rgb-pixels-macro', 'rgb-pixels-macro', 'v:tv-test-pattern', 'tv-test-pattern'],
  // televisión antigua
  tvvieja: ['old-black-white-tv', 'v:vintage-tv-workshop', 'v:family-tv-vintage', 'family-tv-vintage', 'tv-test-pattern'],
  // electrónica / radios / taller (niñez, invención)
  electro: ['vintage-radio-parts', 'tube-radio', 'v:engineer-workshop', 'engineer-workshop', 'vintage-typewriter'],
  // contexto mexicano
  mexico: ['mexico-flag', 'guadalajara-city', 'mexico-city-skyline', 'a:mexico-city-1930s@50', 'a:mexico-city-1930s@70'],
  // corporaciones estadounidenses (RCA, comercial de época)
  rca: ['a:rca-color-tv-1950s@2', 'a:rca-color-tv-1950s@14', 'a:rca-color-tv-1950s@26', 'a:rca-color-tv-1950s@58'],
  // televisión mexicana / transmisión (comerciales de época + Canal 5)
  tvmx: ['a:vintage-tv-broadcast-mx@2', 'a:vintage-tv-broadcast-mx@20', 'a:vintage-tv-broadcast-mx@40', 'a:vintage-tv-broadcast-mx@60'],
  // torre / señal / estática
  senal: ['v:broadcast-tower', 'broadcast-tower', 'v:tv-static-noise', 'tv-static-noise'],
  // carretera (accidente)
  carretera: ['v:highway-mexico', 'highway-mexico'],
  // revolución mexicana real
  revol: ['a:mexico-revolucion-1917@2', 'a:mexico-revolucion-1917@6', 'a:mexico-revolucion-1917@13'],
  // sondas Voyager / espacio
  voyager: ['a:voyager-nasa-images@20', 'a:voyager-nasa-images@55', 'a:voyager-nasa-images@62'],
  // música mexicana (huapango)
  musica: ['a:huapango-mexicano@15', 'a:huapango-mexicano@40', 'a:huapango-mexicano@60', 'mexican-musician'],
};

const STORYBOARD: Record<number, SB[]> = {
  // ---------- MINUTO 1 (verificado cuadro por cuadro) ----------
  1:  [{t: 'v:rgb-pixels-macro', m: 'punchIn'}, {t: 'color-spectrum-prism', m: 'zoomIn'}],
  2:  [{t: 'v:color-spectrum-prism', m: 'panRight'}, {t: 'old-black-white-tv', m: 'zoomIn'}],
  3:  [{t: 'v:engineer-workshop', m: 'punchIn'}, {t: 'vintage-radio-parts', m: 'zoomIn'}],
  4:  [{t: 'old-black-white-tv', m: 'zoomIn'}, {t: 'v:vintage-tv-workshop', m: 'panRight'}],
  5:  [{t: 'v:engineer-workshop', m: 'zoomIn'}],  // FULLTEXT "No fue Nueva York/Londres"
  6:  [{t: GGC_CATEDRAL, m: 'zoomIn'}, {t: GGC_CARA, m: 'punchIn'}],
  7:  [{t: 'a:mexico-revolucion-1917@2', m: 'panRight'}, {t: GGC_CATEDRAL, m: 'zoomIn'}],  // "Su nombre era GGC"
  8:  [{t: GGC_TV, m: 'zoomIn'}, {t: 'v:broadcast-tower', m: 'panRight'}],
  9:  [{t: GGC_CARA, m: 'zoomIn'}],  // TÍTULO
  // 10-11 se manejan con tiempos absolutos en buildPlan (olvido -> patente -> 17feb)
  12: [{t: 'a:gc-documental@13.5', m: 'zoomIn'}, {t: 'a:mexico-revolucion-1917@9', m: 'panRight'}],
  13: [{t: 'a:mexico-revolucion-1917@6', m: 'zoomIn'}, {t: 'a:mexico-revolucion-1917@13', m: 'panLeft'}],

  // ---------- CAP II: la niñez (pools rotativos) ----------
  14: [{t: 'p:mexico', m: 'panRight'}, {t: 'p:ggc', m: 'zoomIn'}],       // "Camarena se mudó a CDMX / Guillermo"
  15: [{t: 'p:electro', m: 'punchIn'}, {t: 'p:electro', m: 'zoomIn'}],   // "desarmó todo en la casa"
  16: [{t: 'p:electro', m: 'zoomIn'}, {t: 'p:electro', m: 'panLeft'}],   // "cómo funciona por dentro"
  17: [{t: 'p:electro', m: 'punchIn'}, {t: 'p:electro', m: 'zoomIn'}],   // "armaba radios con piezas sueltas"
  18: [{t: 'p:electro', m: 'zoomIn'}, {t: 'p:electro', m: 'panRight'}],  // "no había dinero para aparatos caros"
  19: [{t: 'p:electro', m: 'zoomIn'}],                                    // FULLTEXT "constrúyelo tú mismo"
  20: [{t: 'a:ipn-politecnico-historia@5', m: 'zoomIn'}, {t: 'university-engineering', m: 'panRight'}], // Politécnico
  21: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:ggc', m: 'punchIn'}],           // "Guillermo estaba obsesionado"

  // ---------- CAP III: la obsesión del color ----------
  22: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:tvvieja', m: 'panRight'}],  // "la televisión, ciencia ficción"
  23: [{t: 'p:tvvieja', m: 'punchIn'}, {t: 'p:tvvieja', m: 'zoomIn'}],   // "todos veían en blanco y negro"
  24: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],     // "él quería color"
  25: [{t: 'p:disco', m: 'zoomIn'}, {t: 'p:disco', m: 'panRight'}],      // "la TV era un experimento"
  26: [{t: 'p:ggc-lab', m: 'zoomIn'}],                                    // "este muchacho en México"
  27: [{t: 'p:rca', m: 'panRight'}, {t: 'p:rca', m: 'zoomIn'}],          // "copiar a los gringos o ingleses"
  28: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:ggc-lab', m: 'punchIn'}],       // "tuvo la idea"
  29: [{t: 'c:colorwheel'}, {t: 'a:mechanical-color-disc@38', m: 'zoomIn'}], // "sistema tricromático" + DEF
  30: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'c:colorwheel'}],                  // "González Camarena entendió"

  // ---------- CAP IV: el disco giratorio ----------
  31: [{t: 'c:colorwheel'}],                                              // "rojo, verde y azul"
  32: [{t: 'a:mechanical-color-disc@26', m: 'zoomIn'}, {t: 'c:colorwheel'}], // "un disco giratorio"
  33: [{t: 'a:mechanical-color-disc@26', m: 'zoomIn'}, {t: 'a:mechanical-color-disc@38', m: 'panRight'}], // "giraba frente a la cámara"
  34: [{t: 'a:mechanical-color-disc@38', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}], // "el ojo humano engañado"
  35: [{t: 'a:mechanical-color-disc@38', m: 'zoomIn'}, {t: 'p:color', m: 'panRight'}], // "imagen a todo color"

  // ---------- CAP V: la patente ----------
  36: [{t: 'a:mechanical-color-disc@88', m: 'zoomIn'}],                   // "19 de agosto de 1940" (dibujos)
  37: [{t: 'c:patent'}],                                                  // "le otorgó la patente"
  38: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "GGC tenía 23 años" + Stat
  39: [{t: 'p:rca', m: 'panRight'}, {t: 'p:tvvieja', m: 'zoomIn'}],      // "Segunda Guerra Mundial"
  40: [{t: 'p:ggc-lab', m: 'zoomIn'}],                                    // "en su taller había patentado"
  41: [{t: 'c:patent'}],                                                  // "patente en Estados Unidos"
  42: [{t: 'c:patent-full'}],                                             // "15 de septiembre de 1942"
  43: [{t: 'c:patent-full'}],                                             // "2,296,019, adaptador cromoscópico"
  44: [{t: 'c:patent-full'}],                                             // "oficinas del país más poderoso"
  45: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "Guillermo no fue el único"

  // ---------- CAP VI: la misma luz ----------
  46: [{t: 'c:colorwheel'}, {t: 'a:mechanical-color-disc@26', m: 'panRight'}], // Goldmark
  47: [{t: 'p:disco', m: 'zoomIn'}, {t: 'c:colorwheel'}],                // "sistema parecido, discos giratorios"
  48: [{t: 'c:colorwheel'}, {t: 'p:color', m: 'punchIn'}], // "la misma luz"
  49: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:rca', m: 'panRight'}],          // "González Camarena vs corporación"
  50: [{t: 'p:ggc-lab', m: 'zoomIn'}],                                    // "Guillermo tenía su talento"
  51: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:ggc-lab', m: 'punchIn'}],       // "un mexicano casi solo"
  52: [{t: 'p:ggc-lab', m: 'zoomIn'}],                                    // "los periódicos lo notaron"
  53: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "El Universal, joven inventor" + News
  54: [{t: 'p:mexico', m: 'panRight'}, {t: 'p:ggc', m: 'zoomIn'}],       // "México volvió a verlo"
  55: [{t: 'p:ggc-lab', m: 'zoomIn'}],                                    // "31 de agosto de 1946"
  56: [{t: 'p:ggc-lab', m: 'panRight'}, {t: 'p:mexico', m: 'zoomIn'}],   // "laboratorio en Lucerna, CDMX"
  57: [{t: 'p:ggc-lab', m: 'zoomIn'}, {t: 'p:ggc-lab', m: 'punchIn'}],   // "con sus aparatos"

  // ---------- CAP VII: el olvido ----------
  58: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "empieza a torcerse"
  59: [{t: 'p:rca', m: 'panRight'}, {t: 'p:ggc-lab', m: 'zoomIn'}],      // "el que tiene más dinero"
  60: [{t: 'p:rca', m: 'zoomIn'}, {t: 'p:rca', m: 'panRight'}],          // "RCA invertía millones"
  61: [{t: 'p:rca', m: 'zoomIn'}, {t: 'p:rca', m: 'panRight'}],          // "la guerra fría"
  62: [{t: 'p:disco', m: 'zoomIn'}, {t: 'p:rca', m: 'panRight'}],        // "no adoptó el sistema"
  63: [{t: 'c:colorwheel'}, {t: 'p:rca', m: 'zoomIn'}],                  // "se fue por otro camino"
  64: [{t: 'p:rca', m: 'zoomIn'}, {t: 'p:rca', m: 'panRight'}],          // "el estándar comercial"
  65: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "se fue borrando"
  66: [{t: 'p:rca', m: 'zoomIn'}],                                        // "escrita en inglés"
  67: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "Guillermo nunca fue por el dinero"
  68: [{t: 'p:ggc-lab', m: 'zoomIn'}, {t: 'p:ggc-lab', m: 'punchIn'}],   // "siguió inventando"
  69: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:tvvieja', m: 'panRight'}],  // "televisores baratos"
  70: [{t: 'v:family-tv-vintage', m: 'zoomIn'}, {t: 'family-tv-vintage', m: 'panRight'}], // "educación por TV"
  71: [{t: 'family-tv-vintage', m: 'zoomIn'}, {t: 'v:family-tv-vintage', m: 'punchIn'}],  // "escuelas rurales"
  72: [{t: 'p:musica', m: 'panRight'}, {t: 'p:musica', m: 'zoomIn'}],    // "era músico, un huapango"
  73: [{t: 'p:musica', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],      // "Río Colorado, el mundo en colores"

  // ---------- CAP VIII: XHGC ----------
  74: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:ggc', m: 'punchIn'}],           // "su gran día"
  75: [{t: 'a:gc-canal5-xhgc@2', m: 'zoomIn'}],                           // "21 de enero de 1963, Canal 5"
  76: [{t: 'c:colorwheel'}, {t: 'p:tvmx', m: 'panRight'}], // "primera transmisión a color"
  77: [{t: 'p:mexico', m: 'zoomIn'}],                                     // "cuarto país del mundo" + Stat
  78: [{t: 'p:tvmx', m: 'panRight'}, {t: 'p:mexico', m: 'zoomIn'}],      // "después de EEUU"
  79: [{t: 'p:mexico', m: 'zoomIn'}],                                     // "cuarto lugar del planeta"
  80: [{t: 'a:gc-canal5-xhgc@2', m: 'zoomIn'}],                           // "¿cómo se llama ese canal?"
  81: [{t: 'a:gc-canal5-xhgc@70', m: 'zoomIn'}],                          // XHGC emblema + name
  82: [{t: 'p:tvmx', m: 'panRight'}, {t: 'a:gc-canal5-xhgc@70', m: 'zoomIn'}], // "el aire de la TV mexicana"
  83: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "pronuncia su nombre"
  84: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "un último golpe"

  // ---------- CAP IX: el último golpe ----------
  85: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:carretera', m: 'panRight'}],    // "18 de abril de 1965, GGC regresaba"
  86: [{t: 'p:carretera', m: 'zoomIn'}, {t: 'p:carretera', m: 'punchIn'}], // "carretera México-Veracruz"
  87: [{t: 'p:carretera', m: 'zoomIn'}],                                  // "murió, 48 años" + Stat
  88: [{t: 'p:ggc-lab', m: 'zoomIn'}, {t: 'p:ggc-lab', m: 'punchIn'}],   // "todavía inventando"
  89: [{t: 'c:screenoff'}],                                               // "como pantalla a la que le cortan la señal"

  // ---------- CAP X: la verdad documentada ----------
  90: [{t: 'p:voyager', m: 'zoomIn'}],                                    // "leyenda: la NASA / Voyager"
  91: [{t: 'p:voyager', m: 'zoomIn'}, {t: 'p:voyager', m: 'panRight'}],  // "imágenes del espacio"
  92: [{t: 'p:voyager', m: 'zoomIn'}],                                    // "voy a ser honesto"
  93: [{t: 'p:voyager', m: 'zoomIn'}],                                    // "no está comprobada"
  94: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "no hace falta"
  95: [{t: 'c:patent-full'}],                                             // "firmado y documentado"
  96: [{t: 'p:ggc', m: 'zoomIn'}],                                        // "un joven de 23 años patentó" + Stat
  97: [{t: 'c:patent-full'}],                                             // "en 1940, con los gigantes"
  98: [{t: 'p:color', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],     // "cuarto país a todo color"
  99: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:ggc', m: 'punchIn'}],           // "¿por qué nadie lo conoce?"
  100: [{t: 'p:rca', m: 'zoomIn'}],                                       // "no la escriben los primeros"
  101: [{t: 'p:rca', m: 'panRight'}, {t: 'p:mexico', m: 'zoomIn'}],      // "el poder no estuvo en México"
  102: [{t: 'p:rca', m: 'zoomIn'}, {t: 'p:rca', m: 'panRight'}],         // "las corporaciones, otro idioma"
  103: [{t: 'p:rca', m: 'zoomIn'}],                                       // "lo inventaron ellos"
  104: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],      // "González Camarena borrado por ser de aquí"
  105: [{t: 'p:mexico', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],   // "de nuestro país"
  106: [{t: 'p:ggc', m: 'zoomIn'}],                                       // "solo si lo permitimos"
  107: [{t: 'p:senal', m: 'zoomIn'}, {t: 'p:tvvieja', m: 'punchIn'}],    // "la próxima vez que enciendas tu TV"
  108: [{t: 'p:color', m: 'punchIn'}, {t: 'p:color', m: 'zoomIn'}],      // "ese rojo, verde, azul"
  109: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:electro', m: 'panRight'}],     // "el muchacho que desarmaba radios"
  110: [{t: 'p:ggc-lab', m: 'zoomIn'}],                                   // "armaba sus aparatos, 23 años"
  111: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:ggc', m: 'punchIn'}],      // "en color cuando el mundo veía B/N"
  112: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],      // "el mundo se olvidó de él"
  113: [{t: 'p:ggc', m: 'zoomIn'}],                                       // "suscríbete a Crónicas Ilustradas"
  114: [{t: 'p:ggc', m: 'zoomIn'}, {t: 'p:ggc', m: 'punchIn'}],          // cierre
};

// ---- Ventanas verificadas por clip (para el avance interno del archivo) ----
const WINDOWS: Record<string, [number, number][]> = {
  'gc-documental': [[13, 16], [18, 21], [32, 43], [96, 100]],
  'gc-historia-tv-color': [[18, 21], [62, 65], [66, 72], [74, 76]],
  'gc-patente-noticia': [[18, 21], [62, 65], [96, 100]],
  'mexico-revolucion-1917': [[1, 7], [9, 15]],
  'mechanical-color-disc': [[26, 31], [38, 44.5], [88, 91]],
  'cbs-goldmark-1940': [[1, 2.6]],  // sólo el disco tricolor; después sale el loro
  'rca-color-tv-1950s': [[0, 44], [56, 64]],
  'ipn-politecnico-historia': [[2, 80]],
  'mexico-city-1930s': [[45, 82]],
  'vintage-tv-broadcast-mx': [[2, 76]],
  'voyager-nasa-images': [[18, 34], [48, 72]],
  'huapango-mexicano': [[8, 72]],
};

// ---- Overlays por cue ----
const FULLTEXT: Record<number, {text: string; accent?: Accent}> = {
  5: {text: 'No fue Nueva York.\nNo fue Londres.', accent: 'amber'},
  19: {text: 'Si no puedes comprarlo,\nconstrúyelo tú mismo.', accent: 'amber'},
};
const STATS: Record<number, StatDef> = {
  38: {value: 23, suffix: ' años', label: 'y ya tenía la patente', accent: 'amber'},
  77: {display: '4°', label: 'país del mundo a color', accent: 'amber'},
  87: {value: 48, suffix: ' años', label: 'en la cima de su talento', accent: 'red'},
  98: {display: '4°', label: 'del planeta a todo color', accent: 'amber'},
};
const DATES: Record<number, string> = {
  36: '1940', 42: '1942', 55: '1946', 75: '1963', 85: '1965',
};
const NEWSPAPER: Record<number, {headline: string; dek?: string}> = {
  53: {headline: 'Un joven inventor mexicano', dek: 'Diarios como El Universal reseñan sus experimentos con la televisión a color.'},
};
const NAMES: Record<number, {name: string; role?: string; delay?: number}> = {
  46: {name: 'Peter Goldmark', role: 'CBS · el mismo sueño', delay: 1.2},
  81: {name: 'XHGC', role: 'sus iniciales, para siempre', delay: 1.5},
  113: {name: 'Crónicas Ilustradas', role: 'suscríbete', delay: 0.5},
};
const DEFS: Record<number, {term: string; pos?: string; def: string; delay?: number}> = {
  29: {term: 'Sistema tricromático', pos: 'secuencial de campos', def: 'Todos los colores nacen de tres: rojo, verde y azul.', delay: 0.6},
};
const SOURCE: Record<number, {label: string; sub?: string}> = {
  12: {label: 'Documental biográfico', sub: 'Deyadira Medina Lara · Archivo Revolución Mexicana'},
  81: {label: 'Canal 5 · XHGC', sub: 'Fundación Cultural Jorge González Camarena'},
};

const CONTEXT_POOL = ['v:broadcast-tower', 'old-black-white-tv', 'v:tv-static-noise', 'color-spectrum-prism'];
const cutMotions: Motion[] = ['punchIn', 'zoomIn', 'panRight', 'zoomOut', 'panLeft'];

type Cand = {src: string; video: boolean; base: string; archId?: string; fixedStart?: number; component?: Comp};
const resolveToken = (t: string, pickVariant: (cands: Cand[]) => Cand): Cand => {
  if (t.startsWith('c:')) return {src: '', video: false, base: t, component: t.slice(2) as Comp};
  if (t.startsWith('a:')) {
    const body = t.slice(2);
    const at = body.indexOf('@');
    const [id, s] = at >= 0 ? [body.slice(0, at), parseFloat(body.slice(at + 1))] : [body, undefined];
    return {src: archivalSrc(id), video: true, base: 'a:' + id, archId: id, fixedStart: s};
  }
  if (t.startsWith('v:')) {
    const base = t.slice(2);
    return pickVariant(videoVariants(base).map((src) => ({src, video: true, base})));
  }
  if (t.startsWith('img:')) {
    const name = t.slice(4);
    return {src: staticFile(`stock-gc/photos/${name}.jpg`), video: false, base: name.replace(/-\d+$/, '')};
  }
  return pickVariant(photoVariants(t).map((src) => ({src, video: false, base: t})));
};

const candidatesFor = (pool: string[]): Cand[] => {
  const out: Cand[] = [];
  for (const token of pool) {
    if (token.startsWith('v:')) for (const src of videoVariants(token.slice(2))) out.push({src, video: true, base: token.slice(2)});
    else for (const src of photoVariants(token)) out.push({src, video: false, base: token});
  }
  if (out.length === 0) out.push({src: staticFile('stock-gc/photos/old-black-white-tv-1.jpg'), video: false, base: 'old-black-white-tv'});
  return out;
};

export const buildPlan = (fps: number, total: number) => {
  const shots: Shot[] = [];
  const overlays: Overlay[] = [];
  let shotSeed = 0;

  const useCount: Record<string, number> = {};
  const pickVariant = (cands: Cand[]): Cand => {
    if (cands.length === 0) return {src: staticFile('stock-gc/photos/old-black-white-tv-1.jpg'), video: false, base: 'old-black-white-tv'};
    let best = cands[0]; let bestScore = Infinity;
    for (let k = 0; k < cands.length; k++) {
      const c = cands[k];
      const tie = ((k * 2654435761) % 997) / 997;
      const score = (useCount[c.src] ?? 0) * 100 + tie;
      if (score < bestScore) {bestScore = score; best = c;}
    }
    return best;
  };
  const recordUse = (src: string) => {if (src) useCount[src] = (useCount[src] ?? 0) + 1;};

  // ---- selector de POOL con anti-repetición: elige el miembro menos usado
  // recientemente para NO repetir las mismas tomas. MIN_SEP = separación mínima. ----
  const poolLast: Record<string, number> = {};   // token -> frame de último uso
  const poolCount: Record<string, number> = {};
  const MIN_SEP = Math.round(22 * fps);           // no repetir el mismo token en <22s
  const pickFromPool = (poolName: string, nowFrame: number): string => {
    const tokens = POOLS[poolName] ?? [poolName];
    let best = tokens[0], bestScore = Infinity;
    tokens.forEach((tk, k) => {
      const last = poolLast[tk];
      const elapsed = last === undefined ? MIN_SEP : nowFrame - last;
      const sepPenalty = elapsed >= MIN_SEP ? 0 : 1e6 * (1 - elapsed / MIN_SEP);
      const tie = ((k * 2654435761) % 997) / 997;
      const score = sepPenalty + (poolCount[tk] ?? 0) * 50 + tie;
      if (score < bestScore) {bestScore = score; best = tk;}
    });
    poolLast[best] = nowFrame;
    poolCount[best] = (poolCount[best] ?? 0) + 1;
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
      if (cursor < acc + len) {let s = a + (cursor - acc); const maxS = Math.max(a, b - durSecs); if (s > maxS) s = maxS; startSec = s; break;}
      acc += len;
    }
    archCursor[id] = (archCursor[id] ?? 0) + Math.max(durSecs, 1.6);
    return Math.max(0, Math.round(startSec * fps));
  };

  const pushShot = (from: number, dur: number, c: Cand, motion: Motion, signalCut?: boolean) => {
    const startFrom = c.archId
      ? (c.fixedStart !== undefined ? Math.round(c.fixedStart * fps) : nextArchStart(c.archId, dur / fps))
      : undefined;
    shots.push({from, dur, base: c.base, seed: shotSeed++, src: c.src, video: c.video, motion, archival: !!c.archId, startFrom, signalCut, component: c.component});
    recordUse(c.src);
  };

  const chapterByCue = new Map(CHAPTERS.map((c) => [c.cue, c]));

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);

    // CASO ESPECIAL (min 1): olvido -> patente continua -> tarjeta 17-feb (tiempos absolutos)
    const PATENT_START = Math.round(45.4 * fps);
    const PATENT_END = Math.round(50.4 * fps);
    if (c.i === 10) {
      pushShot(from, PATENT_START - from, resolveToken(GGC_PENSANDO, pickVariant), 'zoomIn');
      pushShot(PATENT_START, PATENT_END - PATENT_START, {src: '', video: false, base: 'c:patent', component: 'patent'}, 'zoomIn');
      return;
    }
    if (c.i === 11) {
      pushShot(PATENT_END, to - PATENT_END, resolveToken('a:gc-documental@13.5', pickVariant), 'zoomIn', true);
      return;
    }

    const sb = STORYBOARD[c.i];
    if (sb) {
      const totalW = sb.reduce((s, p) => s + (p.w ?? 1), 0);
      let acc = 0;
      sb.forEach((p, k) => {
        const w = p.w ?? 1;
        const sFrom = from + Math.round((acc / totalW) * dur);
        const sTo = from + Math.round(((acc + w) / totalW) * dur);
        acc += w;
        // token de pool 'p:X' -> se resuelve al miembro menos repetido
        const token = p.t.startsWith('p:') ? pickFromPool(p.t.slice(2), sFrom) : p.t;
        const cand = resolveToken(token, pickVariant);
        const motion = p.m ?? cutMotions[(idx + k) % cutMotions.length];
        pushShot(sFrom, Math.max(1, sTo - sFrom), cand, motion, !!p.sc);
      });
    } else {
      const cands = candidatesFor(CONTEXT_POOL);
      const target = 4.0 * fps;
      const n = Math.max(1, Math.round(dur / target));
      for (let k = 0; k < n; k++) {
        const sFrom = from + Math.round((k * dur) / n);
        const sTo = from + Math.round(((k + 1) * dur) / n);
        pushShot(sFrom, Math.max(1, sTo - sFrom), pickVariant(cands), cutMotions[(idx + k) % cutMotions.length]);
      }
    }

    // ---- Overlays (delays SUBIDOS: los textos centrados y capítulos entran CON
    // la frase, no antes) ----
    if (chapterByCue.has(c.i)) {
      const ch = chapterByCue.get(c.i)!;
      overlays.push({from, dur: Math.round(fps * 2.6), delay: ch.delay ?? 1.5, kind: 'chapter', num: ch.num, text: ch.title});
    }
    if (c.i === 9) overlays.push({from, dur: Math.round(fps * 4.2), delay: TEXT_NUDGE, kind: 'title', pre: 'la historia de', text: 'Guillermo González Camarena'});
    if (FULLTEXT[c.i]) overlays.push({from, dur: Math.min(dur, Math.round(fps * 3.6)), delay: 0.8, kind: 'fulltext', text: FULLTEXT[c.i].text, accent: FULLTEXT[c.i].accent});
    if (STATS[c.i]) overlays.push({from, dur: Math.round(fps * 3.0), delay: 1.1, kind: 'stat', stat: STATS[c.i]});
    if (DATES[c.i]) overlays.push({from, dur: Math.round(fps * 2.4), delay: 0.7, kind: 'date', text: DATES[c.i]});
    if (NEWSPAPER[c.i]) overlays.push({from, dur: Math.round(fps * 3.8), delay: 0.9, kind: 'newspaper', headline: NEWSPAPER[c.i].headline, dek: NEWSPAPER[c.i].dek});
    if (NAMES[c.i]) overlays.push({from, dur: Math.round(fps * 3.0), delay: NAMES[c.i].delay ?? 0.9, kind: 'name', name: NAMES[c.i].name, role: NAMES[c.i].role});
    if (DEFS[c.i]) overlays.push({from, dur: Math.round(fps * 3.6), delay: DEFS[c.i].delay ?? 1.0, kind: 'definition', term: DEFS[c.i].term, pos: DEFS[c.i].pos, def: DEFS[c.i].def});
    if (SOURCE[c.i]) overlays.push({from, dur: Math.round(fps * 3.2), delay: 0.6, kind: 'source', label: SOURCE[c.i].label, sub: SOURCE[c.i].sub});
  });

  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const chapterMarks = CHAPTERS.map((ch) => ({from: cueFrom(ch.cue), num: ch.num, title: ch.title}));

  overlays.forEach((o) => {if (o.delay) o.from += Math.round(o.delay * fps);});

  return {shots, overlays, chapters: chapterMarks};
};

const HUE: Record<string, number> = {
  'a:gc-documental': 35, 'a:gc-historia-tv-color': 35, 'a:gc-patente-noticia': 35,
  'a:mexico-revolucion-1917': 25, 'a:mechanical-color-disc': 200, 'a:cbs-goldmark-1940': 280,
  'a:rca-color-tv-1950s': 210, 'a:ipn-politecnico-historia': 5, 'a:mexico-city-1930s': 30,
  'a:vintage-tv-broadcast-mx': 300, 'a:voyager-nasa-images': 220, 'a:huapango-mexicano': 340,
  'rgb-pixels-macro': 200, 'color-spectrum-prism': 280, 'engineer-workshop': 40,
  'old-black-white-tv': 210, 'vintage-radio-parts': 40, 'tube-radio': 40, 'vintage-tv-workshop': 210,
  'broadcast-tower': 195, 'mexico-flag': 140, 'family-tv-vintage': 35, 'highway-mexico': 30,
  'mexican-musician': 340, 'tv-static-noise': 210, 'university-engineering': 205,
};
export const hueFor = (base: string) => HUE[base] ?? 205;
export {hasPhoto};
