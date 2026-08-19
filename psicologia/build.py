# -*- coding: utf-8 -*-
"""Genera la web de psicología/relaciones -> carpeta dist/.
Uso: python3 psicologia/build.py"""
import os, html, shutil
from data import SITE, ARTICLES

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

def ad(slot_key, label="Publicidad"):
    """Devuelve el código Adsterra si está configurado; si no, un placeholder."""
    code = SITE.get(slot_key, "")
    inner = code if code else '<span class="ad-ph">Espacio publicitario</span>'
    return f'''<div class="ad"><span class="ad-label">{label}</span>
      <div class="ad-inner">{inner}</div></div>'''

MONETAG_SITEWIDE = f'''<!-- Monetag Push -->
{SITE.get("monetag_push", "")}
<!-- Monetag In-Page Push -->
{SITE.get("monetag_inpage_push", "")}
<!-- Monetag Vignette -->
{SITE.get("monetag_vignette", "")}'''

def video(yt):
    return f'''<div class="video-frame">
      <iframe src="https://www.youtube.com/embed/{yt}" title="Vídeo" loading="lazy"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe></div>'''

def head(title, desc, canonical):
    social = SITE.get("ad_social", "")
    social_tag = f'<script src="{social}" data-cfasync="false" async></script>' if social else ""
    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:site_name" content="{SITE['name']}">
<meta name="robots" content="index,follow">
<meta name="google-site-verification" content="{SITE['google_verify']}">
<link rel="stylesheet" href="/style.css">
{social_tag}
</head>
<body>
<header class="site-header">
  <a class="logo" href="/">🔥 <span>{SITE['name']}</span></a>
  <nav><a href="/">Inicio</a> <a href="{SITE['facebook']}" target="_blank" rel="noopener">Facebook</a></nav>
</header>
<main>'''

FOOT = f'''</main>
<footer class="site-footer">
  <p>{SITE['name']} — {SITE['tagline']}.</p>
  <p><a href="{SITE['facebook']}" target="_blank" rel="noopener">Síguenos en Facebook</a> ·
     <a href="/privacidad.html">Privacidad</a> · <a href="/aviso.html">Aviso legal</a></p>
  <p class="disclaimer">Contenido divulgativo sobre psicología y relaciones. No sustituye la ayuda
     de un profesional. Las señales descritas son orientativas, no diagnósticos.</p>
</footer>
{MONETAG_SITEWIDE}
</body></html>'''

def write(path, content):
    full = os.path.join(DIST, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

def related(current):
    out = ""
    count = 0
    for a in ARTICLES:
        if a["slug"] == current["slug"]:
            continue
        out += f'<a class="rel-card" href="/{a["slug"]}.html"><h4>{html.escape(a["title"])}</h4></a>\n'
        count += 1
        if count == 4:
            break
    return out

# ---------- Página de artículo ----------
def article_page(a):
    canonical = f"{SITE['domain']}/{a['slug']}.html"
    sections = ""
    for i, (sub, paras) in enumerate(a["body"]):
        sections += f"<h2>{html.escape(sub)}</h2>\n"
        for p in paras:
            sections += f"<p>{p}</p>\n"
        # anuncio native tras la 2ª sección (en pleno contenido = más CPM)
        if i == 1:
            sections += ad("ad_native", "Publicidad")
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/">Inicio</a> › <span>{html.escape(a['cat'])}</span></nav>
    <span class="tag">{html.escape(a['cat'])}</span>
    <h1>{html.escape(a['title'])}</h1>
    <p class="lead">{html.escape(a['summary'])}</p>
    {ad("ad_top")}
    {video(a['yt'])}
    {sections}
    {ad("ad_incontent")}
    <div class="fb-cta">
      <p>📢 ¿Te gustó? Sígueme en <a href="{SITE['facebook']}" target="_blank" rel="noopener">Facebook</a>
         para más contenido sobre psicología y relaciones.</p>
    </div>
    <h2>Sigue leyendo</h2>
    <div class="rel-grid">{related(a)}</div>
    {ad("ad_bottom")}
  </article>'''
    write(f"{a['slug']}.html", head(a['title'], a['summary'], canonical) + body + FOOT)

# ---------- Home ----------
def home():
    cards = ""
    for a in ARTICLES:
        cards += f'''<a class="card" href="/{a['slug']}.html">
          <span class="tag">{html.escape(a['cat'])}</span>
          <h3>{html.escape(a['title'])}</h3>
          <p>{html.escape(a['summary'][:100])}…</p></a>\n'''
    body = f'''
  <section class="hero">
    <h1>Psicología femenina, atracción e infidelidad</h1>
    <p class="lead">{SITE['description']}</p>
    <a class="btn" href="{SITE['facebook']}" target="_blank" rel="noopener">🔥 Síguenos en Facebook</a>
  </section>
  {ad("ad_top")}
  <section class="grid-wrap">
    <h2>Artículos</h2>
    <div class="grid">{cards}</div>
  </section>
  {ad("ad_bottom")}'''
    write("index.html", head(f"{SITE['name']} — {SITE['tagline']}", SITE['description'],
                             SITE['domain'] + "/") + body + FOOT)

# ---------- Legales ----------
def legal():
    priv = '''<article class="post"><h1>Política de privacidad</h1>
      <p>Este sitio muestra publicidad de terceros que puede usar cookies para mostrar anuncios
      relevantes. Puedes desactivar las cookies de personalización en tu navegador. No recopilamos
      datos personales identificables; el tráfico se mide de forma anónima.</p></article>'''
    aviso = '''<article class="post"><h1>Aviso legal</h1>
      <p>El contenido de esta web es divulgativo y de entretenimiento sobre psicología y relaciones.
      No constituye asesoramiento psicológico profesional. Ante problemas serios de pareja o
      emocionales, consulta a un profesional cualificado.</p></article>'''
    write("privacidad.html", head("Política de privacidad — " + SITE['name'],
          "Política de privacidad y cookies.", SITE['domain']+"/privacidad.html") + priv + FOOT)
    write("aviso.html", head("Aviso legal — " + SITE['name'],
          "Aviso legal.", SITE['domain']+"/aviso.html") + aviso + FOOT)

def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/privacidad.html", SITE['domain'] + "/aviso.html"]
    urls += [f"{SITE['domain']}/{a['slug']}.html" for a in ARTICLES]
    items = "\n".join(f"  <url><loc>{u}</loc><changefreq>weekly</changefreq></url>" for u in urls)
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?>\n'
          f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{items}\n</urlset>')
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE['domain']}/sitemap.xml\n")

def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    shutil.copy(os.path.join(HERE, "style.css"), os.path.join(DIST, "style.css"))
    home(); legal(); seo_files()
    for a in ARTICLES:
        article_page(a)
    print(f"OK -> {len(ARTICLES)} artículos + home + legales + sitemap en {DIST}")

if __name__ == "__main__":
    main()
