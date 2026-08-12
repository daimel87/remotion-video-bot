# -*- coding: utf-8 -*-
"""Builds the Lite OS Reviews site -> dist/.
Usage: python3 osreview/build.py"""
import os, html, shutil
from data import SITE, ARTICLES

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

def video(yt):
    return f'''<div class="video-frame">
      <iframe src="https://www.youtube.com/embed/{yt}" title="Video" loading="lazy"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe></div>'''

def head(title, desc, canonical):
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
</head>
<body>
<header class="site-header">
  <a class="logo" href="/">💻 {SITE['name']}</a>
  <nav><a href="/">Home</a> <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a></nav>
</header>
<main>'''

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
     <a href="/privacy">Privacy</a> · <a href="/disclaimer">Disclaimer</a></p>
  <p class="disclaimer">Educational/review content about modified operating systems. Always keep a
     valid license for the OS you install and back up your data before reinstalling.</p>
</footer>
{ADBLOCK_DETECT}
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
        out += f'<a class="rel-card" href="/{a["slug"]}"><h4>{html.escape(a["title"])}</h4></a>\n'
        count += 1
        if count == 4:
            break
    return out

def download_block(a):
    return f'''<a class="download" href="/get/{a['slug']}">⬇ Get download link</a>'''

# ---------- Intermediate download-gate page ----------
def download_page(a):
    directlink_click = f"window.open('{SITE['monetag_directlink']}','_blank')" if SITE.get("monetag_directlink") else ""
    canonical = f"{SITE['domain']}/get/{a['slug']}"
    body = f'''
  <article class="post dlgate">
    <nav class="crumbs"><a href="/">Home</a> › <a href="/{a['slug']}">{html.escape(a['title'])}</a> › <span>Download</span></nav>
    <h1>Your download is being prepared</h1>
    <p class="lead">{html.escape(a['cat'])} — {html.escape(a['title'])}</p>
    <div class="dlgate-box">
      <div class="dlgate-ring" id="dlRing">
        <svg viewBox="0 0 100 100">
          <circle class="ring-bg" cx="50" cy="50" r="45"></circle>
          <circle class="ring-fg" id="ringFg" cx="50" cy="50" r="45"></circle>
        </svg>
        <span id="dlCountdown">15</span>
      </div>
      <p id="dlWaitLabel">Please wait, your link is being prepared…</p>
      <button id="dlContinue" class="download" type="button" style="display:none">Click to continue ▶</button>
      <a id="dlReal" class="download" href="{a['url']}" rel="noopener nofollow" style="display:none"
         onclick="{directlink_click}">⬇ Get Link</a>
    </div>
    <p class="note">⚠️ Always back up your files before reinstalling any operating system. Make sure
       you have a valid license for Windows before using a modified build.</p>
  </article>
  <script>
  (function(){{
    var total=15, half=Math.ceil(total/2), c=total,
        cd=document.getElementById('dlCountdown'), ring=document.getElementById('ringFg'),
        label=document.getElementById('dlWaitLabel'), wrap=document.getElementById('dlRing'),
        contBtn=document.getElementById('dlContinue'), btn=document.getElementById('dlReal');
    var circumference = 2 * Math.PI * 45;
    ring.style.strokeDasharray = circumference;
    var id=null;
    function tick(){{
      c--;
      if(c<=half){{
        clearInterval(id);
        label.textContent='Almost there — click to continue';
        contBtn.style.display='inline-block';
      }} else {{
        cd.textContent=c;
        ring.style.strokeDashoffset = circumference * (1 - c/total);
      }}
    }}
    id=setInterval(tick,1000);
    contBtn.addEventListener('click', function(){{
      contBtn.style.display='none';
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
    }});
  }})();
  </script>'''
    write(f"get/{a['slug']}.html", head(f"Download — {a['title']}", a['summary'], canonical)
          .replace('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex,follow">')
          + body + FOOT)

# ---------- Article page ----------
def article_page(a):
    canonical = f"{SITE['domain']}/{a['slug']}"
    sections = ""
    for i, (sub, paras) in enumerate(a["body"]):
        sections += f"<h2>{html.escape(sub)}</h2>\n"
        for p in paras:
            sections += f"<p>{p}</p>\n"
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/">Home</a> › <span>{html.escape(a['cat'])}</span></nav>
    <span class="tag">{html.escape(a['cat'])}</span>
    <h1>{html.escape(a['title'])}</h1>
    <p class="lead">{html.escape(a['summary'])}</p>
    {video(a['yt'])}
    {download_block(a)}
    <p class="note">⚠️ Always back up your files before reinstalling any operating system. Make sure
       you have a valid license for Windows before using a modified build.</p>
    {sections}
    <div class="fb-cta">
      <p>📺 Liked this review? Subscribe on <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a>
         for more lightweight OS builds and install guides.</p>
    </div>
    <h2>More reviews</h2>
    <div class="rel-grid">{related(a)}</div>
  </article>'''
    write(f"{a['slug']}.html", head(a['title'], a['summary'], canonical) + body + FOOT)

# ---------- Home ----------
def home():
    cards = ""
    for a in ARTICLES:
        cards += f'''<a class="card" href="/{a['slug']}">
          <span class="tag">{html.escape(a['cat'])}</span>
          <h3>{html.escape(a['title'])}</h3>
          <p>{html.escape(a['summary'][:100])}…</p></a>\n'''
    body = f'''
  <section class="hero">
    <h1>Modified Windows & lightweight OS reviews</h1>
    <p class="lead">{SITE['description']}</p>
    <a class="btn" href="{SITE['youtube']}" target="_blank" rel="noopener">📺 Subscribe on YouTube</a>
  </section>
  <section class="grid-wrap">
    <h2>Reviews</h2>
    <div class="grid">{cards}</div>
  </section>'''
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
          "Privacy policy and cookies.", SITE['domain']+"/privacy") + priv + FOOT)
    write("disclaimer.html", head("Disclaimer — " + SITE['name'],
          "Disclaimer.", SITE['domain']+"/disclaimer") + disc + FOOT)

def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/privacy", SITE['domain'] + "/disclaimer"]
    urls += [f"{SITE['domain']}/{a['slug']}" for a in ARTICLES]
    items = "\n".join(f"  <url><loc>{u}</loc><changefreq>weekly</changefreq></url>" for u in urls)
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?>\n'
          f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{items}\n</urlset>')
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE['domain']}/sitemap.xml\n")

def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    shutil.copy(os.path.join(HERE, "style.css"), os.path.join(DIST, "style.css"))
    shutil.copy(os.path.join(HERE, "sw.js"), os.path.join(DIST, "sw.js"))
    verify_file = os.path.join(HERE, "google1fa65511afa56808.html")
    if os.path.exists(verify_file):
        shutil.copy(verify_file, os.path.join(DIST, "google1fa65511afa56808.html"))
    home(); legal(); seo_files()
    for a in ARTICLES:
        article_page(a)
        download_page(a)
    print(f"OK -> {len(ARTICLES)} reviews + home + legal + sitemap in {DIST}")

if __name__ == "__main__":
    main()
