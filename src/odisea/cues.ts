// Bloque 1 -- texto real del guion (scripts/odisea-guion.md), 27 planos.
// CERO REPETICION: cada plano usa una imagen distinta (ver pools-ai.ts).
//
// durationSec de cada cue viene de alinear el texto contra el SRT real
// (whisper) de la grabacion "la_oidesea_bloque_1mejoradav2.mp3", repartiendo
// el tiempo de cada segmento del SRT proporcionalmente por palabra. La suma
// exacta de todas las duraciones = 104.56s = duracion real de la locucion.
import type {Cue} from './plan';

export const BLOQUE_1: Cue[] = [
  {text: 'Durante más de 2,000 años, la gente creyó que la Odisea era pura fantasía:', pool: 'b1-odiseo-1', durationSec: 4.445},
  {text: 'un poema sobre monstruos, dioses y un héroe que nunca existió.', pool: 'b1-mito-fresco-1', durationSec: 3.863},
  {text: 'Pero en las últimas décadas, arqueólogos han encontrado algo que cambia todo.', pool: 'b1-manos-descubrimiento-1', durationSec: 4.129},
  {text: 'Homero pudo haber basado su historia en una guerra real, en una ciudad real,', pool: 'b1-ruinas-1', durationSec: 4.421},
  {text: 'y tal vez hasta en un hombre real que sí regresó de un conflicto que la historia casi olvidó.', pool: 'b1-odiseo-2', durationSec: 5.144},
  {text: 'Hoy vamos a separar el mito de lo que realmente ocurrió:', pool: 'b1-balanza-1', durationSec: 2.655},
  {text: 'qué parte de la Odisea es pura leyenda,', pool: 'b1-mar-1', durationSec: 2.371},
  {text: 'y qué parte podría seguir enterrada bajo tierra turca, esperando a ser descubierta.', pool: 'b1-artefacto-1', durationSec: 3.922},
  {text: 'Porque la verdad detrás de este mito es casi tan extraña como el mito mismo.', pool: 'b1-silueta-1', durationSec: 4.656},
  {text: 'Pero antes de meternos en la arqueología, necesitamos entender algo fundamental.', pool: 'b1-estudio-1', durationSec: 3.387},
  {text: 'La Odisea no es un libro cualquiera.', pool: 'b1-manuscrito-1', durationSec: 1.910},
  {text: 'No es una novela que alguien escribió sentado en su escritorio.', pool: 'b1-manuscrito-2', durationSec: 2.824},
  {text: 'Es, probablemente, la historia de aventuras más antigua que sobrevive en Occidente.', pool: 'b1-ciudad-1', durationSec: 4.439},
  {
    text: 'Y durante siglos, nadie —literalmente nadie— sabía si el hombre que supuestamente la escribió siquiera existió.',
    pool: 'b1-trono-vacio-1',
    durationSec: 6.122,
  },
  {text: 'Estoy hablando de Homero.', pool: 'b1-poeta-1', durationSec: 1.248},
  {
    text: 'Un poeta ciego del que no tenemos ni una sola imagen verificada, ni una tumba confirmada,',
    pool: 'b1-tumba-vacia-1',
    durationSec: 5.160,
  },
  {
    text: 'ni un solo dato biográfico que los historiadores acepten al cien por ciento.',
    pool: 'b1-artefactos-2',
    durationSec: 3.872,
  },
  {text: 'Siete ciudades de la antigüedad se peleaban por ser su lugar de nacimiento. Siete.', pool: 'b1-mapa-siete-1', durationSec: 5.183},
  {
    text: 'Eso ya te dice algo: o Homero era tan importante que todos lo querían,',
    pool: 'b1-multitud-1',
    durationSec: 4.809,
  },
  {text: 'o era tan misterioso que nadie realmente sabía quién era.', pool: 'b1-encapuchado-1', durationSec: 2.541},
  {text: 'Y eso nos lleva a la primera gran pregunta:', pool: 'b1-vela-1', durationSec: 2.465},
  {
    text: 'si ni siquiera podemos confirmar quién escribió la Odisea... ¿cómo vamos a saber si lo que cuenta es verdad?',
    pool: 'b1-balanza-2',
    durationSec: 6.140,
  },
  {text: 'Bueno, ahí es donde la cosa se pone interesante.', pool: 'b1-amanecer-excavacion-1', durationSec: 2.605},
  {
    text: 'Porque resulta que la respuesta no está en los libros de literatura. Está bajo tierra.',
    pool: 'b1-pico-tierra-1',
    durationSec: 5.098,
  },
  {text: 'Pero para entender lo que los arqueólogos encontraron,', pool: 'b1-manos-tablilla-1', durationSec: 2.585},
  {
    text: 'primero tenemos que hablar de un hombre obsesionado que gastó toda su fortuna persiguiendo un mito.',
    pool: 'b1-obsesionado-1',
    durationSec: 5.046,
  },
  {text: 'Y lo que descubrió sacudió el mundo académico para siempre.', pool: 'b1-montana-atardecer-1', durationSec: 3.520},
];
