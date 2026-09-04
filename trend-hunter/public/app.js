// Todo corre en el navegador con tu clave de YouTube Data API v3
// (localStorage, nunca sale de tu dispositivo). Sin proxies, sin Reddit,
// sin Trends, sin X — solo YouTube, porque es la única fuente que de
// verdad deja llamarla directo desde el navegador sin bloqueos.
//
// Para cada tema que escribas, busca los videos más vistos publicados
// recientemente y marca los que son "outlier": de un canal chico
// (pocos suscriptores) con una cantidad de vistas fuera de lo normal para
// ese tamaño de canal — el tipo de señal real de que algo está pegando
// antes de que se sature.
//
// % de viralidad = raíz(anomalía × oportunidad):
//  - anomalía (0-100%): qué tan por encima está viewCount/subscriberCount
//    de lo normal (una referencia de 80x = 100%, ej. 13k subs con 1M
//    de vistas ≈ 77x ≈ 100%).
//  - oportunidad (0-100%): qué tan poca oferta hay en YouTube para ese
//    tema completo (menos videos totales sobre el tema = más alto).
// Hace falta que AMBAS sean altas para llegar a 100%.

const KEY_STORAGE = "trendhunter_youtube_key";
const TOPICS_STORAGE = "trendhunter_topics";
const API_BASE = "https://www.googleapis.com/youtube/v3";
const REFERENCE_RATIO = 80; // vistas/suscriptor que se considera "100% anomalía"

// Si no escribís ningún tema, se escanean estas categorías generales de
// YouTube en su lugar (sin necesidad de palabra clave — search.list acepta
// videoCategoryId solo, sin "q") para poder simplemente pegar la clave y
// darle a "Buscar outliers" sin escribir nada.
const DEFAULT_CATEGORIES = [
  { id: "25", label: "Noticias y política" },
  { id: "24", label: "Entretenimiento" },
  { id: "22", label: "Personas y blogs" },
  { id: "27", label: "Educación" },
  { id: "28", label: "Ciencia y tecnología" },
  { id: "23", label: "Comedia" },
];

const els = {
  settingsBtn: document.getElementById("settings-btn"),
  modal: document.getElementById("key-modal"),
  keyInput: document.getElementById("key-input"),
  keySave: document.getElementById("key-save"),
  keyCancel: document.getElementById("key-cancel"),
  topicsInput: document.getElementById("topics-input"),
  daysSelect: document.getElementById("days-select"),
  subsSelect: document.getElementById("subs-select"),
  minViewsSelect: document.getElementById("minviews-select"),
  topnSelect: document.getElementById("topn-select"),
  refreshBtn: document.getElementById("refresh-btn"),
  progress: document.getElementById("progress"),
  emptyState: document.getElementById("empty-state"),
  list: document.getElementById("list"),
  updatedAt: document.getElementById("updated-at"),
};

function getKey() { return localStorage.getItem(KEY_STORAGE) || ""; }
function getTopics() { return localStorage.getItem(TOPICS_STORAGE) || ""; }

els.topicsInput.value = getTopics();
els.topicsInput.addEventListener("change", () => {
  localStorage.setItem(TOPICS_STORAGE, els.topicsInput.value);
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

// ---------- YouTube ----------

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

function anomalyFromViewsPerSub(viewsPerSub) {
  const score = (100 * Math.log1p(viewsPerSub)) / Math.log1p(REFERENCE_RATIO);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function finalScore(a, b) {
  return Math.round(Math.sqrt(Math.max(0, a) * Math.max(0, b)));
}

// Busca los videos más vistos publicados en la ventana de días, junto con
// las estadísticas de sus canales (suscriptores) en un solo lote extra —
// 1 search.list (100 unidades) + 1 videos.list + 1 channels.list (1 unidad
// cada uno, ambos por lote) por tema/categoría.
//
// spec es { label, q } para un tema escrito a mano, o { label, categoryId }
// para escanear una categoría general de YouTube sin palabra clave (así se
// puede buscar sin escribir nada).
async function fetchTopicCandidates(spec, publishedAfterIso, subThreshold, minViews) {
  const searchJson = await ytGet("search", {
    part: "snippet",
    q: spec.q,
    videoCategoryId: spec.categoryId,
    type: "video",
    order: "viewCount",
    publishedAfter: publishedAfterIso,
    maxResults: 25,
  });
  const topic = spec.label;
  const totalResults = Number(searchJson.pageInfo?.totalResults ?? 0);
  const ids = (searchJson.items || []).map((it) => it.id.videoId).filter(Boolean);
  if (ids.length === 0) return { topic, totalResults, candidates: [] };

  const statsJson = await ytGet("videos", { part: "snippet,statistics", id: ids.join(",") });
  const videos = statsJson.items || [];

  const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))];
  const channelsJson = await ytGet("channels", { part: "statistics", id: channelIds.join(",") });
  const subsByChannel = new Map(
    (channelsJson.items || []).map((c) => [
      c.id,
      c.statistics.hiddenSubscriberCount ? null : Number(c.statistics.subscriberCount || 0),
    ])
  );

  const candidates = [];
  for (const v of videos) {
    const views = Number(v.statistics.viewCount || 0);
    if (views < minViews) continue;
    const subs = subsByChannel.get(v.snippet.channelId);
    if (subs == null || subs > subThreshold) continue; // canal oculta subs, o es "grande"

    const ageHours = Math.max(0.5, (Date.now() - new Date(v.snippet.publishedAt).getTime()) / 3600000);
    const viewsPerSub = views / Math.max(1, subs);
    candidates.push({
      topic,
      title: v.snippet.title,
      channelTitle: v.snippet.channelTitle,
      url: `https://youtube.com/watch?v=${v.id}`,
      views,
      subs,
      viewsPerSub,
      viewsPerHour: Math.round(views / ageHours),
      ageHours,
    });
  }

  return { topic, totalResults, candidates };
}

