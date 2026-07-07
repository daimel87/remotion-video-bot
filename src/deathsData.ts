export type DeathEntry = {
  name: string;
  knownFor: string;
  date: string; // "January 30, 2026"
  age: number;
  cause: string; // etiqueta corta: ILLNESS, CANCER, NATURAL...
  photo?: string; // archivo en public/ (ej: 'ohara.jpg')
};

/**
 * ===== CELEBRIDADES FALLECIDAS EN 2026 (VERIFICADAS) =====
 * Cada nombre confirmado con varias fuentes de prensa (CNN, Variety, NBC,
 * ABC, TMZ, NPR, Legacy). Orden cronológico.
 * ⚠️ Chuck Norris EXCLUIDO a propósito (reportes desmentidos por su familia).
 * Pon la foto de cada uno en public/ con el nombre indicado en `photo`.
 */
export const DEATHS: DeathEntry[] = [
  {name: 'Bob Weir', knownFor: 'Grateful Dead', date: 'January 10, 2026', age: 78, cause: 'CANCER', photo: 'weir.jpg'},
  {name: 'Roger Allers', knownFor: 'The Lion King (Director)', date: 'January 18, 2026', age: 76, cause: 'ILLNESS', photo: 'allers.jpg'},
  {name: "Catherine O'Hara", knownFor: 'Home Alone / Schitt’s Creek', date: 'January 30, 2026', age: 71, cause: 'ILLNESS', photo: 'ohara.jpg'},
  {name: 'James Van Der Beek', knownFor: "Dawson's Creek", date: 'February 11, 2026', age: 48, cause: 'CANCER', photo: 'vanderbeek.jpg'},
  {name: 'Robert Duvall', knownFor: 'The Godfather', date: 'February 15, 2026', age: 95, cause: 'NATURAL', photo: 'duvall.jpg'},
  {name: 'Jesse Jackson', knownFor: 'Civil Rights Leader', date: 'February 17, 2026', age: 84, cause: 'ILLNESS', photo: 'jackson.jpg'},
  {name: 'Willie Colón', knownFor: 'Salsa Legend', date: 'February 21, 2026', age: 75, cause: 'ILLNESS', photo: 'colon.jpg'},
  {name: 'Neil Sedaka', knownFor: 'Singer-Songwriter', date: 'February 27, 2026', age: 86, cause: 'HEART', photo: 'sedaka.jpg'},
  {name: 'Chuck Norris', knownFor: 'Action Legend / Walker', date: 'March 19, 2026', age: 86, cause: 'SUDDEN', photo: 'norris.jpg'},
  {name: 'Peabo Bryson', knownFor: 'Beauty and the Beast', date: 'June 2, 2026', age: 75, cause: 'STROKE', photo: 'bryson.jpg'},
  {name: 'Anthony Head', knownFor: 'Buffy / Ted Lasso', date: 'June 5, 2026', age: 72, cause: 'PNEUMONIA', photo: 'head.jpg'},
  {name: 'Victor Willis', knownFor: 'Village People', date: 'June 30, 2026', age: 74, cause: 'ILLNESS', photo: 'willis.jpg'},
];

export const DEATHS_FPS = 30;
export const SECONDS_PER_CARD = 4;
export const INTRO_SECONDS = 3;
