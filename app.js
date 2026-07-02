import { findOutliers } from "./outliers-engine.js";
import { computeInsights } from "./insights.js";

const KEY_STORAGE = "outlier-tracker:api-key";
const DATA_STORAGE = "outlier-tracker:last-results";
const FAVORITES_STORAGE = "outlier-tracker:favorites";
const HISTORY_STORAGE = "outlier-tracker:search-history";
const MAX_HISTORY = 10;

const grid = document.getElementById("grid");
const emptyState = document.getElementById("empty-state");
const updatedAtEl = document.getElementById("updated-at");
const countBadge = document.getElementById("count-badge");
const filtersEl = document.getElementById("niche-filters");
const refreshBtn = document.getElementById("refresh-btn");
const settingsBtn = document.getElementById("settings-btn");
const progressEl = document.getElementById("progress");

const modal = document.getElementById("key-modal");
const keyInput = document.getElementById("key-input");
const keySave = document.getElementById("key-save");
const keyCancel = document.getElementById("key-cancel");

const termForm = document.getElementById("term-form");
const termInput = document.getElementById("term-input");
const searchBanner = document.getElementById("search-banner");
const searchBannerText = document.getElementById("search-banner-text");
const termClearBtn = document.getElementById("term-clear-btn");
const insightsBtn = document.getElementById("insights-btn");

const insightsModal = document.getElementById("insights-modal");
const insightsTermEl = document.getElementById("insights-term");
const insightsBody = document.getElementById("insights-body");
const insightsClose = document.getElementById("insights-close");

const searchHistoryEl = document.getElementById("search-history");
const instantSearchInput = document.getElementById("instant-search");
const sortSelect = document.getElementById("sort-select");
const favoritesToggleBtn = document.getElementById("favorites-toggle-btn");
const filtersToggleBtn = document.getElementById("filters-toggle-btn");
const filtersPanel = document.getElementById("filters-panel");
const filtersResetBtn = document.getElementById("filters-reset-btn");
const filterDurationMin = document.getElementById("filter-duration-min");
const filterDurationMax = document.getElementById("filter-duration-max");
const filterSubsMin = document.getElementById("filter-subs-min");
const filterSubsMax = document.getElementById("filter-subs-max");
const filterViewsMin = document.getElementById("filter-views-min");
const filterMultiplierMin = document.getElementById("filter-multiplier-min");
const exportCsvBtn = document.getElementById("export-csv-btn");
const exportJsonBtn = document.getElementById("export-json-btn");
const exportMdBtn = document.getElementById("export-md-btn");
const noMatchState = document.getElementById("no-match-state");

let currentData = null;
let activeNiche = "all";
let niches = [];
let searchTerm = null;
let searchData = null;
let currentInsights = null;

let instantSearchText = "";
let sortKey = "outlierMultiplier";
let favoritesOnly = false;
let advancedFilters = { durationMin: null, durationMax: null, subsMin: null, subsMax: null, viewsMin: null, multiplierMin: null };
let favorites = new Set(JSON.parse(localStorage.getItem(FAVORITES_STORAGE) || "[]"));
let searchHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE) || "[]");

function formatNumber(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatRelativeDate(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days <= 0) return "hoy";
  if (days === 1) return "hace 1 día";
  return `hace ${days} días`;
}

function nicheLabel(id) {
  const dataset = searchTerm ? searchData : currentData;
  return dataset?.niches.find((n) => n.id === id)?.label ?? id;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function classifyOutlier(multiplier) {
  if (multiplier >= 10) return "🔥 Explosivo";
  if (multiplier >= 5) return "🚀 Muy Viral";
  if (multiplier >= 3) return "⭐ Outlier";
  return "📈 Prometedor";
}

function isFavorite(videoId) {
  return favorites.has(videoId);
}

function toggleFavorite(videoId) {
  if (favorites.has(videoId)) favorites.delete(videoId);
  else favorites.add(videoId);
  localStorage.setItem(FAVORITES_STORAGE, JSON.stringify([...favorites]));
}

function addToSearchHistory(term) {
  searchHistory = [term, ...searchHistory.filter((t) => t !== term)].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_STORAGE, JSON.stringify(searchHistory));
  renderSearchHistory();
}

