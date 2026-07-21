# -*- coding: utf-8 -*-
"""Genera la web estática a partir de data.py -> carpeta dist/.
Uso: python3 site/build.py"""
import os, html, shutil
from data import SITE, TOOLS

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

# ---- Bloque de anuncio Adsterra (responsive: 728x90 escritorio / 320x50 móvil) ----
def ad(slot):
    dk = SITE["adsterra_desktop"]
    mk = SITE["adsterra_mobile"]
    return f'''<div class="ad" data-slot="{slot}">
      <span class="ad-label">Publicidad</span>
      <div class="ad-inner ad-desktop">
        <script type="text/javascript">
          atOptions = {{ 'key':'{dk}', 'format':'iframe', 'height':90, 'width':728, 'params':{{}} }};
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/{dk}/invoke.js"></script>
      </div>
      <div class="ad-inner ad-mobile">
        <script type="text/javascript">
          atOptions = {{ 'key':'{mk}', 'format':'iframe', 'height':50, 'width':320, 'params':{{}} }};
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/{mk}/invoke.js"></script>
      </div>
    </div>'''

def head(title, desc, canonical):
    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:site_name" content="{SITE['name']}">
<meta name="robots" content="index,follow">
<meta name="google-site-verification" content="{SITE['google_verify']}">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="site-header">
  <a class="logo" href="/">🔧 {SITE['name']}</a>
  <nav><a href="/">Inicio</a> <a href="/#herramientas">Herramientas</a>
  <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a></nav>
</header>
<main>'''

FOOT = f'''</main>
<footer class="site-footer">
  <p>{SITE['name']} — {SITE['tagline']}.</p>
  <p><a href="{SITE['youtube']}" target="_blank" rel="noopener">Canal de YouTube</a> ·
     <a href="/privacidad.html">Privacidad</a> · <a href="/aviso.html">Aviso legal</a></p>
  <p class="disclaimer">Las herramientas enlazadas pertenecen a sus respectivos fabricantes.
     Úsalas bajo tu responsabilidad; una reparación de bajo nivel borra todos los datos de la USB.</p>
