// Motor de detección de outliers que corre en el navegador, usando la clave
// de YouTube Data API v3 que el propio usuario pega en la UI. Nunca se envía
// a ningún servidor propio: las llamadas van directo de tu navegador a
// googleapis.com.

const API_BASE = "https://www.googleapis.com/youtube/v3";
const MAX_SUBSCRIBERS = 10000;
const MIN_OUTLIER_PERCENT = 100; // +100% = 2x la mediana del canal
const DAYS_WINDOW = 30;
const RECENT_UPLOADS_TO_SCAN = 20;

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

async function searchNicheVideos(apiKey, niche, cutoffDate) {
  const results = [];
  let pageToken;
  for (let page = 0; page < 2; page++) {
    const json = await ytFetch(apiKey, "search", {
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
        subscriberCount: item.statistics.hiddenSubscriberCount
          ? null
          : Number(item.statistics.subscriberCount ?? 0),
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

/**
 * @param {string} apiKey
 * @param {{id: string, label: string, query: string}[]} niches
 * @param {(msg: string) => void} onProgress
 */
export async function findOutliers(apiKey, niches, onProgress) {
  const cutoffDate = new Date(Date.now() - DAYS_WINDOW * 24 * 60 * 60 * 1000);

  const candidatesByChannel = new Map();
  for (const niche of niches) {
    onProgress?.(`Buscando en ${niche.label}...`);
    const videos = await searchNicheVideos(apiKey, niche, cutoffDate);
    for (const v of videos) {
      const existing = candidatesByChannel.get(v.channelId) ?? [];
      const already = existing.find((e) => e.videoId === v.videoId);
      if (already) already.niches.add(niche.id);
      else existing.push({ ...v, niches: new Set([niche.id]) });
      candidatesByChannel.set(v.channelId, existing);
    }
  }

  const channelIds = [...candidatesByChannel.keys()];
  onProgress?.(`Revisando ${channelIds.length} canales...`);
  const channels = await fetchChannels(apiKey, channelIds);

  const smallChannels = [...channels.values()].filter(
    (c) => c.subscriberCount !== null && c.subscriberCount < MAX_SUBSCRIBERS && c.uploadsPlaylistId
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
      const publishedAt = new Date(stat.publishedAt);
      if (publishedAt < cutoffDate) baselinePool.push(stat.viewCount);
      else candidatePool.push({ videoId, ...stat });
    }

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

  return {
    generatedAt: new Date().toISOString(),
    windowDays: DAYS_WINDOW,
    maxSubscribers: MAX_SUBSCRIBERS,
    minOutlierPercent: MIN_OUTLIER_PERCENT,
    niches: niches.map((n) => ({ id: n.id, label: n.label })),
    count: outliers.length,
    videos: outliers,
  };
}
