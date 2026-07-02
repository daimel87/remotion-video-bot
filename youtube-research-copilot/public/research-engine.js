// Motor de investigación que corre en el navegador. La búsqueda y las
// estadísticas van directo a googleapis.com (CORS habilitado). Las
// transcripciones pasan por tu proxy de Cloudflare Worker, porque YouTube no
// permite leer la página del video desde el navegador de otro sitio.

const API_BASE = "https://www.googleapis.com/youtube/v3";
const TOP_N = 30;
const MIN_LONGFORM_SECONDS = 240;
const TRANSCRIPT_CONCURRENCY = 5;

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

/**
 * @param {string} apiKey
 * @param {string} topic
 * @param {string} workerUrl
 * @param {(msg: string) => void} onProgress
 */
export async function researchTopic(apiKey, topic, workerUrl, onProgress) {
  onProgress?.(`Buscando los mejores videos de "${topic}"...`);

  const searchJson = await ytFetch(apiKey, "search", {
    part: "snippet",
    q: topic,
    type: "video",
    order: "viewCount",
    maxResults: "50",
  });
  const candidateIds = (searchJson.items ?? []).map((i) => i.id.videoId);

  onProgress?.(`Revisando ${candidateIds.length} candidatos...`);
  const statsJson = await ytFetch(apiKey, "videos", {
    part: "snippet,statistics,contentDetails",
    id: candidateIds.join(","),
  });

  let videos = (statsJson.items ?? [])
    .map((item) => ({
      videoId: item.id,
      url: `https://www.youtube.com/watch?v=${item.id}`,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
      viewCount: Number(item.statistics.viewCount ?? 0),
      durationSeconds: parseIsoDurationToSeconds(item.contentDetails?.duration),
    }))
    .filter((v) => v.durationSeconds >= MIN_LONGFORM_SECONDS)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, TOP_N);

  let withTranscript = [];
  if (workerUrl) {
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
      medianLength: Math.round(median(videos.map((v) => v.title.length))),
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
