import {staticFile} from 'remotion';
import {cues, Cue} from './cues';
import {photoVariants, videoVariants, hasPhoto, ARCHIVAL, archivalSrc} from './assets';

// ============================================================
// EL CEREBRO del documental "Un MEXICANO de 23 Años le Dio COLOR a tu TV"
// (Guillermo González Camarena).
//
// REGLA MADRE (directiva del usuario): NO REPETIR ARCHIVOS. Se usa TODO el
// material descargado. La cara animada de GGC (los 4 clips gc-*) SOLO aparece
// cuando se DICE su nombre; el resto de la narración se ilustra con el stock
// temático (niño con electrónica, radios, taller, prensa, TVs, color, México…),
// repartido por pools con selector "menos usado + separación mínima".
//
// Los clips gc-* son el MISMO documental animado; sus primeros ~12s son cine de
// época (Cantinflas) — PROHIBIDOS. Segmentos con GGC marcados con @segundo.
// ============================================================

export type Motion = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
export type Accent = 'amber' | 'teal' | 'red' | 'paper';
type Comp = 'patent' | 'patent-full' | 'colorwheel' | 'screenoff';

export interface StatDef {value?: number; display?: string; prefix?: string; suffix?: string; label?: string; decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;}
export interface Shot {from: number; dur: number; base: string; seed: number; motion: Motion; src?: string; video?: boolean; archival?: boolean; startFrom?: number; signalCut?: boolean; component?: Comp;}
export interface Overlay {
  from: number; dur: number;
  kind: 'title' | 'chapter' | 'date' | 'fulltext' | 'stat' | 'newspaper' | 'quote' | 'definition' | 'name' | 'source';
  pre?: string; text?: string; num?: number; stat?: StatDef; accent?: Accent;
  headline?: string; dek?: string; quote?: string; author?: string;
  term?: string; pos?: string; def?: string; name?: string; role?: string;
  label?: string; sub?: string;
}

// ---- Capítulos (arco narrativo). anchor = palabra del cue sobre la que entra
// el título, para que caiga EXACTAMENTE con la frase, nunca antes. ----
const CHAPTERS = [
  {num: 1, cue: 12, title: 'Guadalajara, 1917', anchor: 'Guadalajara'},
  {num: 2, cue: 15, title: 'El niño que lo desarmaba todo', anchor: 'desarmó'},
  {num: 3, cue: 24, title: 'La obsesión del color', anchor: 'quería color'},
  {num: 4, cue: 32, title: 'El disco giratorio', anchor: 'disco giratorio'},
  {num: 5, cue: 37, title: 'La patente', anchor: 'patente'},
  {num: 6, cue: 47, title: 'La misma luz', anchor: 'parecido'},
  {num: 7, cue: 58, title: 'El olvido', anchor: 'torcerse'},
  {num: 8, cue: 74, title: 'XHGC', anchor: 'gran día'},
  {num: 9, cue: 85, title: 'El último golpe', anchor: 'regresaba'},
  {num: 10, cue: 95, title: 'La verdad documentada', anchor: 'documentado'},
];

