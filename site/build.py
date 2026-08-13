# -*- coding: utf-8 -*-
"""Genera la web estática a partir de data.py -> carpeta dist/.
Uso: python3 site/build.py"""
import os, html, shutil, re, json
from data import SITE, TOOLS, EXTERNAL_LINKS, PROBLEMS, TESTIMONIALS

# ---- Datos estructurados (Schema.org) ----
def _strip_tags(s):
    return re.sub(r"<[^<]+?>", "", s)

def howto_schema(name, steps):
    step_list = [{"@type": "HowToStep", "position": i + 1, "text": _strip_tags(s)}
                 for i, s in enumerate(steps)]
    data = {"@context": "https://schema.org", "@type": "HowTo", "name": name, "step": step_list}
    return f'<script type="application/ld+json">{json.dumps(data, ensure_ascii=False)}</script>'

def faq_schema(pairs):
    items = [{"@type": "Question", "name": q,
              "acceptedAnswer": {"@type": "Answer", "text": _strip_tags(a)}} for q, a in pairs]
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": items}
    return f'<script type="application/ld+json">{json.dumps(data, ensure_ascii=False)}</script>'

def video_jsonld(t):
    data = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": t.get("video_title") or t["title"],
        "description": _strip_tags(t["intro"]),
        "thumbnailUrl": f"https://i.ytimg.com/vi/{t['video_id']}/hqdefault.jpg",
        "embedUrl": f"https://www.youtube.com/embed/{t['video_id']}",
    }
    return f'<script type="application/ld+json">{json.dumps(data, ensure_ascii=False)}</script>'

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

# ---- Reproductor de la lista de reproducción de YouTube ----
def video(titulo="🎥 Tutoriales en vídeo", pid=None, vid=None, cta="default"):
    src = f"https://www.youtube.com/embed/{vid}" if vid else \
          f"https://www.youtube.com/embed/videoseries?list={pid or SITE['playlist_id']}"
    if cta == "nav":
        cta_row = f'''<a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">🔔 Suscribirse al canal</a>
        <a class="btn cta-ebook" href="/herramientas">🛠 Ver herramientas</a>
        <a class="btn cta-miniapp" href="/problemas">❓ ¿Cuál es el problema de tu USB?</a>'''
    else:
        cta_row = f'''<a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">🔔 Suscribirse al canal</a>
        <a class="btn cta-ebook" href="/ir/ebook">🔥 Comprar el curso</a>
        <a class="btn cta-miniapp" href="/ir/miniapp">🤖 Abrir Mini App</a>'''
    return f'''<section class="video-tut">
      <h2>{titulo}</h2>
      <p class="lead">Aprende a reparar tu memoria USB paso a paso con nuestros tutoriales.</p>
      <div class="video-frame">
        <iframe src="{src}"
          title="Tutoriales de reparación USB" loading="lazy"
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
      </div>
      <div class="video-cta-row">
        {cta_row}
      </div>
    </section>'''

def testimonials_marquee():
    cards = ""
    for tst in TESTIMONIALS * 2:  # duplicado para el loop sin cortes
        cards += f'''<div class="tst-card">
          <div class="tst-head">{html.escape(tst['author'])}</div>
          <div class="tst-body">
            <p>"{html.escape(tst['text'])}"</p>
            <a href="https://www.youtube.com/watch?v={tst['video_id']}" target="_blank" rel="noopener">
              ▶ {html.escape(tst['video_title'])}</a>
          </div>
        </div>\n'''
    return f'''<section class="tst-wrap">
      <h2>Lo que dicen quienes ya repararon su USB</h2>
      <div class="tst-track">{cards}</div>
    </section>'''

