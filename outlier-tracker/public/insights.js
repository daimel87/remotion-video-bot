// Calcula un resumen de patrones a partir de los videos outlier ya obtenidos.
// No hace llamadas nuevas a la API: todo sale de los datos que ya trajo la búsqueda.

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const STOPWORDS = new Set([
  "de", "la", "el", "en", "que", "con", "para", "los", "las", "del", "un", "una",
  "y", "a", "por", "es", "su", "se", "lo", "al", "mi", "tu", "no", "si", "más",
  "the", "and", "for", "with", "from", "this", "that", "your", "you", "is", "are",
  "of", "to", "in", "on", "it", "my", "me", "we", "he", "she", "was", "be", "how",
  "shorts", "short", "video", "videos",
]);

function median(nums) {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mean(nums) {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function topWords(titles, limit = 8) {
  const counts = new Map();
  for (const title of titles) {
    const words = (title.toLowerCase().match(/[\p{L}]{4,}/gu) ?? []).filter((w) => !STOPWORDS.has(w));
    const seenInTitle = new Set();
    for (const w of words) {
      if (seenInTitle.has(w)) continue; // no contar repetido dos veces dentro del mismo título
      seenInTitle.add(w);
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function bestPublishDay(videos) {
  const counts = new Array(7).fill(0);
  for (const v of videos) counts[new Date(v.publishedAt).getDay()]++;
  const maxCount = Math.max(...counts);
  if (maxCount === 0) return null;
  const dayIndex = counts.indexOf(maxCount);
  return { day: DAY_NAMES[dayIndex], count: maxCount, total: videos.length };
}

/**
 * @param {object[]} videos
 */
export function computeInsights(videos) {
  if (videos.length === 0) return null;

  const durations = videos.map((v) => v.durationSeconds).filter((d) => d > 0);
  const multipliers = videos.map((v) => v.outlierMultiplier);
  const subs = videos.map((v) => v.subscriberCount).filter((s) => s !== null);

  return {
    count: videos.length,
    avgMultiplier: Math.round(mean(multipliers) * 10) / 10,
    topMultiplier: Math.max(...multipliers),
    medianDurationMin: Math.round((median(durations) / 60) * 10) / 10,
    bestDay: bestPublishDay(videos),
    topWords: topWords(videos.map((v) => v.title)),
    subsRange: subs.length ? { min: Math.min(...subs), max: Math.max(...subs) } : null,
  };
}
