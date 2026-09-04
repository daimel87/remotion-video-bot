// Lee el snapshot público que el workflow de GitHub Actions guarda en la
// rama trend-hunter-data. raw.githubusercontent.com sirve JSON con CORS
// abierto, así que esto funciona 100% en el navegador, sin API key ni
// servidor propio.

const REPO = "daimel87/remotion-video-bot";
const DATA_URL = `https://raw.githubusercontent.com/${REPO}/trend-hunter-data/trend-hunter/output/latest.json?_=${Date.now()}`;
const HISTORY_URL = `https://github.com/${REPO}/tree/trend-hunter-data/trend-hunter/output/history`;
const ACTIONS_URL = `https://github.com/${REPO}/actions/workflows/trend-hunter.yml`;

const statusEl = document.getElementById("status");
const listEl = document.getElementById("list");
document.getElementById("history-link").href = HISTORY_URL;
document.getElementById("actions-link").href = ACTIONS_URL;

function timeAgo(iso) {
  const diffMin = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (diffMin < 60) return `hace ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return `hace ${h}h ${m}min`;
}

function renderCard(row) {
  const badges = [];
  if (row.isNew) badges.push(`<span class="badge new">🆕 NUEVO</span>`);
  else if (row.scorePerHour != null) {
    const cls = row.scorePerHour >= 3 ? "hot" : "";
    badges.push(`<span class="badge ${cls}">⚡ ${row.scorePerHour >= 0 ? "+" : ""}${row.scorePerHour}/h</span>`);
  }
  if (row.gap) badges.push(`<span class="badge gap">🟢 HUECO EN YOUTUBE</span>`);

  const yt = row.youtube || {};
  const ytLine = yt.skipped
    ? "YouTube no revisado (falta YOUTUBE_API_KEY)"
    : `YouTube: ${yt.videoCount ?? 0} videos recientes, máx ${yt.maxViewsPerHour ?? 0} vistas/h`;

  const samples = (row.samples || [])
    .slice(0, 3)
    .map((s) => `<li>[${s.source}] ${s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${s.title}</a>` : s.title}</li>`)
    .join("");

  return `
    <div class="card">
      <div class="card-head">
        <span class="token">#${row.token}</span>
        ${badges.join(" ")}
      </div>
      <div class="card-meta">score ${row.score} · ${row.distinctSourceTypes} fuentes distintas · ${ytLine}</div>
      <ul class="samples">${samples}</ul>
    </div>
  `;
}

async function load() {
  statusEl.textContent = "Cargando último snapshot...";
  try {
    const res = await fetch(DATA_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const top = data.top || [];

    statusEl.textContent = `Última corrida: ${timeAgo(data.generatedAt)} (${new Date(data.generatedAt).toLocaleString("es-MX")})`;

    if (top.length === 0) {
      listEl.innerHTML = `<div class="empty">Sin temas con señal cruzada en la última corrida.</div>`;
      return;
    }
    listEl.innerHTML = top.map(renderCard).join("");
  } catch (err) {
    statusEl.textContent = "";
    listEl.innerHTML = `
      <div class="empty">
        No se pudo cargar el snapshot (¿el workflow ya corrió al menos una vez?
        ¿la rama <code>trend-hunter-data</code> existe?).<br />
        Detalle: ${err.message}
      </div>
    `;
  }
}

document.getElementById("refresh-btn").addEventListener("click", load);
load();