def related_tools(current):
    others = [t for t in TOOLS if t["slug"] != current["slug"]]
    offset = sum(ord(c) for c in current["slug"]) % max(len(others), 1)
    picks = (others[offset:] + others[:offset])[:4]
    if not picks:
        return ""
    cards = "\n".join(
        f'''<a class="card" href="/{t['slug']}">
          <h3>{html.escape(t['brand'])}</h3>
          <p>{html.escape(t['intro'][:90])}…</p>
          <span class="go">Ver y descargar →</span></a>'''
        for t in picks
    )
    return f'''<section class="grid-wrap">
      <h2>Otras herramientas populares</h2>
      <div class="grid">{cards}</div>
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
def _inline_js(script_tag):
    """Quita el envoltorio <script ...>...</script>, dejando solo el JS interno."""
    return re.sub(r'^\s*<script[^>]*>|</script>\s*$', '', script_tag.strip())

MONETAG_SITEWIDE = f'''<!-- Monetag Push -->
{SITE['monetag_push']}
<!-- In-Page Push / Popunder / Vignette: diferidos hasta después del load para que nunca
     compitan con la carga inicial del contenido/vídeo -->
<script>
window.addEventListener('load', function(){{
  setTimeout(function(){{
    {_inline_js(SITE['monetag_inpage_push'])};
    {_inline_js(SITE['monetag_popunder'])};
    {_inline_js(SITE['monetag_vignette'])};
  }}, 1200);
}});
if ('serviceWorker' in navigator) {{
  navigator.serviceWorker.register('/sw.js').catch(function(){{}});
}}
</script>'''

SITE_JSONLD = f'''<script type="application/ld+json">{json.dumps({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": SITE["name"],
    "url": SITE["domain"] + "/",
    "logo": SITE["logo"],
    "sameAs": [SITE["youtube"], SITE["facebook"], SITE["instagram"]],
}, ensure_ascii=False)}</script>
<script type="application/ld+json">{json.dumps({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE["name"],
    "url": SITE["domain"] + "/",
}, ensure_ascii=False)}</script>'''

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
<meta property="og:image" content="{SITE['logo']}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{html.escape(title)}">
<meta name="twitter:description" content="{html.escape(desc)}">
<meta name="twitter:image" content="{SITE['logo']}">
<meta name="robots" content="index,follow">
<meta name="google-site-verification" content="{SITE['google_verify']}">
<link rel="icon" href="{SITE['logo']}">
<link rel="apple-touch-icon" href="{SITE['logo']}">
<link rel="stylesheet" href="/style.css">
{SITE_JSONLD}
</head>
<body>
<div class="blob b1"></div>
<div class="blob b2"></div>
<div class="blob b3"></div>
<header class="site-header glass">
  <a class="logo" href="/"><img src="{SITE['logo']}" alt="{SITE['name']}" width="36" height="36" loading="eager"> {SITE['name']}</a>
  <nav><a href="/">Inicio</a> <a href="/problemas">Problemas</a> <a href="/herramientas">Herramientas</a>
  <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a></nav>
</header>
<main>'''

COOKIE_BANNER = '''
<div class="cookie-banner" id="cookieBanner" style="display:none">
  <p>Usamos cookies propias y de terceros (anuncios) para mantener esta web gratuita.
     Al seguir navegando aceptas su uso. <a href="/privacidad">Más información</a>.</p>
  <button class="btn" type="button" onclick="document.getElementById('cookieBanner').style.display='none';localStorage.setItem('cookieOk','1')">Entendido</button>
</div>
<script>
if (!localStorage.getItem('cookieOk')) {
  document.getElementById('cookieBanner').style.display = 'flex';
}
</script>'''

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
  <img class="footer-logo" src="{SITE['logo']}" alt="{SITE['name']}" width="64" height="64" loading="lazy">
  <p class="footer-name">{SITE['name']} — {SITE['tagline']}.</p>
  <a class="btn ghost footer-yt" href="{SITE['youtube']}" target="_blank" rel="noopener">🔔 Canal de YouTube</a>
  <div class="footer-social">
    <a href="{SITE['facebook']}" target="_blank" rel="noopener" aria-label="Facebook">Facebook</a>
    <a href="{SITE['instagram']}" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
  </div>
  <div class="footer-cols">
    <div>
      <h4>Recursos</h4>
      <a href="/chipgenius">ChipGenius</a>
      <a href="/tabla-solucionadas">Tabla de solucionadas</a>
      <a href="/herramientas">Todas las herramientas</a>
      <a href="/problemas">¿Cuál es el problema de tu USB?</a>
    </div>
    <div>
      <h4>Más</h4>
      <a href="/ir/ebook">Curso de reparación USB</a>
      <a href="/ir/miniapp">Mini App de Telegram</a>
      <a href="/sobre-mi">Sobre mí</a>
      <a href="/contacto">Contacto</a>
    </div>
    <div>
      <h4>Legal</h4>
      <a href="/privacidad">Privacidad</a>
      <a href="/aviso">Aviso legal</a>
      <a href="/terminos">Términos de servicio</a>
    </div>
    <div>
      <h4>Otros sitios</h4>
      <a href="https://paginaingles.pages.dev/" target="_blank" rel="noopener">Lite OS Reviews (EN)</a>
    </div>
  </div>
  <p class="disclaimer">Las herramientas enlazadas pertenecen a sus respectivos fabricantes.
     Úsalas bajo tu responsabilidad; una reparación de bajo nivel borra todos los datos de la USB.</p>
