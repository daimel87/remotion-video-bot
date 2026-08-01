// Bloque 4 final -- Itaca/Paliki + Odiseo hombre real + cierre (version
// condensada del guion, fusiona los bloques 6+7+8 originales).
// 21 planos alineados 1:1 con los 21 segmentos del SRT real de la locucion
// (bloque_4_finalmejoradav2.mp3). El TEXTO de cada plano son las palabras
// exactas que se oyen en su ventana de tiempo, con ortografia corregida
// donde el reconocimiento automatico del SRT confundio un nombre propio o
// palabra (Bittleston->Bittlestone, Paliqui->Paliki, "de remotos"->
// terremotos, Diemburgo->Edimburgo, Omero->Homero, gente de Troia->guerra
// de Troya). durationSec = duracion exacta de cada segmento del SRT; suma =
// 109.52s (109.68s de audio real, con un silencio de 0.16s entre los
// segmentos 10 y 11 absorbido sin corte propio).
//
// CERO REPETICION: cada plano usa una imagen distinta (b4-01..b4-30, de las
// cuales 2 -- 02 y 09 -- quedan fuera por tener un marco decorativo pintado
// dentro de la imagen). Se usan 21 de las 28 utilizables.
import type {Cue} from './plan';

export const BLOQUE_4: Cue[] = [
  {text: 'Ítaca existe hoy. Puedes tomar un ferry y llegar a una isla griega con ese nombre, pero', pool: 'b4-01', durationSec: 5.32},
  {text: 'no coincide con la descripción de Homero, que dice que es la isla más baja del grupo,', pool: 'b4-04', durationSec: 4.24},
  {text: 'la más occidental, y que mira hacia el noroeste. La Ítaca moderna no cumple ninguna de esas', pool: 'b4-05', durationSec: 5.16},
  {text: 'condiciones. En 2005, el geólogo aficionado Robert Bittlestone propuso algo radical. La', pool: 'b4-06', durationSec: 6.08},
  {text: 'verdadera Ítaca de Homero no es esa isla, sino la península de Paliki, en la vecina', pool: 'b4-10', durationSec: 5.28},
  {text: 'Cefalonia. Hace 3.000 años, un canal de agua separaba Paliki del resto de la isla, y terremotos', pool: 'b4-08', durationSec: 5.64},
  {text: 'y sedimentación lo rellenaron con el tiempo. Cuando miras Paliki con esos ojos,', pool: 'b4-07', durationSec: 4.92},
  {text: 'cumple con cada descripción, la más baja, la más occidental, mirando al noroeste,', pool: 'b4-03', durationSec: 5.12},
  {text: 'con un puerto y hasta una cueva que coinciden con el relato. La Universidad de Edimburgo', pool: 'b4-12', durationSec: 5.119},
  {text: 'encontró sedimentos marinos que respaldan la teoría, aunque falta confirmarla del todo.', pool: 'b4-14', durationSec: 5.36},
  {text: 'Y queda la pregunta final. ¿Realmente existió Odiseo? No hay tumba, no hay inscripción con su nombre,', pool: 'b4-15', durationSec: 6.16},
  {text: 'pero la mayoría de historiadores cree que la Odisea no describe un solo hombre, sino un fenómeno.', pool: 'b4-16', durationSec: 5.08},
  {text: 'Miles de guerreros griegos cruzando el Mediterráneo, en barcos de madera, sin mapas,', pool: 'b4-17', durationSec: 4.80},
  {text: 'navegando por las estrellas, muchos de ellos sin volver jamás. Los que sí regresaron, contaron', pool: 'b4-19', durationSec: 5.64},
  {text: 'historias que con cada generación se volvieron más grandes, más míticas, hasta fundirse en un', pool: 'b4-18', durationSec: 5.16},
  {text: 'solo héroe, Odiseo. Sabemos que la guerra de Troya probablemente ocurrió, sabemos que la ciudad', pool: 'b4-21', durationSec: 5.64},
  {text: 'existía donde Homero dijo, sabemos que los monstruos se parecen a fenómenos reales del', pool: 'b4-22', durationSec: 4.519},
  {text: 'Mediterráneo, que la ruta coincide con lugares identificables y que un eclipse en el texto puede', pool: 'b4-25', durationSec: 5.80},
  {text: 'fecharse astronómicamente. La Odisea no es pura ficción, tampoco es historia pura,', pool: 'b4-23', durationSec: 5.081},
  {text: 'es un recuerdo colectivo de eventos reales distorsionados por el tiempo y cristalizado por', pool: 'b4-27', durationSec: 5.56},
  {text: 'un poeta en una de las obras más poderosas que ha producido la humanidad.', pool: 'b4-30', durationSec: 3.84},
];
