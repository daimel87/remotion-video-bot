// Motor de investigación que corre en el navegador. Busca outliers reales
// (canales chicos superando su propio promedio) sobre un tema, igual que el
// outlier tracker pero con su propio umbral de suscriptores y filtros de
// contenido. La búsqueda y las estadísticas van directo a googleapis.com
// (CORS habilitado). Las transcripciones pasan por tu proxy de Cloudflare
// Worker, porque YouTube no permite leer la página del video desde el
// navegador de otro sitio.

import { isExcluded } from "./content-filters.js";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const MAX_SUBSCRIBERS = 50000;
const MIN_OUTLIER_PERCENT = 100; // +100% = 2x la mediana del canal
const MIN_ABSOLUTE_VIEWS = 100000; // descarta outliers "de mentira" con vistas insignificantes
const DAYS_WINDOW = 90;
const RECENT_UPLOADS_TO_SCAN = 20;
const MIN_LONGFORM_SECONDS = 240; // excluye Shorts
const TOP_N = 30;
const TRANSCRIPT_CONCURRENCY = 5;

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
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

async function ytFetch(apiKey, endpoint, params) {
  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set("key", apiKey);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url);
  const json = await res.json();
  if (!res.ok) {
    const reason = json?.error?.errors?.[0]?.reason || res.status;
    const err = new Error(`${reason}: ${json?.error?.message ?? "Error de YouTube API"}`);
    err.reason = reason;
    throw err;
  }
  return json;
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
  await Promise.all(Array.from({ length: Math.min(limit, items.length) || 1 }, worker));
  return results;
}

async function fetchTranscriptViaProxy(workerUrl, videoId) {
  try {
    const url = new URL(workerUrl);
    url.searchParams.set("videoId", videoId);
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    return json && json.text ? json : null;
  } catch {
    return null;
  }
}

async function searchTopicVideos(apiKey, topic, cutoffDate) {
  const results = [];
  let pageToken;
  for (let page = 0; page < 2; page++) {
    const json = await ytFetch(apiKey, "search", {
      part: "snippet",
      q: topic,
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
        thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
      });
    }
    pageToken = json.nextPageToken;
    if (!pageToken) break;
  }
  return results;
}

async function fetchChannels(apiKey, channelIds) {
  const byId = new Map();
  for (const group of chunk(channelIds, 50)) {
    if (group.length === 0) continue;
    const json = await ytFetch(apiKey, "channels", {
      part: "snippet,statistics,contentDetails",
      id: group.join(","),
    });
    for (const item of json.items ?? []) {
      byId.set(item.id, {
        id: item.id,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.default?.url,
        subscriberCount: item.statistics.hiddenSubscriberCount ? null : Number(item.statistics.subscriberCount ?? 0),
        uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads,
      });
    }
  }
  return byId;
}

async function fetchUploadsPlaylistVideoIds(apiKey, uploadsPlaylistId) {
  const json = await ytFetch(apiKey, "playlistItems", {
    part: "contentDetails",
    playlistId: uploadsPlaylistId,
    maxResults: String(RECENT_UPLOADS_TO_SCAN),
  });
  return (json.items ?? []).map((i) => i.contentDetails.videoId);
}

async function fetchVideoStats(apiKey, videoIds) {
  const byId = new Map();
  for (const group of chunk([...new Set(videoIds)], 50)) {
    if (group.length === 0) continue;
    const json = await ytFetch(apiKey, "videos", {
      part: "statistics,snippet,contentDetails",
      id: group.join(","),
    });
    for (const item of json.items ?? []) {
      byId.set(item.id, {
        viewCount: Number(item.statistics.viewCount ?? 0),
        publishedAt: item.snippet.publishedAt,
        durationSeconds: parseIsoDurationToSeconds(item.contentDetails?.duration),
      });
    }
  }
  return byId;
}

/**
 * @param {string} apiKey
 * @param {string} topic
 * @param {string} workerUrl
 * @param {(msg: string) => void} onProgress
 */
