#!/usr/bin/env node
// Lee el último snapshot y, si hay temas NUEVOS o ACELERANDO con señal en
// 2+ fuentes, imprime el texto de alerta en Markdown por stdout. Si no hay
// nada digno de aviso, no imprime nada (y el workflow no molesta a nadie).

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const latestFile = path.join(ROOT, "output", "latest.json");

if (!existsSync(latestFile)) process.exit(0);

const snapshot = JSON.parse(readFileSync(latestFile, "utf8"));
const HOT_VELOCITY = 3; // score/hora — mismo umbral que hunt.mjs

const hot = (snapshot.top || []).filter(
  (r) => r.distinctSourceTypes >= 2 && (r.isNew || (r.scorePerHour ?? 0) >= HOT_VELOCITY)
);

if (hot.length === 0) process.exit(0);

const lines = [
  `### 🔎 Trend Hunter — ${hot.length} tema(s) con señal fuerte`,
  `_Corrida: ${snapshot.generatedAt}_`,
  "",
];

for (const row of hot) {
  const tag = row.isNew ? "🆕 NUEVO" : `⚡ +${row.scorePerHour}/h`;
  const gapTag = row.gap ? " · 🟢 HUECO EN YOUTUBE" : "";
  const yt = row.youtube;
  const ytInfo = yt ? `${yt.videoCount} videos recientes, máx ${yt.maxViewsPerHour} vistas/h` : "sin datos de YouTube";
  lines.push(`**#${row.token}** — ${tag}${gapTag} (score ${row.score}, ${row.distinctSourceTypes} fuentes)`);
  lines.push(`  ${ytInfo}`);
  for (const s of row.samples.slice(0, 2)) {
    lines.push(`  - [${s.source}] ${s.title}`);
  }
  lines.push("");
}

console.log(lines.join("\n"));