// ============================================================
// POOLS temáticos — cada uno lleno de ARCHIVOS DISTINTOS (fotos con 6 variantes
// + videos + algún archival). 'p:nombre' se resuelve al miembro menos usado.
// Objetivo: gastar TODO el material sin repetir.
// ============================================================
const POOLS: Record<string, string[]> = {
  // La CARA de GGC — ahora con FOTOS REALES de él (gc-tvunam) + archivo AGN.
  // El dibujo animado queda solo como respaldo puntual.
  ggcface: [
    'a:gc-tvunam@78',        // retrato formal icónico (real)
    'a:gc-tvunam@24',        // de perfil trabajando en su equipo (real)
    'a:gc-tvunam@48',        // frente a la cámara de televisión (real)
    'a:gc-tvunam@62',        // operando la cámara (real)
    'a:gc-tvunam@12',        // sentado, con su TV (real)
    'a:gc-entrevista@20',    // aparatos "construidos en México" (archivo AGN)
    'a:gc-historia-tv-color@62', 'a:gc-patente-noticia@62', // dibujo (respaldo)
  ],
  // El joven inventor / trasteando (niñez, "armaba radios", "inventando"). Stock real.
  inventor: ['child-electronics', 'engineer-workshop', 'v:engineer-workshop', 'vintage-radio-parts', 'tube-radio', 'vintage-typewriter'],
  // GGC trabajando en su laboratorio/aparatos: stock + frames REALES suyos.
  lab: ['engineer-workshop', 'v:engineer-workshop', 'vintage-radio-parts', 'tube-radio', 'vintage-tv-workshop', 'a:gc-entrevista@30', 'a:gc-entrevista@20', 'a:gc-tvunam@62'],
  // RGB / espectro / píxeles a color.
  color: ['color-spectrum-prism', 'v:color-spectrum-prism', 'rgb-pixels-macro', 'v:rgb-pixels-macro', 'tv-test-pattern', 'v:tv-test-pattern', 'c:colorwheel'],
  // televisión antigua.
  tvvieja: ['old-black-white-tv', 'vintage-tv-workshop', 'v:vintage-tv-workshop', 'family-tv-vintage', 'v:family-tv-vintage', 'tv-test-pattern'],
  // disco tricromático (colorwheel propio + disco mecánico verificado).
  disco: ['c:colorwheel', 'a:mechanical-color-disc@26', 'a:mechanical-color-disc@38', 'a:mechanical-color-disc@88'],
  // prensa / reconocimiento (periódicos, El Universal).
  press: ['old-newspaper', 'vintage-typewriter'],
  // contexto mexicano.
  mexico: ['mexico-flag', 'guadalajara-city', 'mexico-city-skyline', 'a:mexico-city-1930s@50', 'a:mexico-city-1930s@70'],
  // torre / señal / estática.
  senal: ['broadcast-tower', 'v:broadcast-tower', 'tv-static-noise', 'v:tv-static-noise', 'tv-test-pattern'],
  // corporaciones (RCA diluido con prensa/torre/TV mexicana).
  corp: ['a:rca-color-tv-1950s@2', 'a:rca-color-tv-1950s@26', 'a:rca-color-tv-1950s@58', 'old-newspaper', 'a:vintage-tv-broadcast-mx@20', 'broadcast-tower', 'vintage-typewriter'],
  // carretera (accidente).
  carretera: ['v:highway-mexico', 'highway-mexico'],
  // revolución mexicana real.
  revol: ['a:mexico-revolucion-1917@2', 'a:mexico-revolucion-1917@6', 'a:mexico-revolucion-1917@13'],
  // sondas Voyager / espacio.
  voyager: ['a:voyager-nasa-images@20', 'a:voyager-nasa-images@55', 'a:voyager-nasa-images@62'],
  // música mexicana (huapango).
  musica: ['mexican-musician', 'a:huapango-mexicano@15', 'a:huapango-mexicano@40', 'a:huapango-mexicano@60'],
  // televisión mexicana / Canal 5 — con la transmisión REAL de 1963 "Paraíso Infantil".
  tvmx: ['a:gc-canal5-1963@4', 'a:gc-canal5-1963@16', 'a:gc-canal5-1963@28', 'a:vintage-tv-broadcast-mx@2', 'a:vintage-tv-broadcast-mx@40', 'a:gc-canal5-xhgc@2'],
};

// ============================================================
// STORYBOARD — cada cue -> planos cortos. 'p:X' = pool. 'a:ID@S' archival fijo.
// 'c:comp' componente. Nombre suelto = foto (rota variantes). 'v:base' = video.
// ============================================================
type SB = {t: string; m?: Motion; w?: number; sc?: boolean};

