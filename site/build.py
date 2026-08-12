# -*- coding: utf-8 -*-
"""Genera la web estática a partir de data.py -> carpeta dist/.
Uso: python3 site/build.py"""
import os, html, shutil
from data import SITE, TOOLS, EXTERNAL_LINKS

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

# ---- Reproductor de la lista de reproducción de YouTube ----
def video(titulo="🎥 Tutoriales en vídeo", pid=None, vid=None):
    src = f"https://www.youtube.com/embed/{vid}" if vid else \
          f"https://www.youtube.com/embed/videoseries?list={pid or SITE['playlist_id']}"
    return f'''<section class="video-tut">
      <h2>{titulo}</h2>
      <p class="lead">Aprende a reparar tu memoria USB paso a paso con nuestros tutoriales.</p>
      <div class="video-frame">
        <iframe src="{src}"
          title="Tutoriales de reparación USB" loading="lazy"
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
    </section>'''

def related_videos_block(t):
    rv = t.get("related_videos")
    if not rv:
        return ""
    items = "\n".join(
        f'<li><a href="https://www.youtube.com/watch?v={r["id"]}" target="_blank" rel="noopener">▶ {html.escape(r["label"])}</a></li>'
        for r in rv
    )
    return f'''<section class="related-videos">
      <h2>Más vídeos sobre este tema</h2>
      <ul class="steps">{items}</ul>
    </section>'''

# ---- Push, In-Page Push, Popunder y Vignette Monetag (todas las páginas) ----
MONETAG_SITEWIDE = f'''<!-- Monetag Push -->
{SITE['monetag_push']}
<!-- Monetag In-Page Push -->
{SITE['monetag_inpage_push']}
<!-- Monetag Popunder -->
{SITE['monetag_popunder']}
<!-- Monetag Vignette Banner -->
{SITE['monetag_vignette']}
<script>
if ('serviceWorker' in navigator) {{
  navigator.serviceWorker.register('/sw.js').catch(function(){{}});
}}
</script>'''

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
<div class="blob b1"></div>
<div class="blob b2"></div>
<div class="blob b3"></div>
<header class="site-header glass">
  <a class="logo" href="/">🔧 {SITE['name']}</a>
  <nav><a href="/">Inicio</a> <a href="/herramientas">Herramientas</a>
  <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a></nav>
</header>
<main>'''

ADBLOCK_DETECT = '''
<div class="ab-overlay" id="abOverlay">
  <div class="ab-box">
    <h2>🚫 Bloqueador de anuncios detectado</h2>
    <p>Esta web es gratuita gracias a la publicidad. Para seguir viendo el contenido y las
       herramientas, desactiva tu bloqueador de anuncios (AdBlock, uBlock, Brave Shields, etc.)
       para este sitio y vuelve a cargar la página.</p>
    <button class="btn" type="button" onclick="location.reload()">Ya lo desactivé, recargar</button>
  </div>
</div>
<div class="ab-bait ad-banner ads adsbox adsbygoogle textads banner_ad" style="position:absolute;left:-9999px;top:-9999px;width:300px;height:250px;"></div>
<script>
(function(){
  var shown = false;
  function showBlock(){
    if(shown) return; shown = true;
    document.getElementById('abOverlay').style.display='flex';
  }
  function checkBait(){
    var bait = document.querySelector('.ab-bait');
    if(!bait) return true;
    var cs = window.getComputedStyle(bait);
    return bait.offsetParent===null || bait.offsetHeight===0 || cs.display==='none' || cs.visibility==='hidden';
  }
  function checkNetwork(cb){
    fetch('https://www3.doubleclick.net/pagead/adview.js?a=1', {mode:'no-cors', cache:'no-store'})
      .then(function(){ cb(false); })
      .catch(function(){ cb(true); });
  }
  window.addEventListener('load', function(){
    setTimeout(function(){
      if(checkBait()){ showBlock(); return; }
      checkNetwork(function(blocked){ if(blocked){ showBlock(); } });
    }, 800);
  });
})();
</script>'''

FOOT = f'''</main>
<footer class="site-footer">
  <p>{SITE['name']} — {SITE['tagline']}.</p>
  <p><a href="{SITE['youtube']}" target="_blank" rel="noopener">Canal de YouTube</a> ·
     <a href="/privacidad">Privacidad</a> · <a href="/aviso">Aviso legal</a></p>
  <p class="disclaimer">Las herramientas enlazadas pertenecen a sus respectivos fabricantes.
     Úsalas bajo tu responsabilidad; una reparación de bajo nivel borra todos los datos de la USB.</p>
