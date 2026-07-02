import { findOutliers } from "./outliers-engine.js";
import { computeInsights } from "./insights.js";

const KEY_STORAGE = "outlier-tracker:api-key";
const DATA_STORAGE = "outlier-tracker:last-results";

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

let currentData = null;
let activeNiche = "all";
let niches = [];
let searchTerm = null;
let searchData = null;
let currentInsights = null;

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
  const videos = searchTerm
    ? searchData?.videos ?? []
    : (currentData?.videos ?? []).filter((v) => activeNiche === "all" || v.niches.includes(activeNiche));

  grid.innerHTML = "";
  emptyState.hidden = videos.length > 0;

  for (const v of videos) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = v.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";

    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="${v.thumbnail}" alt="" loading="lazy" />
        <span class="hero-badge">🚀 ${v.outlierMultiplier}x</span>
        <span class="date-badge">${formatRelativeDate(v.publishedAt)}</span>
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
        <div class="niche-tags">
          ${v.niches.map((n) => `<span class="niche-tag">${escapeHtml(nicheLabel(n))}</span>`).join("")}
        </div>
      </div>
    `;
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

async function init() {
  const res = await fetch("data/niches.json");
  niches = await res.json();

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
