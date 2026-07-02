// Lista editable de exclusiones para el Research Copilot. Agrega o quita
// entradas aquí — son coincidencias de subcadena, sin distinguir mayúsculas,
// contra el nombre del canal y el título del video.

// Franquicias de TV (talk shows / cortes / "decisiones") cuyos clips se
// republican en YouTube sin aportar contenido original de valor.
export const EXCLUDED_CHANNEL_KEYWORDS = [
  "caso cerrado",
  "decisiones",
  "laura en america",
  "laura bozzo",
  "primer impacto",
  "el gordo y la flaca",
  "al rojo vivo",
  "suelta la sopa",
  "que nadie sepa mi sufrir",
  "hoy dia",
  "sale el sol",
];

// Palabras que delatan un video "clip"/repost en vez de contenido original.
export const EXCLUDED_TITLE_KEYWORDS = [
  "capitulo completo",
  "capítulo completo",
  "programa completo",
  "clip viral",
  "compilación de",
  "compilacion de",
];

function containsAny(text, keywords) {
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

export function isExcluded(channelTitle, videoTitle) {
  return (
    containsAny(channelTitle ?? "", EXCLUDED_CHANNEL_KEYWORDS) || containsAny(videoTitle ?? "", EXCLUDED_TITLE_KEYWORDS)
  );
}
