// Sugerencia de títulos y generación de prompts listos para pegar en
// Claude/ChatGPT. No llama a ninguna IA: arma texto a partir de los
// patrones reales que ya sacó research-engine.js. Los títulos son un punto
// de partida editable, no un resultado final.

function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

/**
 * @param {string} topic
 * @param {{titles: {pctWithNumber: number, pctWithQuestion: number, topWords: [string, number][]}}} patterns
 */
export function suggestTitles(topic, patterns) {
  const topicLower = topic.toLowerCase();
  // Descarta palabras que ya están contenidas en el tema (ej. "vegan" cuando
  // el tema es "cocina vegana") para que no se sientan redundantes.
  const words = patterns.titles.topWords
    .map(([w]) => w)
    .filter((w) => !topicLower.includes(w) && !w.includes(topicLower));

  const w1 = words[0];
  const w2 = words[1] ?? words[0];

  const titles = [];

  titles.push(
    patterns.titles.pctWithNumber >= 15
      ? `7 claves de ${topic} que no te están contando`
      : `La verdad sobre ${topic} que nadie te cuenta`
  );

  titles.push(
    patterns.titles.pctWithQuestion >= 10
      ? `¿Por qué ${topic}${w1 ? ` y "${w1}"` : ""} funcionan tan bien juntos?`
      : `${capitalize(topic)}: lo que tienes que saber antes de empezar`
  );

  titles.push(w2 ? `${capitalize(topic)}: por qué "${w2}" es la clave que nadie usa` : `${capitalize(topic)}: la guía definitiva`);

  return [...new Set(titles)];
}

export function buildScriptPrompt(topic, title, patterns) {
  const hookLines = patterns.hooks.examples
    .slice(0, 5)
    .map((h) => `  - "${h.hook}"`)
    .join("\n");

  return `Escribe un guion de YouTube optimizado para retención sobre este video.

Título: "${title}"
Tema: ${topic}

Datos reales de los videos que mejor funcionan en este tema (top ${patterns.videoCount} analizados):
- Duración típica: ${patterns.duration.medianMinutes} minutos
- Vistas típicas: ${formatNumber(patterns.views.median)}
- ${patterns.titles.pctWithNumber}% de los títulos ganadores usan un número, ${patterns.titles.pctWithQuestion}% usan una pregunta
- Palabras que más se repiten en los títulos ganadores: ${patterns.titles.topWords.map(([w]) => w).join(", ") || "sin datos suficientes"}
${hookLines ? `- Ejemplos reales de ganchos de apertura de los videos top:\n${hookLines}` : ""}

Con esos datos como referencia, escribe:
1. Un gancho de los primeros 15 segundos que enganche de inmediato.
2. La estructura completa del video (introducción, desarrollo en bloques, cierre con llamado a la acción).
3. Dónde poner los momentos de mayor tensión/curiosidad para mantener la retención.

Apunta a que la duración total del guion ronde los ${patterns.duration.medianMinutes} minutos.`;
}

export function buildThumbnailPrompt(topic, title, patterns) {
  return `Genera una imagen para una miniatura de YouTube en formato horizontal 16:9.

Video: "${title}"
Tema: ${topic}

Esta miniatura tiene que destacar frente a videos que ya funcionan muy bien en este nicho (vistas típicas de ${formatNumber(patterns.views.median)}).

Dame el concepto y, si puedes generar la imagen directamente, hazlo:
- Composición: dónde va el sujeto principal, el texto y el fondo.
- Paleta de colores de alto contraste que se lea bien en miniatura pequeña.
- Expresión facial o elemento visual central que genere curiosidad.
- Texto corto para overlay (máximo 4 palabras), coherente con el título.`;
}

export function buildDescriptionPrompt(topic, title, patterns, searchSuggestions = []) {
  return `Escribe la descripción, tags y comentario fijado para este video de YouTube.

Título: "${title}"
Tema: ${topic}

Necesito:
1. Descripción optimizada para SEO: primeras 2 líneas con gancho (se ven antes del "Mostrar más"), y el resto con contexto + palabras clave relacionadas con "${topic}". Incorpora de forma natural (sin forzar ni listar) los términos reales que la gente busca en YouTube sobre esto, que están más abajo.
2. Lista de 15-20 tags/etiquetas relevantes para este video, dando prioridad a los términos de búsqueda reales de abajo cuando encajen.
3. Un comentario fijado que invite a comentar y genere más interacción (que termine en una pregunta).

Palabras clave que más se repiten en los títulos que mejor funcionan en este tema: ${patterns.titles.topWords.map(([w]) => w).join(", ") || "sin datos suficientes"}.
${
  searchSuggestions.length
    ? `\nTérminos reales que la gente escribe en el buscador de YouTube sobre "${topic}" (autocompletado real):\n${searchSuggestions.map((s) => `  - ${s}`).join("\n")}`
    : ""
}`;
}
