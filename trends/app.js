// Todo corre en el navegador. La clave de YouTube se guarda en localStorage
// — nunca pasa por ningún servidor nuestro.
//
// % de viralidad = raíz(tendencia × oportunidad):
//  - tendencia: sale de cruzar Reddit + Google Trends + Google News + lo que
//    tú pegues de X. Para poder llamar esas fuentes sin chocar con el
//    bloqueo de CORS del navegador, se pasa por un proxy CORS público
//    gratuito (api.allorigins.win) — no requiere ninguna configuración. Si
//    ninguna fuente cruzada responde, cae a estimar con la velocidad de
//    vistas de YouTube como último recurso.
//  - oportunidad: qué tan poca "oferta" hay ya en YouTube para ese tema
//    (menos videos existentes cubriéndolo = más alto).
// Hace falta que AMBAS sean altas para llegar a 100%.

const KEY_STORAGE = "trendhunter_youtube_key";
const XTRENDS_STORAGE = "trendhunter_xtrends";
const API_BASE = "https://www.googleapis.com/youtube/v3";

const STOPWORDS = [
  "the","and","for","with","from","that","this","have","says","after","over","into","about",
  "their","will","been","were","what","when","where","which","who","how","new","update","live",
  "video","watch","report","breaking","news","amid","could","would","also","more","than","just",
  "during","following","first","being","still","because","while","against",
  "para","como","desde","este","esta","pero","donde","cuando","tras","sobre","entre","hoy",
  "noticias","video","según","hace","será","están","fueron","tiene","tras",
];

const SOURCE_WEIGHTS = [
  ["reddit:rising", 2.5],
  ["reddit:r/", 1.5],
  ["reddit:search", 1],
  ["googletrends", 3],
  ["news:top", 2],
  ["news:search", 1.5],
  ["x:manual", 3.5],
];

const els = {
  settingsBtn: document.getElementById("settings-btn"),
  modal: document.getElementById("key-modal"),
  keyInput: document.getElementById("key-input"),
  keySave: document.getElementById("key-save"),
  keyCancel: document.getElementById("key-cancel"),
  regionSelect: document.getElementById("region-select"),
  topnSelect: document.getElementById("topn-select"),
  refreshBtn: document.getElementById("refresh-btn"),
  termForm: document.getElementById("term-form"),
  termInput: document.getElementById("term-input"),
  xtrendsInput: document.getElementById("xtrends-input"),
  progress: document.getElementById("progress"),
  emptyState: document.getElementById("empty-state"),
  list: document.getElementById("list"),
  updatedAt: document.getElementById("updated-at"),
};

const REGION_TO_HL = { NP: "en-IN", US: "en-US", MX: "es-419", ES: "es-419", IN: "en-IN", GB: "en-GB", BR: "pt-BR", AR: "es-419" };

function getKey() { return localStorage.getItem(KEY_STORAGE) || ""; }
function getXTrends() { return localStorage.getItem(XTRENDS_STORAGE) || ""; }

els.xtrendsInput.value = getXTrends();
els.xtrendsInput.addEventListener("change", () => {
  localStorage.setItem(XTRENDS_STORAGE, els.xtrendsInput.value);
});

function openModal() {
  els.keyInput.value = getKey();
  els.modal.hidden = false;
}
function closeModal() { els.modal.hidden = true; }

els.settingsBtn.addEventListener("click", openModal);
els.keyCancel.addEventListener("click", closeModal);
els.keySave.addEventListener("click", () => {
  const key = els.keyInput.value.trim();
  if (key) localStorage.setItem(KEY_STORAGE, key);
  closeModal();
});

function setProgress(text) {
  els.progress.hidden = !text;
  els.progress.textContent = text || "";
}

// ---------- YouTube (oportunidad = oferta ya existente) ----------

