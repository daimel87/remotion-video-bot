import { researchTopic } from "./research-engine.js";

const KEY_STORAGE = "outlier-tracker:api-key"; // misma clave que el outlier tracker, si es el mismo sitio
const WORKER_STORAGE = "research-copilot:worker-url";

const termForm = document.getElementById("term-form");
const termInput = document.getElementById("term-input");
const progressEl = document.getElementById("progress");
const emptyState = document.getElementById("empty-state");
const results = document.getElementById("results");
const grid = document.getElementById("grid");
const settingsBtn = document.getElementById("settings-btn");

const statDuration = document.getElementById("stat-duration");
const statViews = document.getElementById("stat-views");
const statNumbers = document.getElementById("stat-numbers");
const statTranscripts = document.getElementById("stat-transcripts");
const titleWordsEl = document.getElementById("title-words");
const hookWordsEl = document.getElementById("hook-words");
const hookExamplesEl = document.getElementById("hook-examples");
const hooksSection = document.getElementById("hooks-section");

const settingsModal = document.getElementById("settings-modal");
const keyInput = document.getElementById("key-input");
const workerInput = document.getElementById("worker-input");
const settingsSave = document.getElementById("settings-save");
const settingsCancel = document.getElementById("settings-cancel");

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

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function getStoredKey() {
  return localStorage.getItem(KEY_STORAGE) || "";
}

function getStoredWorkerUrl() {
  return localStorage.getItem(WORKER_STORAGE) || "";
}

function showSettingsModal() {
  keyInput.value = getStoredKey();
  workerInput.value = getStoredWorkerUrl();
  settingsModal.hidden = false;
}

function hideSettingsModal() {
  settingsModal.hidden = true;
}

function renderResults(data) {
  emptyState.hidden = true;
  results.hidden = false;

  statDuration.textContent = `${data.patterns.duration.medianMinutes} min`;
  statViews.textContent = formatNumber(data.patterns.views.median);
  statNumbers.textContent = `${data.patterns.titles.pctWithNumber}%`;
  statTranscripts.textContent = `${data.patterns.transcriptCoverage}/${data.patterns.videoCount}`;

  titleWordsEl.innerHTML = data.patterns.titles.topWords.length
    ? data.patterns.titles.topWords.map(([w, c]) => `<span class="insights-word">${escapeHtml(w)} · ${c}</span>`).join("")
    : `<span class="insights-empty">Sin patrones repetidos claros.</span>`;

  if (data.patterns.transcriptCoverage > 0) {
    hooksSection.hidden = false;
    hookWordsEl.innerHTML = data.patterns.hooks.topWords.length
      ? data.patterns.hooks.topWords.map(([w, c]) => `<span class="insights-word">${escapeHtml(w)} · ${c}</span>`).join("")
      : `<span class="insights-empty">Sin palabras de apertura repetidas.</span>`;
    hookExamplesEl.innerHTML = data.patterns.hooks.examples
      .map(
        (h) => `
        <div class="hook-example">
          <div class="hook-title">${escapeHtml(h.title)}</div>
          <div class="hook-text">"${escapeHtml(h.hook)}"</div>
        </div>`
      )
      .join("");
  } else {
    hooksSection.hidden = true;
  }

  grid.innerHTML = "";
  for (const v of data.videos) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = v.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="${v.thumbnail}" alt="" loading="lazy" />
        <span class="hero-badge">${formatNumber(v.viewCount)}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${escapeHtml(v.title)}</div>
        <div class="channel-row">
          <span>${escapeHtml(v.channelTitle)} · ${Math.round(v.durationSeconds / 60)} min · ${formatRelativeDate(v.publishedAt)}</span>
        </div>
        ${v.hook ? `<div class="card-hook">"${escapeHtml(v.hook)}"</div>` : ""}
      </div>
    `;
    grid.appendChild(card);
  }
}

async function runResearch(topic) {
  const apiKey = getStoredKey();
  if (!apiKey) {
    showSettingsModal();
    return;
  }
  const workerUrl = getStoredWorkerUrl();

  termInput.disabled = true;
  progressEl.hidden = false;
  progressEl.textContent = "Iniciando investigación...";

  try {
    const data = await researchTopic(apiKey, topic, workerUrl, (msg) => {
      progressEl.textContent = msg;
    });
    renderResults(data);
    progressEl.textContent = `Listo: ${data.patterns.videoCount} videos analizados${
      workerUrl ? `, ${data.patterns.transcriptCoverage} con transcripción` : " (sin proxy de transcripciones configurado)"
    }.`;
    setTimeout(() => (progressEl.hidden = true), 5000);
  } catch (err) {
    console.error(err);
    if (err.reason === "keyInvalid" || err.reason === "forbidden" || err.reason === "API_KEY_SERVICE_BLOCKED") {
      progressEl.textContent = `Clave inválida o API no habilitada: ${err.message}`;
      showSettingsModal();
    } else {
      progressEl.textContent = `Error: ${err.message}`;
    }
  } finally {
    termInput.disabled = false;
  }
}

termForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const topic = termInput.value.trim();
  if (!topic) return;
  runResearch(topic);
});

settingsBtn.addEventListener("click", showSettingsModal);
settingsCancel.addEventListener("click", hideSettingsModal);
settingsSave.addEventListener("click", () => {
  const key = keyInput.value.trim();
  const worker = workerInput.value.trim();
  if (key) localStorage.setItem(KEY_STORAGE, key);
  if (worker) localStorage.setItem(WORKER_STORAGE, worker);
  else localStorage.removeItem(WORKER_STORAGE);
  hideSettingsModal();
});

if (!getStoredKey()) showSettingsModal();