function renderCard(row) {
  const pctClass = row.viralidad >= 70 ? "pct-high" : row.viralidad >= 40 ? "pct-mid" : "pct-low";
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(row.topic)}`;
  const ageLabel = row.ageHours < 48 ? `${Math.round(row.ageHours)}h` : `${Math.round(row.ageHours / 24)}d`;

  return `
    <div class="card">
      <div class="card-head">
        <span class="pct-badge ${pctClass}">${row.viralidad}%</span>
        <a class="title" href="${row.url}" target="_blank" rel="noopener">${row.title}</a>
      </div>
      <div class="card-meta">
        ${row.channelTitle} · ${row.subs.toLocaleString("es-MX")} subs · ${row.views.toLocaleString("es-MX")} vistas
        (${row.viewsPerSub.toFixed(1)}x sus subs) · ${row.viewsPerHour.toLocaleString("es-MX")} vistas/h · publicado hace ${ageLabel}
      </div>
      <div class="card-meta">
        Tema "${row.topic}": ${row.totalResults.toLocaleString("es-MX")} videos en total en YouTube
        · <a href="${searchUrl}" target="_blank" rel="noopener">ver búsqueda ↗</a>
      </div>
      <div class="score-bars">
        <div class="score-bar"><span>Anomalía</span><div class="bar"><i style="width:${row.trendScore}%"></i></div><b>${row.trendScore}%</b></div>
        <div class="score-bar"><span>Oportunidad</span><div class="bar"><i style="width:${row.opportunityScore}%"></i></div><b>${row.opportunityScore}%</b></div>
      </div>
    </div>
  `;
}

function renderResults(rows) {
  if (rows.length === 0) {
    els.list.innerHTML = "";
    els.emptyState.hidden = false;
    els.emptyState.textContent =
      "Sin outliers con estos filtros. Prueba subir el tope de suscriptores, bajar las vistas mínimas, o cambiar de tema.";
    return;
  }
  els.emptyState.hidden = true;
  els.list.innerHTML = rows.map(renderCard).join("");
}

async function runSearch() {
  if (!getKey()) return openModal();

  const typedTopics = els.topicsInput.value
    .split(/[\n,]/)
    .map((t) => t.trim())
    .filter(Boolean);

  // Sin temas escritos: escanea categorías generales en vez de pedir texto.
  const specs = typedTopics.length > 0
    ? typedTopics.map((t) => ({ label: t, q: t }))
    : DEFAULT_CATEGORIES.map((c) => ({ label: c.label, categoryId: c.id }));

  const days = Number(els.daysSelect.value);
  const subThreshold = Number(els.subsSelect.value);
  const minViews = Number(els.minViewsSelect.value);
  const topN = Number(els.topnSelect.value);
  const publishedAfter = new Date(Date.now() - days * 86400000).toISOString();

  els.list.innerHTML = "";
  els.emptyState.hidden = true;

  const allCandidates = [];
  let errorCount = 0;
  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    setProgress(`Buscando outliers en "${spec.label}" (${i + 1}/${specs.length})...`);
    try {
      const { totalResults, candidates } = await fetchTopicCandidates(spec, publishedAfter, subThreshold, minViews);
      const opportunityScore = opportunityFromTotalResults(totalResults);
      for (const c of candidates) {
        const trendScore = anomalyFromViewsPerSub(c.viewsPerSub);
        allCandidates.push({ ...c, totalResults, opportunityScore, trendScore, viralidad: finalScore(trendScore, opportunityScore) });
      }
    } catch (err) {
      errorCount++;
      console.warn(`"${spec.label}" falló: ${err.message}`);
    }
  }

  setProgress(null);

  if (allCandidates.length === 0 && errorCount === specs.length) {
    els.emptyState.hidden = false;
    els.emptyState.textContent = "Todas las búsquedas fallaron — revisa tu clave de YouTube (¿tiene cuota disponible hoy?).";
    return;
  }

  allCandidates.sort((a, b) => b.viralidad - a.viralidad);
  const rows = allCandidates.slice(0, topN);
  renderResults(rows);
  const modeLabel = typedTopics.length > 0 ? "tema(s)" : "categoría(s) generales";
  els.updatedAt.textContent = `Actualizado: ${new Date().toLocaleString("es-MX")} · ${allCandidates.length} outlier(es) encontrados en ${specs.length} ${modeLabel}${errorCount ? ` (${errorCount} con error)` : ""}`;
}

els.refreshBtn.addEventListener("click", runSearch);

if (!getKey()) openModal();