async function ytGet(path, params) {
  const url = new URL(`${API_BASE}/${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }
  url.searchParams.set("key", getKey());
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!res.ok) {
    const reason = json?.error?.errors?.[0]?.reason || json?.error?.status || "unknown";
    throw new Error(`${res.status} ${reason}: ${json?.error?.message || "error de API"}`);
  }
  return json;
}

function opportunityFromTotalResults(totalResults) {
  const score = 100 - 22 * Math.log10(1 + totalResults);
  return Math.max(0, Math.min(100, Math.round(score)));
}

async function fetchSupply(query, publishedAfterIso) {
  try {
    const json = await ytGet("search", { part: "snippet", q: query, type: "video", maxResults: 1, publishedAfter: publishedAfterIso });
    return Number(json.pageInfo?.totalResults ?? 0);
  } catch (err) {
    console.warn(`Oferta falló para "${query}": ${err.message}`);
    return null;
  }
}

async function fetchTopVideosForQuery(query, publishedAfterIso) {
  try {
    const json = await ytGet("search", { part: "snippet", q: query, type: "video", order: "viewCount", maxResults: 3, publishedAfter: publishedAfterIso });
    return (json.items || []).map((it) => ({ title: it.snippet.title, url: `https://youtube.com/watch?v=${it.id.videoId}` }));
  } catch {
    return [];
  }
}

// ---------- Cruce de fuentes: Reddit + Google Trends + Google News ----------
//
// Ninguna de las tres deja llamarla directo desde el navegador de otro sitio
// (bloqueo CORS), así que se pasa por un proxy CORS público y gratuito —
// sin configurar nada. Estos servicios de terceros fallan seguido (caídas,
// límites de tasa), así que se prueban varios en orden: si el primero no
// responde, se intenta el siguiente antes de rendirse.

const PUBLIC_CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

function mapRedditPosts(data, source) {
  const children = data?.data?.children || [];
  return children.map((c) => ({
    source,
    title: c.data.title,
    score: c.data.score,
    url: `https://reddit.com${c.data.permalink}`,
  }));
}

