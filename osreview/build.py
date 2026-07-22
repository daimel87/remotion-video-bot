# -*- coding: utf-8 -*-
"""Builds the Lite OS Reviews site -> dist/.
Usage: python3 osreview/build.py"""
import os, html, shutil
from data import SITE, ARTICLES

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

def ad(slot_key, label="Advertisement"):
    code = SITE.get(slot_key, "")
    inner = code if code else '<span class="ad-ph">Ad space</span>'
    return f'''<div class="ad"><span class="ad-label">{label}</span>
      <div class="ad-inner">{inner}</div></div>'''

def video(yt):
    return f'''<div class="video-frame">
      <iframe src="https://www.youtube.com/embed/{yt}" title="Video" loading="lazy"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe></div>'''

def head(title, desc, canonical):
    social = SITE.get("ad_social", "")
    social_tag = f'<script src="{social}" data-cfasync="false" async></script>' if social else ""
    verify = f'<meta name="google-site-verification" content="{SITE["google_verify"]}">' if SITE.get("google_verify") else ""
    return f'''<!DOCTYPE html>
<html lang="en">
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
{verify}
<link rel="stylesheet" href="/style.css">
{social_tag}
</head>
<body>
<header class="site-header">
  <a class="logo" href="/">💻 {SITE['name']}</a>
  <nav><a href="/">Home</a> <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a></nav>
</header>
<main>'''

POPUNDER = f'''<!-- Adsterra Popunder -->
<script type="text/javascript" src="{SITE['popunder']}"></script>''' if SITE.get('popunder') else ''

ADBLOCK_DETECT = '''
<div class="ab-overlay" id="abOverlay">
  <div class="ab-box">
    <h2>🚫 Ad blocker detected</h2>
    <p>This site is free thanks to advertising. Please disable your ad blocker (AdBlock, uBlock,
       Brave Shields, etc.) for this site and reload the page to keep reading and downloading.</p>
    <button class="btn" type="button" onclick="location.reload()">I disabled it, reload</button>
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
  window.addEventListener('load', function(){
    setTimeout(function(){ if(checkBait()){ showBlock(); } }, 800);
  });
})();
</script>'''

