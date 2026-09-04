// Todo corre en el navegador. La clave de YouTube Data API v3 se guarda en
// localStorage y las llamadas van directo a googleapis.com — nunca pasan por
// ningún servidor propio.
//
// % de viralidad = combinación de:
//  - trendScore: qué tan rápido gana vistas (vistas/hora), normalizado contra
//    el resto de los temas analizados en esta corrida.
//  - opportunityScore: qué tan poca "oferta" hay ya en YouTube para ese tema
//    (menos videos existentes = más oportunidad).
// viralidad% = raíz(trendScore * opportunityScore) — para llegar a 100% hace
// falta que AMBAS cosas sean altas, no solo una.

const KEY_STORAGE = "trendhunter_youtube_key";
const API_BASE = "https://www.googleapis.com/youtube/v3";

const els = {
  settingsBtn: document.getElementById("settings-btn"),
  modal: document.getElementById("key-modal"),
  keyInput: document.getElementById("key-input"),
  keySave: document.getElementById("key-save"),
  keyCancel: document.getElementById("key-cancel"),
  regionSelect: document.getElementById("region-select"),
  categorySelect: document.getElementById("category-select"),
  topnSelect: document.getElementById("topn-select"),
  refreshBtn: document.getElementById("refresh-btn"),
  termForm: document.getElementById("term-form"),
  termInput: document.getElementById("term-input"),
  progress: document.getElementById("progress"),
  emptyState: document.getElementById("empty-state"),
  list: document.getElementById("list"),
  updatedAt: document.getElementById("updated-at"),
};

function getKey() {
  return localStorage.getItem(KEY_STORAGE) || "";
}

function openModal() {
  els.keyInput.value = getKey();
  els.modal.hidden = false;
}

function closeModal() {
  els.modal.hidden = true;
}

els.settingsBtn.addEventListener("click", openModal);
els.keyCancel.addEventListener("click", closeModal);
els.keySave.addEventListener("click", () => {
  const value = els.keyInput.value.trim();
  if (!value) return;
  localStorage.setItem(KEY_STORAGE, value);
  closeModal();
});

function setProgress(text) {
  if (!text) {
    els.progress.hidden = true;
    els.progress.textContent = "";
    return;
  }
  els.progress.hidden = false;
  els.progress.textContent = text;
}

async function apiGet(path, params) {
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

function cleanTitleForSearch(title) {
  return title
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/[|/•·].*$/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 6)
    .join(" ");
}

function hoursSince(iso) {
  return Math.max(0.5, (Date.now() - new Date(iso).getTime()) / 3600000);
}

// trendScore: log-normalizado contra el máximo de vistas/hora del lote actual.
function computeTrendScores(items) {
  const maxVph = Math.max(1, ...items.map((it) => it.viewsPerHour));
  return items.map((it) => ({
    ...it,
    trendScore: Math.round((100 * Math.log1p(it.viewsPerHour)) / Math.log1p(maxVph)),
  }));
}

