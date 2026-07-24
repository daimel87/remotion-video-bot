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

// ---- Capítulos (arco narrativo) ----
const CHAPTERS = [
  {num: 1, cue: 12, title: 'Guadalajara, 1917'},
  {num: 2, cue: 15, title: 'El niño que lo desarmaba todo'},
  {num: 3, cue: 22, title: 'La obsesión del color'},
  {num: 4, cue: 31, title: 'El disco giratorio'},
  {num: 5, cue: 36, title: 'La patente'},
  {num: 6, cue: 46, title: 'La misma luz'},
  {num: 7, cue: 58, title: 'El olvido'},
  {num: 8, cue: 74, title: 'XHGC'},
  {num: 9, cue: 85, title: 'El último golpe'},
  {num: 10, cue: 95, title: 'La verdad documentada'},
];

// ============================================================
// STORYBOARD — cada cue -> lista de planos cortos.
// Token: 'a:ID@S' archivo (inicio fijo S) · 'v:base' video · 'img:base-n' foto
//        'base' fotos de la base · 'c:comp' componente motion-graphic.
// sc: corte de estática de TV al entrar. w: peso (reparto del cue).
// ============================================================
type SB = {t: string; m?: Motion; w?: number; sc?: boolean};

// abreviaturas de retrato de GGC (documental animado) — SIEMPRE muestran a GGC
const GGC_CATEDRAL = 'a:gc-historia-tv-color@18';   // GGC joven + catedral de Guadalajara
const GGC_CARA = 'a:gc-historia-tv-color@62';        // primer plano de su cara
const GGC_TV = 'a:gc-historia-tv-color@66';          // GGC dentro de una TV
const GGC_PENSANDO = 'a:gc-historia-tv-color@74';    // GGC pensando (se desvanece)
const GGC_LAB = 'a:gc-patente-noticia@98';           // GGC en su laboratorio con aparatos
const GGC_APARATOS = 'a:gc-documental@33';           // aparatos/herramientas animados (invención)

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

  // ---------- CAP II: la niñez ----------
  // 14 "Camarena se mudó a la Ciudad de México y desde muy chico Guillermo..." -> CDMX época + GGC
  14: [{t: 'a:mexico-city-1930s@50', m: 'panRight'}, {t: GGC_CATEDRAL, m: 'zoomIn'}],
  // 15 "niño que vuelve locos a sus padres, el que desarmó todo en la casa"
  15: [{t: 'vintage-radio-parts', m: 'punchIn'}, {t: 'tube-radio', m: 'zoomIn'}],
  // 16 "ver cómo funciona por dentro. él lo entendía"
  16: [{t: 'v:engineer-workshop', m: 'zoomIn'}, {t: 'vintage-radio-parts', m: 'panLeft'}],
  // 17 "construía sus propios juguetes eléctricos, armaba radios con piezas sueltas"
  17: [{t: 'tube-radio', m: 'punchIn'}, {t: 'v:engineer-workshop', m: 'zoomIn'}],
  // 18 "con lo que encontraba... No había dinero para comprar aparatos caros"
  18: [{t: 'vintage-radio-parts', m: 'zoomIn'}, {t: 'tube-radio', m: 'panRight'}],
  // 19 "Si no puedes comprarlo, constrúyelo tú mismo" -> FULLTEXT
  19: [{t: 'v:engineer-workshop', m: 'zoomIn'}],
  // 20 "Entró a la escuela de ingeniería del Politécnico" -> IPN
  20: [{t: 'a:ipn-politecnico-historia@5', m: 'zoomIn'}, {t: 'university-engineering', m: 'panRight'}],
  // 21 "mientras otros soñaban con cosas normales, Guillermo estaba obsesionado con" -> GGC
  21: [{t: GGC_CARA, m: 'zoomIn'}, {t: GGC_PENSANDO, m: 'punchIn'}],

  // ---------- CAP III: la obsesión del color ----------
  // 22 "una tecnología casi ciencia ficción: la televisión"
  22: [{t: 'old-black-white-tv', m: 'zoomIn'}, {t: 'v:vintage-tv-workshop', m: 'panRight'}],
  // 23 "todo el mundo veía en blanco y negro"
  23: [{t: 'old-black-white-tv', m: 'punchIn'}, {t: 'v:vintage-tv-workshop', m: 'zoomIn'}],
  // 24 "eso le parecía incompleto... él quería color" -> B/N a color
  24: [{t: 'old-black-white-tv', m: 'zoomIn'}, {t: 'v:color-spectrum-prism', m: 'punchIn'}],
  // 25 "en los años 30 la televisión apenas existía, era un experimento"
  25: [{t: 'a:mechanical-color-disc@38', m: 'zoomIn'}, {t: 'a:mechanical-color-disc@26', m: 'panRight'}],
  // 26 "un truco de laboratorio, y este muchacho en México..." -> GGC laboratorio
  26: [{t: GGC_LAB, m: 'zoomIn'}],
  // 27 "no quería copiar la televisión de los gringos o los ingleses" -> RCA (potencias)
  27: [{t: 'a:rca-color-tv-1950s@2', m: 'panRight'}, {t: 'a:rca-color-tv-1950s@26', m: 'zoomIn'}],
  // 28 "dar el siguiente salto que ni ellos habían dado. tuvo la idea" -> GGC
  28: [{t: GGC_CARA, m: 'zoomIn'}, {t: GGC_APARATOS, m: 'punchIn'}],
  // 29 "el sistema tricromático secuencial de campos" -> DEFINICIÓN + disco RGB
  29: [{t: 'a:cbs-goldmark-1940@2', m: 'zoomIn'}],
  // 30 "González Camarena entendió que..." -> GGC + disco
  30: [{t: GGC_CARA, m: 'zoomIn'}, {t: 'c:colorwheel'}],

  // ---------- CAP IV: el disco giratorio ----------
  // 31 "todos los colores se forman con tres: rojo, verde y azul" -> ColorWheel
  31: [{t: 'c:colorwheel'}],
  // 32 "diseñó un disco giratorio con filtros de esos tres colores" -> disco real + diagrama
  32: [{t: 'a:cbs-goldmark-1940@2', m: 'zoomIn'}, {t: 'c:colorwheel'}],
  // 33 "giraba frente a una cámara de blanco y negro, otro disco sincronizado"
  33: [{t: 'a:mechanical-color-disc@26', m: 'zoomIn'}, {t: 'a:mechanical-color-disc@38', m: 'panRight'}],
  // 34 "dentro del televisor. El ojo humano engañado juntaba los tres colores"
  34: [{t: 'a:mechanical-color-disc@38', m: 'zoomIn'}, {t: 'v:rgb-pixels-macro', m: 'punchIn'}],
  // 35 "la imagen completa a todo color. ingenioso, barato y mexicano"
  35: [{t: 'a:cbs-goldmark-1940@2', m: 'zoomIn'}, {t: 'v:color-spectrum-prism', m: 'panRight'}],

  // ---------- CAP V: la patente ----------
  // 36 "la fecha que casi nadie conoce: el 19 de agosto de 1940" -> DateStamp 1940
  36: [{t: 'a:mechanical-color-disc@88', m: 'zoomIn'}],  // dibujos de patente
  // 37 "le otorgó la patente oficial de su sistema" -> PatentTeaser
  37: [{t: 'c:patent'}],
  // 38 "Guillermo González Camarena tenía 23 años" -> GGC + StatBox 23
  38: [{t: GGC_CARA, m: 'zoomIn'}],
  // 39 "mientras el mundo se incendiaba en la Segunda Guerra Mundial"
  39: [{t: 'a:rca-color-tv-1950s@2', m: 'panRight'}, {t: 'old-black-white-tv', m: 'zoomIn'}],
  // 40 "un joven mexicano de 23 años en su taller había patentado" -> GGC laboratorio
  40: [{t: GGC_LAB, m: 'zoomIn'}],
  // 41 "al año siguiente solicitó la patente en Estados Unidos" -> PatentTeaser
  41: [{t: 'c:patent'}],
  // 42 "el 15 de septiembre de 1942 se la concedió. la patente número" -> DateStamp 1942 + patente
  42: [{t: 'c:patent-full'}],
  // 43 "2,296,019, adaptador cromoscópico. registrada con su nombre" -> patente REVELADA
  43: [{t: 'c:patent-full'}],
  // 44 "en las oficinas de patentes del país más poderoso"
  44: [{t: 'c:patent-full'}],
  // 45 "Guillermo no fue el único que pensó en esto" -> GGC
  45: [{t: GGC_CARA, m: 'zoomIn'}],

  // ---------- CAP VI: la misma luz ----------
  // 46 "un ingeniero de CBS llamado Peter Goldmark" -> name Goldmark + disco
  46: [{t: 'a:cbs-goldmark-1940@2', m: 'zoomIn'}, {t: 'a:mechanical-color-disc@26', m: 'panRight'}],
  // 47 "trabajaba en un sistema parecido, también con discos giratorios"
  47: [{t: 'a:mechanical-color-disc@38', m: 'zoomIn'}, {t: 'c:colorwheel'}],
  // 48 "dos países persiguiendo la misma luz al mismo tiempo"
  48: [{t: 'a:cbs-goldmark-1940@2', m: 'zoomIn'}, {t: 'v:color-spectrum-prism', m: 'punchIn'}],
  // 49 "a González Camarena. Goldmark tenía una corporación gigante" -> GGC vs RCA
  49: [{t: GGC_CARA, m: 'zoomIn'}, {t: 'a:rca-color-tv-1950s@2', m: 'panRight'}],
  // 50 "Guillermo tenía su talento, su terquedad y un país pobre" -> GGC
  50: [{t: GGC_LAB, m: 'zoomIn'}],
  // 51 "aún así llegó ahí, en paralelo, un mexicano casi solo" -> GGC
  51: [{t: GGC_CARA, m: 'zoomIn'}, {t: GGC_APARATOS, m: 'punchIn'}],
  // 52 "los periódicos de la época lo notaron" -> NewspaperCard
  52: [{t: GGC_LAB, m: 'zoomIn'}],
  // 53 "diarios como El Universal reseñaron a este joven inventor mexicano" -> Newspaper + GGC
  53: [{t: GGC_CARA, m: 'zoomIn'}],
  // 54 "haciendo algo imposible. México volvió a verlo" -> México
  54: [{t: 'mexico-flag', m: 'panRight'}, {t: GGC_CATEDRAL, m: 'zoomIn'}],
  // 55 "el 31 de agosto de 1946 hizo sus primeras transmisiones experimentales" -> DateStamp 1946
  55: [{t: GGC_LAB, m: 'zoomIn'}],
  // 56 "desde su laboratorio en la calle de Lucerna, en Ciudad de México"
  56: [{t: GGC_LAB, m: 'panRight'}, {t: 'a:mexico-city-1930s@70', m: 'zoomIn'}],
  // 57 "con sus aparatos hechos por él. justo cuando debería premiarlo"
  57: [{t: GGC_APARATOS, m: 'zoomIn'}, {t: GGC_LAB, m: 'punchIn'}],

  // ---------- CAP VII: el olvido ----------
  // 58 "empieza a torcerse. inventar primero no es quedarse con la gloria"
  58: [{t: GGC_PENSANDO, m: 'zoomIn'}],
  // 59 "la gloria se la lleva el que tiene más dinero. Guillermo trabajaba con lo que tenía"
  59: [{t: 'a:rca-color-tv-1950s@26', m: 'panRight'}, {t: GGC_LAB, m: 'zoomIn'}],
  // 60 "corporaciones como RCA invertían millones" -> RCA + name
  60: [{t: 'a:rca-color-tv-1950s@2', m: 'zoomIn'}, {t: 'a:rca-color-tv-1950s@26', m: 'panRight'}],
  // 61 "empezaba la guerra fría, la tecnología campo de batalla"
  61: [{t: 'a:rca-color-tv-1950s@26', m: 'zoomIn'}, {t: 'a:rca-color-tv-1950s@58', m: 'panRight'}],
  // 62 "la industria mundial no adoptó el sistema"
  62: [{t: 'a:mechanical-color-disc@26', m: 'zoomIn'}, {t: 'a:rca-color-tv-1950s@2', m: 'panRight'}],
  // 63 "de discos giratorios. se fue por otro camino, el de las grandes empresas"
  63: [{t: 'c:colorwheel'}, {t: 'a:rca-color-tv-1950s@58', m: 'zoomIn'}],
  // 64 "estadounidenses, el estándar comercial. y así poco a poco"
  64: [{t: 'a:rca-color-tv-1950s@58', m: 'zoomIn'}, {t: 'a:rca-color-tv-1950s@26', m: 'panRight'}],
  // 65 "el nombre del muchacho de Guadalajara se fue borrando" -> GGC se desvanece
  65: [{t: GGC_PENSANDO, m: 'zoomIn'}],
  // 66 "una historia escrita en inglés en los países ricos"
  66: [{t: 'a:rca-color-tv-1950s@58', m: 'zoomIn'}],
  // 67 "Pero Guillermo nunca fue por el dinero" -> GGC
  67: [{t: GGC_CARA, m: 'zoomIn'}],
  // 68 "un héroe de verdad. siguió inventando" -> GGC inventando
  68: [{t: GGC_APARATOS, m: 'zoomIn'}, {t: GGC_LAB, m: 'punchIn'}],
  // 69 "diseñó televisores baratos para un país pobre"
  69: [{t: 'old-black-white-tv', m: 'zoomIn'}, {t: 'v:vintage-tv-workshop', m: 'panRight'}],
  // 70 "soñaba con llevar la educación por televisión a México"
  70: [{t: 'v:family-tv-vintage', m: 'zoomIn'}, {t: 'family-tv-vintage', m: 'panRight'}],
  // 71 "a las escuelas rurales, a los niños"
  71: [{t: 'family-tv-vintage', m: 'zoomIn'}, {t: 'v:family-tv-vintage', m: 'punchIn'}],
  // 72 "era músico, compuso un huapango" -> mariachi
  72: [{t: 'a:huapango-mexicano@15', m: 'panRight'}, {t: 'mexican-musician', m: 'zoomIn'}],
  // 73 "llamado Río Colorado. veía el mundo en colores" -> mariachi + color
  73: [{t: 'a:huapango-mexicano@40', m: 'zoomIn'}, {t: 'v:color-spectrum-prism', m: 'punchIn'}],

  // ---------- CAP VIII: XHGC ----------
  // 74 "por fin llegó su gran día, su desquite contra el olvido" -> GGC
  74: [{t: GGC_CARA, m: 'zoomIn'}, {t: GGC_TV, m: 'punchIn'}],
  // 75 "el 21 de enero de 1963, a través del Canal 5" -> Canal 5 + DateStamp 1963
  75: [{t: 'a:gc-canal5-xhgc@2', m: 'zoomIn'}],
  // 76 "primera transmisión a color de México. paraíso infantil"
  76: [{t: 'a:cbs-goldmark-1940@2', m: 'zoomIn'}, {t: 'a:vintage-tv-broadcast-mx@30', m: 'panRight'}],
  // 77 "México se convirtió en el cuarto país del mundo" -> StatBox 4°
  77: [{t: 'mexico-flag', m: 'zoomIn'}],
  // 78 "en emitir a color, solo después de EEUU"
  78: [{t: 'a:vintage-tv-broadcast-mx@2', m: 'panRight'}, {t: 'mexico-flag', m: 'zoomIn'}],
  // 79 "Japón y Canadá. cuarto lugar en el planeta" -> StatBox
  79: [{t: 'mexico-flag', m: 'zoomIn'}],
  // 80 "¿y sabes cómo se llama ese canal hasta hoy?" -> Canal 5
  80: [{t: 'a:gc-canal5-xhgc@2', m: 'zoomIn'}],
  // 81 "Canal 5 lleva las siglas XHGC: González Camarena, sus iniciales" -> emblema XHGC + name
  81: [{t: 'a:gc-canal5-xhgc@70', m: 'zoomIn'}],
  // 82 "en el aire de la televisión mexicana"
  82: [{t: 'a:vintage-tv-broadcast-mx@60', m: 'panRight'}, {t: 'a:gc-canal5-xhgc@70', m: 'zoomIn'}],
  // 83 "sin saberlo pronuncia su nombre. el destino le había robado el crédito"
  83: [{t: GGC_CARA, m: 'zoomIn'}],
  // 84 "todavía le tenía guardado un último golpe, el más cruel" -> tensión
  84: [{t: GGC_PENSANDO, m: 'zoomIn'}],

  // ---------- CAP IX: el último golpe ----------
  // 85 "el 18 de abril de 1965, Guillermo González Camarena regresaba" -> GGC + carretera + 1965
  85: [{t: GGC_CARA, m: 'zoomIn'}, {t: 'v:highway-mexico', m: 'panRight'}],
  // 86 "por la carretera entre México y Veracruz. un accidente"
  86: [{t: 'v:highway-mexico', m: 'zoomIn'}, {t: 'highway-mexico', m: 'punchIn'}],
  // 87 "murió. tenía apenas 48 años" -> StatBox 48
  87: [{t: 'highway-mexico', m: 'zoomIn'}],
  // 88 "todavía inventando, soñando con el color y la educación" -> GGC
  88: [{t: GGC_APARATOS, m: 'zoomIn'}, {t: GGC_LAB, m: 'punchIn'}],
  // 89 "Se apagó de golpe como una pantalla a la que le cortan la señal" -> SCREEN OFF
  89: [{t: 'c:screenoff'}],

  // ---------- CAP X: la verdad documentada ----------
  // 90 "una leyenda: que la NASA usó su sistema para el Voyager" -> sonda Voyager
  90: [{t: 'a:voyager-nasa-images@20', m: 'zoomIn'}],
  // 91 "las primeras imágenes del espacio desde las sondas Voyager"
  91: [{t: 'a:voyager-nasa-images@55', m: 'zoomIn'}, {t: 'a:voyager-nasa-images@20', m: 'panRight'}],
  // 92 "y la vas a escuchar por todas partes. pero voy a ser honesto"
  92: [{t: 'a:voyager-nasa-images@55', m: 'zoomIn'}],
  // 93 "mereces la verdad. esa parte no está del todo comprobada"
  93: [{t: 'a:voyager-nasa-images@20', m: 'zoomIn'}],
  // 94 "es probable que se exageró. ¿y sabes qué? no hace falta"
  94: [{t: GGC_CARA, m: 'zoomIn'}],
  // 95 "lo que sí es cierto, lo que sí está firmado y documentado" -> PatentTeaser revelado
  95: [{t: 'c:patent-full'}],
  // 96 "un joven mexicano de 23 años patentó" -> GGC + StatBox 23
  96: [{t: GGC_CARA, m: 'zoomIn'}],
  // 97 "un sistema de televisión a color en 1940, con los gigantes"
  97: [{t: 'c:patent-full'}],
  // 98 "con una fracción de recursos, cuarto país en ver a todo color" -> StatBox
  98: [{t: 'v:color-spectrum-prism', m: 'zoomIn'}, {t: 'mexico-flag', m: 'panRight'}],
  // 99 "¿eso no es leyenda? es historia. ¿por qué nadie lo conoce?" -> GGC
  99: [{t: GGC_CARA, m: 'zoomIn'}, {t: GGC_PENSANDO, m: 'punchIn'}],
  // 100 "la historia no la escriben los que llegan primero"
  100: [{t: 'a:rca-color-tv-1950s@58', m: 'zoomIn'}],
  // 101 "la escriben los que tienen el poder. no estuvo en México"
  101: [{t: 'a:rca-color-tv-1950s@2', m: 'panRight'}, {t: 'mexico-flag', m: 'zoomIn'}],
  // 102 "estuvo en las corporaciones, los países ricos, otro idioma"
  102: [{t: 'a:rca-color-tv-1950s@58', m: 'zoomIn'}, {t: 'a:rca-color-tv-1950s@26', m: 'panRight'}],
  // 103 "que decidieron que el color lo inventaron ellos"
  103: [{t: 'a:rca-color-tv-1950s@26', m: 'zoomIn'}],
  // 104 "González Camarena fue borrado porque era de aquí" -> GGC + México
  104: [{t: GGC_CARA, m: 'zoomIn'}, {t: 'mexico-flag', m: 'panRight'}],
  // 105 "porque era de nuestro país"
  105: [{t: 'mexico-flag', m: 'zoomIn'}, {t: 'a:mexico-city-1930s@70', m: 'panRight'}],
  // 106 "les toca el papel de espectadores. solo si lo permitimos"
  106: [{t: GGC_CARA, m: 'zoomIn'}],
  // 107 "si dejamos que su nombre se apague. la próxima vez que enciendas tu TV"
  107: [{t: 'v:tv-static-noise', m: 'zoomIn'}, {t: 'old-black-white-tv', m: 'punchIn'}],
  // 108 "tu celular, cualquier pantalla, ese rojo verde azul, acuérdate de él" -> RGB
  108: [{t: 'v:rgb-pixels-macro', m: 'punchIn'}, {t: 'v:color-spectrum-prism', m: 'zoomIn'}],
  // 109 "acuérdate del muchacho de Guadalajara que desarmaba radios" -> GGC + radios
  109: [{t: GGC_CATEDRAL, m: 'zoomIn'}, {t: 'vintage-radio-parts', m: 'panRight'}],
  // 110 "que armaba sus aparatos porque no tenía para comprarlos, a los 23 años" -> GGC
  110: [{t: GGC_LAB, m: 'zoomIn'}],
  // 111 "a soñar en color cuando el mundo veía en blanco y negro. Guillermo González" -> GGC
  111: [{t: 'old-black-white-tv', m: 'zoomIn'}, {t: GGC_CARA, m: 'punchIn'}],
  // 112 "Camarena. el mundo se olvidó de él. México no tiene por qué" -> GGC + México
  112: [{t: GGC_CARA, m: 'zoomIn'}, {t: 'mexico-flag', m: 'panRight'}],
  // 113 "compártela. suscríbete a Crónicas Ilustradas" -> name
  113: [{t: GGC_CATEDRAL, m: 'zoomIn'}],
  // 114 "cada semana rescatamos una historia que merecías conocer" -> cierre
  114: [{t: GGC_CARA, m: 'zoomIn'}, {t: GGC_TV, m: 'punchIn'}],
};

