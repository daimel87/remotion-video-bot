# -*- coding: utf-8 -*-
"""Builds the Lite OS Reviews site -> dist/.
Usage: python3 osreview/build.py"""
import os, html, shutil, json
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
<meta property="og:image" content="{SITE['logo']}">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{html.escape(title)}">
<meta name="twitter:description" content="{html.escape(desc)}">
<meta name="twitter:image" content="{SITE['logo']}">
<meta name="robots" content="index,follow">
{verify}
<link rel="icon" href="{SITE['logo']}">
<link rel="apple-touch-icon" href="{SITE['logo']}">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div class="blob b1"></div>
<div class="blob b2"></div>
<div class="blob b3"></div>
<header class="site-header glass">
  <a class="logo" href="/"><img src="{SITE['logo']}" alt="{SITE['name']}" width="36" height="36" loading="eager"> {SITE['name']}</a>
  <nav><a href="/">Home</a> <a href="/advisor">PC Advisor</a> <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a></nav>
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

COOKIE_BANNER = '''
<div class="cookie-banner" id="cookieBanner" style="display:none">
  <p>We use first-party and third-party (advertising) cookies to keep this site free.
     By continuing to browse you accept their use. <a href="/privacy">Learn more</a>.</p>
  <button class="btn" type="button" onclick="document.getElementById('cookieBanner').style.display='none';localStorage.setItem('cookieOk','1')">Got it</button>
</div>
<script>
if (!localStorage.getItem('cookieOk')) {
  document.getElementById('cookieBanner').style.display = 'flex';
}
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
  <img class="footer-logo" src="{SITE['logo']}" alt="{SITE['name']}" width="64" height="64" loading="lazy">
  <p class="footer-name">{SITE['name']} — {SITE['tagline']}.</p>
  <a class="btn ghost footer-yt" href="{SITE['youtube']}" target="_blank" rel="noopener">🔔 Subscribe on YouTube</a>
  <div class="footer-cols">
    <div>
      <h4>Explore</h4>
      <a href="/advisor">PC Advisor</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </div>
    <div>
      <h4>Legal</h4>
      <a href="/privacy">Privacy</a>
      <a href="/disclaimer">Disclaimer</a>
      <a href="/terms">Terms of Service</a>
    </div>
  </div>
  <p class="disclaimer">Educational/review content about modified operating systems. Always keep a
     valid license for the OS you install and back up your data before reinstalling.</p>
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
      <div class="dlgate-ring" id="dlRing" style="cursor:pointer">
        <svg viewBox="0 0 100 100">
          <circle class="ring-bg" cx="50" cy="50" r="45"></circle>
          <circle class="ring-fg" id="ringFg" cx="50" cy="50" r="45"></circle>
        </svg>
        <span id="dlCountdown">15</span>
      </div>
      <p id="dlWaitLabel">Please wait, your link is being prepared…</p>
      <a id="dlReal" class="download" href="{a['url']}" rel="noopener nofollow" style="display:none"
         onclick="{directlink_click}">⬇ Get Link</a>
    </div>
    <p class="note">⚠️ Always back up your files before reinstalling any operating system. Make sure
       you have a valid license for Windows before using a modified build.</p>
  </article>
  <script>
  (function(){{
    var total=15, half=Math.ceil(total/2), c=total, stalled=false,
        cd=document.getElementById('dlCountdown'), ring=document.getElementById('ringFg'),
        label=document.getElementById('dlWaitLabel'), wrap=document.getElementById('dlRing'),
        btn=document.getElementById('dlReal');
    var circumference = 2 * Math.PI * 45;
    ring.style.strokeDasharray = circumference;
    var id=null;
    function tick(){{
      c--;
      if(c<=half){{
        clearInterval(id);
        stalled=true;
        label.textContent='Stalled — click the circle above to continue';
      }} else {{
        cd.textContent=c;
        ring.style.strokeDashoffset = circumference * (1 - c/total);
      }}
    }}
    id=setInterval(tick,1000);
    wrap.addEventListener('click', function(){{
      if(!stalled) return;
      stalled=false;
      label.textContent='Please wait, your link is being prepared…';
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
    <h1>Modified Windows & <span class="grad">lightweight OS</span> reviews</h1>
    <p class="lead">{SITE['description']}</p>
    <a class="btn" href="/advisor">🧭 Find my perfect Windows build</a>
    <a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">📺 Subscribe on YouTube</a>
  </section>
  <section class="grid-wrap">
    <h2>Reviews</h2>
    <div class="grid">{cards}</div>
  </section>'''
    write("index.html", head(f"{SITE['name']} — {SITE['tagline']}", SITE['description'],
                             SITE['domain'] + "/") + body + FOOT)

