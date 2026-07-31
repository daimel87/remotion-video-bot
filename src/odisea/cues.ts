// Bloque 1 -- texto real del guion (scripts/odisea-guion.md), cortado en
// ~27 planos de ~5s cada uno. CERO REPETICION: cada plano usa una imagen
// distinta (ver pools-ai.ts) -- no se reutiliza ninguna en todo el bloque.
import type {Cue} from './plan';

export const BLOQUE_1: Cue[] = [
  {text: 'Durante más de 2,000 años, la gente creyó que la Odisea era pura fantasía:', pool: 'b1-odiseo-1'},
  {text: 'un poema sobre monstruos, dioses y un héroe que nunca existió.', pool: 'b1-mito-fresco-1'},
  {text: 'Pero en las últimas décadas, arqueólogos han encontrado algo que cambia todo.', pool: 'b1-manos-descubrimiento-1'},
  {text: 'Homero pudo haber basado su historia en una guerra real, en una ciudad real,', pool: 'b1-ruinas-1'},
  {text: 'y tal vez hasta en un hombre real que sí regresó de un conflicto que la historia casi olvidó.', pool: 'b1-odiseo-2'},
  {text: 'Hoy vamos a separar el mito de lo que realmente ocurrió:', pool: 'b1-balanza-1'},
  {text: 'qué parte de la Odisea es pura leyenda,', pool: 'b1-mar-1'},
  {text: 'y qué parte podría seguir enterrada bajo tierra turca, esperando a ser descubierta.', pool: 'b1-artefacto-1'},
  {text: 'Porque la verdad detrás de este mito es casi tan extraña como el mito mismo.', pool: 'b1-silueta-1'},
  {text: 'Pero antes de meternos en la arqueología, necesitamos entender algo fundamental.', pool: 'b1-estudio-1'},
  {text: 'La Odisea no es un libro cualquiera.', pool: 'b1-manuscrito-1'},
  {text: 'No es una novela que alguien escribió sentado en su escritorio.', pool: 'b1-manuscrito-2'},
  {text: 'Es, probablemente, la historia de aventuras más antigua que sobrevive en Occidente.', pool: 'b1-ciudad-1'},
  {
    text: 'Y durante siglos, nadie —literalmente nadie— sabía si el hombre que supuestamente la escribió siquiera existió.',
    pool: 'b1-trono-vacio-1',
  },
  {text: 'Estoy hablando de Homero.', pool: 'b1-poeta-1'},
  {
    text: 'Un poeta ciego del que no tenemos ni una sola imagen verificada, ni una tumba confirmada,',
    pool: 'b1-tumba-vacia-1',
  },
  {
    text: 'ni un solo dato biográfico que los historiadores acepten al cien por ciento.',
    pool: 'b1-artefactos-2',
  },
  {text: 'Siete ciudades de la antigüedad se peleaban por ser su lugar de nacimiento. Siete.', pool: 'b1-mapa-siete-1'},
  {
    text: 'Eso ya te dice algo: o Homero era tan importante que todos lo querían,',
    pool: 'b1-multitud-1',
  },
  {text: 'o era tan misterioso que nadie realmente sabía quién era.', pool: 'b1-encapuchado-1'},
  {text: 'Y eso nos lleva a la primera gran pregunta:', pool: 'b1-vela-1'},
  {
    text: 'si ni siquiera podemos confirmar quién escribió la Odisea... ¿cómo vamos a saber si lo que cuenta es verdad?',
    pool: 'b1-balanza-2',
  },
  {text: 'Bueno, ahí es donde la cosa se pone interesante.', pool: 'b1-amanecer-excavacion-1'},
  {
    text: 'Porque resulta que la respuesta no está en los libros de literatura. Está bajo tierra.',
    pool: 'b1-pico-tierra-1',
  },
  {text: 'Pero para entender lo que los arqueólogos encontraron,', pool: 'b1-manos-tablilla-1'},
  {
    text: 'primero tenemos que hablar de un hombre obsesionado que gastó toda su fortuna persiguiendo un mito.',
    pool: 'b1-obsesionado-1',
  },
  {text: 'Y lo que descubrió sacudió el mundo académico para siempre.', pool: 'b1-montana-atardecer-1'},
];
