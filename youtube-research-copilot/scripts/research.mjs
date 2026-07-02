#!/usr/bin/env node
// YouTube Research Copilot — fase 1 (investigación, sin IA):
// busca los mejores videos de un tema, descarga sus transcripciones y
// detecta patrones de título/duración/gancho. No depende de Gemini ni VidIQ.
//
// Uso: node scripts/research.mjs "tema a investigar"

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { fetchTranscript } from "./transcript.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");
const API_BASE = "https://www.googleapis.com/youtube/v3";

const TOP_N = 30;
const MIN_LONGFORM_SECONDS = 240;
const TRANSCRIPT_CONCURRENCY = 5;

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnvFile(path.join(ROOT, ".env"));
loadEnvFile(path.join(REPO_ROOT, ".env"));

const API_KEY = process.env.YOUTUBE_API_KEY;
const topic = process.argv.slice(2).join(" ").trim();

if (!API_KEY) {
  console.error("Falta YOUTUBE_API_KEY. Define la variable de entorno o crea un .env con YOUTUBE_API_KEY=tu_clave");
  process.exit(1);
}
if (!topic) {
  console.error('Uso: node scripts/research.mjs "tema a investigar"');
  process.exit(1);
}

async function ytFetch(endpoint, params) {
  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set("key", API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    const reason = json?.error?.errors?.[0]?.reason || res.status;
    throw new Error(`YouTube API error (${endpoint}): ${reason} - ${json?.error?.message ?? ""}`);
  }
  return json;
}

function parseIsoDurationToSeconds(iso) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso ?? "");
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

function median(nums) {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function mean(nums) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

const STOPWORDS = new Set([
  "de", "la", "el", "en", "que", "con", "para", "los", "las", "del", "un", "una",
  "y", "a", "por", "es", "su", "se", "lo", "al", "mi", "tu", "no", "si", "más",
  "como", "sus", "esta", "este", "pero", "sobre", "todo", "nos",
  "the", "and", "for", "with", "from", "this", "that", "your", "you", "is", "are",
  "of", "to", "in", "on", "it", "my", "me", "we", "he", "she", "was", "be", "how",
]);

function topWords(strings, limit = 10) {
  const counts = new Map();
  for (const s of strings) {
    const words = (s.toLowerCase().match(/[\p{L}]{4,}/gu) ?? []).filter((w) => !STOPWORDS.has(w));
    const seen = new Set();
    for (const w of words) {
      if (seen.has(w)) continue;
      seen.add(w);
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function main() {
  console.log(`Investigando: "${topic}"...`);

  const searchJson = await ytFetch("search", {
    part: "snippet",
    q: topic,
    type: "video",
    order: "viewCount",
    maxResults: "50",
  });

  const candidateIds = (searchJson.items ?? []).map((i) => i.id.videoId);
  console.log(`  ${candidateIds.length} candidatos encontrados, filtrando Shorts y quedándonos con el top ${TOP_N}...`);

  const statsJson = await ytFetch("videos", {
    part: "snippet,statistics,contentDetails",
    id: candidateIds.join(","),
  });

  let videos = (statsJson.items ?? [])
    .map((item) => ({
      videoId: item.id,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      title: item.snippet.title,
      description: item.snippet.description ?? "",
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
      viewCount: Number(item.statistics.viewCount ?? 0),
      likeCount: Number(item.statistics.likeCount ?? 0),
      commentCount: Number(item.statistics.commentCount ?? 0),
      durationSeconds: parseIsoDurationToSeconds(item.contentDetails?.duration),
    }))
    .filter((v) => v.durationSeconds >= MIN_LONGFORM_SECONDS)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, TOP_N);

  console.log(`  ${videos.length} videos long-form seleccionados. Descargando transcripciones...`);

  videos = await mapWithConcurrency(videos, TRANSCRIPT_CONCURRENCY, async (v, idx) => {
    process.stdout.write(`\r  Transcripción ${idx + 1}/${videos.length}...`);
    const transcript = await fetchTranscript(v.videoId);
    return { ...v, transcript: transcript?.text ?? null, hook: transcript?.hook ?? null };
  });
  console.log("");

  const withTranscript = videos.filter((v) => v.transcript);
  console.log(`  Transcripciones obtenidas: ${withTranscript.length}/${videos.length}`);

  const durations = videos.map((v) => v.durationSeconds);
  const views = videos.map((v) => v.viewCount);
  const titleLengths = videos.map((v) => v.title.length);

  const patterns = {
    videoCount: videos.length,
    transcriptCoverage: withTranscript.length,
    duration: {
      medianMinutes: Math.round((median(durations) / 60) * 10) / 10,
      meanMinutes: Math.round((mean(durations) / 60) * 10) / 10,
    },
    views: {
      median: Math.round(median(views)),
      mean: Math.round(mean(views)),
      top: Math.max(...views),
    },
    titles: {
      medianLength: Math.round(median(titleLengths)),
      pctWithNumber: Math.round((videos.filter((v) => /\d/.test(v.title)).length / videos.length) * 100),
      pctWithQuestion: Math.round((videos.filter((v) => v.title.includes("?")).length / videos.length) * 100),
      pctWithBrackets: Math.round((videos.filter((v) => /[[\](){}]/.test(v.title)).length / videos.length) * 100),
      topWords: topWords(videos.map((v) => v.title)),
    },
    hooks: {
      examples: withTranscript.slice(0, 8).map((v) => ({ title: v.title, hook: v.hook })),
      topWords: topWords(withTranscript.map((v) => v.hook).filter(Boolean)),
    },
  };

  const slug = topic
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const outDir = path.join(ROOT, "output");
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slug}.json`);

  writeFileSync(
    outPath,
    JSON.stringify({ topic, generatedAt: new Date().toISOString(), patterns, videos }, null, 2)
  );

  console.log(`\nListo. Reporte guardado en ${path.relative(process.cwd(), outPath)}`);
  console.log(`\nResumen rápido:`);
  console.log(`  Duración típica: ${patterns.duration.medianMinutes} min`);
  console.log(`  Vistas típicas: ${patterns.views.median.toLocaleString()}`);
  console.log(`  ${patterns.titles.pctWithNumber}% de títulos tienen un número, ${patterns.titles.pctWithQuestion}% tienen "?"`);
  console.log(`  Palabras más repetidas en títulos: ${patterns.titles.topWords.slice(0, 5).map(([w]) => w).join(", ")}`);
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
