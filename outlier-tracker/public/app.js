const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // vuelve a leer data.json cada 5 min

const grid = document.getElementById("grid");
const emptyState = document.getElementById("empty-state");
const updatedAtEl = document.getElementById("updated-at");
const countBadge = document.getElementById("count-badge");
const filtersEl = document.getElementById("niche-filters");

let currentData = null;
let activeNiche = "all";

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
  const niche = currentData?.niches.find((n) => n.id === id);
  return niche?.label ?? id;
}

function renderFilters() {
  const niches = currentData?.niches ?? [];
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

  for (const niche of niches) {
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
  const videos = (currentData?.videos ?? []).filter(
    (v) => activeNiche === "all" || v.niches.includes(activeNiche)
  );

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
        <span class="score-badge">+${v.outlierPercent}%</span>
      </div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(v.title)}</div>
        <div class="channel-row">
          ${v.channelThumbnail ? `<img src="${v.channelThumbnail}" alt="" />` : ""}
          <span>${escapeHtml(v.channelTitle)} · ${formatNumber(v.subscriberCount)} subs</span>
        </div>
        <div class="niche-tags">
          ${v.niches.map((n) => `<span class="niche-tag">${escapeHtml(nicheLabel(n))}</span>`).join("")}
        </div>
        <div class="stats-row">
          <span>${formatNumber(v.viewCount)} vistas (vs ${formatNumber(v.baselineViews)} típico)</span>
          <span>${formatRelativeDate(v.publishedAt)}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  }
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

async function loadData() {
  try {
    const res = await fetch(`data/outliers.json?t=${Date.now()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    currentData = await res.json();

    updatedAtEl.textContent = `Actualizado: ${new Date(currentData.generatedAt).toLocaleString("es")}`;
    countBadge.textContent = `${currentData.count} outliers`;

    renderFilters();
    renderGrid();
  } catch (err) {
    updatedAtEl.textContent = "No se pudieron cargar los datos";
    emptyState.hidden = false;
    console.error(err);
  }
}

loadData();
setInterval(loadData, REFRESH_INTERVAL_MS);
