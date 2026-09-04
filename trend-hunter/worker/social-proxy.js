// Cloudflare Worker: proxy gratuito para leer Reddit, Google Trends y Google
// News (RSS) desde el navegador sin chocar con CORS (esos sitios no dejan
// llamarlos directo desde otro dominio). No usa ninguna clave ni cuota de
// YouTube — es tráfico aparte, directo a esos sitios, igual que
// youtube-research-copilot/worker/transcript-proxy.js hace con YouTube.
//
// Deploy: pega este archivo completo en el editor de Cloudflare Workers
// (dash.cloudflare.com → Workers & Pages → Create → Edit code) y publica.
// Endpoint resultante: https://<tu-worker>.workers.dev/?source=reddit&mode=rising

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) trend-hunter-proxy/1.0";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}

function mapRedditPosts(data, source) {
  const children = data?.data?.children || [];
  return children.map((c) => ({
    source,
    title: c.data.title,
    score: c.data.score,
    numComments: c.data.num_comments,
    url: `https://reddit.com${c.data.permalink}`,
    createdUtc: c.data.created_utc,
  }));
}

async function handleReddit(params) {
  const mode = params.get("mode") || "rising"; // rising | sub | search
  const headers = { "User-Agent": UA };

  if (mode === "rising") {
    const res = await fetch("https://www.reddit.com/r/all/rising.json?limit=30", { headers });
    if (!res.ok) throw new Error(`reddit rising HTTP ${res.status}`);
    return mapRedditPosts(await res.json(), "reddit:rising");
  }

  if (mode === "sub") {
    const sub = params.get("sub");
    if (!sub) throw new Error("Falta 'sub'");
    const res = await fetch(`https://www.reddit.com/r/${sub}/top.json?limit=15&t=day`, { headers });
    if (!res.ok) throw new Error(`reddit r/${sub} HTTP ${res.status}`);
    return mapRedditPosts(await res.json(), `reddit:r/${sub}`);
  }

  if (mode === "search") {
    const q = params.get("q");
    if (!q) throw new Error("Falta 'q'");
    const res = await fetch(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&sort=new&limit=15`,
      { headers }
    );
    if (!res.ok) throw new Error(`reddit search HTTP ${res.status}`);
    return mapRedditPosts(await res.json(), `reddit:search(${q})`);
  }

  throw new Error(`mode desconocido: ${mode}`);
}

function stripJsonPrefix(text) {
  const idx = text.indexOf("{");
  return idx === -1 ? text : text.slice(idx);
}

async function handleTrends(params) {
  const geo = params.get("geo") || "US";
  const hl = params.get("hl") || "en-US";
  const url = `https://trends.google.com/trends/api/dailytrends?hl=${hl}&tz=-360&geo=${geo}&ns=15`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`google trends HTTP ${res.status}`);
  const text = await res.text();
  const parsed = JSON.parse(stripJsonPrefix(text));
  const days = parsed?.default?.trendingSearchesDays || [];
  const items = [];
  for (const day of days) {
    for (const t of day.trendingSearches || []) {
      items.push({
        source: `googletrends:${geo}`,
        title: t.title?.query,
        formattedTraffic: t.formattedTraffic,
      });
    }
  }
  return items;
}

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "g");
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

function decodeEntities(str = "") {
  return str
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function parseRssItems(xml, source) {
  return xml
    .split("<item>")
    .slice(1)
    .map((chunk) => {
      const title = decodeEntities(extractTag(chunk, "title")[0] || "");
      const pubDate = extractTag(chunk, "pubDate")[0] || "";
      const sourceMatch = chunk.match(/<source[^>]*>([\s\S]*?)<\/source>/);
      const outlet = sourceMatch ? decodeEntities(sourceMatch[1]) : "";
      return { source, title, pubDate, outlet };
    });
}

async function handleNews(params) {
  const q = params.get("q");
  const hl = params.get("hl") || "en-US";
  const gl = params.get("gl") || "US";
  const ceid = params.get("ceid") || `${gl}:${hl.split("-")[0]}`;
  const url = q
    ? `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${hl}&gl=${gl}&ceid=${ceid}`
    : `https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${ceid}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`google news HTTP ${res.status}`);
  const xml = await res.text();
  return parseRssItems(xml, q ? `news:search(${q})` : `news:top:${gl}`);
}

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const source = url.searchParams.get("source");

    try {
      let items;
      if (source === "reddit") items = await handleReddit(url.searchParams);
      else if (source === "trends") items = await handleTrends(url.searchParams);
      else if (source === "news") items = await handleNews(url.searchParams);
      else return json({ error: "source debe ser reddit, trends o news" }, 400);

      return json({ items });
    } catch (err) {
      return json({ error: err.message, items: [] }, 200); // 200 con items:[] para que el front no truene
    }
  },
};