</footer>
{ADBLOCK_DETECT}
{COOKIE_BANNER}
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
    {video("🎥 Te lo explico en este vídeo", None, "o4vzo1fpsTA", cta="nav")}
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
        faq_pairs = [
            ("¿Es gratis?", "Sí, totalmente gratis. Sigue los pasos y mira los vídeos de esta página."),
            ("¿Necesito conocimientos técnicos?", "No. Los tutoriales están explicados paso a paso para cualquier usuario."),
            ("¿Y si sigo con problemas?", "Identifica el controlador de tu USB con ChipGenius y usa la herramienta de reparación correspondiente de esta web."),
        ]
    else:
        download = f'''<button class="download" type="button" onclick="openDlModal()">
       ⬇ Descargar {html.escape(t['brand'])}</button>
    {key_html}
    <div class="modal-overlay" id="dlModal">
      <div class="modal-box">
        <button class="modal-close" type="button" onclick="closeDlModal()" aria-label="Cerrar">✕</button>
        <h3>Tu descarga está casi lista</h3>
        <div class="dlgate-ring" id="dlRing" style="cursor:pointer">
          <svg viewBox="0 0 100 100">
            <circle class="ring-bg" cx="50" cy="50" r="45"></circle>
            <circle class="ring-fg" id="ringFg" cx="50" cy="50" r="45"></circle>
          </svg>
          <span id="dlCountdown">10</span>
        </div>
        <p id="dlWaitLabel">Preparando tu descarga…</p>
        <a id="dlReal" class="download" href="{t['url']}" rel="noopener nofollow" style="display:none"
           onclick="window.open('{SITE['monetag_directlink']}','_blank')">⬇ Descargar {html.escape(t['brand'])}</a>
      </div>
    </div>
    <script>
    function openDlModal(){{
      document.getElementById('dlModal').style.display='flex';
      var total=10, half=Math.ceil(total/2), c=total, stalled=false,
          cd=document.getElementById('dlCountdown'), ring=document.getElementById('ringFg'),
          label=document.getElementById('dlWaitLabel'), wrap=document.getElementById('dlRing'),
          btn=document.getElementById('dlReal');
      var circumference = 2 * Math.PI * 45;
      ring.style.strokeDasharray = circumference;
      wrap.style.display='block'; label.style.display='block'; btn.style.display='none';
      cd.textContent = total; ring.style.strokeDashoffset = 0;
      var id=null;
      function tick(){{
        c--;
        if(c<=half){{
          clearInterval(id);
          stalled=true;
          label.textContent='SI EL CONTADOR SE DETIENE DA CLICK ENCIMA';
        }} else {{
          cd.textContent=c;
          ring.style.strokeDashoffset = circumference * (1 - c/total);
        }}
      }}
      id=setInterval(tick,1000);
      wrap.onclick = function(){{
        if(!stalled) return;
        stalled=false;
        label.textContent='Preparando tu descarga…';
        var id2=setInterval(function(){{
          c--;
          if(c<=0){{
            clearInterval(id2);
            wrap.style.display='none'; label.style.display='none'; btn.style.display='inline-block';
          }} else {{
            cd.textContent=c;
            ring.style.strokeDashoffset = circumference * (1 - c/total);
          }}
        }},1000);
      }};
    }}
    function closeDlModal(){{document.getElementById('dlModal').style.display='none';}}
    </script>'''
        steps_title = "Cómo usar esta herramienta paso a paso"
        is_detector = t.get("kind") == "detector"
        if is_detector:
            faq = f'''
    <section class="faq">
      <h2>Preguntas frecuentes</h2>
      <details><summary>¿Esto borra mis archivos?</summary>
        <p>No. {html.escape(t['brand'])} solo lee información de tu memoria USB (VID, PID y
           fabricante del controlador); no modifica ni borra ningún dato. Es 100% seguro de usar.</p></details>
      <details><summary>¿Es gratis?</summary>
        <p>Sí, totalmente gratis y en español.</p></details>
      <details><summary>Ya tengo el VID/PID, ¿ahora qué hago?</summary>
        <p>Con el nombre del controlador (Phison, SMI, Chipsbank, etc.) descarga desde esta web
           la herramienta MPTool exacta para tu chip y sigue su guía paso a paso.</p></details>
    </section>'''
            faq_pairs = [
                ("¿Esto borra mis archivos?", f"No. {t['brand']} solo lee información de tu memoria USB (VID, PID y fabricante del controlador); no modifica ni borra ningún dato. Es 100% seguro de usar."),
                ("¿Es gratis?", "Sí, totalmente gratis y en español."),
                ("Ya tengo el VID/PID, ¿ahora qué hago?", "Con el nombre del controlador (Phison, SMI, Chipsbank, etc.) descarga desde esta web la herramienta MPTool exacta para tu chip y sigue su guía paso a paso."),
            ]
        else:
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
            faq_pairs = [
                (f"¿Esta herramienta borra mis archivos?", f"Sí. Una reparación de bajo nivel ({t['brand']}) reformatea el controlador y elimina todos los datos de la memoria. Haz copia de seguridad si aún puedes leerla."),
                (f"¿Cómo sé si mi USB usa el controlador {t['brand']}?", f"Usa ChipGenius para leer el VID/PID y el fabricante del chip. Si coincide con {t['brand']}, esta es tu herramienta."),
                ("La herramienta no detecta mi memoria, ¿qué hago?", "Prueba otro puerto USB (mejor traseros 2.0), ejecútala como administrador y evita hubs o alargadores. Revisa también la tabla de solucionadas."),
            ]

    video_ld = video_jsonld(t) if t.get("video_id") else ""
    schema = howto_schema(t['title'], t['steps']) + faq_schema(faq_pairs) + video_ld
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
  </article>
  {related_tools(t)}
  {schema}'''
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
    <a class="btn" href="/problemas">¿Cuál es el problema de tu USB?</a>
    <a class="btn ghost" href="/chipgenius">¿No sabes tu controlador? Empieza aquí</a>
  </section>
  <section class="cta-band">
    <a class="btn cta-ebook" href="/ir/ebook">🔥 Curso de Reparación USB — Oferta por tiempo limitado</a>
    <a class="btn cta-miniapp" href="/ir/miniapp">🤖 Abrir Mini App de Telegram</a>
  </section>
  {video("🎥 Curso de Reparación USB", None, "jcl3Q1ijD5o")}
  <section class="guide">
    <p>¿Tu memoria USB tiene formato RAW? ¿Windows no pudo completar el formato? ¿Tu PC no reconoce
       tu USB o aparece "Inserte un disco en la unidad"? Aquí encontrarás la solución.</p>
    <p>Soy Daimel, reparador profesional de memorias USB con más de una década reparando más de
       100,000 USB y ayudando a más de 50,000 personas de todo el mundo a reparar sus pendrives
       dañados. Esta página web está dedicada 100% a la reparación de memorias USB, pendrives,
       tarjetas micro SD y discos duros externos. Aprenderás paso a paso cómo recuperar tus
       dispositivos de almacenamiento con herramientas como CMD, ChipGenius, y software
       especializado — de forma fácil, rápida y segura.</p>
    <ul class="check-list">
      <li>✅ Errores de formato RAW</li>
      <li>✅ USB dañada que no reconoce la PC</li>
      <li>✅ "No hay medios" / "Inserte un disco"</li>
      <li>✅ Windows no pudo completar el formato</li>
      <li>✅ Recuperación de archivos perdidos</li>
      <li>✅ Tutoriales claros y prácticos</li>
      <li>✅ Soluciones rápidas y efectivas</li>
      <li>✅ Tecnología, reparación y recuperación de datos</li>
      <li>✅ Contenido útil para estudiantes, técnicos y usuarios comunes</li>
    </ul>
  </section>
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
  <section class="guide">
    <h2>¿Cómo saber si tu memoria USB está dañada?</h2>
    <p>Antes de intentar cualquier reparación, confirma qué tipo de daño tiene tu USB:</p>
    <ul class="check-list">
      <li>✅ Windows no la reconoce en absoluto o dice "No hay medios"</li>
      <li>✅ Pide formatear cada vez que la conectas ("Inserte un disco en la unidad")</li>
      <li>✅ Aparece en formato RAW en vez de FAT32/exFAT/NTFS</li>
      <li>✅ Muestra 0 bytes o una capacidad distinta a la real</li>
      <li>✅ Windows dice "no pudo completar el formato"</li>
    </ul>
    <p>Si tu USB tiene alguno de estos síntomas, el problema casi siempre está en el
       <strong>controlador</strong> (chip), no en la memoria física — y sí se puede reparar sin
       comprar una nueva. Usa <a href="/problemas">¿Cuál es el problema de tu USB?</a> para ir
       directo a la solución de tu caso exacto.</p>
  </section>
  <section class="grid-wrap">
    <h2>Todas las herramientas ({len(TOOLS)})</h2>
    <a class="btn" href="/herramientas">Ver todas las herramientas →</a>
  </section>
  {testimonials_marquee()}'''
    faq_pairs = [
        ("¿Cómo sé si mi memoria USB está dañada?",
         "Si Windows no la reconoce, pide formatear cada vez, aparece en formato RAW, muestra 0 "
         "bytes o una capacidad falsa, o Windows dice que no pudo completar el formato, tu USB "
         "tiene un problema de controlador — no de la memoria física."),
        ("¿Se puede reparar una memoria USB dañada?",
         "Sí, en la gran mayoría de los casos. El chip controlador se reprograma con su herramienta "
         "de fábrica (MPTool) gratuita, identificándolo primero con ChipGenius."),
        ("¿Cómo reparo una USB dañada sin perder mis datos?",
         "Si aún puedes leer algunos archivos, cópialos primero o usa un programa de recuperación "
         "como TestDisk/PhotoRec antes de reparar — una reparación de bajo nivel borra todo lo que "
         "quede en la memoria."),
        ("¿Qué hago si Windows no reconoce mi USB?",
         "Prueba otro puerto USB (mejor trasero 2.0) y otra PC. Si sigue sin aparecer, identifica el "
         "controlador con ChipGenius y descarga la herramienta MPTool correspondiente desde esta web."),
    ]
    schema = faq_schema(faq_pairs)
    write("index.html", head("Cómo Reparar una Memoria USB Dañada (Gratis) — " + SITE['name'],
                             SITE['description'],
                             SITE['domain'] + "/") + body + schema + FOOT)

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

