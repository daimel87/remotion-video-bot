#!/usr/bin/env python3
"""
Cazador de Ideas — pipeline multi-nicho para YouTube.

Encuentra temas EVERGREEN con: mucha demanda + poca oferta (hueco de mercado)
+ ángulo de "information gain" (lo que los videos top NO responden), enfocado
en el mercado latino/español. Salida: un dashboard HTML con una pestaña por nicho.

Uso:
    export YOUTUBE_API_KEY=...        # o ponlo en idea-hunter/.env
    python3 hunt.py                  # corre real (usa la API)
    python3 hunt.py --demo           # genera el dashboard con datos de ejemplo (sin API)

La API key se lee del entorno / .env — este script NUNCA la escribe a disco ni al repo.
"""
import os, sys, json, math, html, time, urllib.parse, urllib.request, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
API = "https://www.googleapis.com/youtube/v3"


# ----------------------------- utilidades -----------------------------
def load_env():
    """Carga YOUTUBE_API_KEY del entorno o de idea-hunter/.env (sin imprimirla)."""
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
    """GET a la YouTube Data API. Respeta proxies del entorno (urllib estándar)."""
    params["key"] = key
    url = f"{API}/{endpoint}?" + urllib.parse.urlencode(params, doseq=True)
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def iso_to_days(iso):
    try:
        d = datetime.datetime.fromisoformat(iso.replace("Z", "+00:00"))
        return (datetime.datetime.now(datetime.timezone.utc) - d).days
    except Exception:
        return 9999


def parse_dur(iso):
    """PT#H#M#S -> segundos (grosso modo)."""
    import re
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", iso or "")
    if not m:
        return 0
    h, mi, s = (int(x) if x else 0 for x in m.groups())
    return h * 3600 + mi * 60 + s


