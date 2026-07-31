// Cues del Bloque 1 -- ESTE ES UN SCAFFOLD, no el guion final con
// temporizacion real. Las 6 lineas son las que ya se usaron (y gustaron)
// en el preview; falta reemplazar esto por el guion completo con timing
// real en cuanto haya narracion (audio/TTS) para sincronizar por palabra,
// como en los documentales anteriores (cd/bbCues/gc). Mientras tanto usa
// el pacing fijo de Vidrush (~4s por plano).
import type {Cue} from './plan';

export const BLOQUE_1: Cue[] = [
  {text: 'Empezamos donde termina la guerra de Troya.', pool: 'turkey-landscape'},
  {text: 'Diez anios. Un viaje que se volvio leyenda.', pool: 'ancient-greek-ruins'},
  {text: 'Los dioses intervienen en cada paso del camino.', pool: 'greek-gods-art'},
  {
    text: 'La tradicion dice que un poeta ciego la conto primero: Homero.',
    pool: 'blind-poet-art',
  },
  {text: 'Miles de anios despues, seguimos abriendo el libro.', pool: 'old-book-candle'},
];