# ---------- Módulo "¿Cuál es el problema de tu USB?" ----------
def problems_hub_page():
    def thumb(vid):
        return f'<img class="card-thumb" src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="" loading="lazy" width="480" height="270">' if vid else ""
    cards = ""
    for p in PROBLEMS:
        cards += f'''<a class="card" href="/problemas/{p['slug']}">
          {thumb(p.get('video_id'))}
          <h3>{html.escape(p['label'])}</h3>
          <span class="go">Ver solución →</span></a>\n'''
    cards += f'''<a class="card" href="/quitar-proteccion-escritura-usb">
      {thumb("wFTdO_DniuQ")}
      <h3>USB protegida contra escritura</h3>
      <span class="go">Ver solución →</span></a>\n'''
    cards += f'''<a class="card" href="/windows-no-pudo-completar-formato">
      {thumb("aGaTI4Vksc0")}
      <h3>Windows no pudo completar el formato</h3>
      <span class="go">Ver solución →</span></a>\n'''
    cards += f'''<a class="card" href="/windows-no-reconoce-usb">
      {thumb("APabN6Ym_Y0")}
      <h3>USB no se reconoce</h3>
      <span class="go">Ver solución →</span></a>\n'''
    body = f'''
  <article class="tool">
    <nav class="crumbs"><a href="/">Inicio</a> › <span>Problemas</span></nav>
    <h1>¿Cuál es el problema de tu USB?</h1>
    <p class="lead">Elige el mensaje de error o síntoma exacto que ves en tu memoria USB para ver
       la explicación y la solución en vídeo.</p>
  </article>
  <section class="grid-wrap">
    <div class="grid">{cards}</div>
  </section>'''
    write("problemas.html", head(f"¿Cuál es el problema de tu USB? — {SITE['name']}",
          "Identifica el error exacto de tu memoria USB (no hay medios, inserte un disco, formato "
          "RAW, capacidad falsa) y mira la solución paso a paso.",
          SITE['domain'] + "/problemas") + body + FOOT)

