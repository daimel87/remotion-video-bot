// Sugerencia de títulos y generación de prompts listos para pegar en
// Claude/ChatGPT. No llama a ninguna IA: arma texto a partir de los
// patrones reales que ya sacó research-engine.js. Los títulos son un punto
// de partida editable, no un resultado final.

function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * Arma un prompt con los títulos REALES de los videos top para que
 * Claude/ChatGPT saque el patrón de estructura y tono en vez de que
 * nosotros lo inventemos con una plantilla genérica.
 *
 * @param {string} topic
 * @param {{videoCount: number, duration: {medianMinutes: number}, views: {median: number}, titles: {pctWithNumber: number, pctWithQuestion: number, topWords: [string, number][]}}} patterns
 * @param {{title: string, viewCount: number}[]} videos
 */
export function buildTitlesPrompt(topic, patterns, videos) {
  const exampleTitles = [...videos]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 15)
    .map((v) => `  - "${v.title}" (${formatNumber(v.viewCount)} vistas)`)
    .join("\n");

  return `Sugiéreme 3 títulos virales para un video de YouTube sobre "${topic}".

Estos son los títulos REALES de los videos que mejor funcionan en este tema ahora mismo, de más a menos vistas:
${exampleTitles}

Datos del conjunto completo (${patterns.videoCount} videos analizados):
- Duración típica: ${patterns.duration.medianMinutes} minutos
- Vistas típicas: ${formatNumber(patterns.views.median)}
- ${patterns.titles.pctWithNumber}% de los títulos usan un número, ${patterns.titles.pctWithQuestion}% usan una pregunta
- Palabras que más se repiten: ${patterns.titles.topWords.map(([w]) => w).join(", ") || "sin datos suficientes"}

Primero identifica qué patrón de estructura, tono y gancho comparten los títulos de arriba (no me lo expliques, solo úsalo). Después dame 3 títulos nuevos, originales y específicos para "${topic}" que sigan ese mismo patrón — nada de plantillas genéricas tipo "la verdad que nadie te cuenta".`;
}

export function buildScriptPrompt(topic, title, patterns, videos = []) {
  const hookLines = patterns.hooks.examples
    .slice(0, 5)
    .map((h) => `  - "${h.hook}"`)
    .join("\n");

  const exampleTitles = [...videos]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 8)
    .map((v) => `  - "${v.title}"`)
    .join("\n");

  return `Escribe un guion de YouTube optimizado para retención sobre este video.

Título: "${title}"
Tema: ${topic}

Datos reales de los videos que mejor funcionan en este tema (top ${patterns.videoCount} analizados):
- Duración típica: ${patterns.duration.medianMinutes} minutos
- Vistas típicas: ${formatNumber(patterns.views.median)}
- ${patterns.titles.pctWithNumber}% de los títulos ganadores usan un número, ${patterns.titles.pctWithQuestion}% usan una pregunta
- Palabras que más se repiten en los títulos ganadores: ${patterns.titles.topWords.map(([w]) => w).join(", ") || "sin datos suficientes"}
${exampleTitles ? `- Títulos reales de los videos top, para que entiendas el tono/ángulo que funciona en este nicho:\n${exampleTitles}` : ""}
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