function renderSearchHistory() {
  searchHistoryEl.innerHTML = searchHistory
    .map((term) => `<button class="history-chip" data-term="${escapeHtml(term)}">🕐 ${escapeHtml(term)}</button>`)
    .join("");
  for (const chip of searchHistoryEl.querySelectorAll(".history-chip")) {
    chip.addEventListener("click", () => {
      termInput.value = chip.dataset.term;
      runTermSearch(chip.dataset.term);
    });
  }
}

function getVisibleVideos() {
  let videos = searchTerm
    ? searchData?.videos ?? []
    : (currentData?.videos ?? []).filter((v) => activeNiche === "all" || v.niches.includes(activeNiche));

  if (instantSearchText) {
    const q = instantSearchText.toLowerCase();
    videos = videos.filter((v) => v.title.toLowerCase().includes(q) || v.channelTitle.toLowerCase().includes(q));
  }

  if (favoritesOnly) videos = videos.filter((v) => isFavorite(v.videoId));

  const f = advancedFilters;
  videos = videos.filter((v) => {
    const durationMin = v.durationSeconds / 60;
    if (f.durationMin !== null && durationMin < f.durationMin) return false;
    if (f.durationMax !== null && durationMin > f.durationMax) return false;
    if (f.subsMin !== null && v.subscriberCount < f.subsMin) return false;
    if (f.subsMax !== null && v.subscriberCount > f.subsMax) return false;
    if (f.viewsMin !== null && v.viewCount < f.viewsMin) return false;
    if (f.multiplierMin !== null && v.outlierMultiplier < f.multiplierMin) return false;
    return true;
  });

  videos = [...videos].sort((a, b) => {
    if (sortKey === "publishedAt") return new Date(b.publishedAt) - new Date(a.publishedAt);
    return (b[sortKey] ?? 0) - (a[sortKey] ?? 0);
  });

  return videos;
}

