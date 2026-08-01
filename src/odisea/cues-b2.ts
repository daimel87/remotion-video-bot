// Bloque 2 -- Schliemann y Troya (guion scripts/odisea-guion.md).
// 27 planos alineados 1:1 con los 27 segmentos del SRT real de la locucion
// (odisea_bloque_2mejoradav2.mp3). El TEXTO de cada plano son las palabras
// exactas que se oyen en su ventana de tiempo (tomadas del SRT, con
// ortografia/puntuacion corregida) para que subtitulo y voz coincidan al
// 100%. durationSec = duracion exacta de cada segmento; suma = 141.12s.
//
// CERO REPETICION: cada plano usa una imagen distinta (b2-01..b2-38). Se
// usan 27 de las 38; las 11 restantes quedan de margen.
import type {Cue} from './plan';

export const BLOQUE_2: Cue[] = [
  {text: 'En 1868, un empresario alemán llamado Heinrich Schliemann hizo algo que los académicos consideraban', pool: 'b2-01', durationSec: 7.12},
  {text: 'ridículo. Decidió que la Ilíada, la precuela de la Odisea, no era ficción. Decidió que', pool: 'b2-03', durationSec: 6.02},
  {text: 'Troya era real y decidió encontrarla. Hay que entender el contexto. En esa época,', pool: 'b2-04', durationSec: 5.18},
  {text: 'la mayoría de los académicos trataban a Homero como tratamos hoy a Tolkien. Sí, una historia', pool: 'b2-02', durationSec: 5.36},
  {text: 'brillante pero inventada. Nadie en su sano juicio tomaba un mapa y decía: voy a buscar', pool: 'b2-05', durationSec: 4.84},
  {text: 'a Mordor. Pues Schliemann hizo exactamente eso con Troya. Viajó al noroeste de Turquía,', pool: 'b2-07', durationSec: 5.60},
  {text: 'a una colina llamada Hisarlik, y empezó a excavar. Y lo que encontró cambió la historia', pool: 'b2-09', durationSec: 4.80},
  {text: 'para siempre. Debajo de esa colina había no una, sino nueve ciudades apiladas una', pool: 'b2-10', durationSec: 5.84},
  {text: 'encima de otra, construidas a lo largo de miles de años. Capas y capas de civilización.', pool: 'b2-08', durationSec: 5.84},
  {text: 'Y una de esas capas, la que los arqueólogos llaman Troya VIIa, mostraba señales', pool: 'b2-29', durationSec: 5.24},
  {text: 'inconfundibles de destrucción violenta: muros derrumbados, puntas de flecha incrustadas', pool: 'b2-11', durationSec: 5.04},
  {text: 'en las murallas, esqueletos sin enterrar, cenizas. Alguien había atacado esa ciudad.', pool: 'b2-12', durationSec: 5.16},
  {text: 'Y la fecha coincidía: alrededor del 1180 a.C., justo en el periodo que los griegos asociaban', pool: 'b2-14', durationSec: 6.04},
  {text: 'con la Guerra de Troya. Schliemann no era perfecto. De hecho, era problemático. Dinamitó', pool: 'b2-34', durationSec: 5.48},
  {text: 'capas arqueológicas enteras buscando tesoros, destruyó evidencia invaluable y probablemente', pool: 'b2-37', durationSec: 5.20},
  {text: 'mintió sobre varios de sus hallazgos. Pero el punto central era innegable: había una', pool: 'b2-36', durationSec: 4.68},
  {text: 'ciudad real, en el lugar exacto que Homero describía, que había sido destruida por', pool: 'b2-17', durationSec: 4.76},
  {text: 'una guerra real. Y eso abrió una puerta enorme. Porque si la Ilíada, la historia de la guerra,', pool: 'b2-18', durationSec: 5.80},
  {text: 'tenía una base real... ¿qué pasaba con la Odisea, la historia del viaje de regreso?', pool: 'b2-19', durationSec: 5.20},
  {text: 'Esa pregunta parecía imposible de responder. Porque la Odisea, a diferencia de la Ilíada,', pool: 'b2-20', durationSec: 5.08},
  {text: 'no ocurre en un solo lugar. Es un viaje. Un viaje por mares, islas y costas que nadie', pool: 'b2-22', durationSec: 5.46},
  {text: 'ha podido ubicar con certeza en más de dos milenios. Pero resulta que hay una teoría', pool: 'b2-27', durationSec: 4.38},
  {text: 'que lleva décadas ganando fuerza entre geógrafos y marineros. Y si es correcta, significa que', pool: 'b2-21', durationSec: 5.28},
  {text: 'Homero no estaba inventando nada: estaba describiendo una ruta de navegación real. Pero antes de', pool: 'b2-26', durationSec: 5.48},
  {text: 'llegar ahí, necesitamos entender qué cuenta exactamente la Odisea. Porque la mayoría de', pool: 'b2-38', durationSec: 5.20},
  {text: 'la gente solo conoce la versión simplificada. Y la historia real es mucho más oscura y', pool: 'b2-24', durationSec: 5.00},
  {text: 'extraña de lo que te contaron en la escuela.', pool: 'b2-13', durationSec: 2.04},
];