def problem_page(p):
    canonical = f"{SITE['domain']}/problemas/{p['slug']}"
    steps = "\n".join(f"<li>{s}</li>" for s in p["steps"])
    video_block = video("🎥 Solución en vídeo", None, p["video_id"]) if p.get("video_id") else ""
    schema = howto_schema(p['title'], p['steps'])
    body = f'''
  <article class="tool">
    <nav class="crumbs"><a href="/">Inicio</a> › <a href="/problemas">Problemas</a> › <span>{html.escape(p['label'])}</span></nav>
    <h1>{html.escape(p['title'])}</h1>
    <p class="lead">{p['explanation']}</p>
    {video_block}
    <h2>Cómo solucionarlo</h2>
    <ol class="steps">{steps}</ol>
    <p class="cta">🔎 ¿No sabes qué controlador tiene tu USB?
       <a href="/chipgenius">Identifícalo con ChipGenius</a>.</p>
  </article>
  {schema}'''
    write(f"problemas/{p['slug']}.html", head(p['title'], p['explanation'][:155], canonical) + body + FOOT)

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

    terminos = '''<article class="tool simple-page"><h1>Términos de servicio</h1>
      <p>Al usar este sitio aceptas estos términos:</p>
      <ul class="steps">
        <li>Las herramientas de reparación (MPTool) enlazadas son gratuitas y pertenecen a sus
            respectivos fabricantes; este sitio solo enlaza a ellas con fines educativos.</li>
        <li>No garantizamos que una reparación funcione al 100% en todos los casos — depende del
            estado físico real del chip controlador de tu memoria.</li>
        <li>Una reparación de bajo nivel borra permanentemente todos los datos de la USB. Haz
            copia de seguridad antes de intentar cualquier herramienta si aún puedes leer tus archivos.</li>
        <li>El uso de cualquier herramienta descargada desde esta web es bajo tu propia
            responsabilidad. No nos hacemos responsables por daños al dispositivo o pérdida de datos.</li>
        <li>El contenido (guías, vídeos, eBook, mini app) es propiedad de D-Tech USB / Daimel y no
            puede redistribuirse comercialmente sin permiso.</li>
      </ul>
      <p>Si tienes dudas sobre estos términos, escríbenos a
         <a href="mailto:{email}">{email}</a>.</p></article>'''.format(email=SITE['contact_email'])
    write("terminos.html", head("Términos de servicio — " + SITE['name'],
          "Términos de uso del sitio, las herramientas y el contenido de D-Tech USB.",
          SITE['domain']+"/terminos") + terminos + FOOT)

    contacto = f'''<article class="tool simple-page"><h1>Contacto</h1>
      <p class="lead">¿Tienes dudas sobre tu reparación, el eBook o la mini app? Escríbeme
         directamente:</p>
      <a class="btn" href="mailto:{SITE['contact_email']}">✉ {SITE['contact_email']}</a>
      <p style="margin-top:22px">También puedes dejar tu pregunta en los comentarios de cualquier
         vídeo del <a href="{SITE['youtube']}" target="_blank" rel="noopener">canal de YouTube</a>,
         suelo responder ahí también.</p></article>'''
    write("contacto.html", head("Contacto — " + SITE['name'],
          "Escríbeme directamente si tienes dudas sobre la reparación de tu memoria USB.",
          SITE['domain']+"/contacto") + contacto + FOOT)

    sobre_mi = f'''<article class="tool simple-page"><h1>Sobre mí</h1>
      <p class="lead">Soy Daimel, reparador profesional de memorias USB con más de una década de
         experiencia.</p>
      <p>Empecé reparando pendrives por curiosidad, entendiendo cómo funcionan los chips
         controladores por dentro — hasta convertirlo en mi especialidad. Desde entonces he
         reparado más de 100,000 memorias USB y he ayudado a más de 50,000 personas de todo el
         mundo, a través de mis vídeos de YouTube y de esta misma web, a recuperar sus pendrives
         dañados sin tener que comprar uno nuevo.</p>
      <p>Todo lo que enseño aquí — desde identificar el controlador con ChipGenius hasta usar la
         herramienta MPTool exacta de cada chip — es el mismo método que uso yo en cada reparación
         real, documentado paso a paso para que cualquier persona, sin conocimientos técnicos,
         pueda seguirlo.</p>
      <p>Si quieres el proceso completo explicado desde cero, tengo un
         <a href="/ir/ebook">curso completo de reparación de USB</a>. Y si prefieres buscar tu
         reparación específica al instante, prueba la
         <a href="/ir/miniapp">mini app de Telegram</a>.</p>
      <a class="btn" href="/contacto">✉ Contáctame</a></article>'''
    write("sobre-mi.html", head("Sobre mí — " + SITE['name'],
          "Conoce a Daimel, reparador profesional de memorias USB con más de una década de experiencia.",
          SITE['domain']+"/sobre-mi") + sobre_mi + FOOT)