// opportunityScore: entre menos videos existentes cubran el tema, más alto.
function opportunityFromTotalResults(totalResults) {
  const score = 100 - 22 * Math.log10(1 + totalResults);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function finalScore(trendScore, opportunityScore) {
  return Math.round(Math.sqrt(Math.max(0, trendScore) * Math.max(0, opportunityScore)));
}

// Cuenta cuántos videos ya existen sobre el mismo tema (search.list gasta
// ~100 unidades de cuota por llamada — por eso se limita a los top N).
async function fetchSupply(query, publishedAfterIso) {
  try {
    const json = await apiGet("search", {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 1,
      publishedAfter: publishedAfterIso,
    });
    return Number(json.pageInfo?.totalResults ?? 0);
  } catch (err) {
    console.warn(`Oferta falló para "${query}": ${err.message}`);
    return null;
  }
}

function renderCard(row) {
  const pctClass = row.viralidad >= 70 ? "pct-high" : row.viralidad >= 40 ? "pct-mid" : "pct-low";
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(row.query)}`;
  return `
    <div class="card">
      <div class="card-head">
        <span class="pct-badge ${pctClass}">${row.viralidad}%</span>
        <a class="title" href="${row.url}" target="_blank" rel="noopener">${row.title}</a>
      </div>
      <div class="card-meta">
        ${row.channelTitle} · ${row.views.toLocaleString("es-MX")} vistas ·
        ${Math.round(row.viewsPerHour).toLocaleString("es-MX")} vistas/h ·
        ${row.ageHours < 48 ? `${Math.round(row.ageHours)}h` : `${Math.round(row.ageHours / 24)}d`} de publicado
      </div>
      <div class="card-meta">
        Oferta en YouTube para "${row.query}":
        ${row.totalResults == null ? "no calculado" : `${row.totalResults.toLocaleString("es-MX")} videos`}
        · <a href="${searchUrl}" target="_blank" rel="noopener">ver búsqueda ↗</a>
      </div>
      <div class="score-bars">
        <div class="score-bar"><span>Tendencia</span><div class="bar"><i style="width:${row.trendScore}%"></i></div><b>${row.trendScore}%</b></div>
        <div class="score-bar"><span>Oportunidad</span><div class="bar"><i style="width:${row.opportunityScore}%"></i></div><b>${row.opportunityScore}%</b></div>
      </div>
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

async function runTrendingMode() {
  if (!getKey()) return openModal();
  const region = els.regionSelect.value;
  const categoryId = els.categorySelect.value;
  const topN = Number(els.topnSelect.value);

  setProgress("Descargando tendencias oficiales de YouTube...");
  els.list.innerHTML = "";
  els.emptyState.hidden = true;

  try {
    const json = await apiGet("videos", {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: region,
      videoCategoryId: categoryId,
      maxResults: 50,
    });

    let items = (json.items || []).map((v) => {
      const ageHours = hoursSince(v.snippet.publishedAt);
      const views = Number(v.statistics.viewCount || 0);
      return {
        id: v.id,
        title: v.snippet.title,
        channelTitle: v.snippet.channelTitle,
        publishedAt: v.snippet.publishedAt,
        views,
        ageHours,
        viewsPerHour: views / ageHours,
        url: `https://youtube.com/watch?v=${v.id}`,
        query: cleanTitleForSearch(v.snippet.title),
      };
    });

    items = computeTrendScores(items);
    items.sort((a, b) => b.trendScore - a.trendScore);
    const candidates = items.slice(0, topN);

    const rows = [];
    for (let i = 0; i < candidates.length; i++) {
      const it = candidates[i];
      setProgress(`Calculando oferta en YouTube (${i + 1}/${candidates.length})...`);
      const publishedAfter = new Date(new Date(it.publishedAt).getTime() - 5 * 86400000).toISOString();
      const totalResults = await fetchSupply(it.query, publishedAfter);
      const opportunityScore = totalResults == null ? 50 : opportunityFromTotalResults(totalResults);
      rows.push({
        ...it,
        totalResults,
        opportunityScore,
        viralidad: finalScore(it.trendScore, opportunityScore),
      });
    }

    rows.sort((a, b) => b.viralidad - a.viralidad);
    renderResults(rows);
    els.updatedAt.textContent = `Actualizado: ${new Date().toLocaleString("es-MX")} · ${rows.length} temas`;
  } catch (err) {
    els.emptyState.hidden = false;
    els.emptyState.textContent = `Error: ${err.message}`;
  } finally {
    setProgress(null);
  }
}

async function runTermSearch(term) {
  if (!getKey()) return openModal();
  setProgress(`Buscando "${term}" en YouTube...`);
  els.list.innerHTML = "";
  els.emptyState.hidden = true;

  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const searchJson = await apiGet("search", {
      part: "snippet",
      q: term,
      type: "video",
      order: "viewCount",
      publishedAfter: sevenDaysAgo,
      maxResults: 15,
    });
    const totalResults = Number(searchJson.pageInfo?.totalResults ?? 0);
    const ids = (searchJson.items || []).map((it) => it.id.videoId).filter(Boolean);

    if (ids.length === 0) {
      renderResults([]);
      els.updatedAt.textContent = `"${term}": 0 videos en los últimos 7 días — hueco total (100% oportunidad, pero sin tendencia confirmada aún).`;
      return;
    }

    const statsJson = await apiGet("videos", { part: "snippet,statistics", id: ids.join(",") });
    let items = (statsJson.items || []).map((v) => {
      const ageHours = hoursSince(v.snippet.publishedAt);
      const views = Number(v.statistics.viewCount || 0);
      return {
        id: v.id,
        title: v.snippet.title,
        channelTitle: v.snippet.channelTitle,
        publishedAt: v.snippet.publishedAt,
        views,
        ageHours,
        viewsPerHour: views / ageHours,
        url: `https://youtube.com/watch?v=${v.id}`,
        query: term,
      };
    });

    items = computeTrendScores(items);
    const opportunityScore = opportunityFromTotalResults(totalResults);
    const rows = items
      .map((it) => ({
        ...it,
        totalResults,
        opportunityScore,
        viralidad: finalScore(it.trendScore, opportunityScore),
      }))
      .sort((a, b) => b.viralidad - a.viralidad);

    renderResults(rows);
    els.updatedAt.textContent = `"${term}": ${totalResults.toLocaleString("es-MX")} videos en los últimos 7 días · oportunidad ${opportunityScore}%`;
  } catch (err) {
    els.emptyState.hidden = false;
    els.emptyState.textContent = `Error: ${err.message}`;
  } finally {
    setProgress(null);
  }
}

els.refreshBtn.addEventListener("click", runTrendingMode);
els.termForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const term = els.termInput.value.trim();
  if (term) runTermSearch(term);
});

if (!getKey()) openModal();