</footer>
{ADBLOCK_DETECT}
{MONETAG_SITEWIDE}
</body></html>'''

def write(path, content):
    full = os.path.join(DIST, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

# ---------- Página intermedia de anuncios para enlaces externos (/ir/<slug>) ----------
def external_gate_page(link):
    canonical = f"{SITE['domain']}/ir/{link['slug']}"
    body = f'''
  <article class="tool dlgate">
    <nav class="crumbs"><a href="/">Inicio</a> › <span>Redirigiendo</span></nav>
    <h1>{html.escape(link['title'])}</h1>
    <p class="lead">{html.escape(link['lead'])}</p>
    {video("🎥 Te lo explico en este vídeo", None, "o4vzo1fpsTA")}
    <div class="dlgate-box">
      <a class="download" href="{link['target_url']}" rel="noopener">⬇ {html.escape(link['cta_label'])}</a>
    </div>
  </article>'''
    write(f"ir/{link['slug']}.html", head(link['title'], link['lead'], canonical)
          .replace('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex,follow">')
          + body + FOOT)

# ---------- Página de cada herramienta ----------
def tool_page(t):
    canonical = f"{SITE['domain']}/{t['slug']}"
    key_html = ""
    if t.get("key"):
        key_html = f'<p class="note">🔑 Contraseña del archivo: <code>{t["key"]}</code></p>'
    steps = "\n".join(f"<li>{s}</li>" for s in t["steps"])
    is_guide = t.get("kind") == "guide"

    if is_guide:
        # Página informativa: sin descarga, sin popunder/smartlink; FAQ genérica.
        download = ""
        steps_title = "Pasos a seguir"
        faq = f'''
    <section class="faq">
      <h2>Preguntas frecuentes</h2>
      <details><summary>¿Es gratis?</summary>
        <p>Sí, totalmente gratis. Sigue los pasos y mira los vídeos de esta página.</p></details>
      <details><summary>¿Necesito conocimientos técnicos?</summary>
        <p>No. Los tutoriales están explicados paso a paso para cualquier usuario.</p></details>
      <details><summary>¿Y si sigo con problemas?</summary>
        <p>Identifica el controlador de tu USB con <a href="/chipgenius">ChipGenius</a> y usa la
           herramienta de reparación correspondiente de esta web.</p></details>
    </section>'''
    else:
        download = f'''<button class="download" type="button" onclick="openDlModal()">
       ⬇ Descargar {html.escape(t['brand'])}</button>
    {key_html}
    <div class="modal-overlay" id="dlModal">
      <div class="modal-box">
        <button class="modal-close" type="button" onclick="closeDlModal()" aria-label="Cerrar">✕</button>
        <h3>Tu descarga está casi lista</h3>
        <p id="dlCountdown" style="cursor:pointer">Preparando tu descarga… 10s</p>
        <a id="dlReal" class="download" href="{t['url']}" rel="noopener nofollow" style="display:none"
           onclick="window.open('{SITE['monetag_directlink']}','_blank')">⬇ Descargar {html.escape(t['brand'])}</a>
      </div>
    </div>
    <script>
    function openDlModal(){{
      document.getElementById('dlModal').style.display='flex';
      var total=10, c=total, cd=document.getElementById('dlCountdown'),
          btn=document.getElementById('dlReal'), stalled=false;
      cd.style.display='block'; btn.style.display='none';
      var id=setInterval(function(){{
        c--;
        if(c<=5){{
          clearInterval(id);
          stalled=true;
          cd.innerHTML='Se detuvo… haz clic aquí arriba ↑ para continuar';
        }} else {{
          cd.innerHTML='Preparando tu descarga… '+c+'s';
        }}
      }},1000);
      cd.onclick = function(){{
        if(!stalled) return;
        stalled=false;
        var id2=setInterval(function(){{
          c--;
          if(c<0){{clearInterval(id2); cd.style.display='none'; btn.style.display='inline-block';}}
          else{{cd.innerHTML='Preparando tu descarga… '+c+'s';}}
        }},1000);
      }};
    }}
    function closeDlModal(){{document.getElementById('dlModal').style.display='none';}}
    </script>'''
        steps_title = "Cómo usar esta herramienta paso a paso"
        faq = f'''
    <section class="faq">
      <h2>Preguntas frecuentes</h2>
      <details><summary>¿Esta herramienta borra mis archivos?</summary>
        <p>Sí. Una reparación de bajo nivel ({t['brand']}) reformatea el controlador y elimina
           todos los datos de la memoria. Haz copia de seguridad si aún puedes leerla.</p></details>
      <details><summary>¿Cómo sé si mi USB usa el controlador {t['brand']}?</summary>
        <p>Usa <a href="/chipgenius">ChipGenius</a> para leer el VID/PID y el fabricante del
           chip. Si coincide con {t['brand']}, esta es tu herramienta.</p></details>
      <details><summary>La herramienta no detecta mi memoria, ¿qué hago?</summary>
        <p>Prueba otro puerto USB (mejor traseros 2.0), ejecútala como administrador y evita hubs
           o alargadores. Revisa también la <a href="/tabla-solucionadas">tabla de solucionadas</a>.</p></details>
    </section>'''

    body = f'''
  <article class="tool">
    <nav class="crumbs"><a href="/">Inicio</a> › {html.escape(t['brand'])}</nav>
    <h1>{html.escape(t['title'])}</h1>
    <p class="lead">{t['intro']}</p>
    {download}
    <h2>{steps_title}</h2>
    <ol class="steps">{steps}</ol>
    {video("🎥 Vídeotutoriales", t.get("playlist"), t.get("video_id"))}
    {related_videos_block(t)}
    {faq}
    <p class="cta">📺 Más tutoriales en
       <a href="{SITE['youtube']}" target="_blank" rel="noopener">nuestro canal de YouTube</a>.</p>
  </article>'''
    desc = t['intro'][:155]
    write(f"{t['slug']}.html", head(t['title'], desc, canonical) + body + FOOT)

# ---------- Home ----------
def home():
    cards = ""
    for t in TOOLS:
        cards += f'''<a class="card" href="/{t['slug']}">
          <h3>{html.escape(t['brand'])}</h3>
          <p>{html.escape(t['intro'][:90])}…</p>
          <span class="go">Ver y descargar →</span></a>\n'''
    body = f'''
  <section class="hero">
    <h1>Herramientas gratis para reparar <span class="grad">memorias USB</span></h1>
    <p class="lead">{SITE['description']}</p>
    <a class="btn" href="/herramientas">Ver herramientas</a>
    <a class="btn ghost" href="/chipgenius">¿No sabes tu controlador? Empieza aquí</a>
  </section>
  <section class="cta-band">
    <a class="btn cta-ebook" href="/ir/ebook">🔥 Curso de Reparación USB — Oferta por tiempo limitado</a>
    <a class="btn cta-miniapp" href="/ir/miniapp">🤖 Abrir Mini App de Telegram</a>
  </section>
  {video("🎥 Videotutoriales: repara tu USB paso a paso")}
  <section class="guide">
    <h2>¿Cómo reparar una memoria USB dañada?</h2>
    <p>Cuando una USB no da formato, aparece con 0 bytes, pide formatear una y otra vez o Windows no
       la reconoce, casi siempre el problema está en el <strong>controlador</strong> (el chip que
       gobierna la memoria). La solución es reprogramarlo con su herramienta de fábrica (MPTool).
       El proceso es siempre el mismo:</p>
    <ol class="steps">
      <li><a href="/chipgenius">Identifica el controlador</a> con ChipGenius (VID/PID + fabricante).</li>
      <li>Busca en la <a href="/tabla-solucionadas">tabla de solucionadas</a> si tu modelo ya está documentado.</li>
      <li>Descarga la herramienta de tu controlador de la lista de abajo.</li>
      <li>Ejecútala, deja que detecte la USB y pulsa Start hasta que termine en verde.</li>
    </ol>
  </section>
  <section class="grid-wrap">
    <h2>Todas las herramientas ({len(TOOLS)})</h2>
    <a class="btn" href="/herramientas">Ver todas las herramientas →</a>
  </section>'''
    write("index.html", head(f"{SITE['name']} — {SITE['tagline']}", SITE['description'],
                             SITE['domain'] + "/") + body + FOOT)

# ---------- Página de herramientas (separada, carga anuncios propios) ----------
def herramientas_page():
    cards = ""
    for t in TOOLS:
        cards += f'''<a class="card" href="/{t['slug']}">
          <h3>{html.escape(t['brand'])}</h3>
          <p>{html.escape(t['intro'][:90])}…</p>
          <span class="go">Ver y descargar →</span></a>\n'''
    body = f'''
  <article class="tool">
    <nav class="crumbs"><a href="/">Inicio</a> › <span>Herramientas</span></nav>
    <h1>Todas las herramientas de reparación USB ({len(TOOLS)})</h1>
    <p class="lead">Elige el controlador de tu memoria USB para descargar su herramienta de
       reparación. ¿No sabes cuál es? Usa <a href="/chipgenius">ChipGenius</a> primero.</p>
  </article>
  <section id="herramientas" class="grid-wrap">
    <div class="grid">{cards}</div>
  </section>'''
    write("herramientas.html", head(f"Todas las herramientas — {SITE['name']}",
          "Descarga la herramienta de reparación (MPTool) exacta para tu controlador USB.",
          SITE['domain'] + "/herramientas") + body + FOOT)

# ---------- Páginas legales (requeridas por AdSense/Adsterra) ----------
def legal():
    priv = '''<article class="tool"><h1>Política de privacidad</h1>
      <p>Este sitio muestra publicidad de terceros (redes como Monetag o Google AdSense). Estas
      redes pueden usar cookies para mostrar anuncios relevantes según tu navegación. Puedes
      desactivar las cookies de personalización en la configuración de tu navegador.</p>
      <p>No recopilamos datos personales identificables. El tráfico se mide de forma anónima.</p></article>'''
    aviso = '''<article class="tool"><h1>Aviso legal</h1>
      <p>Las herramientas enlazadas son propiedad de sus respectivos fabricantes y se enlazan con
      fines educativos y de reparación. Este sitio no aloja ni desarrolla dicho software. El uso de
      cualquier herramienta de reparación de bajo nivel es responsabilidad del usuario y puede
      provocar la pérdida total de los datos de la memoria.</p></article>'''
    write("privacidad.html", head("Política de privacidad — " + SITE['name'],
          "Política de privacidad y uso de cookies publicitarias.", SITE['domain']+"/privacidad") + priv + FOOT)
    write("aviso.html", head("Aviso legal — " + SITE['name'],
          "Aviso legal sobre las herramientas de reparación USB.", SITE['domain']+"/aviso") + aviso + FOOT)

# ---------- sitemap + robots ----------
def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/herramientas", SITE['domain'] + "/privacidad", SITE['domain'] + "/aviso"]
    urls += [f"{SITE['domain']}/{t['slug']}" for t in TOOLS]
    items = "\n".join(f"  <url><loc>{u}</loc><changefreq>monthly</changefreq></url>" for u in urls)
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?>\n'
          f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{items}\n</urlset>')
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE['domain']}/sitemap.xml\n")

def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    shutil.copy(os.path.join(HERE, "style.css"), os.path.join(DIST, "style.css"))
    shutil.copy(os.path.join(HERE, "sw.js"), os.path.join(DIST, "sw.js"))
    home(); herramientas_page(); legal(); seo_files()
    for t in TOOLS:
        tool_page(t)
    for link in EXTERNAL_LINKS:
        external_gate_page(link)
    print(f"OK -> {len(TOOLS)} herramientas + home + legales + sitemap generados en {DIST}")

if __name__ == "__main__":
    main()