function csvEscape(val) {
  const s = String(val ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const headers = [
    "Título", "Canal", "Suscriptores", "Vistas", "Vistas típicas del canal", "% Outlier", "Multiplicador",
    "Vistas/día", "Vistas/Sub", "Engagement %", "Duración (min)", "Fecha", "URL",
  ];
  const rows = getVisibleVideos().map((v) => [
    v.title, v.channelTitle, v.subscriberCount, v.viewCount, v.baselineViews, v.outlierPercent, v.outlierMultiplier,
    v.viewsPerDay, v.viewsPerSubscriber, v.engagementRate, Math.round(v.durationSeconds / 60), v.publishedAt, v.url,
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
  downloadBlob(csv, "outliers.csv", "text/csv");
}

function exportJson() {
  downloadBlob(JSON.stringify(getVisibleVideos(), null, 2), "outliers.json", "application/json");
}

function exportMarkdown() {
  const lines = ["| Título | Canal | Subs | Vistas | Multiplicador | URL |", "|---|---|---|---|---|---|"];
  for (const v of getVisibleVideos()) {
    lines.push(`| ${v.title.replace(/\|/g, "\\|")} | ${v.channelTitle} | ${v.subscriberCount} | ${v.viewCount} | ${v.outlierMultiplier}x | ${v.url} |`);
  }
  downloadBlob(lines.join("\n"), "outliers.md", "text/markdown");
}

function renderFilters() {
  if (searchTerm) {
    filtersEl.hidden = true;
    return;
  }
  filtersEl.hidden = false;

  const list = currentData?.niches ?? [];
  filtersEl.innerHTML = "";

  const allChip = document.createElement("button");
  allChip.className = `filter-chip ${activeNiche === "all" ? "active" : ""}`;
  allChip.textContent = "Todos";
  allChip.onclick = () => {
    activeNiche = "all";
    renderFilters();
    renderGrid();
  };
  filtersEl.appendChild(allChip);

  for (const niche of list) {
    const chip = document.createElement("button");
    chip.className = `filter-chip ${activeNiche === niche.id ? "active" : ""}`;
    chip.textContent = niche.label;
    chip.onclick = () => {
      activeNiche = niche.id;
      renderFilters();
      renderGrid();
    };
    filtersEl.appendChild(chip);
  }
}

function renderGrid() {
  const baseVideos = searchTerm
    ? searchData?.videos ?? []
    : (currentData?.videos ?? []).filter((v) => activeNiche === "all" || v.niches.includes(activeNiche));
  const videos = getVisibleVideos();

  grid.innerHTML = "";
  emptyState.hidden = baseVideos.length > 0;
  noMatchState.hidden = baseVideos.length === 0 || videos.length > 0;

  for (const v of videos) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = v.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="${v.thumbnail}" alt="" loading="lazy" />
        <span class="classification-tag">${classifyOutlier(v.outlierMultiplier)}</span>
        <span class="hero-badge">🚀 ${v.outlierMultiplier}x</span>
        <span class="date-badge">${formatRelativeDate(v.publishedAt)}</span>
        <button class="favorite-star ${isFavorite(v.videoId) ? "active" : ""}" data-video-id="${v.videoId}" title="Favorito">${isFavorite(v.videoId) ? "★" : "☆"}</button>
      </div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(v.title)}</div>
        <div class="channel-row">
          ${v.channelThumbnail ? `<img src="${v.channelThumbnail}" alt="" />` : ""}
          <span>${escapeHtml(v.channelTitle)}</span>
        </div>
        <div class="stat-grid">
          <div class="stat-tile">
            <div class="stat-label">👁 Vistas</div>
            <div class="stat-value">${formatNumber(v.viewCount)}</div>
            <div class="stat-delta">vs ${formatNumber(v.baselineViews)} típico</div>
          </div>
          <div class="stat-tile">
            <div class="stat-label">👥 Suscriptores</div>
            <div class="stat-value">${formatNumber(v.subscriberCount)}</div>
            <div class="stat-delta stat-delta-accent">+${v.outlierPercent}% outlier</div>
          </div>
        </div>
        <div class="metrics-row">
          <span>${formatNumber(v.viewsPerDay ?? 0)} vistas/día</span>
          <span>${v.viewsPerSubscriber ?? 0}x vistas/sub</span>
          <span>${v.engagementRate ?? 0}% engagement</span>
        </div>
        <div class="niche-tags">
          ${v.niches.map((n) => `<span class="niche-tag">${escapeHtml(nicheLabel(n))}</span>`).join("")}
        </div>
      </div>
    `;

    card.querySelector(".favorite-star").addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(v.videoId);
      renderGrid();
    });

    grid.appendChild(card);
  }
}

function applyData(data) {
  currentData = data;
  updatedAtEl.textContent = data.generatedAt
    ? `Actualizado: ${new Date(data.generatedAt).toLocaleString("es")}`
    : "Sin datos todavía";
  countBadge.textContent = data.count ? `${data.count} outliers` : "";
  renderFilters();
  renderGrid();
}

function getStoredKey() {
  return localStorage.getItem(KEY_STORAGE) || "";
}

function showKeyModal() {
  keyInput.value = getStoredKey();
  modal.hidden = false;
  keyInput.focus();
}

function hideKeyModal() {
  modal.hidden = true;
}

async function runSearch() {
  let apiKey = getStoredKey();
  if (!apiKey) {
    showKeyModal();
    return;
  }

  if (searchTerm) clearTermSearch();

  refreshBtn.disabled = true;
  progressEl.hidden = false;
  progressEl.textContent = "Iniciando búsqueda...";

  try {
    const data = await findOutliers(apiKey, niches, (msg) => {
      progressEl.textContent = msg;
    });
    applyData(data);
    localStorage.setItem(DATA_STORAGE, JSON.stringify(data));
    progressEl.textContent = `Listo: ${data.count} outliers encontrados.`;
    setTimeout(() => (progressEl.hidden = true), 4000);
  } catch (err) {
    console.error(err);
    if (err.reason === "keyInvalid" || err.reason === "forbidden" || err.reason === "API_KEY_SERVICE_BLOCKED") {
      progressEl.textContent = `Clave inválida o API no habilitada: ${err.message}`;
      showKeyModal();
    } else {
      progressEl.textContent = `Error: ${err.message}`;
    }
  } finally {
    refreshBtn.disabled = false;
  }
}

function renderInsightsModal(term, insights) {
  insightsTermEl.textContent = term;

  if (!insights) {
    insightsBody.innerHTML = `<p class="insights-empty">No hay suficientes datos para armar un resumen.</p>`;
    insightsModal.hidden = false;
    return;
  }

  const wordsHtml = insights.topWords.length
    ? insights.topWords.map(([word, count]) => `<span class="insights-word">${escapeHtml(word)} · ${count}</span>`).join("")
    : `<span class="insights-empty">Sin patrones repetidos claros.</span>`;

  const dayText = insights.bestDay
    ? `${insights.bestDay.day} (${insights.bestDay.count} de ${insights.bestDay.total} videos)`
    : "Sin datos suficientes";

  const subsText = insights.subsRange
    ? `${formatNumber(insights.subsRange.min)} – ${formatNumber(insights.subsRange.max)} suscriptores`
    : "Sin datos";

  insightsBody.innerHTML = `
    <div class="insights-stats">
      <div class="stat-tile">
        <div class="stat-label">🚀 Multiplicador promedio</div>
        <div class="stat-value">${insights.avgMultiplier}x</div>
        <div class="stat-delta">máximo: ${insights.topMultiplier}x</div>
      </div>
      <div class="stat-tile">
        <div class="stat-label">⏱ Duración típica</div>
        <div class="stat-value">${insights.medianDurationMin} min</div>
        <div class="stat-delta">mediana de los ${insights.count} outliers</div>
      </div>
    </div>
    <div>
      <div class="insights-section-label">📅 Mejor día de publicación</div>
      <div>${escapeHtml(dayText)}</div>
    </div>
    <div>
      <div class="insights-section-label">👥 Rango de suscriptores de los canales</div>
      <div>${escapeHtml(subsText)}</div>
    </div>
    <div>
      <div class="insights-section-label">🔤 Palabras repetidas en los títulos</div>
      <div class="insights-word-list">${wordsHtml}</div>
    </div>
  `;
  insightsModal.hidden = false;
}

function hideInsightsModal() {
  insightsModal.hidden = true;
}

async function runTermSearch(term) {
  let apiKey = getStoredKey();
  if (!apiKey) {
    showKeyModal();
    return;
  }

  refreshBtn.disabled = true;
  termInput.disabled = true;
  progressEl.hidden = false;
  progressEl.textContent = `Buscando "${term}"...`;

  try {
    const data = await findOutliers(apiKey, [{ id: "custom-term", label: term, query: term }], (msg) => {
      progressEl.textContent = msg;
    });
    searchTerm = term;
    searchData = data;
    searchBanner.hidden = false;
    searchBannerText.textContent = data.count
      ? `${data.count} outliers para "${term}"`
      : `Sin outliers para "${term}" en el último mes`;
    addToSearchHistory(term);
    renderFilters();
    renderGrid();
    progressEl.textContent = `Listo: ${data.count} outliers encontrados para "${term}".`;
    setTimeout(() => (progressEl.hidden = true), 4000);

    if (data.count > 0) {
      currentInsights = computeInsights(data.videos);
      insightsBtn.hidden = false;
      renderInsightsModal(term, currentInsights);
    } else {
      currentInsights = null;
      insightsBtn.hidden = true;
    }
  } catch (err) {
    console.error(err);
    if (err.reason === "keyInvalid" || err.reason === "forbidden" || err.reason === "API_KEY_SERVICE_BLOCKED") {
      progressEl.textContent = `Clave inválida o API no habilitada: ${err.message}`;
      showKeyModal();
    } else {
      progressEl.textContent = `Error: ${err.message}`;
    }
  } finally {
    refreshBtn.disabled = false;
    termInput.disabled = false;
  }
}

function clearTermSearch() {
  searchTerm = null;
  searchData = null;
  currentInsights = null;
  searchBanner.hidden = true;
  insightsBtn.hidden = true;
  termInput.value = "";
  renderFilters();
  renderGrid();
}

termForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const term = termInput.value.trim();
  if (!term) return;
  runTermSearch(term);
});
termClearBtn.addEventListener("click", clearTermSearch);
insightsBtn.addEventListener("click", () => renderInsightsModal(searchTerm, currentInsights));
insightsClose.addEventListener("click", hideInsightsModal);

refreshBtn.addEventListener("click", runSearch);
settingsBtn.addEventListener("click", showKeyModal);
keyCancel.addEventListener("click", hideKeyModal);
keySave.addEventListener("click", () => {
  const value = keyInput.value.trim();
  if (!value) return;
  localStorage.setItem(KEY_STORAGE, value);
  hideKeyModal();
  runSearch();
});
keyInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") keySave.click();
});

instantSearchInput.addEventListener("input", () => {
  instantSearchText = instantSearchInput.value.trim();
  renderGrid();
});

sortSelect.addEventListener("change", () => {
  sortKey = sortSelect.value;
  renderGrid();
});

favoritesToggleBtn.addEventListener("click", () => {
  favoritesOnly = !favoritesOnly;
  favoritesToggleBtn.classList.toggle("active", favoritesOnly);
  favoritesToggleBtn.textContent = favoritesOnly ? "★ Favoritos" : "☆ Favoritos";
  renderGrid();
});

filtersToggleBtn.addEventListener("click", () => {
  filtersPanel.hidden = !filtersPanel.hidden;
});

function applyAdvancedFiltersFromInputs() {
  const num = (input) => (input.value === "" ? null : Number(input.value));
  advancedFilters = {
    durationMin: num(filterDurationMin),
    durationMax: num(filterDurationMax),
    subsMin: num(filterSubsMin),
    subsMax: num(filterSubsMax),
    viewsMin: num(filterViewsMin),
    multiplierMin: num(filterMultiplierMin),
  };
  renderGrid();
}

for (const input of [filterDurationMin, filterDurationMax, filterSubsMin, filterSubsMax, filterViewsMin, filterMultiplierMin]) {
  input.addEventListener("input", applyAdvancedFiltersFromInputs);
}

filtersResetBtn.addEventListener("click", () => {
  for (const input of [filterDurationMin, filterDurationMax, filterSubsMin, filterSubsMax, filterViewsMin, filterMultiplierMin]) {
    input.value = "";
  }
  advancedFilters = { durationMin: null, durationMax: null, subsMin: null, subsMax: null, viewsMin: null, multiplierMin: null };
  renderGrid();
});

exportCsvBtn.addEventListener("click", exportCsv);
exportJsonBtn.addEventListener("click", exportJson);
exportMdBtn.addEventListener("click", exportMarkdown);

async function init() {
  const res = await fetch("data/niches.json");
  niches = await res.json();
  renderSearchHistory();

  const cached = localStorage.getItem(DATA_STORAGE);
  if (cached) {
    applyData(JSON.parse(cached));
  } else {
    try {
      const demo = await fetch(`data/outliers.json?t=${Date.now()}`).then((r) => r.json());
      applyData(demo);
    } catch {
      applyData({ generatedAt: null, niches: [], count: 0, videos: [] });
    }
  }

  if (!getStoredKey()) showKeyModal();
}

init();
