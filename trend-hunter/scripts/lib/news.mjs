// Google News RSS es público y no requiere API key. Cada <item> trae
// <source> con el nombre del medio, lo que permite contar cuántos medios
// distintos están cubriendo un tema (señal de que ya "explotó" en prensa).

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

function parseItems(xml, sourceLabel) {
  const itemsXml = xml.split("<item>").slice(1);
  return itemsXml.map((chunk) => {
    const title = decodeEntities(extractTag(chunk, "title")[0] || "");
    const pubDate = extractTag(chunk, "pubDate")[0] || "";
    const sourceMatch = chunk.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    const outlet = sourceMatch ? decodeEntities(sourceMatch[1]) : "";
    return { source: sourceLabel, title, pubDate, outlet };
  });
}

async function getRss(url, sourceLabel) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 trend-hunter/1.0" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return parseItems(xml, sourceLabel);
  } catch (err) {
    console.warn(`[news] ${sourceLabel} falló: ${err.message}`);
    return [];
  }
}

export async function fetchTopHeadlines(hl, gl, ceid) {
  const url = `https://news.google.com/rss?hl=${hl}&gl=${gl}&ceid=${ceid}`;
  return getRss(url, `news:top:${gl}`);
}

export async function searchNews(keyword, hl, gl, ceid) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=${hl}&gl=${gl}&ceid=${ceid}`;
  return getRss(url, `news:search(${keyword}):${gl}`);
}
