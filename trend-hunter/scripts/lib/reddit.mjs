// Reddit expone sus listados públicos como JSON sin necesidad de API key.
// "rising.json" es la señal más temprana: posts que están ganando tracción
// rápido, antes de llegar a "hot" o "top".

const UA = "trend-hunter/1.0 (uso personal, deteccion de tendencias)";

async function getJson(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Reddit ${res.status} en ${url}`);
  return res.json();
}

function mapPosts(json, source) {
  const children = json?.data?.children || [];
  return children.map((c) => {
    const d = c.data;
    return {
      source,
      title: d.title,
      score: d.score,
      numComments: d.num_comments,
      subreddit: d.subreddit,
      url: `https://reddit.com${d.permalink}`,
      createdUtc: d.created_utc,
      ageHours: (Date.now() / 1000 - d.created_utc) / 3600,
    };
  });
}

export async function fetchRisingAllTime() {
  try {
    const json = await getJson("https://www.reddit.com/r/all/rising.json?limit=30");
    return mapPosts(json, "reddit:rising");
  } catch (err) {
    console.warn(`[reddit] rising falló: ${err.message}`);
    return [];
  }
}

export async function fetchSubTop(sub, timeframe = "day", limit = 20) {
  try {
    const json = await getJson(
      `https://www.reddit.com/r/${sub}/top.json?limit=${limit}&t=${timeframe}`
    );
    return mapPosts(json, `reddit:r/${sub}`);
  } catch (err) {
    console.warn(`[reddit] r/${sub} falló: ${err.message}`);
    return [];
  }
}

export async function searchReddit(keyword, limit = 15) {
  try {
    const json = await getJson(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(keyword)}&sort=new&limit=${limit}`
    );
    return mapPosts(json, `reddit:search(${keyword})`);
  } catch (err) {
    console.warn(`[reddit] búsqueda "${keyword}" falló: ${err.message}`);
    return [];
  }
}
