#!/usr/bin/env python3
"""
Cazador de Ideas v2 — pipeline multi-nicho con ARBITRAJE DE IDIOMAS.

Busca oportunidades que:
  1. EXPLOTAN en inglés (mucha demanda, videos recientes con muchas vistas), y
  2. tienen oferta NULA o casi nula en español (nadie lo ha hecho para LATAM), y
  3. cuyo ÁNGULO específico casi no existe en video, pero el tema es masivo.

Estrategia: robar el ángulo probado en inglés y ser el PRIMERO en español.
Salida: dashboard HTML con una pestaña por nicho.

Uso:
    export YOUTUBE_API_KEY=...        # o en idea-hunter/.env
    python3 hunt.py                  # real
    python3 hunt.py --demo           # ejemplo sin API

La API key se lee del entorno / .env — este script NUNCA la escribe ni la sube al repo.
"""
import os, sys, json, math, html, time, re, urllib.parse, urllib.request, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
API = "https://www.googleapis.com/youtube/v3"


def load_env():
    key = os.environ.get("YOUTUBE_API_KEY")
    if not key:
        envf = os.path.join(HERE, ".env")
        if os.path.exists(envf):
            for line in open(envf):
                line = line.strip()
                if line.startswith("YOUTUBE_API_KEY=") and not line.startswith("#"):
                    key = line.split("=", 1)[1].strip()
    return key


def load_config():
    return json.load(open(os.path.join(HERE, "config.json")))


def yt(endpoint, key, **params):
    params["key"] = key
    url = f"{API}/{endpoint}?" + urllib.parse.urlencode(params, doseq=True)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def iso_days(iso):
    try:
        d = datetime.datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return max(1, (datetime.datetime.now(datetime.timezone.utc) - d).days)
    except Exception:
        return 9999


def search_market(key, q, market, n):
    """Devuelve filas [{views, age_days, title, ...}] de los top videos por vistas."""
    sr = yt("search.list", key, part="snippet", q=q, type="video",
            order="viewCount", maxResults=n,
            regionCode=market["regionCode"], relevanceLanguage=market["relevanceLanguage"])
    ids = [it["id"]["videoId"] for it in sr.get("items", []) if it.get("id", {}).get("videoId")]
    total_results = int(sr.get("pageInfo", {}).get("totalResults", 0))
    if not ids:
        return [], total_results
    vs = yt("videos.list", key, part="statistics,snippet", id=",".join(ids))
    rows = []
    for v in vs.get("items", []):
        st, sn = v.get("statistics", {}), v.get("snippet", {})
        views = int(st.get("viewCount", 0) or 0)
        rows.append({"id": v["id"], "title": sn.get("title", ""),
                     "views": views, "age_days": iso_days(sn.get("publishedAt", "")),
                     "vph": views / (iso_days(sn.get("publishedAt", "")) * 24)})
    rows.sort(key=lambda r: r["views"], reverse=True)
    return rows, total_results