</footer>
<!-- Adsterra Social Bar -->
<script src="{SITE['adsterra_socialbar']}" data-cfasync="false" async></script>
</body></html>'''

def write(path, content):
    full = os.path.join(DIST, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

# ---------- Página de cada herramienta ----------
def tool_page(t):
    canonical = f"{SITE['domain']}/{t['slug']}.html"
    key_html = ""
    if t.get("key"):
        key_html = f'<p class="note">🔑 Contraseña del archivo: <code>{t["key"]}</code></p>'
    steps = "\n".join(f"<li>{s}</li>" for s in t["steps"])
    faq = f'''
    <section class="faq">
      <h2>Preguntas frecuentes</h2>
      <details><summary>¿Esta herramienta borra mis archivos?</summary>
        <p>Sí. Una reparación de bajo nivel ({t['brand']}) reformatea el controlador y elimina
           todos los datos de la memoria. Haz copia de seguridad si aún puedes leerla.</p></details>
      <details><summary>¿Cómo sé si mi USB usa el controlador {t['brand']}?</summary>
        <p>Usa <a href="/chipgenius.html">ChipGenius</a> para leer el VID/PID y el fabricante del
           chip. Si coincide con {t['brand']}, esta es tu herramienta.</p></details>
      <details><summary>La herramienta no detecta mi memoria, ¿qué hago?</summary>
        <p>Prueba otro puerto USB (mejor traseros 2.0), ejecútala como administrador y evita hubs
           o alargadores. Revisa también la <a href="/tabla-solucionadas.html">tabla de solucionadas</a>.</p></details>
    </section>'''
    body = f'''
  <article class="tool">
    <nav class="crumbs"><a href="/">Inicio</a> › {html.escape(t['brand'])}</nav>
    <h1>{html.escape(t['title'])}</h1>
    <p class="lead">{t['intro']}</p>
    {ad('top')}
    <a class="download" href="{t['url']}" target="_blank" rel="noopener nofollow"
       onclick="window.open('{SITE['adsterra_smartlink']}','_blank')">
       ⬇ Descargar {html.escape(t['brand'])}</a>
    {key_html}
    <h2>Cómo usar esta herramienta paso a paso</h2>
    <ol class="steps">{steps}</ol>
    {ad('mid')}
    {faq}
    <p class="cta">📺 ¿Prefieres verlo en vídeo? Mira el tutorial en
       <a href="{SITE['youtube']}" target="_blank" rel="noopener">nuestro canal de YouTube</a>.</p>
    {ad('bottom')}
  </article>'''
    desc = t['intro'][:155]
    write(f"{t['slug']}.html", head(t['title'], desc, canonical) + body + FOOT)

# ---------- Home ----------
def home():
    cards = ""
    for t in TOOLS:
        cards += f'''<a class="card" href="/{t['slug']}.html">
          <h3>{html.escape(t['brand'])}</h3>
          <p>{html.escape(t['intro'][:90])}…</p>
          <span class="go">Ver y descargar →</span></a>\n'''
    body = f'''
  <section class="hero">
    <h1>Herramientas gratis para reparar memorias USB</h1>
    <p class="lead">{SITE['description']}</p>
    <a class="btn" href="#herramientas">Ver herramientas</a>
    <a class="btn ghost" href="/chipgenius.html">¿No sabes tu controlador? Empieza aquí</a>
  </section>
  {ad('home-top')}
  <section class="guide">
    <h2>¿Cómo reparar una memoria USB dañada?</h2>
    <p>Cuando una USB no da formato, aparece con 0 bytes, pide formatear una y otra vez o Windows no
       la reconoce, casi siempre el problema está en el <strong>controlador</strong> (el chip que
       gobierna la memoria). La solución es reprogramarlo con su herramienta de fábrica (MPTool).
       El proceso es siempre el mismo:</p>
    <ol class="steps">
      <li><a href="/chipgenius.html">Identifica el controlador</a> con ChipGenius (VID/PID + fabricante).</li>
      <li>Busca en la <a href="/tabla-solucionadas.html">tabla de solucionadas</a> si tu modelo ya está documentado.</li>
      <li>Descarga la herramienta de tu controlador de la lista de abajo.</li>
      <li>Ejecútala, deja que detecte la USB y pulsa Start hasta que termine en verde.</li>
    </ol>
  </section>
  <section id="herramientas" class="grid-wrap">
    <h2>Todas las herramientas ({len(TOOLS)})</h2>
    <div class="grid">{cards}</div>
  </section>
  {ad('home-bottom')}'''
    write("index.html", head(f"{SITE['name']} — {SITE['tagline']}", SITE['description'],
                             SITE['domain'] + "/") + body + FOOT)

# ---------- Páginas legales (requeridas por AdSense/Adsterra) ----------
def legal():
    priv = '''<article class="tool"><h1>Política de privacidad</h1>
      <p>Este sitio muestra publicidad de terceros (redes como Adsterra o Google AdSense). Estas
      redes pueden usar cookies para mostrar anuncios relevantes según tu navegación. Puedes
      desactivar las cookies de personalización en la configuración de tu navegador.</p>
      <p>No recopilamos datos personales identificables. El tráfico se mide de forma anónima.</p></article>'''
    aviso = '''<article class="tool"><h1>Aviso legal</h1>
      <p>Las herramientas enlazadas son propiedad de sus respectivos fabricantes y se enlazan con
      fines educativos y de reparación. Este sitio no aloja ni desarrolla dicho software. El uso de
      cualquier herramienta de reparación de bajo nivel es responsabilidad del usuario y puede
      provocar la pérdida total de los datos de la memoria.</p></article>'''
    write("privacidad.html", head("Política de privacidad — " + SITE['name'],
          "Política de privacidad y uso de cookies publicitarias.", SITE['domain']+"/privacidad.html") + priv + FOOT)
    write("aviso.html", head("Aviso legal — " + SITE['name'],
          "Aviso legal sobre las herramientas de reparación USB.", SITE['domain']+"/aviso.html") + aviso + FOOT)

# ---------- sitemap + robots ----------
def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/privacidad.html", SITE['domain'] + "/aviso.html"]
    urls += [f"{SITE['domain']}/{t['slug']}.html" for t in TOOLS]
    items = "\n".join(f"  <url><loc>{u}</loc><changefreq>monthly</changefreq></url>" for u in urls)
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?>\n'
          f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{items}\n</urlset>')
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE['domain']}/sitemap.xml\n")

def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    shutil.copy(os.path.join(HERE, "style.css"), os.path.join(DIST, "style.css"))
    home(); legal(); seo_files()
    for t in TOOLS:
        tool_page(t)
    print(f"OK -> {len(TOOLS)} herramientas + home + legales + sitemap generados en {DIST}")

if __name__ == "__main__":
    main()
