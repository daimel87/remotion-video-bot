export type Puzzle = {
  emojis: string[]; // los emojis que se suman (ej: ['🕷️','👨'])
  answer: string; // respuesta en mayúsculas
};

/**
 * ===== GUESS THE WORD BY EMOJIS =====
 * Cada ronda: se muestran los emojis, cuenta atrás, y se revela la respuesta.
 * Edita/añade rondas libremente. Mezcla de pelis, marcas y palabras: lo más
 * compartible. Mantén respuestas cortas y "adivinables".
 */
export const PUZZLES: Puzzle[] = [
  {emojis: ['🕷️', '👨'], answer: 'SPIDER-MAN'},
  {emojis: ['🦁', '👑'], answer: 'LION KING'},
  {emojis: ['⭐', '⚔️'], answer: 'STAR WARS'},
  {emojis: ['🔥', '🦊'], answer: 'FIREFOX'},
  {emojis: ['☀️', '🌻'], answer: 'SUNFLOWER'},
  {emojis: ['🦶', '⚽'], answer: 'FOOTBALL'},
  {emojis: ['🌙', '🚶'], answer: 'MOONWALK'},
  {emojis: ['🦇', '🧍'], answer: 'BATMAN'},
  {emojis: ['❄️', '👑'], answer: 'FROZEN'},
  {emojis: ['🍎', '📱'], answer: 'APPLE'},
  {emojis: ['🍔', '👑'], answer: 'BURGER KING'},
  {emojis: ['🐭', '🏰'], answer: 'DISNEYLAND'},
  {emojis: ['🐢', '🥷'], answer: 'NINJA TURTLE'},
  {emojis: ['👻', '🚫'], answer: 'GHOSTBUSTERS'},
  {emojis: ['⭐', '🐟'], answer: 'STARFISH'},
  {emojis: ['🐺', '🌕'], answer: 'WEREWOLF'},
  {emojis: ['🌽', '🍿'], answer: 'POPCORN'},
  {emojis: ['🐝', '🍯'], answer: 'BEEHIVE'},
  {emojis: ['🌊', '🏄'], answer: 'SURFING'},
  {emojis: ['🚪', '🔔'], answer: 'DOORBELL'},
  {emojis: ['🌧️', '🧥'], answer: 'RAINCOAT'},
];

export const QUIZ_FPS = 30;

// Tiempos de cada ronda (en segundos)
export const SHOW_SECS = 1.2; // aparecen los emojis
export const COUNTDOWN_SECS = 5; // cuenta atrás 5→1
export const REVEAL_SECS = 2.3; // se muestra la respuesta
export const INTRO_SECS = 2.5; // título inicial

export const ROUND_SECS = SHOW_SECS + COUNTDOWN_SECS + REVEAL_SECS;
export const roundFrames = Math.round(QUIZ_FPS * ROUND_SECS);
export const introFrames = Math.round(QUIZ_FPS * INTRO_SECS);
export const totalQuizFrames = introFrames + PUZZLES.length * roundFrames;
