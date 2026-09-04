// Usa la YouTube Data API v3 (misma YOUTUBE_API_KEY que outlier-tracker y
// youtube-research-copilot) para medir qué tanto cubre YouTube un tema y a
// qué velocidad. Un tema con mucha señal de noticias/Reddit/Trends pero
// pocos videos recientes en YouTube = "hueco" = oportunidad.

const API_BASE = "https://www.googleapis.com/youtube/v3";

export async function searchRecentVideos(apiKey, keyword, publishedAfterHours = 72, maxResults = 15) {
  if (!apiKey) return { videos: [], skipped: true };
  const publishedAfter = new Date(Date.now() - publishedAfterHours * 3600 * 1000).toISOString();
  const searchUrl =
    `${API_BASE}/search?part=snippet&type=video&order=viewCount&maxResults=${maxResults}` +
    `&publishedAfter=${publishedAfter}&q=${encodeURIComponent(keyword)}&key=${apiKey}`;
  try {
    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const ids = (json.items || []).map((it) => it.id.videoId).filter(Boolean);
    if (ids.length === 0) return { videos: [], skipped: false };

    const statsUrl = `${API_BASE}/videos?part=statistics,snippet&id=${ids.join(",")}&key=${apiKey}`;
    const statsRes = await fetch(statsUrl);
    if (!statsRes.ok) throw new Error(`HTTP ${statsRes.status} (videos.list)`);
    const statsJson = await statsRes.json();

    const videos = (statsJson.items || []).map((v) => {
      const publishedAt = new Date(v.snippet.publishedAt).getTime();
      const ageHours = Math.max(0.5, (Date.now() - publishedAt) / 3600000);
      const views = Number(v.statistics.viewCount || 0);
      return {
        title: v.snippet.title,
        channelTitle: v.snippet.channelTitle,
        views,
        ageHours,
        viewsPerHour: Math.round(views / ageHours),
        url: `https://youtube.com/watch?v=${v.id}`,
      };
    });
    videos.sort((a, b) => b.viewsPerHour - a.viewsPerHour);
    return { videos, skipped: false };
  } catch (err) {
    console.warn(`[youtube] "${keyword}" falló: ${err.message}`);
    return { videos: [], skipped: false, error: err.message };
  }
}