const STORYBOARD: Record<number, SB[]> = {
  // ---------- ARRANQUE: el color de hoy ----------
  1:  [{t: 'v:rgb-pixels-macro', m: 'punchIn'}, {t: 'p:color', m: 'zoomIn'}],
  2:  [{t: 'p:color', m: 'panRight'}, {t: 'p:tvvieja', m: 'zoomIn'}],
  3:  [{t: 'p:inventor', m: 'punchIn'}, {t: 'p:color', m: 'zoomIn'}],
  4:  [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:corp', m: 'panRight'}],
  5:  [{t: 'p:corp', m: 'zoomIn'}],                                      // FULLTEXT "No fue NY/Londres"
  6:  [{t: 'guadalajara-city', m: 'zoomIn'}, {t: 'p:inventor', m: 'punchIn'}], // "joven de Guadalajara, con sus manos"
  7:  [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:revol', m: 'panRight'}],    // NOMBRE "Su nombre era Guillermo"
  8:  [{t: 'p:ggcface', m: 'punchIn'}, {t: 'p:tvvieja', m: 'zoomIn'}],   // NOMBRE "Camarena"
  9:  [{t: 'p:ggcface', m: 'zoomIn'}],                                    // TÍTULO
  // 10-11 tiempos absolutos (patente teaser continuo + tarjeta 17-feb)
  12: [{t: 'guadalajara-city', m: 'zoomIn'}, {t: 'p:revol', m: 'panRight'}],
  13: [{t: 'a:mexico-revolucion-1917@6', m: 'zoomIn'}, {t: 'p:revol', m: 'panLeft'}], // auto destruido (mantener)

  // ---------- CAP II: la niñez ----------
  14: [{t: 'p:mexico', m: 'panRight'}, {t: 'p:ggcface', m: 'zoomIn'}],   // NOMBRE "familia González / Guillermo"
  15: [{t: 'child-electronics', m: 'punchIn'}, {t: 'p:inventor', m: 'zoomIn'}], // "desarmó todo"
  16: [{t: 'p:inventor', m: 'zoomIn'}, {t: 'p:inventor', m: 'panLeft'}], // "lo entendía por dentro"
  17: [{t: 'vintage-radio-parts', m: 'punchIn'}, {t: 'tube-radio', m: 'zoomIn'}], // "armaba radios"
  18: [{t: 'p:inventor', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],  // "no había dinero"
  19: [{t: 'p:inventor', m: 'zoomIn'}],                                   // FULLTEXT "constrúyelo tú mismo"
  20: [{t: 'a:ipn-politecnico-historia@5', m: 'zoomIn'}, {t: 'university-engineering', m: 'panRight'}], // Politécnico
  21: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:inventor', m: 'punchIn'}],  // NOMBRE "Guillermo obsesionado"

  // ---------- CAP III: la obsesión del color ----------
  22: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:tvvieja', m: 'panRight'}],  // "ciencia ficción, la televisión"
  23: [{t: 'old-black-white-tv', m: 'punchIn'}, {t: 'p:tvvieja', m: 'zoomIn'}], // "todos veían en B/N"
  24: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],     // "él quería color"
  25: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:disco', m: 'panRight'}],    // "años 30, un experimento"
  26: [{t: 'p:mexico', m: 'zoomIn'}, {t: 'p:inventor', m: 'punchIn'}],   // "este muchacho en México"
  27: [{t: 'p:corp', m: 'panRight'}, {t: 'p:tvvieja', m: 'zoomIn'}],     // "copiar a gringos o ingleses"
  28: [{t: 'p:inventor', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],    // "dar el siguiente salto, la idea"
  29: [{t: 'c:colorwheel'}, {t: 'a:mechanical-color-disc@38', m: 'zoomIn'}], // "sistema tricromático" + DEF
  30: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:disco', m: 'panRight'}],    // NOMBRE "Camarena entendió"

  // ---------- CAP IV: el disco giratorio ----------
  31: [{t: 'c:colorwheel'}, {t: 'p:color', m: 'punchIn'}],               // "rojo, verde y azul"
  32: [{t: 'a:mechanical-color-disc@26', m: 'zoomIn'}, {t: 'c:colorwheel'}], // "un disco giratorio"
  33: [{t: 'a:mechanical-color-disc@38', m: 'zoomIn'}, {t: 'p:disco', m: 'panRight'}], // "giraba frente a la cámara"
  34: [{t: 'a:mechanical-color-disc@88', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}], // "el ojo humano engañado"
  35: [{t: 'c:colorwheel'}, {t: 'p:color', m: 'panRight'}],              // "imagen a todo color, mexicano"

  // ---------- CAP V: la patente ----------
  36: [{t: 'a:mechanical-color-disc@88', m: 'zoomIn'}, {t: 'p:disco', m: 'panRight'}], // DATE "19 ago 1940"
  37: [{t: 'c:patent'}],                                                  // "le otorgó la patente"
  38: [{t: 'p:ggcface', m: 'zoomIn'}],                                    // NOMBRE "GGC tenía 23 años" + Stat
  39: [{t: 'p:corp', m: 'panRight'}, {t: 'p:tvvieja', m: 'zoomIn'}],     // "Segunda Guerra Mundial"
  40: [{t: 'p:inventor', m: 'zoomIn'}, {t: 'p:lab', m: 'punchIn'}],      // "en su taller había patentado"
  41: [{t: 'c:patent'}],                                                  // "patente en Estados Unidos"
  42: [{t: 'c:patent-full'}],                                             // DATE "15 sep 1942"
  43: [{t: 'c:patent-full'}],                                             // "2,296,019, adaptador cromoscópico"
  44: [{t: 'c:patent-full'}],                                             // "oficinas del país más poderoso"
  45: [{t: 'p:ggcface', m: 'zoomIn'}],                                    // NOMBRE "Guillermo no fue el único"

  // ---------- CAP VI: la misma luz ----------
  46: [{t: 'a:mechanical-color-disc@26', m: 'zoomIn'}, {t: 'p:disco', m: 'panRight'}], // NAME Goldmark (CBS)
  47: [{t: 'p:disco', m: 'zoomIn'}, {t: 'c:colorwheel'}],                // "sistema parecido, discos"
  48: [{t: 'p:disco', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],       // "la misma luz"
  49: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:corp', m: 'panRight'}],     // NOMBRE "González Camarena vs corporación"
  50: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:inventor', m: 'punchIn'}],  // NOMBRE "Guillermo tenía talento"
  51: [{t: 'p:inventor', m: 'zoomIn'}, {t: 'p:corp', m: 'panRight'}],    // "un mexicano casi solo vs imperios"
  52: [{t: 'p:press', m: 'zoomIn'}, {t: 'p:press', m: 'panRight'}],      // "los periódicos lo notaron"
  53: [{t: 'p:press', m: 'zoomIn'}, {t: 'p:ggcface', m: 'punchIn'}],     // NEWS "El Universal, joven inventor"
  54: [{t: 'p:mexico', m: 'panRight'}, {t: 'p:ggcface', m: 'zoomIn'}],   // "México volvió a verlo"
  55: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:lab', m: 'punchIn'}],       // NOMBRE DATE "31 ago 1946 Guillermo"
  56: [{t: 'p:lab', m: 'panRight'}, {t: 'p:mexico', m: 'zoomIn'}],       // "laboratorio en Lucerna, CDMX"
  57: [{t: 'p:lab', m: 'zoomIn'}, {t: 'p:inventor', m: 'punchIn'}],      // "con sus aparatos"

  // ---------- CAP VII: el olvido ----------
  58: [{t: 'p:lab', m: 'zoomIn'}],                                        // "empieza a torcerse"
  59: [{t: 'p:ggcface', m: 'panRight'}, {t: 'p:inventor', m: 'zoomIn'}], // NOMBRE "Guillermo trabajaba con lo que tenía"
  60: [{t: 'p:corp', m: 'zoomIn'}, {t: 'p:corp', m: 'panRight'}],        // "RCA invertía millones"
  61: [{t: 'p:corp', m: 'zoomIn'}, {t: 'p:corp', m: 'panRight'}],        // "la guerra fría"
  62: [{t: 'p:disco', m: 'zoomIn'}, {t: 'p:corp', m: 'panRight'}],       // "no adoptó el sistema de discos"
  63: [{t: 'p:corp', m: 'zoomIn'}, {t: 'p:disco', m: 'panRight'}],       // "otro camino técnico, grandes empresas"
  64: [{t: 'p:corp', m: 'zoomIn'}, {t: 'p:tvvieja', m: 'panRight'}],     // "el estándar comercial"
  65: [{t: 'p:mexico', m: 'zoomIn'}, {t: 'p:tvvieja', m: 'punchIn'}],    // "el muchacho de Guadalajara se fue borrando"
  66: [{t: 'p:press', m: 'zoomIn'}, {t: 'p:corp', m: 'panRight'}],       // "historia escrita en inglés"
  67: [{t: 'p:ggcface', m: 'zoomIn'}],                                    // NOMBRE "Guillermo nunca fue por el dinero"
  68: [{t: 'p:inventor', m: 'zoomIn'}, {t: 'p:lab', m: 'punchIn'}],      // "siguió inventando"
  69: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],   // "televisores baratos para país pobre"
  70: [{t: 'v:family-tv-vintage', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}], // "educación por TV"
  71: [{t: 'p:mexico', m: 'zoomIn'}, {t: 'family-tv-vintage', m: 'punchIn'}],    // "escuelas rurales, niños"
  72: [{t: 'p:musica', m: 'panRight'}, {t: 'p:musica', m: 'zoomIn'}],    // "era músico, un huapango"
  73: [{t: 'p:musica', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],      // "Río Colorado, el mundo en colores"

  // ---------- CAP VIII: XHGC ----------
  74: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:tvmx', m: 'panRight'}],     // "su gran día"
  75: [{t: 'a:gc-canal5-1963@4', m: 'zoomIn'}, {t: 'p:tvmx', m: 'punchIn'}], // DATE "21 ene 1963, Canal 5" (transmisión real)
  76: [{t: 'p:tvmx', m: 'zoomIn'}, {t: 'p:color', m: 'panRight'}],       // "primera transmisión a color de México"
  77: [{t: 'p:mexico', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],      // "cuarto país del mundo" + Stat
  78: [{t: 'p:tvmx', m: 'panRight'}, {t: 'p:mexico', m: 'zoomIn'}],      // "después de EEUU, Japón, Canadá"
  79: [{t: 'p:mexico', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],      // "cuarto lugar del planeta"
  80: [{t: 'a:gc-canal5-xhgc@2', m: 'zoomIn'}],                           // "¿cómo se llama ese canal?"
  81: [{t: 'a:gc-canal5-xhgc@70', m: 'zoomIn'}, {t: 'p:tvmx', m: 'panRight'}], // NAME "XHGC, iniciales"
  82: [{t: 'p:tvmx', m: 'panRight'}, {t: 'a:gc-canal5-xhgc@70', m: 'zoomIn'}], // "el aire de la TV mexicana"
  83: [{t: 'p:ggcface', m: 'zoomIn'}],                                    // "pronuncia su nombre"
  84: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:carretera', m: 'punchIn'}], // "un último golpe"

  // ---------- CAP IX: el último golpe ----------
  85: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:carretera', m: 'panRight'}], // NOMBRE DATE "18 abr 1965 Guillermo regresaba"
  86: [{t: 'p:carretera', m: 'zoomIn'}, {t: 'p:carretera', m: 'punchIn'}], // "carretera México-Veracruz"
  87: [{t: 'p:carretera', m: 'zoomIn'}, {t: 'p:ggcface', m: 'punchIn'}], // "murió, 48 años" + Stat
  88: [{t: 'p:lab', m: 'zoomIn'}, {t: 'p:inventor', m: 'punchIn'}],      // "todavía inventando"
  89: [{t: 'c:screenoff'}],                                               // "se apagó como pantalla sin señal"

  // ---------- CAP X: la verdad documentada ----------
  90: [{t: 'p:voyager', m: 'zoomIn'}],                                    // "leyenda: la NASA / Voyager"
  91: [{t: 'p:voyager', m: 'zoomIn'}, {t: 'p:voyager', m: 'panRight'}],  // "imágenes del espacio"
  92: [{t: 'p:voyager', m: 'zoomIn'}, {t: 'p:voyager', m: 'panRight'}],  // "voy a ser honesto"
  93: [{t: 'p:voyager', m: 'zoomIn'}],                                    // "no está comprobada"
  94: [{t: 'p:lab', m: 'zoomIn'}],                                        // "no hace falta"
  95: [{t: 'c:patent-full'}],                                             // "firmado y documentado"
  96: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'c:patent'}],                  // "joven de 23 años patentó" + Stat
  97: [{t: 'c:patent-full'}, {t: 'p:corp', m: 'panRight'}],              // "en 1940, con los gigantes"
  98: [{t: 'p:color', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],     // "cuarto país a todo color" + Stat
  99: [{t: 'p:ggcface', m: 'zoomIn'}],                                    // "¿por qué nadie lo conoce?"
  100: [{t: 'p:press', m: 'zoomIn'}, {t: 'p:corp', m: 'panRight'}],      // "no la escriben los primeros"
  101: [{t: 'p:corp', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],     // "el poder no estuvo en México"
  102: [{t: 'p:corp', m: 'zoomIn'}, {t: 'p:press', m: 'panRight'}],      // "corporaciones, otro idioma"
  103: [{t: 'p:corp', m: 'zoomIn'}],                                      // "lo inventaron ellos"
  104: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],  // NOMBRE "González Camarena borrado por ser de aquí"
  105: [{t: 'p:mexico', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],   // "de nuestro país"
  106: [{t: 'p:mexico', m: 'zoomIn'}, {t: 'p:senal', m: 'punchIn'}],     // "solo si lo permitimos"
  107: [{t: 'p:tvvieja', m: 'zoomIn'}, {t: 'p:senal', m: 'punchIn'}],    // "la próxima vez que enciendas tu TV"
  108: [{t: 'p:color', m: 'punchIn'}, {t: 'p:color', m: 'zoomIn'}],      // "ese rojo, verde, azul"
  109: [{t: 'p:inventor', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}], // "el muchacho que desarmaba radios"
  110: [{t: 'p:inventor', m: 'zoomIn'}, {t: 'p:lab', m: 'punchIn'}],     // "armaba sus aparatos, 23 años"
  111: [{t: 'p:color', m: 'zoomIn'}, {t: 'p:ggcface', m: 'punchIn'}],    // NOMBRE "soñar en color... Se llamaba Guillermo"
  112: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:mexico', m: 'panRight'}],  // NOMBRE "Camarena. El mundo se olvidó"
  113: [{t: 'p:ggcface', m: 'zoomIn'}],                                   // "suscríbete a Crónicas Ilustradas"
  114: [{t: 'p:ggcface', m: 'zoomIn'}, {t: 'p:color', m: 'punchIn'}],    // cierre
};

// ---- Ventanas verificadas por clip (para el avance interno del archivo) ----
const WINDOWS: Record<string, [number, number][]> = {
  'gc-documental': [[13, 16], [18, 21], [32, 43], [96, 100]],
  'gc-historia-tv-color': [[18, 21], [62, 65], [66, 72], [74, 76]],
  'gc-patente-noticia': [[18, 21], [62, 65], [96, 100]],
  'gc-canal5-xhgc': [[2, 8], [68, 74]],
  'gc-tvunam': [[12, 92]],
  'gc-entrevista': [[8, 45]],
  'gc-canal5-1963': [[2, 36]],
  'mexico-revolucion-1917': [[1, 7], [9, 15]],
  'mechanical-color-disc': [[26, 31], [38, 44.5], [88, 91]],
  'cbs-goldmark-1940': [[1, 2.6]],
  'rca-color-tv-1950s': [[0, 44], [56, 64]],
  'ipn-politecnico-historia': [[2, 80]],
  'mexico-city-1930s': [[45, 82]],
  'vintage-tv-broadcast-mx': [[2, 76]],
  'voyager-nasa-images': [[18, 34], [48, 72]],
  'huapango-mexicano': [[8, 72]],
};

// ---- Overlays por cue ----
const FULLTEXT: Record<number, {text: string; accent?: Accent; anchor?: string}> = {
  5: {text: 'No fue Nueva York.\nNo fue Londres.', accent: 'amber', anchor: 'Nueva York'},
  19: {text: 'Si no puedes comprarlo,\nconstrúyelo tú mismo.', accent: 'amber', anchor: 'Si no puedes'},
};
const STATS: Record<number, {stat: StatDef; anchor?: string}> = {
  38: {stat: {value: 23, suffix: ' años', label: 'y ya tenía la patente', accent: 'amber'}, anchor: '23 años'},
  77: {stat: {display: '4°', label: 'país del mundo a color', accent: 'amber'}, anchor: 'cuarto'},
  87: {stat: {value: 48, suffix: ' años', label: 'en la cima de su talento', accent: 'red'}, anchor: '48'},
  98: {stat: {display: '4°', label: 'del planeta a todo color', accent: 'amber'}, anchor: 'cuarto'},
};
const DATES: Record<number, {year: string; anchor: string}> = {
  36: {year: '1940', anchor: '1940'}, 42: {year: '1942', anchor: '1942'},
  55: {year: '1946', anchor: '1946'}, 75: {year: '1963', anchor: '1963'},
  85: {year: '1965', anchor: '1965'},
};
const NEWSPAPER: Record<number, {headline: string; dek?: string; anchor?: string}> = {
  53: {headline: 'Un joven inventor mexicano', dek: 'Diarios como El Universal reseñan sus experimentos con la televisión a color.', anchor: 'inventor'},
};
const NAMES: Record<number, {name: string; role?: string; anchor?: string}> = {
  46: {name: 'Peter Goldmark', role: 'CBS · el mismo sueño', anchor: 'Goldmark'},
  81: {name: 'XHGC', role: 'sus iniciales, para siempre', anchor: 'XHGC'},
  113: {name: 'Crónicas Ilustradas', role: 'suscríbete', anchor: 'crónicas'},
};
const DEFS: Record<number, {term: string; pos?: string; def: string; anchor?: string}> = {
  29: {term: 'Sistema tricromático', pos: 'secuencial de campos', def: 'Todos los colores nacen de tres: rojo, verde y azul.', anchor: 'tricromático'},
};
const SOURCE: Record<number, {label: string; sub?: string}> = {
  12: {label: 'Documental biográfico', sub: 'Deyadira Medina Lara · Archivo Revolución Mexicana'},
  81: {label: 'Canal 5 · XHGC', sub: 'Fundación Cultural Jorge González Camarena'},
};

const CONTEXT_POOL = ['broadcast-tower', 'old-black-white-tv', 'tv-static-noise', 'color-spectrum-prism'];
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
  const MIN_SEP = Math.round(24 * fps);           // no repetir el mismo token en <24s
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

  // ---- ancla temporal: momento (en frames) en que se dice `kw` dentro del cue,
  // por posición del texto. Así los overlays entran CON la palabra, no antes. ----
  const anchorFrom = (c: Cue, kw?: string, fallback = 0.9): number => {
    if (kw) {
      const i = c.text.toLowerCase().indexOf(kw.toLowerCase());
      if (i >= 0) {
        const frac = i / Math.max(1, c.text.length);
        const t = c.start + frac * (c.end - c.start) + 0.15;   // +0.15s: nunca antes
        return Math.round(Math.min(c.end - 0.1, Math.max(c.start, t)) * fps);
      }
    }
    return Math.round((c.start + fallback) * fps);
  };

  cues.forEach((c, idx) => {
    const from = Math.round(c.start * fps);
    const to = idx < cues.length - 1 ? Math.round(cues[idx + 1].start * fps) : total;
    const dur = Math.max(1, to - from);

    // CASO ESPECIAL (min 1): olvido -> patente continua -> tarjeta 17-feb (tiempos absolutos)
    const PATENT_START = Math.round(45.4 * fps);
    const PATENT_END = Math.round(50.4 * fps);
    if (c.i === 10) {
      pushShot(from, PATENT_START - from, resolveToken('a:gc-tvunam@78', pickVariant), 'zoomIn');
      pushShot(PATENT_START, PATENT_END - PATENT_START, {src: '', video: false, base: 'c:patent', component: 'patent'}, 'zoomIn');
      return;
    }
    if (c.i === 11) {
      pushShot(PATENT_END, to - PATENT_END, resolveToken('guadalajara-city', pickVariant), 'zoomIn', true);
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

    // ---- Overlays: cada uno ANCLADO a su palabra clave (entra CON la frase) ----
    if (chapterByCue.has(c.i)) {
      const ch = chapterByCue.get(c.i)!;
      overlays.push({from: anchorFrom(c, ch.anchor, 1.2), dur: Math.round(fps * 2.6), kind: 'chapter', num: ch.num, text: ch.title});
    }
    if (c.i === 9) overlays.push({from: anchorFrom(c, 'su historia', 0.6), dur: Math.round(fps * 4.2), kind: 'title', pre: 'la historia de', text: 'Guillermo González Camarena'});
    if (FULLTEXT[c.i]) overlays.push({from: anchorFrom(c, FULLTEXT[c.i].anchor, 0.8), dur: Math.min(dur, Math.round(fps * 3.6)), kind: 'fulltext', text: FULLTEXT[c.i].text, accent: FULLTEXT[c.i].accent});
    if (STATS[c.i]) overlays.push({from: anchorFrom(c, STATS[c.i].anchor, 1.1), dur: Math.round(fps * 3.0), kind: 'stat', stat: STATS[c.i].stat});
    if (DATES[c.i]) overlays.push({from: anchorFrom(c, DATES[c.i].anchor, 0.7), dur: Math.round(fps * 2.4), kind: 'date', text: DATES[c.i].year});
    if (NEWSPAPER[c.i]) overlays.push({from: anchorFrom(c, NEWSPAPER[c.i].anchor, 0.9), dur: Math.round(fps * 3.8), kind: 'newspaper', headline: NEWSPAPER[c.i].headline, dek: NEWSPAPER[c.i].dek});
    if (NAMES[c.i]) overlays.push({from: anchorFrom(c, NAMES[c.i].anchor, 0.9), dur: Math.round(fps * 3.0), kind: 'name', name: NAMES[c.i].name, role: NAMES[c.i].role});
    if (DEFS[c.i]) overlays.push({from: anchorFrom(c, DEFS[c.i].anchor, 0.9), dur: Math.round(fps * 3.6), kind: 'definition', term: DEFS[c.i].term, pos: DEFS[c.i].pos, def: DEFS[c.i].def});
    if (SOURCE[c.i]) overlays.push({from: Math.round((c.start + 0.6) * fps), dur: Math.round(fps * 3.2), kind: 'source', label: SOURCE[c.i].label, sub: SOURCE[c.i].sub});
  });

  const cueFrom = (i: number) => Math.round((cues.find((c) => c.i === i)?.start ?? 0) * fps);
  const chapterMarks = CHAPTERS.map((ch) => ({from: cueFrom(ch.cue), num: ch.num, title: ch.title}));

  return {shots, overlays, chapters: chapterMarks};
};

const HUE: Record<string, number> = {
  'a:gc-documental': 35, 'a:gc-historia-tv-color': 35, 'a:gc-patente-noticia': 35, 'a:gc-canal5-xhgc': 300,
  'a:gc-tvunam': 35, 'a:gc-entrevista': 35, 'a:gc-canal5-1963': 300,
  'a:mexico-revolucion-1917': 25, 'a:mechanical-color-disc': 200, 'a:cbs-goldmark-1940': 280,
  'a:rca-color-tv-1950s': 210, 'a:ipn-politecnico-historia': 5, 'a:mexico-city-1930s': 30,
  'a:vintage-tv-broadcast-mx': 300, 'a:voyager-nasa-images': 220, 'a:huapango-mexicano': 340,
  'rgb-pixels-macro': 200, 'color-spectrum-prism': 280, 'engineer-workshop': 40, 'child-electronics': 40,
  'old-black-white-tv': 210, 'vintage-radio-parts': 40, 'tube-radio': 40, 'vintage-tv-workshop': 210,
  'broadcast-tower': 195, 'mexico-flag': 140, 'family-tv-vintage': 35, 'highway-mexico': 30,
  'mexican-musician': 340, 'tv-static-noise': 210, 'university-engineering': 205, 'vintage-typewriter': 45,
  'old-newspaper': 40, 'guadalajara-city': 30, 'mexico-city-skyline': 30, 'tv-test-pattern': 200,
};
export const hueFor = (base: string) => HUE[base] ?? 205;
export {hasPhoto};