# ---------- PC Advisor ----------
def advisor_page():
    catalog = [
        {"slug": a["slug"], "title": a["title"], "cat": a["cat"], "yt": a["yt"], **a["advisor"]}
        for a in ARTICLES if a.get("advisor")
    ]
    catalog_json = json.dumps(catalog)
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/">Home</a> › <span>PC Advisor</span></nav>
    <h1>Which Windows build fits your PC?</h1>
    <p class="lead">Answer 3 quick questions and we'll match you with the best build from our
       reviewed catalog — no guesswork.</p>

    <form id="advisorForm" class="advisor-form">
      <div class="advisor-q">
        <label>How much RAM does your PC have?</label>
        <select id="qRam">
          <option value="1.5">1–2 GB (very old PC)</option>
          <option value="4" selected>4 GB</option>
          <option value="8">8 GB</option>
          <option value="16">16 GB or more</option>
        </select>
      </div>
      <div class="advisor-q">
        <label>What will you mainly use it for?</label>
        <select id="qPurpose">
          <option value="gaming">Gaming</option>
          <option value="everyday" selected>Everyday use / office / browsing</option>
          <option value="revive">Reviving a very old / slow PC</option>
        </select>
      </div>
      <div class="advisor-q">
        <label>Windows version preference</label>
        <select id="qOs">
          <option value="any" selected>No preference — show the best match</option>
          <option value="11">Windows 11 only</option>
          <option value="10">Windows 10 only</option>
          <option value="linux">I'm open to Linux too</option>
        </select>
      </div>
      <button class="btn" type="button" onclick="runAdvisor()">Find my build →</button>
    </form>

    <div id="advisorResults" class="advisor-results"></div>
  </article>
  <script>
  var ADVISOR_CATALOG = {catalog_json};
  function runAdvisor(){{
    var ram = parseFloat(document.getElementById('qRam').value);
    var purpose = document.getElementById('qPurpose').value;
    var osPref = document.getElementById('qOs').value;
    var pool = ADVISOR_CATALOG.filter(function(a){{
      if (a.ram_min > ram) return false;
      if (osPref !== 'any' && String(a.os) !== osPref) return false;
      return true;
    }});
    pool.forEach(function(a){{
      a.score = (a.purpose.indexOf(purpose) !== -1 ? 3 : 0) + (ram - a.ram_min < 4 ? 1 : 0);
    }});
    pool.sort(function(x,y){{ return y.score - x.score || (y.ram_min - x.ram_min); }});
    var top = pool.slice(0,3);
    var box = document.getElementById('advisorResults');
    if (!top.length){{
      box.innerHTML = '<p class="lead">No exact match — try lowering the RAM requirement or picking "No preference".</p>';
      return;
    }}
    var html = '<h2>Best matches for you</h2><div class="grid">';
    top.forEach(function(a, i){{
      html += '<a class="card" href="/' + a.slug + '">' +
        (i===0 ? '<span class="tag" style="background:var(--brand2)">TOP PICK</span>' : '<span class="tag">' + a.cat + '</span>') +
        '<h3>' + a.title + '</h3>' +
        '<p>Needs ' + a.ram_min + 'GB+ RAM · Windows ' + a.os + '</p></a>';
    }});
    html += '</div>';
    box.innerHTML = html;
    box.scrollIntoView({{behavior:'smooth', block:'start'}});
  }}
  </script>'''
    write("advisor.html", head("PC Advisor — Which Windows build fits your PC? — " + SITE['name'],
          "Answer 3 quick questions and get matched with the best lightweight Windows build for "
          "your PC's specs and use case.", SITE['domain'] + "/advisor") + body + FOOT)

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

    terms = f'''<article class="post simple-page"><h1>Terms of Service</h1>
      <p>By using this site you agree to the following:</p>
      <ul>
        <li>All reviewed OS builds are created by third-party communities; this site only reviews
            and links to them for educational purposes.</li>
        <li>We do not guarantee any build will work perfectly on every hardware configuration —
            always test on a spare drive or backup your data first.</li>
        <li>Reinstalling or replacing your OS erases your existing data. Back up anything important
            before following any guide on this site.</li>
        <li>Use of any linked build or tool is at your own risk. We are not responsible for data
            loss, hardware issues, or software conflicts.</li>
        <li>Site content (reviews, guides, the PC Advisor tool) belongs to {SITE['name']} / Daimel
            and may not be redistributed commercially without permission.</li>
      </ul>
      <p>Questions about these terms? Email <a href="mailto:{SITE['contact_email']}">{SITE['contact_email']}</a>.</p></article>'''
    write("terms.html", head("Terms of Service — " + SITE['name'],
          "Terms of use for this site, its reviews and the PC Advisor tool.",
          SITE['domain']+"/terms") + terms + FOOT)

    contact = f'''<article class="post simple-page"><h1>Contact</h1>
      <p class="lead">Questions about a build, the PC Advisor tool, or anything else? Reach out
         directly:</p>
      <a class="btn" href="mailto:{SITE['contact_email']}">✉ {SITE['contact_email']}</a>
      <p style="margin-top:22px">You can also drop a comment on any video on the
         <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube channel</a> — I read
         and reply there too.</p></article>'''
    write("contact.html", head("Contact — " + SITE['name'],
          "Get in touch with questions about any reviewed Windows build.",
          SITE['domain']+"/contact") + contact + FOOT)

    about = f'''<article class="post simple-page"><h1>About</h1>
      <p class="lead">This site is run by Daimel, the creator behind the {SITE['name']} YouTube
         channel.</p>
      <p>I test, review and document modified/debloated Windows builds and lightweight OS
         alternatives — Ghost Spectre, KernelOS, AtlasOS, ReviOS, X-Lite and more — so you don't
         have to guess which one actually fits your hardware and use case.</p>
      <p>Every review here is based on a real install and hands-on testing, documented step by
         step so anyone, regardless of technical background, can follow along safely.</p>
      <p>Not sure which build fits your PC? Try the
         <a href="/advisor">PC Advisor</a> — answer 3 quick questions and get matched instantly.</p>
      <a class="btn" href="/contact">✉ Contact me</a></article>'''
    write("about.html", head("About — " + SITE['name'],
          "About the creator behind Lite OS Reviews and the modified Windows builds covered here.",
          SITE['domain']+"/about") + about + FOOT)

def not_found_page():
    body = '''<article class="post simple-page" style="text-align:center">
      <h1>404 — This page doesn't exist</h1>
      <p class="lead">The link you followed isn't here, but your next favorite Windows build
         probably is.</p>
      <a class="btn" href="/advisor">Find my perfect Windows build</a>
      <a class="btn ghost" href="/">Back to home</a></article>'''
    write("404.html", head("Page not found — " + SITE['name'],
          "The page you're looking for doesn't exist.", SITE['domain']+"/404") + body + FOOT)

def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/privacy", SITE['domain'] + "/disclaimer",
            SITE['domain'] + "/advisor", SITE['domain'] + "/terms", SITE['domain'] + "/contact",
            SITE['domain'] + "/about"]
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
    home(); legal(); seo_files(); advisor_page()
    for a in ARTICLES:
        article_page(a)
        download_page(a)
    not_found_page()
    print(f"OK -> {len(ARTICLES)} reviews + home + legal + sitemap in {DIST}")

if __name__ == "__main__":
    main()
