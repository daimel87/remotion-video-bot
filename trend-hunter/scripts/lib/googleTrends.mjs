// Google Trends no tiene API pública oficial. Este módulo llama al mismo
// endpoint no documentado que usa la web trends.google.com (sin API key).
// Igual que scripts/transcript.mjs en youtube-research-copilot: puede dejar
// de funcionar sin aviso si Google cambia el formato. Solo lectura, sin login.

function stripJsonPrefix(text) {
  // La respuesta viene precedida por ")]}'," para evitar JSON hijacking.
  const idx = text.indexOf("{");
  return idx === -1 ? text : text.slice(idx);
}

export async function fetchDailyTrends(geo = "US", hl = "en-US") {
  const url = `https://trends.google.com/trends/api/dailytrends?hl=${hl}&tz=-360&geo=${geo}&ns=15`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 trend-hunter/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const json = JSON.parse(stripJsonPrefix(text));
    const days = json?.default?.trendingSearchesDays || [];
    const items = [];
    for (const day of days) {
      for (const t of day.trendingSearches || []) {
        items.push({
          source: `googletrends:${geo}`,
          title: t.title?.query,
          formattedTraffic: t.formattedTraffic,
          relatedQueries: (t.relatedQueries || []).map((q) => q.query),
          articleTitles: (t.articles || []).map((a) => a.title),
        });
      }
    }
    return items;
  } catch (err) {
    console.warn(`[google-trends] geo=${geo} falló (puede que el endpoint haya cambiado): ${err.message}`);
    return [];
  }
}