function stripJsonPrefix(text) {
  const idx = text.indexOf("{");
  return idx === -1 ? text : text.slice(idx);
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

function decodeEntities(str = "") {
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function parseRssItems(xml, source) {
  return xml
    .split("<item>")
    .slice(1)
    .map((chunk) => ({ source, title: decodeEntities(extractTag(chunk, "title")[0] || "") }));
}

async function fetchViaPublicCorsProxy(targetUrl) {
  const errors = [];
  for (const buildUrl of PUBLIC_CORS_PROXIES) {
    try {
      const res = await fetch(buildUrl(targetUrl));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (!text) throw new Error("respuesta vacía");
      return text;
    } catch (err) {
      errors.push(err.message);
    }
  }
  throw new Error(`todos los proxies fallaron (${errors.join(" · ")})`);
}

async function directSource(source, params) {
  if (source === "reddit") {
    const mode = params.mode || "rising";
    let url, label;
    if (mode === "rising") { url = "https://www.reddit.com/r/all/rising.json?limit=30"; label = "reddit:rising"; }
    else if (mode === "sub") { url = `https://www.reddit.com/r/${params.sub}/top.json?limit=15&t=day`; label = `reddit:r/${params.sub}`; }
    else { url = `https://www.reddit.com/search.json?q=${encodeURIComponent(params.q)}&sort=new&limit=15`; label = `reddit:search(${params.q})`; }
    const text = await fetchViaPublicCorsProxy(url);
    return mapRedditPosts(JSON.parse(text), label);
  }

  if (source === "trends") {
    const url = `https://trends.google.com/trends/api/dailytrends?hl=${params.hl}&tz=-360&geo=${params.geo}&ns=15`;
    const text = await fetchViaPublicCorsProxy(url);
    const parsed = JSON.parse(stripJsonPrefix(text));
    const days = parsed?.default?.trendingSearchesDays || [];
    const items = [];
    for (const day of days) for (const t of day.trendingSearches || []) items.push({ source: `googletrends:${params.geo}`, title: t.title?.query });
    return items;
  }

  if (source === "news") {
    const url = params.q
      ? `https://news.google.com/rss/search?q=${encodeURIComponent(params.q)}&hl=${params.hl}&gl=${params.gl}&ceid=${params.ceid}`
      : `https://news.google.com/rss?hl=${params.hl}&gl=${params.gl}&ceid=${params.ceid}`;
    const text = await fetchViaPublicCorsProxy(url);
    return parseRssItems(text, params.q ? `news:search(${params.q})` : `news:top:${params.gl}`);
  }

  return [];
}

// Devuelve { items, failed } — failed:true solo cuando los 3 proxies
// fallaron para esta llamada (distinto de "no hay resultados", que es
// items:[] con failed:false).
async function proxyGet(source, params) {
  try {
    const items = await directSource(source, params || {});
    return { items, failed: false };
  } catch (err) {
    console.warn(`Cruce de fuentes falló (${source}): ${err.message}`);
    return { items: [], failed: true };
  }
}

// ---------- Cruce de fuentes (heurística por palabras, sin IA) ----------

function tokenize(title) {
  return (title || "")
    .toLowerCase()
    .replace(/['"“”‘’]/g, "")
    .split(/[^a-záéíóúñü0-9]+/i)
    .filter((w) => w.length >= 4 && !STOPWORDS.includes(w));
}

function weightFor(source) {
  for (const [prefix, w] of SOURCE_WEIGHTS) if (source.startsWith(prefix)) return w;
  return 1;
}

function buildCrossBoard(items) {
  const board = new Map();
  for (const item of items) {
    if (!item.title) continue;
    const tokens = new Set(tokenize(item.title));
    const w = weightFor(item.source);
    for (const tok of tokens) {
      if (!board.has(tok)) board.set(tok, { token: tok, score: 0, sourceTypes: new Set(), sources: new Set(), samples: [] });
      const e = board.get(tok);
      e.score += w;
      e.sourceTypes.add(item.source.split(":")[0]);
      e.sources.add(item.source);
      if (e.samples.length < 3) e.samples.push({ title: item.title, source: item.source, url: item.url });
    }
  }
  return [...board.values()].map((e) => ({ ...e, sourceTypes: [...e.sourceTypes], sources: [...e.sources] }));
}

function xManualItems() {
  return getXTrends()
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((phrase) => ({ source: "x:manual", title: phrase }));
}

function overlapsTokens(aTokens, bTokens) {
  return aTokens.some((t) => bTokens.includes(t));
}

function finalScore(trendScore, opportunityScore) {
  return Math.round(Math.sqrt(Math.max(0, trendScore) * Math.max(0, opportunityScore)));
}

function badgesForSourceTypes(sourceTypes) {
  const map = { reddit: "Reddit", googletrends: "Trends", news: "Noticias", x: "X", youtube: "YouTube" };
  return sourceTypes.map((s) => `<span class="src-badge">${map[s] || s}</span>`).join(" ");
}

function renderCard(row) {
  const pctClass = row.viralidad >= 70 ? "pct-high" : row.viralidad >= 40 ? "pct-mid" : "pct-low";
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(row.query)}`;
  const xSearchUrl = `https://x.com/search?q=${encodeURIComponent(row.query)}&f=live`;
  const samples = (row.samples || [])
    .slice(0, 3)
    .map((s) => `<li>[${s.source}] ${s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>` : s.title}</li>`)
    .join("");
  const topVideos = (row.topVideos || [])
    .map((v) => `<li><a href="${v.url}" target="_blank" rel="noopener">${v.title}</a></li>`)
    .join("");

  return `
    <div class="card">
      <div class="card-head">
        <span class="pct-badge ${pctClass}">${row.viralidad}%</span>
        <span class="topic-title">${row.query}</span>
        ${badgesForSourceTypes(row.sourceTypes || [])}
      </div>
      <div class="card-meta">
        Oferta en YouTube: ${row.totalResults == null ? "no calculado" : `${row.totalResults.toLocaleString("es-MX")} videos`}
        · <a href="${searchUrl}" target="_blank" rel="noopener">buscar en YouTube ↗</a>
        · <a href="${xSearchUrl}" target="_blank" rel="noopener">buscar en X ↗</a>
      </div>
      <div class="score-bars">
        <div class="score-bar"><span>Tendencia</span><div class="bar"><i style="width:${row.trendScore}%"></i></div><b>${row.trendScore}%</b></div>
        <div class="score-bar"><span>Oportunidad</span><div class="bar"><i style="width:${row.opportunityScore}%"></i></div><b>${row.opportunityScore}%</b></div>
      </div>
      ${samples ? `<ul class="samples">${samples}</ul>` : ""}
      ${topVideos ? `<div class="card-meta">Videos existentes más vistos:</div><ul class="samples">${topVideos}</ul>` : ""}
    </div>
  `;
}

function renderResults(rows) {
  if (rows.length === 0) {
    els.list.innerHTML = "";
    els.emptyState.hidden = false;
    els.emptyState.textContent = "Sin resultados.";
    return;
  }
  els.emptyState.hidden = true;
  els.list.innerHTML = rows.map(renderCard).join("");
}

// ---------- Modo 1: descubrir tendencias cruzadas ----------

async function runDiscoveryMode() {
  if (!getKey()) return openModal();
  const region = els.regionSelect.value;
  const hl = REGION_TO_HL[region] || "en-US";
  const topN = Number(els.topnSelect.value);

  els.list.innerHTML = "";
  els.emptyState.hidden = true;

  setProgress("Consultando Reddit, Google Trends y Google News...");
  const results = await Promise.all([
    proxyGet("reddit", { mode: "rising" }),
    proxyGet("reddit", { mode: "sub", sub: "worldnews" }),
    proxyGet("reddit", { mode: "sub", sub: "news" }),
    proxyGet("trends", { geo: region, hl }),
    proxyGet("news", { hl, gl: region, ceid: `${region}:${hl.split("-")[0]}` }),
  ]);

  const allFailed = results.every((r) => r.failed);
  const allItems = [...results.flatMap((r) => r.items), ...xManualItems()];
  const board = buildCrossBoard(allItems);
  const crossed = board.filter((r) => r.sourceTypes.length >= 2).sort((a, b) => b.score - a.score);

  if (crossed.length === 0) {
    setProgress(null);
    els.emptyState.hidden = false;
    els.emptyState.textContent = allFailed
      ? "No se pudo contactar Reddit/Google Trends/Google News (los proxies públicos fallaron). Espera un momento y vuelve a intentar — no significa que no haya tendencias."
      : "No hay temas con señal en 2+ fuentes distintas en este momento. Prueba otro país o vuelve a intentar más tarde.";
    return;
  }

  const maxScore = Math.max(...crossed.map((r) => r.score));
  const candidates = crossed.slice(0, topN).map((r) => ({
    ...r,
    query: r.token,
    trendScore: Math.round((100 * Math.log1p(r.score)) / Math.log1p(maxScore)),
  }));

  const rows = [];
  for (let i = 0; i < candidates.length; i++) {
    const c = candidates[i];
    setProgress(`Revisando oferta en YouTube (${i + 1}/${candidates.length})...`);
    const publishedAfter = new Date(Date.now() - 5 * 86400000).toISOString();
    const [totalResults, topVideos] = await Promise.all([
      fetchSupply(c.query, publishedAfter),
      fetchTopVideosForQuery(c.query, publishedAfter),
    ]);
    const opportunityScore = totalResults == null ? 50 : opportunityFromTotalResults(totalResults);
    rows.push({ ...c, totalResults, topVideos, opportunityScore, viralidad: finalScore(c.trendScore, opportunityScore) });
  }

  rows.sort((a, b) => b.viralidad - a.viralidad);
  renderResults(rows);
  els.updatedAt.textContent = `Actualizado: ${new Date().toLocaleString("es-MX")} · ${rows.length} temas cruzados`;
  setProgress(null);
}

// ---------- Modo 2: buscar un tema puntual ----------

async function runTermSearch(term) {
  if (!getKey()) return openModal();
  const region = els.regionSelect.value;
  const hl = REGION_TO_HL[region] || "en-US";

  els.list.innerHTML = "";
  els.emptyState.hidden = true;
  setProgress(`Cruzando "${term}" en Reddit/Trends/Noticias/X...`);

  const termTokens = tokenize(term);
  let trendScore = null;
  let sourceTypes = [];
  let samples = [];

  const [redditRes, newsRes, trendsRes] = await Promise.all([
    proxyGet("reddit", { mode: "search", q: term }),
    proxyGet("news", { q: term, hl, gl: region, ceid: `${region}:${hl.split("-")[0]}` }),
    proxyGet("trends", { geo: region, hl }),
  ]);
  const crossSourceTotalFailure = redditRes.failed && newsRes.failed && trendsRes.failed;
  const redditHits = redditRes.items;
  const newsHits = newsRes.items;
  const xHits = xManualItems().filter((it) => overlapsTokens(tokenize(it.title), termTokens));
  const trendsMatch = trendsRes.items.filter((t) => overlapsTokens(tokenize(t.title), termTokens));

  const redditScore = redditHits.reduce((s, it) => s + (it.score || 0), 0);
  if (redditHits.length) sourceTypes.push("reddit");
  if (newsHits.length) sourceTypes.push("news");
  if (trendsMatch.length) sourceTypes.push("googletrends");
  if (xHits.length) sourceTypes.push("x");

  if (sourceTypes.length > 0) {
    const base = sourceTypes.length * 20;
    const magnitude = Math.min(20, Math.log1p(redditScore) * 3 + Math.log1p(newsHits.length) * 5);
    trendScore = Math.max(0, Math.min(100, Math.round(base + magnitude)));
    samples = [...redditHits.slice(0, 2), ...newsHits.slice(0, 2), ...trendsMatch.slice(0, 1), ...xHits.slice(0, 1)];
  }
  // Si no hubo señal en ninguna fuente cruzada (o el proxy falló), trendScore
  // se calcula más abajo con la velocidad de vistas de YouTube como respaldo.

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const searchJson = await ytGet("search", { part: "snippet", q: term, type: "video", order: "viewCount", publishedAfter: sevenDaysAgo, maxResults: 10 }).catch((err) => {
    els.emptyState.hidden = false;
    els.emptyState.textContent = `Error de YouTube: ${err.message}`;
    return null;
  });
  if (!searchJson) { setProgress(null); return; }

  const totalResults = Number(searchJson.pageInfo?.totalResults ?? 0);
  const opportunityScore = opportunityFromTotalResults(totalResults);
  const ids = (searchJson.items || []).map((it) => it.id.videoId).filter(Boolean);
  let topVideos = [];

  if (ids.length > 0) {
    const statsJson = await ytGet("videos", { part: "snippet,statistics", id: ids.slice(0, 5).join(",") });
    const vids = (statsJson.items || []).map((v) => {
      const ageHours = Math.max(0.5, (Date.now() - new Date(v.snippet.publishedAt).getTime()) / 3600000);
      const views = Number(v.statistics.viewCount || 0);
      return { title: v.snippet.title, url: `https://youtube.com/watch?v=${v.id}`, viewsPerHour: views / ageHours };
    });
    topVideos = vids.slice(0, 3);
    if (trendScore == null) {
      // Sin señal cruzada no hay con qué comparar en relativo, así que se
      // usa una referencia absoluta: 5.000 vistas/hora = tendencia 100%.
      const REFERENCE_VPH = 5000;
      const maxVph = Math.max(0, ...vids.map((v) => v.viewsPerHour));
      trendScore = Math.max(0, Math.min(100, Math.round((100 * Math.log1p(maxVph)) / Math.log1p(REFERENCE_VPH))));
      sourceTypes = ["youtube"];
    }
  } else if (trendScore == null) {
    trendScore = 0;
  }

  const viralidad = finalScore(trendScore, opportunityScore);
  renderResults([{ query: term, trendScore, opportunityScore, viralidad, totalResults, topVideos, sourceTypes, samples }]);

  if (crossSourceTotalFailure) {
    els.updatedAt.textContent = `"${term}": no se pudo contactar Reddit/Trends/Noticias (proxies públicos caídos) — estimado solo con YouTube · oferta ${totalResults.toLocaleString("es-MX")} videos`;
  } else {
    els.updatedAt.textContent = sourceTypes.includes("youtube")
      ? `"${term}": sin señal cruzada, estimado solo con YouTube · oferta ${totalResults.toLocaleString("es-MX")} videos`
      : `"${term}": cruzado en ${sourceTypes.length} fuente(s) · oferta ${totalResults.toLocaleString("es-MX")} videos`;
  }
  setProgress(null);
}

els.refreshBtn.addEventListener("click", runDiscoveryMode);
els.termForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const term = els.termInput.value.trim();
  if (term) runTermSearch(term);
});

if (!getKey()) openModal();