# ----------------------------- núcleo -----------------------------
def analyze_seed(key, seed, cfg):
    """Busca un seed en YouTube y devuelve métricas de demanda/oferta + preguntas minadas."""
    market = cfg["market"]
    sr = yt("search.list", key, part="snippet", q=seed, type="video",
            order="viewCount", maxResults=cfg["top_n_per_seed"],
            regionCode=market["regionCode"], relevanceLanguage=market["relevanceLanguage"])
    items = sr.get("items", [])
    vids = [it["id"]["videoId"] for it in items if it.get("id", {}).get("videoId")]
    if not vids:
        return None
    chan_ids = list({it["snippet"]["channelId"] for it in items})
    vstats = yt("videos.list", key, part="statistics,contentDetails,snippet",
                id=",".join(vids))
    cstats = yt("channels.list", key, part="statistics", id=",".join(chan_ids))
    subs = {c["id"]: int(c["statistics"].get("subscriberCount", 0) or 0)
            for c in cstats.get("items", [])}

    rows = []
    for v in vstats.get("items", []):
        st = v.get("statistics", {})
        sn = v.get("snippet", {})
        views = int(st.get("viewCount", 0) or 0)
        rows.append({
            "id": v["id"], "title": sn.get("title", ""),
            "views": views, "age_days": iso_to_days(sn.get("publishedAt", "")),
            "channel": sn.get("channelTitle", ""),
            "subs": subs.get(sn.get("channelId"), 0),
            "dur": parse_dur(v.get("contentDetails", {}).get("duration", "")),
        })
    rows.sort(key=lambda r: r["views"], reverse=True)
    if not rows:
        return None

    views_list = sorted((r["views"] for r in rows), reverse=True)
    median_views = views_list[len(views_list) // 2]
    top_views = views_list[0]
    avg_age = sum(r["age_days"] for r in rows) / len(rows)
    median_subs = sorted(r["subs"] for r in rows)[len(rows) // 2]
    small_chan_wins = sum(1 for r in rows if r["subs"] and r["views"] > r["subs"] * 5)

    # --- scores (0-100) ---
    demand = min(100, math.log10(max(10, median_views)) / 7 * 100)     # ~10M -> 100
    # hueco: premia videos top viejos, canales chicos ganando, y baja mediana de subs
    gap = 0
    gap += 35 if avg_age > 730 else (20 if avg_age > 365 else 5)        # top viejo = hueco
    gap += 35 * min(1, small_chan_wins / max(1, len(rows) / 2))         # chicos ganan = hueco
    gap += 30 if median_subs < 200000 else (12 if median_subs < 1_000_000 else 2)
    gap = min(100, gap)

    return {
        "seed": seed, "demand": round(demand), "gap": round(gap),
        "median_views": median_views, "top_views": top_views,
        "avg_age_days": round(avg_age), "median_subs": median_subs,
        "small_chan_wins": small_chan_wins,
        "top_video": rows[0], "top_ids": [r["id"] for r in rows[:3]],
        "sample_titles": [r["title"] for r in rows[:4]],
    }


def mine_questions(key, video_ids, limit=40):
    """Extrae preguntas de los comentarios = curiosidad no resuelta (information gain)."""
    qmarks = ("?", "¿")
    starters = ("por que", "porque", "por qué", "como", "cómo", "alguien sabe",
                "que pasa", "qué pasa", "es verdad", "cual", "cuál", "y si")
    found = []
    for vid in video_ids:
        try:
            cr = yt("commentThreads.list", key, part="snippet", videoId=vid,
                    order="relevance", maxResults=50, textFormat="plainText")
        except Exception:
            continue
        for it in cr.get("items", []):
            t = it["snippet"]["topLevelComment"]["snippet"]["textDisplay"].strip()
            low = t.lower()
            if (any(q in t for q in qmarks) or any(low.startswith(s) for s in starters)) \
               and 12 < len(t) < 160:
                found.append(t)
        if len(found) >= limit:
            break
    # dedupe simple
    seen, out = set(), []
    for f in found:
        k = f.lower()[:50]
        if k not in seen:
            seen.add(k); out.append(f)
    return out[:8]


TITLE_FORMULAS = [
    "{topic}: la verdad que nadie te contó",
    "Por qué {topic} no es lo que crees",
    "{topic}: el detalle que la historia ocultó",
    "La cara oculta de {topic}",
    "{topic}… y el error que todos repiten",
]


def build_niche(key, niche, cfg):
    seeds = []
    for s in niche["seeds"]:
        try:
            r = analyze_seed(key, s, cfg)
        except Exception as e:
            r = None
        if r:
            w = niche["weights"]
            r["score"] = round(r["demand"] * w["demand"] * 0.5 + r["gap"] * w["gap"] * 0.5)
            seeds.append(r)
        time.sleep(0.2)
    seeds.sort(key=lambda x: x["score"], reverse=True)
    ideas = []
    for i, s in enumerate(seeds[:5]):
        qs = mine_questions(key, s["top_ids"]) if key else []
        topic = s["seed"].strip().capitalize()
        ideas.append({
            "rank": i + 1, "score": s["score"], "demand": s["demand"], "gap": s["gap"],
            "seed": s["seed"],
            "suggested_title": TITLE_FORMULAS[i % len(TITLE_FORMULAS)].format(topic=topic),
            "median_views": s["median_views"], "avg_age_days": s["avg_age_days"],
            "median_subs": s["median_subs"],
            "why": _why(s),
            "questions": qs,
            "competitors": s["sample_titles"],
        })
    return ideas


def _why(s):
    bits = []
    bits.append(f"Demanda: mediana de {s['median_views']:,} vistas".replace(",", "."))
    if s["avg_age_days"] > 365:
        bits.append(f"los videos top promedian {s['avg_age_days']//365} año(s) → hueco")
    if s["small_chan_wins"]:
        bits.append(f"{s['small_chan_wins']} canal(es) chico(s) ganando → poca oferta")
    if s["median_subs"] < 200000:
        bits.append("dominado por canales chicos → entrable")
    return " · ".join(bits)


# ----------------------------- HTML -----------------------------
def render_html(niches_data, is_demo=False):
    tabs, panels = [], []
    for idx, (niche, ideas) in enumerate(niches_data):
        active = " active" if idx == 0 else ""
        tabs.append(
            f'<button class="tab{active}" onclick="showTab({idx})">'
            f'{niche["emoji"]} {html.escape(niche["name"])}</button>')
        cards = []
        for it in ideas:
            qs = "".join(f"<li>{html.escape(q)}</li>" for q in it["questions"]) or \
                 "<li class='muted'>(corre con tu API key para minar preguntas reales)</li>"
            comps = "".join(f"<li>{html.escape(c)}</li>" for c in it.get("competitors", [])[:3])
            cards.append(f"""
            <div class="card">
              <div class="cardhead">
                <span class="rank">#{it['rank']}</span>
                <h3>{html.escape(it['suggested_title'])}</h3>
                <span class="score">{it['score']}</span>
              </div>
              <div class="meters">
                <div class="meter"><span>Demanda</span><div class="bar"><i style="width:{it['demand']}%"></i></div><b>{it['demand']}</b></div>
                <div class="meter"><span>Hueco (poca oferta)</span><div class="bar gap"><i style="width:{it['gap']}%"></i></div><b>{it['gap']}</b></div>
              </div>
              <p class="why">{html.escape(it['why'])}</p>
              <div class="cols">
                <div><h4>💡 Information gain — preguntas sin responder</h4><ul class="q">{qs}</ul></div>
                <div><h4>🎯 Competencia (top actual)</h4><ul class="c">{comps}</ul></div>
              </div>
              <div class="seed">semilla: <code>{html.escape(it['seed'])}</code></div>
            </div>""")
        panels.append(
            f'<div class="panel{active}" id="panel{idx}">' + "".join(cards) + "</div>")

    banner = ('<div class="demo">⚠️ MODO DEMO — datos de ejemplo. Corre '
              '<code>python3 hunt.py</code> con tu API key para datos reales.</div>'
              if is_demo else "")
    stamp = "datos de ejemplo" if is_demo else "generado con YouTube Data API"
    return f"""<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cazador de Ideas — Dashboard</title>
<style>
*{{box-sizing:border-box;margin:0;padding:0}}
body{{font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#0e0b08;color:#f4e9d6;padding:18px;max-width:1100px;margin:auto}}
h1{{font-size:26px;margin-bottom:2px}}.sub{{color:#b8ac97;font-size:13px;margin-bottom:16px}}
.demo{{background:#3a2a12;border:1px solid #e8b04b;color:#e8b04b;padding:10px 14px;border-radius:8px;margin-bottom:16px;font-size:13px}}
.tabs{{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}}
.tab{{background:#1a1512;color:#b8ac97;border:1px solid #2a2320;padding:10px 16px;border-radius:10px;cursor:pointer;font-size:15px;font-weight:600}}
.tab.active{{background:#e8b04b;color:#0e0b08;border-color:#e8b04b}}
.panel{{display:none}}.panel.active{{display:block}}
.card{{background:#161210;border:1px solid #2a2320;border-radius:14px;padding:18px;margin-bottom:14px}}
.cardhead{{display:flex;align-items:center;gap:12px}}
.rank{{background:#b23a2e;color:#fff;font-weight:800;border-radius:8px;padding:4px 10px;font-size:14px}}
.cardhead h3{{flex:1;font-size:19px;line-height:1.25}}
.score{{background:#e8b04b;color:#0e0b08;font-weight:800;border-radius:8px;padding:6px 12px;font-size:18px}}
.meters{{display:flex;gap:20px;margin:14px 0;flex-wrap:wrap}}
.meter{{display:flex;align-items:center;gap:8px;font-size:13px;color:#b8ac97;flex:1;min-width:220px}}
.meter .bar{{flex:1;height:8px;background:#2a2320;border-radius:6px;overflow:hidden}}
.meter .bar i{{display:block;height:100%;background:#e8b04b}}
.meter .bar.gap i{{background:#5aa469}}
.meter b{{color:#f4e9d6;min-width:26px;text-align:right}}
.why{{color:#cbbfa6;font-size:13px;margin-bottom:12px}}
.cols{{display:flex;gap:20px;flex-wrap:wrap}}.cols>div{{flex:1;min-width:260px}}
h4{{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#e8b04b;margin-bottom:6px}}
ul{{list-style:none;font-size:13px}}ul.q li{{padding:5px 0;border-bottom:1px solid #201b18}}
ul.c li{{padding:4px 0;color:#8f857260;color:#8f8572}}
.muted{{color:#6b6357;font-style:italic}}
.seed{{margin-top:12px;font-size:12px;color:#6b6357}}code{{background:#221c18;padding:2px 6px;border-radius:4px}}
</style></head><body>
<h1>🎯 Cazador de Ideas</h1>
<div class="sub">Evergreen · alta demanda · poca oferta en el mercado latino · information gain — {stamp}</div>
{banner}
<div class="tabs">{"".join(tabs)}</div>
{"".join(panels)}
<script>
function showTab(i){{
  document.querySelectorAll('.tab').forEach((t,n)=>t.classList.toggle('active',n===i));
  document.querySelectorAll('.panel').forEach((p,n)=>p.classList.toggle('active',n===i));
}}
</script></body></html>"""


# ----------------------------- demo data -----------------------------
def demo_data(cfg):
    def idea(rank, title, seed, demand, gap, why, qs, comps):
        return {"rank": rank, "score": round(demand*0.5+gap*0.5), "demand": demand, "gap": gap,
                "seed": seed, "suggested_title": title, "median_views": 0, "avg_age_days": 0,
                "median_subs": 0, "why": why, "questions": qs, "competitors": comps}
    out = []
    for niche in cfg["niches"]:
        if niche["id"] == "cronicas":
            ideas = [
                idea(1, "El mexicano que inventó el cine a color (y nadie lo recuerda)", "inventos mexicanos", 82, 74,
                     "Demanda alta · top viejo (5+ años) · canales chicos ganando → hueco",
                     ["¿Por qué no enseñan esto en la escuela?", "¿Es verdad que fue mexicano?", "¿Y qué pasó con su patente?"],
                     ["Historia de la TV a color | resumen", "Inventos que cambiaron el mundo"]),
                idea(2, "La civilización que borraron de los libros", "civilizaciones perdidas", 88, 55,
                     "Demanda muy alta · oferta genérica repetida → ángulo virgen",
                     ["¿Alguien sabe por qué desaparecieron?", "¿Hay pruebas reales de esto?"],
                     ["Top 10 civilizaciones perdidas", "Civilizaciones antiguas"]),
                idea(3, "Por qué la papa derrumbó un imperio", "por que desaparecio", 70, 68,
                     "Conexión inesperada · poca oferta en español",
                     ["¿Cómo una papa hizo eso?", "¿Qué imperio exactamente?"],
                     ["Historia de la papa", "El alimento que cambió el mundo"]),
                idea(4, "El dios griego que la mitología prefiere olvidar", "mitologia griega", 76, 48,
                     "Demanda alta · saturado en genérico, virgen en el sub-ángulo",
                     ["¿Por qué nadie habla de él?", "¿Es real este mito?"],
                     ["Mitología griega explicada", "Dioses del Olimpo"]),
                idea(5, "El imperio que cayó por su propia comida", "el imperio que", 66, 60,
                     "Ángulo de causa oculta (tu fórmula) · poca oferta",
                     ["¿Qué comida?", "¿Cuándo pasó esto?"],
                     ["Ascenso y caída de los imperios"]),
            ]
        else:
            ideas = [
                idea(1, "Cuando una mujer se queda callada, significa esto", "cuando una mujer", 90, 40,
                     "Demanda enorme · MUY saturado → gana solo con ángulo/retención superior",
                     ["¿Y si nunca habla?", "¿Esto aplica si está molesta?"],
                     ["Cuando una mujer no te llama", "Psicología de la mujer"]),
                idea(2, "La señal de infidelidad que casi nadie menciona", "señales de infidelidad", 84, 52,
                     "Demanda alta · hueco en la señal específica no cubierta",
                     ["¿Cómo lo confirmo sin acusar?", "¿Y si me equivoco?"],
                     ["10 señales de infidelidad", "Cómo saber si te engaña"]),
                idea(3, "Estoicismo: por qué ignorarla funciona (y cuándo no)", "estoicismo mujeres", 72, 58,
                     "Sub-nicho en alza · poca oferta con matiz honesto",
                     ["¿No es manipulación?", "¿Funciona de verdad?"],
                     ["Estoicismo y mujeres", "Marco Aurelio relaciones"]),
                idea(4, "Lo que una mujer nunca te dirá pero espera que sepas", "psicologia femenina", 80, 46,
                     "Demanda alta · saturado → diferénciate con ejemplos reales",
                     ["¿Por qué no lo dicen directo?", "¿Todas son iguales?"],
                     ["Psicología femenina", "Cómo piensa una mujer"]),
                idea(5, "Por qué una mujer regresa justo cuando la superas", "por que una mujer", 78, 50,
                     "Curiosidad universal · ángulo de timing poco cubierto",
                     ["¿Es verdad esto?", "¿Cuánto tiempo tarda?"],
                     ["Por qué vuelven las ex", "Psicología de la ruptura"]),
            ]
        out.append((niche, ideas))
    return out


# ----------------------------- main -----------------------------
def main():
    cfg = load_config()
    demo = "--demo" in sys.argv
    if demo:
        data = demo_data(cfg)
    else:
        key = load_env()
        if not key:
            print("❌ No encuentro YOUTUBE_API_KEY.\n"
                  "   Pon tu clave en idea-hunter/.env (copia .env.example) "
                  "o export YOUTUBE_API_KEY=...\n"
                  "   Para ver el formato sin API: python3 hunt.py --demo")
            sys.exit(1)
        data = []
        for niche in cfg["niches"]:
            print(f"→ analizando nicho: {niche['name']} ...")
            data.append((niche, build_niche(key, niche, cfg)))
    out = os.path.join(HERE, "dashboard.html")
    open(out, "w").write(render_html(data, is_demo=demo))
    print(f"✅ Dashboard escrito: {out}")


if __name__ == "__main__":
    main()