// ---- Ventanas verificadas por clip (para el avance interno del archivo) ----
const WINDOWS: Record<string, [number, number][]> = {
  'gc-documental': [[13, 16], [18, 21], [32, 43], [96, 100]],
  'gc-historia-tv-color': [[18, 21], [62, 65], [66, 72], [74, 76]],
  'gc-patente-noticia': [[18, 21], [62, 65], [96, 100]],
  'mexico-revolucion-1917': [[1, 7], [9, 15]],
  'mechanical-color-disc': [[26, 31], [38, 44.5], [88, 91]],
  'cbs-goldmark-1940': [[1, 4.5]],
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
        const cand = resolveToken(p.t, pickVariant);
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

    // ---- Overlays ----
    if (chapterByCue.has(c.i)) {
      const ch = chapterByCue.get(c.i)!;
      overlays.push({from, dur: Math.round(fps * 2.6), delay: 0.5, kind: 'chapter', num: ch.num, text: ch.title});
    }
    if (c.i === 9) overlays.push({from, dur: Math.round(fps * 4.2), delay: TEXT_NUDGE, kind: 'title', pre: 'la historia de', text: 'Guillermo González Camarena'});
    if (FULLTEXT[c.i]) overlays.push({from, dur: Math.min(dur, Math.round(fps * 3.6)), delay: TEXT_NUDGE, kind: 'fulltext', text: FULLTEXT[c.i].text, accent: FULLTEXT[c.i].accent});
    if (STATS[c.i]) overlays.push({from, dur: Math.round(fps * 3.0), delay: 0.6, kind: 'stat', stat: STATS[c.i]});
    if (DATES[c.i]) overlays.push({from, dur: Math.round(fps * 2.4), delay: 0.4, kind: 'date', text: DATES[c.i]});
    if (NEWSPAPER[c.i]) overlays.push({from, dur: Math.round(fps * 3.8), delay: 0.4, kind: 'newspaper', headline: NEWSPAPER[c.i].headline, dek: NEWSPAPER[c.i].dek});
    if (NAMES[c.i]) overlays.push({from, dur: Math.round(fps * 3.0), delay: NAMES[c.i].delay ?? 0.4, kind: 'name', name: NAMES[c.i].name, role: NAMES[c.i].role});
    if (DEFS[c.i]) overlays.push({from, dur: Math.round(fps * 3.6), delay: DEFS[c.i].delay ?? 0.5, kind: 'definition', term: DEFS[c.i].term, pos: DEFS[c.i].pos, def: DEFS[c.i].def});
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
