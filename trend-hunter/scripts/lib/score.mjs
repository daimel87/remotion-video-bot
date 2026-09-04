// Heurística simple (sin ML): tokeniza los títulos de todas las fuentes y
// agrupa por token significativo. Un token que aparece en varias fuentes
// distintas (Reddit + Google Trends + Noticias) al mismo tiempo es una señal
// de tendencia cruzada — justo lo que se necesita para detectar algo antes
// de que "explote" en YouTube.

const SOURCE_WEIGHT = {
  "googletrends": 3,
  "reddit:rising": 2.5,
  "reddit:r": 1.5,
  "reddit:search": 1,
  "news:top": 2,
  "news:search": 1.5,
};

function weightFor(source) {
  for (const key of Object.keys(SOURCE_WEIGHT)) {
    if (source.startsWith(key)) return SOURCE_WEIGHT[key];
  }
  return 1;
}

function tokenize(title, stopwords) {
  return (title || "")
    .toLowerCase()
    .replace(/['"“”‘’]/g, "")
    .split(/[^a-záéíóúñü0-9]+/i)
    .filter((w) => w.length >= 4 && !stopwords.includes(w));
}

export function buildTrendBoard(items, stopwords) {
  const board = new Map(); // token -> { token, score, sources:Set, samples:[] }

  for (const item of items) {
    const tokens = new Set(tokenize(item.title, stopwords));
    const w = weightFor(item.source);
    const recencyBoost = item.ageHours != null ? Math.max(0.5, 2 - item.ageHours / 24) : 1;
    for (const tok of tokens) {
      if (!board.has(tok)) {
        board.set(tok, { token: tok, score: 0, sources: new Set(), samples: [] });
      }
      const entry = board.get(tok);
      entry.score += w * recencyBoost;
      entry.sources.add(item.source);
      if (entry.samples.length < 3) entry.samples.push({ title: item.title, source: item.source, url: item.url });
    }
  }

  const rows = [...board.values()].map((e) => ({
    token: e.token,
    score: Math.round(e.score * 10) / 10,
    distinctSourceTypes: new Set([...e.sources].map((s) => s.split(":")[0])).size,
    sources: [...e.sources],
    samples: e.samples,
  }));

  rows.sort((a, b) => b.score - a.score || b.distinctSourceTypes - a.distinctSourceTypes);
  return rows;
}