def med(xs):
    xs = sorted(xs)
    return xs[len(xs) // 2] if xs else 0


def analyze_bilingual(key, seed, cfg):
    en_rows, _ = search_market(key, seed["en"], cfg["market_en"], cfg["top_n"])
    es_rows, es_total = search_market(key, seed["es"], cfg["market_es"], cfg["top_n"])
    if not en_rows:
        return None

    en_med = med([r["views"] for r in en_rows])
    en_recent_hot = sum(1 for r in en_rows if r["age_days"] < 240 and r["views"] > 300_000)
    es_med = med([r["views"] for r in es_rows]) if es_rows else 0
    es_count = len(es_rows)

    # --- scores 0-100 ---
    en_demand = min(100, math.log10(max(10, en_med)) / 7 * 100)          # ~10M EN -> 100
    exploding = min(100, en_recent_hot / max(1, len(en_rows) / 2) * 100)  # % de top EN recientes y fuertes
    en_signal = round(0.65 * en_demand + 0.35 * exploding)

    # oferta ES: menos videos + menos vistas = más hueco
    es_supply = 0
    es_supply += 55 if es_count >= 8 else (30 if es_count >= 4 else (10 if es_count >= 1 else 0))
    es_supply += 45 if es_med > 500_000 else (25 if es_med > 100_000 else (8 if es_med > 10_000 else 0))
    es_supply = min(100, es_supply)

    # ARBITRAJE = explota en inglés Y vacío en español
    arbitrage = round(en_signal * (1 - es_supply / 100))

    return {
        "seed": seed, "en_signal": en_signal, "en_demand": round(en_demand),
        "exploding": round(exploding), "es_supply": es_supply, "es_count": es_count,
        "en_med": en_med, "es_med": es_med, "arbitrage": arbitrage,
        "proven_angles": [r["title"] for r in en_rows[:4]],   # ángulos probados en inglés
        "es_existing": [r["title"] for r in es_rows[:3]],       # lo poco que hay en español
        "en_top_ids": [r["id"] for r in en_rows[:3]],
    }


def mine_questions(key, video_ids, limit=6):
    qmarks = ("?", "¿")
    starters = ("why", "how", "what if", "is it true", "does", "por que", "porque",
                "como", "cómo", "alguien sabe", "que pasa", "es verdad")
    found, seen = [], set()
    for vid in video_ids:
        try:
            cr = yt("commentThreads.list", key, part="snippet", videoId=vid,
                    order="relevance", maxResults=40, textFormat="plainText")
        except Exception:
            continue
        for it in cr.get("items", []):
            t = it["snippet"]["topLevelComment"]["snippet"]["textDisplay"].strip()
            low = t.lower()
            if (any(q in t for q in qmarks) or any(low.startswith(s) for s in starters)) \
               and 12 < len(t) < 160:
                k = low[:50]
                if k not in seen:
                    seen.add(k); found.append(t)
        if len(found) >= limit:
            break
    return found[:limit]


def build_niche(key, niche, cfg):
    scored = []
    for seed in niche["seeds"]:
        try:
            r = analyze_bilingual(key, seed, cfg)
        except Exception:
            r = None
        if r:
            w = niche["weights"]
            r["score"] = round(r["arbitrage"] * w["arbitrage"] * 0.55
                               + r["en_signal"] * w["demand"] * 0.25
                               + (100 - r["es_supply"]) * w["gap"] * 0.20)
            scored.append(r)
        time.sleep(0.15)
    scored.sort(key=lambda x: x["score"], reverse=True)
    ideas = []
    for i, s in enumerate(scored[:5]):
        qs = mine_questions(key, s["en_top_ids"]) if key else []
        ideas.append({
            "rank": i + 1, "score": s["score"], "arbitrage": s["arbitrage"],
            "en_signal": s["en_signal"], "exploding": s["exploding"],
            "es_supply": s["es_supply"], "es_count": s["es_count"],
            "en_med": s["en_med"], "es_med": s["es_med"],
            "seed_es": s["seed"]["es"], "seed_en": s["seed"]["en"],
            "proven_angles": s["proven_angles"], "es_existing": s["es_existing"],
            "questions": qs,
            "verdict": _verdict(s),
        })
    return ideas


def _verdict(s):
    if s["arbitrage"] >= 65:
        return "🔥 ORO — explota en inglés, casi vacío en español. Sé el primero."
    if s["arbitrage"] >= 45:
        return "✅ Buena — demanda en inglés y oferta española floja."
    if s["es_supply"] >= 70:
        return "⚠️ Saturado en español — solo entra con ángulo/retención superior."
    return "◽ Oportunidad media."


# ----------------------------- HTML -----------------------------
def render_html(niches_data, is_demo=False):
    tabs, panels = [], []
    for idx, (niche, ideas) in enumerate(niches_data):
        act = " active" if idx == 0 else ""
        tabs.append(f'<button class="tab{act}" onclick="showTab({idx})">'
                    f'{niche["emoji"]} {html.escape(niche["name"])}</button>')
        cards = []
        for it in ideas:
            angles = "".join(f"<li>{html.escape(a)}</li>" for a in it["proven_angles"][:4])
            esx = "".join(f"<li>{html.escape(a)}</li>" for a in it["es_existing"]) or \
                  "<li class='good'>🈳 casi nada en español — hueco abierto</li>"
            qs = "".join(f"<li>{html.escape(q)}</li>" for q in it["questions"]) or \
                 "<li class='muted'>(corre con tu API key para minar comentarios reales)</li>"
            enm = f"{it['en_med']:,}".replace(",", ".")
            esm = f"{it['es_med']:,}".replace(",", ".")
            cards.append(f"""
            <div class="card">
              <div class="cardhead">
                <span class="rank">#{it['rank']}</span>
                <h3>{html.escape(it['seed_en'])} <span class="arrow">→</span> {html.escape(it['seed_es'])}</h3>
                <span class="score">{it['score']}</span>
              </div>
              <div class="verdict">{html.escape(it['verdict'])}</div>
              <div class="meters">
                <div class="meter"><span>🔥 Señal EN (explota)</span><div class="bar en"><i style="width:{it['en_signal']}%"></i></div><b>{it['en_signal']}</b></div>
                <div class="meter"><span>🈳 Oferta ES (menos=mejor)</span><div class="bar es"><i style="width:{it['es_supply']}%"></i></div><b>{it['es_supply']}</b></div>
                <div class="meter"><span>⭐ ARBITRAJE</span><div class="bar arb"><i style="width:{it['arbitrage']}%"></i></div><b>{it['arbitrage']}</b></div>
              </div>
              <div class="stats">EN mediana: <b>{enm}</b> vistas · ES: <b>{it['es_count']}</b> videos, mediana <b>{esm}</b></div>
              <div class="cols">
                <div><h4>🎯 Ángulos PROBADOS en inglés (róbalos para español)</h4><ul class="a">{angles}</ul></div>
                <div><h4>🇪🇸 Lo que existe en español (la competencia)</h4><ul class="c">{esx}</ul></div>
              </div>
              <h4>💡 Preguntas sin responder (information gain)</h4><ul class="q">{qs}</ul>
            </div>""")
        panels.append(f'<div class="panel{act}" id="panel{idx}">' + "".join(cards) + "</div>")

    banner = ('<div class="demo">⚠️ MODO DEMO — datos de ejemplo. Corre '
              '<code>python3 hunt.py</code> con tu API key para datos reales.</div>'
              if is_demo else "")
    stamp = "datos de ejemplo" if is_demo else "YouTube Data API · arbitraje EN→ES"
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cazador de Ideas — Arbitraje EN→ES</title>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#0e0b08;color:#f4e9d6;padding:18px;max-width:1120px;margin:auto}}
h1{{font-size:26px}}.sub{{color:#b8ac97;font-size:13px;margin:2px 0 16px}}
.demo{{background:#3a2a12;border:1px solid #e8b04b;color:#e8b04b;padding:10px 14px;border-radius:8px;margin-bottom:16px;font-size:13px}}
.tabs{{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}}
.tab{{background:#1a1512;color:#b8ac97;border:1px solid #2a2320;padding:10px 16px;border-radius:10px;cursor:pointer;font-size:15px;font-weight:600}}
.tab.active{{background:#e8b04b;color:#0e0b08;border-color:#e8b04b}}
.panel{{display:none}}.panel.active{{display:block}}
.card{{background:#161210;border:1px solid #2a2320;border-radius:14px;padding:18px;margin-bottom:14px}}
.cardhead{{display:flex;align-items:center;gap:12px}}
.rank{{background:#b23a2e;color:#fff;font-weight:800;border-radius:8px;padding:4px 10px}}
.cardhead h3{{flex:1;font-size:17px}}.arrow{{color:#e8b04b}}
.score{{background:#e8b04b;color:#0e0b08;font-weight:800;border-radius:8px;padding:6px 12px;font-size:18px}}
.verdict{{margin:10px 0;font-size:14px;color:#f4e9d6;background:#201b16;padding:8px 12px;border-radius:8px}}
.meters{{display:flex;gap:16px;flex-wrap:wrap;margin:12px 0}}
.meter{{display:flex;align-items:center;gap:8px;font-size:12px;color:#b8ac97;flex:1;min-width:230px}}
.meter .bar{{flex:1;height:8px;background:#2a2320;border-radius:6px;overflow:hidden}}
.bar.en i{{background:#c96}}.bar.es i{{background:#b23a2e}}.bar.arb i{{background:#e8b04b}}
.meter .bar i{{display:block;height:100%}}.meter b{{color:#f4e9d6;min-width:26px;text-align:right}}
.stats{{font-size:12px;color:#8f8572;margin-bottom:12px}}
.cols{{display:flex;gap:20px;flex-wrap:wrap}}.cols>div{{flex:1;min-width:260px}}
h4{{font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:#e8b04b;margin:10px 0 6px}}
ul{{list-style:none;font-size:13px}}ul.a li{{padding:5px 0;border-bottom:1px solid #201b18}}
ul.c li,ul.q li{{padding:4px 0;color:#a89c86}}li.good{{color:#5aa469;font-weight:600}}
.muted{{color:#6b6357;font-style:italic}}code{{background:#221c18;padding:2px 6px;border-radius:4px}}
</style></head><body>
<h1>🎯 Cazador de Ideas — Arbitraje EN→ES</h1>
<div class="sub">Explota en inglés · casi nulo en español · ángulo virgen · tema masivo — {stamp}</div>
{banner}
<div class="tabs">{"".join(tabs)}</div>
{"".join(panels)}
<script>
function showTab(i){{
 document.querySelectorAll('.tab').forEach((t,n)=>t.classList.toggle('active',n===i));
 document.querySelectorAll('.panel').forEach((p,n)=>p.classList.toggle('active',n===i));
}}
</script></body></html>"""


# ----------------------------- demo -----------------------------
def demo_data(cfg):
    def idea(rank, en, es, arb, ensig, essup, verdict, angles, esx, qs, enmed, esmed, escount):
        return {"rank": rank, "score": arb + 8, "arbitrage": arb, "en_signal": ensig,
                "exploding": ensig - 10, "es_supply": essup, "es_count": escount,
                "en_med": enmed, "es_med": esmed, "seed_es": es, "seed_en": en,
                "proven_angles": angles, "es_existing": esx, "questions": qs, "verdict": verdict}
    out = []
    for niche in cfg["niches"]:
        if niche["id"] == "cronicas":
            ideas = [
                idea(1, "forgotten inventors", "inventores olvidados", 78, 88, 12,
                     "🔥 ORO — explota en inglés, casi vacío en español. Sé el primero.",
                     ["The Forgotten Genius Who Invented Color TV", "The Inventor Erased From History",
                      "The Man Who Gave Us Everything and Got Nothing"],
                     [], ["Why was he erased?", "Is this actually true?"], 3_400_000, 0, 0),
                idea(2, "lost civilizations", "civilizaciones perdidas", 62, 84, 34,
                     "✅ Buena — demanda en inglés y oferta española floja.",
                     ["The Civilization That Vanished Overnight", "A Lost World Older Than Egypt"],
                     ["Civilizaciones perdidas | resumen"], ["Where did they go?"], 6_100_000, 120_000, 3),
                idea(3, "the empire that fell", "el imperio que cayo", 55, 80, 40,
                     "✅ Buena — demanda en inglés y oferta española floja.",
                     ["The Empire That Destroyed Itself From Within", "How One Decision Ended an Empire"],
                     ["El imperio romano resumen"], ["What decision?"], 4_800_000, 300_000, 4),
                idea(4, "greek mythology explained", "mitologia griega explicada", 41, 86, 62,
                     "⚠️ Saturado en español — solo entra con ángulo/retención superior.",
                     ["The Greek God Everyone Forgets", "The Dark Myth They Don't Teach You"],
                     ["Mitología griega explicada", "Dioses del Olimpo"], ["Is this myth real?"], 5_500_000, 900_000, 9),
            ]
        else:
            ideas = [
                idea(1, "stoicism when she ignores you", "estoicismo cuando ella te ignora", 74, 82, 18,
                     "🔥 ORO — explota en inglés, casi vacío en español. Sé el primero.",
                     ["Stoicism: What To Do When She Ignores You", "The Stoic Response To Being Ignored"],
                     [], ["Isn't this manipulation?", "Does it really work?"], 1_900_000, 0, 0),
                idea(2, "why she comes back", "por que una mujer regresa", 66, 80, 26,
                     "✅ Buena — demanda en inglés y oferta española floja.",
                     ["Why She Comes Back When You Move On", "The Psychology of Why Exes Return"],
                     ["Por qué vuelven las ex"], ["How long does it take?"], 2_600_000, 90_000, 2),
                idea(3, "signs she is cheating", "senales de infidelidad", 48, 84, 52,
                     "✅ Buena — demanda en inglés y oferta española floja.",
                     ["7 Signs She's Cheating (Most Men Miss #4)", "The One Sign Nobody Talks About"],
                     ["10 señales de infidelidad", "Cómo saber si te engaña"], ["How to confirm without accusing?"], 3_100_000, 600_000, 8),
                idea(4, "when a woman goes quiet", "cuando una mujer se queda callada", 38, 80, 60,
                     "⚠️ Saturado en español — solo entra con ángulo/retención superior.",
                     ["When A Woman Goes Silent, This Is What It Means", "Her Silence Is A Message"],
                     ["Cuando una mujer no te llama", "El silencio de una mujer"], ["What if she never talks?"], 2_200_000, 700_000, 10),
            ]
        out.append((niche, ideas))
    return out


def main():
    cfg = load_config()
    demo = "--demo" in sys.argv
    if demo:
        data = demo_data(cfg)
    else:
        key = load_env()
        if not key:
            print("❌ No encuentro YOUTUBE_API_KEY. Pon tu clave en idea-hunter/.env "
                  "(copia .env.example) o export YOUTUBE_API_KEY=...\n"
                  "   Para ver el formato sin API: python3 hunt.py --demo")
            sys.exit(1)
        data = []
        for niche in cfg["niches"]:
            print(f"→ nicho: {niche['name']} (buscando EN y ES) ...")
            data.append((niche, build_niche(key, niche, cfg)))
    out = os.path.join(HERE, "dashboard.html")
    open(out, "w").write(render_html(data, is_demo=demo))
    print(f"✅ Dashboard escrito: {out}")


if __name__ == "__main__":
    main()