export async function researchTopic(apiKey, topic, workerUrl, onProgress) {
  const cutoffDate = new Date(Date.now() - DAYS_WINDOW * 24 * 60 * 60 * 1000);

  onProgress?.(`Buscando videos de "${topic}" de los últimos 3 meses...`);
  const candidates = await searchTopicVideos(apiKey, topic, cutoffDate);
  const candidatesByChannel = new Map();
  for (const v of candidates) {
    const existing = candidatesByChannel.get(v.channelId) ?? [];
    if (!existing.find((e) => e.videoId === v.videoId)) existing.push(v);
    candidatesByChannel.set(v.channelId, existing);
  }

  const channelIds = [...candidatesByChannel.keys()];
  onProgress?.(`Revisando ${channelIds.length} canales...`);
  const channels = await fetchChannels(apiKey, channelIds);

  const smallChannels = [...channels.values()].filter(
    (c) =>
      c.subscriberCount !== null &&
      c.subscriberCount < MAX_SUBSCRIBERS &&
      c.uploadsPlaylistId &&
      !isExcluded(c.title, "")
  );
  onProgress?.(`${smallChannels.length} canales con menos de ${MAX_SUBSCRIBERS.toLocaleString()} suscriptores. Calculando outliers...`);

  const outliers = [];

  for (let i = 0; i < smallChannels.length; i++) {
    const channel = smallChannels[i];
    onProgress?.(`Analizando canal ${i + 1}/${smallChannels.length}: ${channel.title}`);

    let recentVideoIds;
    try {
      recentVideoIds = await fetchUploadsPlaylistVideoIds(apiKey, channel.uploadsPlaylistId);
    } catch {
      continue;
    }

    const candidateVideos = candidatesByChannel.get(channel.id) ?? [];
    const allIds = [...new Set([...recentVideoIds, ...candidateVideos.map((v) => v.videoId)])];
    const stats = await fetchVideoStats(apiKey, allIds);

    const baselinePool = [];
    const candidatePool = [];
    for (const [videoId, stat] of stats) {
      if (stat.durationSeconds < MIN_LONGFORM_SECONDS) continue;
      const publishedAt = new Date(stat.publishedAt);
      if (publishedAt < cutoffDate) baselinePool.push(stat.viewCount);
      else candidatePool.push({ videoId, ...stat });
    }

    let baseline = median(baselinePool);
    if (baseline === 0 && candidatePool.length > 1) baseline = median(candidatePool.map((c) => c.viewCount));
    if (baseline <= 0) continue;

    for (const candidate of candidateVideos) {
      const stat = stats.get(candidate.videoId);
      if (!stat) continue;
      if (stat.durationSeconds < MIN_LONGFORM_SECONDS) continue;
      if (isExcluded(channel.title, candidate.title)) continue;
      const publishedAt = new Date(stat.publishedAt);
      if (publishedAt < cutoffDate) continue;

      if (stat.viewCount < MIN_ABSOLUTE_VIEWS) continue; // descarta outliers estadísticos sin relevancia real

      const outlierPercent = Math.round(((stat.viewCount - baseline) / baseline) * 100);
      if (outlierPercent < MIN_OUTLIER_PERCENT) continue;

      outliers.push({
        videoId: candidate.videoId,
        url: `https://www.youtube.com/watch?v=${candidate.videoId}`,
        title: candidate.title,
        channelTitle: channel.title,
        subscriberCount: channel.subscriberCount,
        publishedAt: stat.publishedAt,
        durationSeconds: stat.durationSeconds,
        thumbnail: candidate.thumbnail,
        viewCount: stat.viewCount,
        baselineViews: Math.round(baseline),
        outlierPercent,
        outlierMultiplier: Math.round((stat.viewCount / baseline) * 10) / 10,
      });
    }
  }

  outliers.sort((a, b) => b.outlierPercent - a.outlierPercent);
  let videos = outliers.slice(0, TOP_N);

  let withTranscript = [];
  if (workerUrl && videos.length) {
    onProgress?.(`Descargando transcripciones de ${videos.length} videos...`);
    let done = 0;
    videos = await mapWithConcurrency(videos, TRANSCRIPT_CONCURRENCY, async (v) => {
      const t = await fetchTranscriptViaProxy(workerUrl, v.videoId);
      done++;
      onProgress?.(`Transcripción ${done}/${videos.length}...`);
      return { ...v, transcript: t?.text ?? null, hook: t?.hook ?? null };
    });
    withTranscript = videos.filter((v) => v.transcript);
  } else {
    videos = videos.map((v) => ({ ...v, transcript: null, hook: null }));
  }

  const durations = videos.map((v) => v.durationSeconds);
  const views = videos.map((v) => v.viewCount);

  const patterns = {
    videoCount: videos.length,
    transcriptCoverage: withTranscript.length,
    maxSubscribers: MAX_SUBSCRIBERS,
    minOutlierPercent: MIN_OUTLIER_PERCENT,
    minAbsoluteViews: MIN_ABSOLUTE_VIEWS,
    daysWindow: DAYS_WINDOW,
    duration: {
      medianMinutes: Math.round((median(durations) / 60) * 10) / 10,
      meanMinutes: Math.round((mean(durations) / 60) * 10) / 10,
    },
    views: {
      median: Math.round(median(views)),
      mean: Math.round(mean(views)),
      top: views.length ? Math.max(...views) : 0,
    },
    titles: {
      medianLength: videos.length ? Math.round(median(videos.map((v) => v.title.length))) : 0,
      pctWithNumber: videos.length ? Math.round((videos.filter((v) => /\d/.test(v.title)).length / videos.length) * 100) : 0,
      pctWithQuestion: videos.length ? Math.round((videos.filter((v) => v.title.includes("?")).length / videos.length) * 100) : 0,
      topWords: topWords(videos.map((v) => v.title)),
    },
    hooks: {
      examples: withTranscript.slice(0, 8).map((v) => ({ title: v.title, hook: v.hook })),
      topWords: topWords(withTranscript.map((v) => v.hook).filter(Boolean)),
    },
  };

  return { topic, generatedAt: new Date().toISOString(), patterns, videos };
}
