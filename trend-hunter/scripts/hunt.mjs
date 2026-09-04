#!/usr/bin/env node
// Trend Hunter: combina Reddit, Google Trends, Google News (prensa/TV vía RSS)
// y YouTube para detectar temas que están empezando a moverse ANTES de que
// exploten en YouTube — el tipo de señal que hubiera marcado "inundaciones
// Nepal" el 26 de agosto antes de que se viralizara el primer video.
//
// Uso:
//   npm run hunt                       # corrida completa con config/seeds.json
//   npm run hunt -- --geo NP,US        # solo esos países
//   npm run hunt -- --top 15           # cuántos temas mostrar (default 20)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { loadEnvFile } from "./lib/env.mjs";
import { fetchRisingAllTime, fetchSubTop, searchReddit } from "./lib/reddit.mjs";
import { fetchDailyTrends } from "./lib/googleTrends.mjs";
import { fetchTopHeadlines, searchNews } from "./lib/news.mjs";
import { searchRecentVideos } from "./lib/youtube.mjs";
import { buildTrendBoard } from "./lib/score.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");

loadEnvFile(path.join(ROOT, ".env"));
loadEnvFile(path.join(REPO_ROOT, ".env"));

const args = process.argv.slice(2);
function argValue(name, fallback) {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1 || !args[idx + 1]) return fallback;
  return args[idx + 1];
}

const seeds = JSON.parse(readFileSync(path.join(ROOT, "config", "seeds.json"), "utf8"));
const geoFilter = argValue("geo", "").split(",").filter(Boolean);
const geos = geoFilter.length
  ? seeds.geos.filter((g) => geoFilter.includes(g.code))
  : seeds.geos;
const topN = Number(argValue("top", 20));
const apiKey = process.env.YOUTUBE_API_KEY;

console.log("🔎 Trend Hunter — recolectando señales...\n");

const allItems = [];

// 1) Reddit: r/all rising (la señal más temprana) + top diario de subs de noticias.
const [rising, ...subTops] = await Promise.all([
  fetchRisingAllTime(),
  ...seeds.redditSubs.map((s) => fetchSubTop(s, "day", 15)),
]);
allItems.push(...rising, ...subTops.flat());
console.log(`Reddit: ${rising.length} en rising, ${subTops.flat().length} en tops de subs.`);

// 2) Google Trends por geo.
const trendsResults = await Promise.all(geos.map((g) => fetchDailyTrends(g.code, g.hl)));
trendsResults.forEach((items, i) => {
  console.log(`Google Trends (${geos[i].label}): ${items.length} tendencias.`);
  allItems.push(...items);
});

// 3) Noticias (prensa + TV vía Google News RSS) — titulares top por geo.
const newsResults = await Promise.all(
  geos.map((g) => fetchTopHeadlines(g.hl, g.gl, g.newsCeid))
);
newsResults.forEach((items, i) => {
  console.log(`Noticias (${geos[i].label}): ${items.length} titulares.`);
  allItems.push(...items);
});

// 4) Palabras clave "vigía" (desastres, disturbios, etc.) buscadas en Reddit y Noticias
//    para no depender solo de lo que ya está en portada.
const watchGeo = geos[0] || seeds.geos[0];
const watchResults = await Promise.all(
  seeds.watchKeywords.map(async (kw) => {
    const [redditHits, newsHits] = await Promise.all([
      searchReddit(kw, 8),
      searchNews(kw, watchGeo.hl, watchGeo.gl, watchGeo.newsCeid),
    ]);
    return [...redditHits, ...newsHits];
  })
);
const watchFlat = watchResults.flat();
allItems.push(...watchFlat);
console.log(`Palabras vigía (${seeds.watchKeywords.length}): ${watchFlat.length} menciones encontradas.\n`);

// 5) Cruce de señales.
const board = buildTrendBoard(allItems, seeds.stopwords);
const top = board.filter((r) => r.distinctSourceTypes >= 2).slice(0, topN);

if (top.length === 0) {
  console.log("No se encontraron temas con señal en 2+ fuentes distintas. Revisa el board completo en el JSON de salida.");
}

// 6) Para los temas más fuertes, revisa qué tanto los cubre ya YouTube (hueco = oportunidad).
console.log("📹 Revisando cobertura en YouTube de los temas top...\n");
const withYoutube = [];
for (const row of top.slice(0, 10)) {
  const { videos, skipped, error } = await searchRecentVideos(apiKey, row.token, 96, 10);
  const totalViews = videos.reduce((s, v) => s + v.views, 0);
  const maxVph = videos.length ? Math.max(...videos.map((v) => v.viewsPerHour)) : 0;
  withYoutube.push({
    ...row,
    youtube: {
      skipped,
      error,
      videoCount: videos.length,
      totalViews,
      maxViewsPerHour: maxVph,
      topVideos: videos.slice(0, 3),
    },
    gap: !skipped && videos.length <= 2, // poca o ninguna cobertura todavía = oportunidad
  });
}

// 7) Reporte en consola.
console.log("=".repeat(70));
console.log("TEMAS CON SEÑAL CRUZADA (multi-fuente), ordenados por score:");
console.log("=".repeat(70));
for (const row of withYoutube) {
  const gapTag = row.gap ? "  🟢 HUECO EN YOUTUBE" : "";
  console.log(
    `\n#${row.token}  score=${row.score}  fuentes=${row.distinctSourceTypes}${gapTag}`
  );
  console.log(`  YouTube: ${row.youtube.videoCount} videos recientes, máx ${row.youtube.maxViewsPerHour} vistas/hora`);
  for (const s of row.samples) {
    console.log(`  · [${s.source}] ${s.title}`);
  }
}

if (!apiKey) {
  console.log("\n⚠ No hay YOUTUBE_API_KEY configurada — se omitió el chequeo de cobertura en YouTube.");
  console.log('  Crea un .env en la raíz del repo con: YOUTUBE_API_KEY=tu_clave');
}

console.log(
  "\nℹ X/Twitter no tiene API de tendencias gratuita (requiere plan de pago desde 2023)." +
    " Si ves algo trending en X, agrégalo a mano en config/seeds.json (watchKeywords) para" +
    " que se cruce con las demás fuentes en la próxima corrida."
);

// 8) Guardar JSON completo para inspección/uso posterior.
const outDir = path.join(ROOT, "output");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const outFile = path.join(outDir, `hunt-${stamp}.json`);
writeFileSync(
  outFile,
  JSON.stringify({ generatedAt: new Date().toISOString(), geos: geos.map((g) => g.code), board, top: withYoutube }, null, 2)
);
console.log(`\n💾 Reporte completo guardado en trend-hunter/${path.relative(ROOT, outFile)}`);