# ---------- Página 404 personalizada ----------
def not_found_page():
    body = '''<article class="tool simple-page" style="text-align:center">
      <h1>404 — Esta página no existe</h1>
      <p class="lead">El enlace que buscas no está aquí, pero seguro tu solución sí está en el
         sitio.</p>
      <a class="btn" href="/problemas">¿Cuál es el problema de tu USB?</a>
      <a class="btn ghost" href="/herramientas">Ver todas las herramientas</a></article>'''
    write("404.html", head("Página no encontrada — " + SITE['name'],
          "La página que buscas no existe.", SITE['domain']+"/404") + body + FOOT)

# ---------- sitemap + robots ----------
def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/herramientas", SITE['domain'] + "/problemas",
            SITE['domain'] + "/privacidad", SITE['domain'] + "/aviso", SITE['domain'] + "/terminos",
            SITE['domain'] + "/contacto", SITE['domain'] + "/sobre-mi"]
    urls += [f"{SITE['domain']}/{t['slug']}" for t in TOOLS]
    urls += [f"{SITE['domain']}/problemas/{p['slug']}" for p in PROBLEMS]
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
    problems_hub_page()
    for p in PROBLEMS:
        problem_page(p)
    for t in TOOLS:
        tool_page(t)
    for link in EXTERNAL_LINKS:
        external_gate_page(link)
    not_found_page()
    print(f"OK -> {len(TOOLS)} herramientas + home + legales + sitemap generados en {DIST}")

if __name__ == "__main__":
    main()
