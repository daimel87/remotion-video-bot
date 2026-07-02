#!/usr/bin/env node
// Detecta videos "outlier" de canales pequeños (<10k suscriptores) publicados
// en los últimos 30 días, usando la YouTube Data API v3.
//
// Un video es "outlier" cuando sus vistas superan en un 100%+ (2x o más) la
// mediana de vistas de los uploads recientes de ese mismo canal.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");

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
const MAX_SUBSCRIBERS = 10000;
const MIN_OUTLIER_PERCENT = 100; // video debe superar en +100% (2x) la mediana del canal
const DAYS_WINDOW = 30;
const RECENT_UPLOADS_TO_SCAN = 20;
const API_BASE = "https://www.googleapis.com/youtube/v3";

if (!API_KEY) {
  console.error(
    "Falta YOUTUBE_API_KEY. Define la variable de entorno o crea un archivo .env con YOUTUBE_API_KEY=tu_clave"
  );
  process.exit(1);
}

const niches = JSON.parse(readFileSync(path.join(ROOT, "public", "data", "niches.json"), "utf8"));

const cutoffDate = new Date(Date.now() - DAYS_WINDOW * 24 * 60 * 60 * 1000);

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

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function median(nums) {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function searchNicheVideos(niche) {
  const results = [];
  let pageToken;
  // Hasta 2 páginas (100 resultados) por nicho para no disparar la cuota.
  for (let page = 0; page < 2; page++) {
    const json = await ytFetch("search", {
      part: "snippet",
      q: niche.query,
      type: "video",
      order: "date",
      publishedAfter: cutoffDate.toISOString(),
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    for (const item of json.items ?? []) {
      results.push({
        videoId: item.id.videoId,
        channelId: item.snippet.channelId,
        channelTitle: item.snippet.channelTitle,
        title: item.snippet.title,
        publishedAt: item.snippet.publishedAt,
        thumbnail:
          item.snippet.thumbnails?.high?.url ??
          item.snippet.thumbnails?.medium?.url ??
          item.snippet.thumbnails?.default?.url,
        nicheId: niche.id,
      });
    }
    pageToken = json.nextPageToken;
    if (!pageToken) break;
  }
  return results;
}

async function fetchChannels(channelIds) {
  const byId = new Map();
  for (const group of chunk(channelIds, 50)) {
    const json = await ytFetch("channels", {
      part: "snippet,statistics,contentDetails",
      id: group.join(","),
    });
    for (const item of json.items ?? []) {
      byId.set(item.id, {
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.default?.url,
        subscriberCount: item.statistics.hiddenSubscriberCount
          ? null
          : Number(item.statistics.subscriberCount ?? 0),
        uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads,
      });
    }
  }
  return byId;
}

async function fetchUploadsPlaylistVideoIds(uploadsPlaylistId) {
  const json = await ytFetch("playlistItems", {
    part: "contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: String(RECENT_UPLOADS_TO_SCAN),
  });
  return (json.items ?? []).map((i) => i.contentDetails.videoId);
}

async function fetchVideoStats(videoIds) {
  const byId = new Map();
  for (const group of chunk([...new Set(videoIds)], 50)) {
    if (group.length === 0) continue;
    const json = await ytFetch("videos", {
      part: "statistics,snippet",
      id: group.join(","),
    });
    for (const item of json.items ?? []) {
      byId.set(item.id, {
        viewCount: Number(item.statistics.viewCount ?? 0),
        publishedAt: item.snippet.publishedAt,
      });
    }
  }
  return byId;
}

async function main() {
  console.log(`Buscando videos publicados desde ${cutoffDate.toISOString()}...`);

  const candidatesByChannel = new Map();
  for (const niche of niches) {
    console.log(`  Nicho: ${niche.label}`);
    const videos = await searchNicheVideos(niche);
    for (const v of videos) {
      const existing = candidatesByChannel.get(v.channelId) ?? [];
      const already = existing.find((e) => e.videoId === v.videoId);
      if (already) {
        already.niches.add(niche.id);
      } else {
        existing.push({ ...v, niches: new Set([niche.id]) });
      }
      candidatesByChannel.set(v.channelId, existing);
    }
  }

  const channelIds = [...candidatesByChannel.keys()];
  console.log(`Canales candidatos únicos: ${channelIds.length}`);
  const channels = await fetchChannels(channelIds);

  const smallChannels = [...channels.values()].filter(
    (c) => c.subscriberCount !== null && c.subscriberCount < MAX_SUBSCRIBERS && c.uploadsPlaylistId
  );
  console.log(`Canales con menos de ${MAX_SUBSCRIBERS.toLocaleString()} suscriptores: ${smallChannels.length}`);

  const outliers = [];

  for (const channel of smallChannels) {
    let recentVideoIds;
    try {
      recentVideoIds = await fetchUploadsPlaylistVideoIds(channel.uploadsPlaylistId);
    } catch (err) {
      console.warn(`  No se pudo leer uploads de ${channel.title}: ${err.message}`);
      continue;
    }

    const candidateVideos = candidatesByChannel.get(channel.id) ?? [];
    const allIds = [...new Set([...recentVideoIds, ...candidateVideos.map((v) => v.videoId)])];
    const stats = await fetchVideoStats(allIds);

    const baselinePool = [];
    const candidatePool = [];
    for (const [videoId, stat] of stats) {
      const publishedAt = new Date(stat.publishedAt);
      if (publishedAt < cutoffDate) baselinePool.push(stat.viewCount);
      else candidatePool.push({ videoId, ...stat });
    }

    // Si el canal no tiene historial previo a la ventana, usamos la mediana
    // del resto de sus subidas recientes como aproximación del baseline.
    let baseline = median(baselinePool);
    if (baseline === 0 && candidatePool.length > 1) {
      baseline = median(candidatePool.map((c) => c.viewCount));
    }
    if (baseline <= 0) continue;

    for (const candidate of candidateVideos) {
      const stat = stats.get(candidate.videoId);
      if (!stat) continue;
      const publishedAt = new Date(stat.publishedAt);
      if (publishedAt < cutoffDate) continue;

      const outlierPercent = Math.round(((stat.viewCount - baseline) / baseline) * 100);
      if (outlierPercent < MIN_OUTLIER_PERCENT) continue;

      outliers.push({
        videoId: candidate.videoId,
        url: `https://www.youtube.com/watch?v=${candidate.videoId}`,
        title: candidate.title,
        thumbnail: candidate.thumbnail,
        publishedAt: stat.publishedAt,
        channelId: channel.id,
        channelTitle: channel.title,
        channelThumbnail: channel.thumbnail,
        subscriberCount: channel.subscriberCount,
        viewCount: stat.viewCount,
        baselineViews: Math.round(baseline),
        outlierPercent,
        outlierMultiplier: Math.round((stat.viewCount / baseline) * 10) / 10,
        niches: [...candidate.niches],
      });
    }
  }

  outliers.sort((a, b) => b.outlierPercent - a.outlierPercent);

  const output = {
    generatedAt: new Date().toISOString(),
    windowDays: DAYS_WINDOW,
    maxSubscribers: MAX_SUBSCRIBERS,
    minOutlierPercent: MIN_OUTLIER_PERCENT,
    niches: niches.map((n) => ({ id: n.id, label: n.label })),
    count: outliers.length,
    videos: outliers,
  };

  const outDir = path.join(ROOT, "public", "data");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "outliers.json"), JSON.stringify(output, null, 2));
  console.log(`Listo. ${outliers.length} videos outlier guardados en public/data/outliers.json`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