FOOT = f'''</main>
<footer class="site-footer">
  <p>{SITE['name']} — {SITE['tagline']}.</p>
  <p><a href="{SITE['youtube']}" target="_blank" rel="noopener">Subscribe on YouTube</a> ·
     <a href="/privacy.html">Privacy</a> · <a href="/disclaimer.html">Disclaimer</a></p>
  <p class="disclaimer">Educational/review content about modified operating systems. Always keep a
     valid license for the OS you install and back up your data before reinstalling.</p>
</footer>
{ADBLOCK_DETECT}
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

def download_block(a):
    mkm = SITE.get("ad_modal", "")
    modal_ad = f'''<script type="text/javascript">
            atOptions = {{ 'key':'{mkm}', 'format':'iframe', 'height':250, 'width':300, 'params':{{}} }};
          </script>
          <script type="text/javascript" src="https://russiaexternalknew.com/{mkm}/invoke.js"></script>''' \
        if mkm else '<span class="ad-ph">Ad space</span>'
    smartlink_click = f"window.open('{SITE['smartlink']}','_blank')" if SITE.get("smartlink") else ""
    return f'''<button class="download" type="button" onclick="openDlModal()">
       ⬇ Get download link</button>
    <div class="modal-overlay" id="dlModal">
      <div class="modal-box">
        <button class="modal-close" type="button" onclick="closeDlModal()" aria-label="Close">✕</button>
        <h3>Your download link is almost ready</h3>
        <div class="modal-ad">{modal_ad}</div>
        <p id="dlCountdown">Preparing your link… 10s</p>
        <a id="dlReal" class="download" href="{a['url']}" target="_blank" rel="noopener nofollow" style="display:none"
           onclick="{smartlink_click}">⬇ Download {html.escape(a['cat'])}</a>
      </div>
    </div>
    <script>
    function openDlModal(){{
      document.getElementById('dlModal').style.display='flex';
      var c=10, cd=document.getElementById('dlCountdown'), btn=document.getElementById('dlReal');
      cd.style.display='block'; btn.style.display='none';
      var id=setInterval(function(){{
        c--;
        if(c<0){{clearInterval(id); cd.style.display='none'; btn.style.display='inline-block';}}
        else{{cd.innerHTML='Preparing your link… '+c+'s';}}
      }},1000);
    }}
    function closeDlModal(){{document.getElementById('dlModal').style.display='none';}}
    </script>'''

# ---------- Article page ----------
def article_page(a):
    canonical = f"{SITE['domain']}/{a['slug']}.html"
    sections = ""
    for i, (sub, paras) in enumerate(a["body"]):
        sections += f"<h2>{html.escape(sub)}</h2>\n"
        for p in paras:
            sections += f"<p>{p}</p>\n"
        if i == 1:
            sections += ad("ad_native", "Advertisement")
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/">Home</a> › <span>{html.escape(a['cat'])}</span></nav>
    <span class="tag">{html.escape(a['cat'])}</span>
    <h1>{html.escape(a['title'])}</h1>
    <p class="lead">{html.escape(a['summary'])}</p>
    {ad("ad_top")}
    {video(a['yt'])}
    {download_block(a)}
    <p class="note">⚠️ Always back up your files before reinstalling any operating system. Make sure
       you have a valid license for Windows before using a modified build.</p>
    {sections}
    {ad("ad_incontent")}
    <div class="fb-cta">
      <p>📺 Liked this review? Subscribe on <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a>
         for more lightweight OS builds and install guides.</p>
    </div>
    <h2>More reviews</h2>
    <div class="rel-grid">{related(a)}</div>
    {ad("ad_bottom")}
  </article>'''
    write(f"{a['slug']}.html", head(a['title'], a['summary'], canonical) + body + POPUNDER + FOOT)

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
    <h1>Modified Windows & lightweight OS reviews</h1>
    <p class="lead">{SITE['description']}</p>
    <a class="btn" href="{SITE['youtube']}" target="_blank" rel="noopener">📺 Subscribe on YouTube</a>
  </section>
  {ad("ad_top")}
  <section class="grid-wrap">
    <h2>Reviews</h2>
    <div class="grid">{cards}</div>
  </section>
  {ad("ad_bottom")}'''
    write("index.html", head(f"{SITE['name']} — {SITE['tagline']}", SITE['description'],
                             SITE['domain'] + "/") + body + FOOT)

# ---------- Legal ----------
def legal():
    priv = '''<article class="post"><h1>Privacy Policy</h1>
      <p>This site shows third-party advertising that may use cookies to display relevant ads. You
      can disable personalization cookies in your browser settings. We do not collect personally
      identifiable data; traffic is measured anonymously.</p></article>'''
    disc = '''<article class="post"><h1>Disclaimer</h1>
      <p>This site publishes reviews and install guides for modified/debloated operating system
      builds created by third-party communities. We do not host or distribute any activators,
      cracks or pirated license keys. Download links point to the creators' own official pages or
      file-hosting links shared publicly by them. You are responsible for holding a valid license
      for any Windows installation. Always back up your data before reinstalling an OS.</p></article>'''
    write("privacy.html", head("Privacy Policy — " + SITE['name'],
          "Privacy policy and cookies.", SITE['domain']+"/privacy.html") + priv + FOOT)
    write("disclaimer.html", head("Disclaimer — " + SITE['name'],
          "Disclaimer.", SITE['domain']+"/disclaimer.html") + disc + FOOT)

def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/privacy.html", SITE['domain'] + "/disclaimer.html"]
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
    print(f"OK -> {len(ARTICLES)} reviews + home + legal + sitemap in {DIST}")

if __name__ == "__main__":
    main()
