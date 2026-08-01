// Bloque 3 -- monstruos/ciencia + tradicion oral + ruta real (version
// condensada del guion, fusiona los bloques 3+4+5 originales).
// 20 planos alineados 1:1 con los 20 segmentos del SRT real de la locucion
// (bloque_3mejoradav2.mp3). El TEXTO de cada plano son las palabras exactas
// que se oyen en su ventana de tiempo (tomadas del SRT, con
// ortografia/puntuacion corregida) para que subtitulo y voz coincidan al
// 100%. durationSec = duracion exacta de cada segmento; suma = 111.20s.
//
// CERO REPETICION: cada plano usa una imagen distinta (b3-01..b3-37, de las
// cuales 4 -- 16, 18, 25, 29 -- quedan fuera por tener un marco decorativo
// pintado dentro de la imagen). Se usan 20 de las 33 utilizables.
import type {Cue} from './plan';

export const BLOQUE_3: Cue[] = [
  {text: 'La Odisea arranca donde termina la Ilíada. Troya ha caído, los griegos ganaron, pero el', pool: 'b3-01', durationSec: 5.66},
  {text: 'regreso a casa de Odiseo, rey de Ítaca, le tomó diez años. Diez años que suenan a pura', pool: 'b3-03', durationSec: 5.66},
  {text: 'fantasía. Un cíclope que devora hombres, una hechicera que convierte marineros en cerdos,', pool: 'b3-04', durationSec: 6.34},
  {text: 'sirenas que enloquecen con su canto y un remolino que traga barcos enteros. Pero cuando los', pool: 'b3-06', durationSec: 4.94},
  {text: 'investigadores analizaron estos monstruos con ojos de científicos, algo empezó a encajar.', pool: 'b3-28', durationSec: 4.80},
  {text: 'Escila y Caribdis coinciden con el estrecho de Mesina, donde hoy existen remolinos reales. Los', pool: 'b3-07', durationSec: 6.119},
  {text: 'lotófagos podrían describir los efectos de una planta psicoactiva real, y el cíclope,', pool: 'b3-09', durationSec: 5.241},
  {text: 'Polifemo, podría ser un cráneo de elefante enano extinto, con esa cavidad nasal enorme que parecía', pool: 'b3-11', durationSec: 6.199},
  {text: 'un solo ojo gigante. Pero lo que realmente sorprendió a los expertos fue la ruta. En 2008, dos investigadores', pool: 'b3-12', durationSec: 5.681},
  {text: 'usaron astronomía para fechar un eclipse que Homero describe el día que Odiseo regresa a Ítaca.', pool: 'b3-13', durationSec: 6.08},
  {text: 'Encontraron que un eclipse de sol fue visible desde las islas Jónicas el 16 de abril de 1178', pool: 'b3-14', durationSec: 5.68},
  {text: 'antes de Cristo, y las posiciones de los dos planetas que menciona el poema coinciden con ese', pool: 'b3-31', durationSec: 5.00},
  {text: 'período real. Las descripciones geográficas encajan de forma inquietante. La isla de los', pool: 'b3-15', durationSec: 5.28},
  {text: 'Feacios se asocia con Corfú, la isla de Eolo, con las islas Eolias, al norte de Sicilia,', pool: 'b3-34', durationSec: 5.72},
  {text: 'y la tierra de los gigantes Lestrigones, con un puerto real en Cerdeña o Córcega. Esto solo', pool: 'b3-17', durationSec: 5.68},
  {text: 'pudo sobrevivir gracias a la tradición oral griega, un sistema profesional de memoria. Los aedos', pool: 'b3-20', durationSec: 6.08},
  {text: 'memorizaban miles de versos con fórmulas rítmicas que actuaban como anclas. Entre la guerra de Troya', pool: 'b3-21', durationSec: 5.48},
  {text: 'y el momento en que la Odisea se escribió, pasaron cuatrocientos años de historias contadas de boca en boca,', pool: 'b3-24', durationSec: 5.72},
  {text: 'y aún así el núcleo se mantuvo. Pero hay un lugar que los investigadores no han podido resolver,', pool: 'b3-32', durationSec: 5.399},
  {text: 'Ítaca misma, la isla de Odiseo, y la razón es casi un chiste.', pool: 'b3-36', durationSec: 4.441},
];
