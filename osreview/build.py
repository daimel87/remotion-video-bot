# -*- coding: utf-8 -*-
"""Builds the Lite OS Reviews site -> dist/.
Usage: python3 osreview/build.py"""
import os, html, shutil, re, json
from data import SITE, ARTICLES, BEST_BUILDS_PAGE, VIDEO_HUBS
from data_pl import SITE_PL, ARTICLES_PL, UI_PL, BEST_BUILDS_PAGE_PL

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

def video(yt):
    return f'''<div class="video-frame">
      <iframe src="https://www.youtube.com/embed/{yt}" title="Video" loading="lazy"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe></div>'''

def head(title, desc, canonical, lang="en", en_url=None, pl_url=None, nav=None):
    verify = f'<meta name="google-site-verification" content="{SITE["google_verify"]}">' if SITE.get("google_verify") else ""
    hreflang = ""
    if en_url and pl_url:
        hreflang = f'''<link rel="alternate" hreflang="en" href="{en_url}">
<link rel="alternate" hreflang="pl" href="{pl_url}">
<link rel="alternate" hreflang="x-default" href="{en_url}">
'''
    lang_banner = ""
    if lang == "en" and pl_url:
        lang_banner = f'''<div class="lang-banner" id="langBanner" style="display:none">
  <p>{UI_PL['lang_banner_text']}</p>
  <a class="btn" href="{pl_url}">{UI_PL['lang_banner_btn']}</a>
  <button type="button" class="btn ghost" onclick="dismissLangBanner()">{UI_PL['lang_banner_dismiss']}</button>
</div>
<script>
(function(){{
  try{{
    if(localStorage.getItem('langBannerDismissed')) return;
    if(/^pl/i.test(navigator.language||'')){{
      document.addEventListener('DOMContentLoaded', function(){{
        var b = document.getElementById('langBanner');
        if(b) b.style.display='flex';
      }});
    }}
  }}catch(e){{}}
}})();
function dismissLangBanner(){{
  try{{localStorage.setItem('langBannerDismissed','1');}}catch(e){{}}
  var b=document.getElementById('langBanner'); if(b) b.style.display='none';
}}
</script>'''
    elif lang == "pl" and en_url:
        lang_banner = f'''<div class="lang-banner" id="langBanner" style="display:none">
  <p>{UI_PL['lang_switch_to_en']}</p>
  <a class="btn" href="{en_url}">{UI_PL['lang_switch_to_en']}</a>
  <button type="button" class="btn ghost" onclick="dismissLangBanner()">{UI_PL['lang_banner_dismiss']}</button>
</div>
<script>
(function(){{
  try{{
    if(localStorage.getItem('langBannerDismissed')) return;
    if(!/^pl/i.test(navigator.language||'')){{
      document.addEventListener('DOMContentLoaded', function(){{
        var b = document.getElementById('langBanner');
        if(b) b.style.display='flex';
      }});
    }}
  }}catch(e){{}}
}})();
function dismissLangBanner(){{
  try{{localStorage.setItem('langBannerDismissed','1');}}catch(e){{}}
  var b=document.getElementById('langBanner'); if(b) b.style.display='none';
}}
</script>'''
    return f'''<!DOCTYPE html>
<html lang="{lang}">
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
{hreflang}<link rel="icon" href="{SITE['logo']}">
<link rel="apple-touch-icon" href="{SITE['logo']}">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div class="blob b1"></div>
<div class="blob b2"></div>
<div class="blob b3"></div>
<header class="site-header glass">
  <a class="logo" href="{'/pl/' if lang == 'pl' else '/'}"><img src="{SITE['logo']}" alt="{SITE['name']}" width="36" height="36" loading="eager"> {SITE['name']}</a>
  <nav>{nav or f'<a href="/">Home</a> <a href="/advisor">PC Advisor</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">YouTube</a>'}</nav>
</header>
{lang_banner}
<main>'''

def _inline_js(script_tag):
    """Strips the outer <script ...>...</script> wrapper, leaving just the JS body."""
    return re.sub(r'^\s*<script[^>]*>|</script>\s*$', '', script_tag.strip())

MONETAG_SITEWIDE = f'''<!-- Monetag Push -->
{SITE['monetag_push']}
<!-- Monetag In-Page Push / Popunder / Vignette: deferred until after load so they never
     compete with the initial video/content render -->
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

def COOKIE_BANNER_HTML(lang="en"):
    if lang == "pl":
        text = f'{UI_PL["cookie_text"]} <a href="/pl/privacy">{UI_PL["cookie_more"]}</a>.'
        btn = UI_PL["cookie_ok"]
    else:
        text = 'We use first-party and third-party (advertising) cookies to keep this site free. By continuing to browse you accept their use. <a href="/privacy">Learn more</a>.'
        btn = "Got it"
    return f'''
<div class="cookie-banner" id="cookieBanner" style="display:none">
  <p>{text}</p>
  <button class="btn" type="button" onclick="document.getElementById('cookieBanner').style.display='none';localStorage.setItem('cookieOk','1')">{btn}</button>
</div>
<script>
if (!localStorage.getItem('cookieOk')) {{
  document.getElementById('cookieBanner').style.display = 'flex';
}}
</script>'''

def ADBLOCK_DETECT_HTML(lang="en"):
    if lang == "pl":
        title, text, btn = UI_PL["adblock_title"], UI_PL["adblock_text"], UI_PL["adblock_btn"]
    else:
        title = "🚫 Ad blocker detected"
        text = "This site is free thanks to advertising. Please disable your ad blocker (AdBlock, uBlock, Brave Shields, etc.) for this site and reload the page to keep reading and downloading."
        btn = "I disabled it, reload"
    return f'''
<div class="ab-overlay" id="abOverlay">
  <div class="ab-box">
    <h2>{title}</h2>
    <p>{text}</p>
    <button class="btn" type="button" onclick="location.reload()">{btn}</button>
  </div>
</div>
<div class="ab-bait ad-banner ads adsbox adsbygoogle textads banner_ad" style="position:absolute;left:-9999px;top:-9999px;width:300px;height:250px;"></div>
<script>''' + '''
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

def FOOT_HTML(lang="en"):
    if lang == "pl":
        footer = f'''</main>
<footer class="site-footer">
  <img class="footer-logo" src="{SITE['logo']}" alt="{SITE['name']}" width="64" height="64" loading="lazy">
  <p class="footer-name">{SITE['name']} — {SITE_PL['tagline']}.</p>
  <a class="btn ghost footer-yt" href="{SITE['youtube']}" target="_blank" rel="noopener">🔔 Subskrybuj na YouTube</a>
  <div class="footer-cols">
    <div>
      <h4>{UI_PL['footer_explore']}</h4>
      <a href="/pl/advisor">{UI_PL['nav_advisor']}</a>
      <a href="/pl/about">{UI_PL['footer_about']}</a>
      <a href="/pl/contact">{UI_PL['footer_contact']}</a>
    </div>
    <div>
      <h4>{UI_PL['footer_legal']}</h4>
      <a href="/pl/privacy">{UI_PL['footer_privacy']}</a>
      <a href="/pl/disclaimer">{UI_PL['footer_disclaimer']}</a>
      <a href="/pl/terms">{UI_PL['footer_terms']}</a>
    </div>
    <div>
      <h4>{UI_PL['footer_other_sites']}</h4>
      <a href="https://dtechusb.pages.dev/" target="_blank" rel="noopener">{UI_PL['footer_other_site_label']}</a>
      <a href="/">{UI_PL['footer_en_label']}</a>
    </div>
  </div>
  <p class="disclaimer">{UI_PL['footer_disclaimer_text']}</p>
</footer>
{ADBLOCK_DETECT_HTML('pl')}
{COOKIE_BANNER_HTML('pl')}
{MONETAG_SITEWIDE}
</body></html>'''
        return footer
    return f'''</main>
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
    <div>
      <h4>Other sites</h4>
      <a href="https://dtechusb.pages.dev/" target="_blank" rel="noopener">D-Tech USB (ES) — USB repair tools</a>
      <a href="/pl/">Polska wersja / Polish version</a>
    </div>
  </div>
  <p class="disclaimer">Educational/review content about modified operating systems. Always keep a
     valid license for the OS you install and back up your data before reinstalling.</p>
</footer>
{ADBLOCK_DETECT_HTML('en')}
{COOKIE_BANNER_HTML('en')}
{MONETAG_SITEWIDE}
</body></html>'''

FOOT = FOOT_HTML("en")

def write(path, content):
    full = os.path.join(DIST, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

def faq_block(faqs, heading="Frequently asked questions"):
    if not faqs:
        return "", ""
    items_html = "\n".join(
        f'<div class="faq-item"><h3>{html.escape(q)}</h3><p>{html.escape(a)}</p></div>'
        for q, a in faqs
    )
    visible = f'<h2>{heading}</h2>\n<div class="faq-list">{items_html}</div>'
    ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in faqs
        ],
    }
    jsonld = f'<script type="application/ld+json">{json.dumps(ld)}</script>'
    return visible, jsonld

def review_jsonld(a, canonical):
    ld = {
        "@context": "https://schema.org",
        "@type": "Review",
        "itemReviewed": {
            "@type": "SoftwareApplication",
            "name": a["title"].split(" Review")[0],
            "applicationCategory": "OperatingSystem",
            "operatingSystem": "Windows",
        },
        "reviewBody": a["summary"],
        "author": {"@type": "Organization", "name": SITE["name"]},
        "url": canonical,
    }
    return f'<script type="application/ld+json">{json.dumps(ld)}</script>'

def _rotated(items, current_slug, n):
    """Deterministic per-article rotation so every article isn't always shown the same
    first-N related picks — spreads internal-link clicks (and pageviews) across the catalog."""
    if not items:
        return items
    offset = sum(ord(c) for c in current_slug) % len(items)
    rotated = items[offset:] + items[:offset]
    return rotated[:n]

def related(current):
    same_cat = [a for a in ARTICLES if a["slug"] != current["slug"] and a["cat"] == current["cat"]]
    other = [a for a in ARTICLES if a["slug"] != current["slug"] and a["cat"] != current["cat"]]
    picks = (same_cat + _rotated(other, current["slug"], 4))[:4]
    if len(picks) < 4:
        picks = (picks + other)[:4]
    out = ""
    for a in picks:
        out += f'<a class="rel-card" href="/{a["slug"]}"><h4>{html.escape(a["title"])}</h4></a>\n'
    return out

def download_block(a, lang="en"):
    if lang == "pl":
        return f'''<a class="download" href="/pl/get/{a['slug']}">⬇ Pobierz link do pobrania</a>'''
    return f'''<a class="download" href="/get/{a['slug']}">⬇ Get download link</a>'''

# ---------- Intermediate download-gate page ----------
def download_page(a, lang="en", a_pl=None):
    directlink_click = f"window.open('{SITE['monetag_directlink']}','_blank')" if SITE.get("monetag_directlink") else ""
    prefix = "/pl" if lang == "pl" else ""
    canonical = f"{SITE['domain']}{prefix}/get/{a['slug']}"
    title = a_pl['title'] if a_pl else a['title']
    cat = a_pl['cat'] if a_pl else a['cat']
    home_label = UI_PL['nav_home'] if lang == "pl" else "Home"
    heading = "Twoje pobieranie jest przygotowywane" if lang == "pl" else "Your download is being prepared"
    wait_label = "Proszę czekać, link jest przygotowywany…" if lang == "pl" else "Please wait, your link is being prepared…"
    stalled_label = "Zatrzymano — kliknij koło powyżej, aby kontynuować" if lang == "pl" else "Stalled — click the circle above to continue"
    get_link = "⬇ Pobierz link" if lang == "pl" else "⬇ Get Link"
    note = UI_PL['backup_note'] if lang == "pl" else "⚠️ Always back up your files before reinstalling any operating system. Make sure you have a valid license for Windows before using a modified build."
    body = f'''
  <article class="post dlgate">
    <nav class="crumbs"><a href="{prefix}/">{home_label}</a> › <a href="{prefix}/{a['slug']}">{html.escape(title)}</a> › <span>Download</span></nav>
    <h1>{heading}</h1>
    <p class="lead">{html.escape(cat)} — {html.escape(title)}</p>
    <div class="dlgate-box">
      <div class="dlgate-ring" id="dlRing" style="cursor:pointer">
        <svg viewBox="0 0 100 100">
          <circle class="ring-bg" cx="50" cy="50" r="45"></circle>
          <circle class="ring-fg" id="ringFg" cx="50" cy="50" r="45"></circle>
        </svg>
        <span id="dlCountdown">15</span>
      </div>
      <p id="dlWaitLabel">{wait_label}</p>
      <a id="dlReal" class="download" href="{a['url']}" rel="noopener nofollow" style="display:none"
         onclick="{directlink_click}">{get_link}</a>
    </div>
    <p class="note">{note}</p>
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
        label.textContent={stalled_label!r};
      }} else {{
        cd.textContent=c;
        ring.style.strokeDashoffset = circumference * (1 - c/total);
      }}
    }}
    id=setInterval(tick,1000);
    wrap.addEventListener('click', function(){{
      if(!stalled) return;
      stalled=false;
      label.textContent={wait_label!r};
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
    dl_prefix = "Download" if lang == "en" else "Pobierz"
    fname = f"get/{a['slug']}.html" if lang == "en" else f"pl/get/{a['slug']}.html"
    summary = a_pl['summary'] if a_pl else a['summary']
    nav_html = f'<a href="/">Home</a> <a href="/advisor">PC Advisor</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">YouTube</a>' if lang == "en" else \
               f'<a href="/pl/">{UI_PL["nav_home"]}</a> <a href="/pl/advisor">{UI_PL["nav_advisor"]}</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">YouTube</a>'
    write(fname, head(f"{dl_prefix} — {title}", summary, canonical, lang=lang, nav=nav_html)
          .replace('<meta name="robots" content="index,follow">', '<meta name="robots" content="noindex,follow">')
          + body + FOOT_HTML(lang))

# ---------- Article page ----------
def hubs_for_article(a):
    """Match an article to its relevant video-hub page(s): the X-Lite build gets its own
    dedicated hub, everything else matches by category."""
    if "x-lite" in a["slug"]:
        return [v for v in VIDEO_HUBS if "x-lite" in v["slug"]]
    return [v for v in VIDEO_HUBS if a["cat"] in v["related_cats"] and "x-lite" not in v["slug"]]

def video_hub_links_block(hubs, heading="🎥 More video guides"):
    if not hubs:
        return ""
    links = "\n".join(
        f'<a class="btn ghost" href="/{v["slug"]}">🎥 {html.escape(v["title"].split(" — ")[0])}</a>'
        for v in hubs
    )
    return f'<div class="video-cta-row"><span style="width:100%;font-weight:700">{heading}</span>{links}</div>'

def article_page(a):
    canonical = f"{SITE['domain']}/{a['slug']}"
    sections = ""
    for i, (sub, paras) in enumerate(a["body"]):
        sections += f"<h2>{html.escape(sub)}</h2>\n"
        for p in paras:
            sections += f"<p>{p}</p>\n"
    faq_visible, faq_ld = faq_block(a.get("faq"))
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/">Home</a> › <span>{html.escape(a['cat'])}</span></nav>
    <span class="tag">{html.escape(a['cat'])}</span>
    <h1>{html.escape(a['title'])}</h1>
    <p class="lead">{html.escape(a['summary'])}</p>
    {video(a['yt'])}
    {download_block(a)}
    <div class="video-cta-row">
      <a class="btn ghost" href="/advisor">🧭 Not sure? Find your build</a>
      <a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">🔔 Subscribe on YouTube</a>
    </div>
    <p class="note">⚠️ Always back up your files before reinstalling any operating system. Make sure
       you have a valid license for Windows before using a modified build.</p>
    {sections}
    {faq_visible}
    <div class="fb-cta">
      <p>📺 Liked this review? Subscribe on <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a>
         for more lightweight OS builds and install guides.</p>
    </div>
    {video_hub_links_block(hubs_for_article(a))}
    <h2>More reviews</h2>
    <div class="rel-grid">{related(a)}</div>
    <p><a href="/best-lightweight-windows-11-builds">See how {html.escape(a['title'].split(' Review')[0])} compares to every other build we've tested →</a></p>
  </article>
  {faq_ld}
  {review_jsonld(a, canonical)}'''
    en_url = canonical
    pl_url = f"{SITE['domain']}/pl/{a['slug']}"
    write(f"{a['slug']}.html", head(a['title'], a['summary'][:155], canonical, lang="en", en_url=en_url, pl_url=pl_url) + body + FOOT)

def related_pl(current):
    same_cat = [a for a in ARTICLES_PL if a["slug"] != current["slug"] and a["cat"] == current["cat"]]
    other = [a for a in ARTICLES_PL if a["slug"] != current["slug"] and a["cat"] != current["cat"]]
    picks = (same_cat + _rotated(other, current["slug"], 4))[:4]
    if len(picks) < 4:
        picks = (picks + other)[:4]
    out = ""
    for a in picks:
        out += f'<a class="rel-card" href="/pl/{a["slug"]}"><h4>{html.escape(a["title"])}</h4></a>\n'
    return out

def article_page_pl(a_pl):
    a = next(x for x in ARTICLES if x["slug"] == a_pl["slug"])
    en_url = f"{SITE['domain']}/{a['slug']}"
    pl_url = f"{SITE['domain']}/pl/{a['slug']}"
    sections = ""
    for sub, paras in a_pl["body"]:
        sections += f"<h2>{html.escape(sub)}</h2>\n"
        for p in paras:
            sections += f"<p>{p}</p>\n"
    nav_html = f'<a href="/pl/">{UI_PL["nav_home"]}</a> <a href="/pl/advisor">{UI_PL["nav_advisor"]}</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">{UI_PL["nav_youtube"]}</a>'
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/pl/">{UI_PL['crumbs_home']}</a> › <span>{html.escape(a_pl['cat'])}</span></nav>
    <span class="tag">{html.escape(a_pl['cat'])}</span>
    <h1>{html.escape(a_pl['title'])}</h1>
    <p class="lead">{html.escape(a_pl['summary'])}</p>
    {video(a['yt'])}
    {download_block(a, lang="pl")}
    <div class="video-cta-row">
      <a class="btn ghost" href="/pl/advisor">{UI_PL['advisor_not_sure']}</a>
      <a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">{UI_PL['subscribe_yt']}</a>
    </div>
    <p class="note">{UI_PL['backup_note']}</p>
    {sections}
    <div class="fb-cta">
      <p>{UI_PL['liked_review']} <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a>
         {UI_PL['liked_review_suffix']}</p>
    </div>
    <h2>{UI_PL['more_reviews']}</h2>
    <div class="rel-grid">{related_pl(a_pl)}</div>
  </article>'''
    write(f"pl/{a['slug']}.html", head(a_pl['title'], a_pl['summary'][:155], pl_url, lang="pl", en_url=en_url, pl_url=pl_url, nav=nav_html) + body + FOOT_HTML("pl"))

# ---------- Best builds comparison hub ----------
def best_builds_page():
    p = BEST_BUILDS_PAGE
    canonical = f"{SITE['domain']}/{p['slug']}"
    intro = "\n".join(f"<p>{para}</p>" for para in p["intro"])
    rows = ""
    for a in ARTICLES:
        adv = a.get("advisor", {})
        os_label = f"Windows {adv['os']}" if adv.get("os") not in (None, "linux") else "Linux"
        ram = f"{adv.get('ram_min', '—')}GB+" if adv else "—"
        purpose = ", ".join(adv.get("purpose", [])) if adv else "—"
        rows += (f'<tr><td><a href="/{a["slug"]}">{html.escape(a["title"].split(" Review")[0])}</a></td>'
                 f'<td>{html.escape(a["cat"])}</td><td>{os_label}</td><td>{ram}</td>'
                 f'<td>{html.escape(purpose)}</td></tr>\n')
    faq_visible, faq_ld = faq_block(p["faq"])
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/">Home</a> › <span>Best builds</span></nav>
    <h1>{html.escape(p['title'])}</h1>
    {intro}
    <div class="table-wrap" style="overflow-x:auto">
      <table class="compare-table">
        <thead><tr><th>Build</th><th>Category</th><th>Windows</th><th>Min RAM</th><th>Best for</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
    <a class="btn" href="/advisor">🧭 Not sure? Find your build in 30 seconds</a>
    {faq_visible}
  </article>
  {faq_ld}'''
    write(f"{p['slug']}.html", head(p["title"], p["meta_desc"], canonical, lang="en",
          en_url=canonical, pl_url=SITE['domain']+"/pl/") + body + FOOT)

def best_builds_page_pl():
    p = BEST_BUILDS_PAGE_PL
    canonical = f"{SITE['domain']}/pl/{p['slug']}"
    en_url = f"{SITE['domain']}/{BEST_BUILDS_PAGE['slug']}"
    intro = "\n".join(f"<p>{para}</p>" for para in p["intro"])
    rows = ""
    for a_pl in ARTICLES_PL:
        a = next(x for x in ARTICLES if x["slug"] == a_pl["slug"])
        adv = a.get("advisor", {})
        os_label = f"Windows {adv['os']}" if adv.get("os") not in (None, "linux") else "Linux"
        ram = f"{adv.get('ram_min', '—')}GB+" if adv else "—"
        purpose_map = {"gaming": "granie", "everyday": "codzienne użycie", "revive": "ożywienie starego PC"}
        purpose = ", ".join(purpose_map.get(x, x) for x in adv.get("purpose", [])) if adv else "—"
        rows += (f'<tr><td><a href="/pl/{a_pl["slug"]}">{html.escape(a_pl["title"].split(" —")[0])}</a></td>'
                 f'<td>{html.escape(a_pl["cat"])}</td><td>{os_label}</td><td>{ram}</td>'
                 f'<td>{html.escape(purpose)}</td></tr>\n')
    faq_visible, faq_ld = faq_block(p["faq"], heading="Najczęściej zadawane pytania")
    nav_html = f'<a href="/pl/">{UI_PL["nav_home"]}</a> <a href="/pl/advisor">{UI_PL["nav_advisor"]}</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">{UI_PL["nav_youtube"]}</a>'
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/pl/">{UI_PL['crumbs_home']}</a> › <span>Porównanie</span></nav>
    <h1>{html.escape(p['title'])}</h1>
    {intro}
    <div class="table-wrap" style="overflow-x:auto">
      <table class="compare-table">
        <thead><tr><th>Wersja</th><th>Kategoria</th><th>Windows</th><th>Min. RAM</th><th>Dla kogo</th></tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
    <a class="btn" href="/pl/advisor">{UI_PL['advisor_not_sure']}</a>
    {faq_visible}
  </article>
  {faq_ld}'''
    write(f"pl/{p['slug']}.html", head(p["title"], p["meta_desc"], canonical, lang="pl",
          en_url=en_url, pl_url=canonical, nav=nav_html) + body + FOOT_HTML("pl"))

# ---------- Video hub pages (one per YouTube playlist) ----------
def video_hub_page(v):
    canonical = f"{SITE['domain']}/{v['slug']}"
    related = [a for a in ARTICLES if a["cat"] in v["related_cats"]][:6]
    rel_html = "\n".join(
        f'<a class="rel-card" href="/{a["slug"]}"><h4>{html.escape(a["title"])}</h4></a>'
        for a in related
    )
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/">Home</a> › <span>Videos</span></nav>
    <h1>{html.escape(v['title'])}</h1>
    <p class="lead">{html.escape(v['intro'])}</p>
    <div class="video-frame">
      <iframe src="https://www.youtube.com/embed/videoseries?list={v['playlist_id']}" title="{html.escape(v['title'])}"
        loading="lazy" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    </div>
    <div class="video-cta-row">
      <a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">🔔 Subscribe on YouTube</a>
      <a class="btn ghost" href="/advisor">🧭 Find my perfect Windows build</a>
    </div>
    {video_hub_links_block([o for o in VIDEO_HUBS if o["slug"] != v["slug"]], heading="🎥 Other video guide playlists")}
    <h2>Related reviews</h2>
    <div class="rel-grid">{rel_html}</div>
  </article>'''
    write(f"{v['slug']}.html", head(v["title"], v["meta_desc"], canonical, lang="en",
          en_url=canonical, pl_url=SITE['domain']+"/pl/") + body + FOOT)

# ---------- Home ----------
def home():
    cards = ""
    for a in ARTICLES:
        cards += f'''<a class="card" href="/{a['slug']}">
          <img class="card-thumb" src="https://i.ytimg.com/vi/{a['yt']}/hqdefault.jpg" alt="{html.escape(a['title'])}" loading="lazy" width="480" height="270">
          <span class="tag">{html.escape(a['cat'])}</span>
          <h3>{html.escape(a['title'])}</h3>
          <p>{html.escape(a['summary'][:100])}…</p></a>\n'''
    video_cards = ""
    for v in VIDEO_HUBS:
        video_cards += f'''<a class="card" href="/{v['slug']}">
          <img class="card-thumb" src="https://i.ytimg.com/vi/{v['first_video']}/hqdefault.jpg" alt="{html.escape(v['title'])}" loading="lazy" width="480" height="270">
          <h3>{html.escape(v['title'].split(' — ')[0])}</h3>
          <p>{html.escape(v['intro'][:100])}…</p></a>\n'''
    body = f'''
  <section class="hero">
    <h1>Best Debloated <span class="grad">Windows 11 & 10</span> Builds for Gaming</h1>
    <p class="lead">{SITE['description']}</p>
    <a class="btn" href="/advisor">🧭 Find my perfect Windows build</a>
    <a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">📺 Subscribe on YouTube</a>
  </section>
  <section class="guide">
    <h2>What is {SITE['name']}?</h2>
    <p>{SITE['name']} tests and reviews modified, debloated and gaming-optimized Windows builds —
       Ghost Spectre, KernelOS, ReviOS, AtlasOS, X-Lite and more — plus a handful of lightweight
       Linux alternatives. Every build here is installed and used hands-on before we publish a
       review, so you know what's actually removed, what still works, and whether the performance
       gains are real before you flash a USB drive.</p>
    <p>Not sure where to start? Answer three quick questions in the
       <a href="/advisor">PC Advisor</a> and we'll match you with the best build for your RAM and
       use case, or browse the full
       <a href="/best-lightweight-windows-11-builds">build comparison table</a> to see everything
       side by side.</p>
  </section>
  <section class="grid-wrap">
    <h2>🎥 Video guide playlists</h2>
    <div class="grid">{video_cards}</div>
  </section>
  <section class="grid-wrap">
    <p><a href="/best-lightweight-windows-11-builds">📊 See the full comparison: best lightweight & debloated Windows 11 builds for 2026 →</a></p>
    <h2>Reviews</h2>
    <div class="grid">{cards}</div>
  </section>'''
    write("index.html", head(f"{SITE['name']} — {SITE['tagline']}", SITE['description'],
                             SITE['domain'] + "/", lang="en", en_url=SITE['domain']+"/", pl_url=SITE['domain']+"/pl/") + body + FOOT)

def home_pl():
    cards = ""
    for a_pl in ARTICLES_PL:
        a = next(x for x in ARTICLES if x["slug"] == a_pl["slug"])
        cards += f'''<a class="card" href="/pl/{a_pl['slug']}">
          <img class="card-thumb" src="https://i.ytimg.com/vi/{a['yt']}/hqdefault.jpg" alt="{html.escape(a_pl['title'])}" loading="lazy" width="480" height="270">
          <span class="tag">{html.escape(a_pl['cat'])}</span>
          <h3>{html.escape(a_pl['title'])}</h3>
          <p>{html.escape(a_pl['summary'][:100])}…</p></a>\n'''
    nav_html = f'<a href="/pl/">{UI_PL["nav_home"]}</a> <a href="/pl/advisor">{UI_PL["nav_advisor"]}</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">{UI_PL["nav_youtube"]}</a>'
    body = f'''
  <section class="hero">
    <h1>{UI_PL['hero_title_pre']} <span class="grad">{UI_PL['hero_title_grad']}</span> {UI_PL['hero_title_post']}</h1>
    <p class="lead">{SITE_PL['description']}</p>
    <a class="btn" href="/pl/advisor">{UI_PL['hero_cta_advisor']}</a>
    <a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">{UI_PL['hero_cta_youtube']}</a>
  </section>
  <section class="grid-wrap">
    <p><a href="/pl/{BEST_BUILDS_PAGE_PL['slug']}">📊 Zobacz pełne porównanie: jak zoptymalizować Windows 11 pod gry (2026) →</a></p>
    <h2>{UI_PL['reviews_heading']}</h2>
    <div class="grid">{cards}</div>
  </section>'''
    write("pl/index.html", head(f"{SITE['name']} — {SITE_PL['tagline']}", SITE_PL['description'],
          SITE['domain'] + "/pl/", lang="pl", en_url=SITE['domain']+"/", pl_url=SITE['domain']+"/pl/", nav=nav_html)
          + body + FOOT_HTML("pl"))

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
          "your PC's specs and use case.", SITE['domain'] + "/advisor",
          lang="en", en_url=SITE['domain']+"/advisor", pl_url=SITE['domain']+"/pl/advisor") + body + FOOT)

def advisor_page_pl():
    catalog = [
        {"slug": a["slug"], "title": next(p for p in ARTICLES_PL if p["slug"] == a["slug"])["title"],
         "cat": next(p for p in ARTICLES_PL if p["slug"] == a["slug"])["cat"], "yt": a["yt"], **a["advisor"]}
        for a in ARTICLES if a.get("advisor")
    ]
    catalog_json = json.dumps(catalog)
    nav_html = f'<a href="/pl/">{UI_PL["nav_home"]}</a> <a href="/pl/advisor">{UI_PL["nav_advisor"]}</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">{UI_PL["nav_youtube"]}</a>'
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/pl/">{UI_PL['crumbs_home']}</a> › <span>{UI_PL['crumbs_advisor']}</span></nav>
    <h1>{UI_PL['advisor_title']}</h1>
    <p class="lead">{UI_PL['advisor_lead']}</p>

    <form id="advisorForm" class="advisor-form">
      <div class="advisor-q">
        <label>{UI_PL['advisor_q_ram']}</label>
        <select id="qRam">
          <option value="1.5">{UI_PL['advisor_ram_low']}</option>
          <option value="4" selected>{UI_PL['advisor_ram_4']}</option>
          <option value="8">{UI_PL['advisor_ram_8']}</option>
          <option value="16">{UI_PL['advisor_ram_16']}</option>
        </select>
      </div>
      <div class="advisor-q">
        <label>{UI_PL['advisor_q_purpose']}</label>
        <select id="qPurpose">
          <option value="gaming">{UI_PL['advisor_purpose_gaming']}</option>
          <option value="everyday" selected>{UI_PL['advisor_purpose_everyday']}</option>
          <option value="revive">{UI_PL['advisor_purpose_revive']}</option>
        </select>
      </div>
      <div class="advisor-q">
        <label>{UI_PL['advisor_q_os']}</label>
        <select id="qOs">
          <option value="any" selected>{UI_PL['advisor_os_any']}</option>
          <option value="11">{UI_PL['advisor_os_11']}</option>
          <option value="10">{UI_PL['advisor_os_10']}</option>
          <option value="linux">{UI_PL['advisor_os_linux']}</option>
        </select>
      </div>
      <button class="btn" type="button" onclick="runAdvisor()">{UI_PL['advisor_btn']}</button>
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
      box.innerHTML = '<p class="lead">{UI_PL['advisor_no_match']}</p>';
      return;
    }}
    var html = '<h2>{UI_PL['advisor_top_matches']}</h2><div class="grid">';
    top.forEach(function(a, i){{
      html += '<a class="card" href="/pl/' + a.slug + '">' +
        (i===0 ? '<span class="tag" style="background:var(--brand2)">{UI_PL['advisor_top_pick']}</span>' : '<span class="tag">' + a.cat + '</span>') +
        '<h3>' + a.title + '</h3>' +
        '<p>{UI_PL['advisor_needs']} ' + a.ram_min + 'GB+ RAM · Windows ' + a.os + '</p></a>';
    }});
    html += '</div>';
    box.innerHTML = html;
    box.scrollIntoView({{behavior:'smooth', block:'start'}});
  }}
  </script>'''
    write("pl/advisor.html", head("Doradca PC — który system Windows pasuje do Twojego PC? — " + SITE['name'],
          UI_PL['advisor_lead'], SITE['domain'] + "/pl/advisor",
          lang="pl", en_url=SITE['domain']+"/advisor", pl_url=SITE['domain']+"/pl/advisor", nav=nav_html)
          + body + FOOT_HTML("pl"))

# ---------- Legal ----------
def legal():
    footer_ctas = f'''<div class="video-cta-row">
      <a class="btn ghost" href="/advisor">🧭 Find my perfect Windows build</a>
      <a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">🔔 Subscribe on YouTube</a>
    </div>'''
    priv = f'''<article class="post"><h1>Privacy Policy</h1>
      <p>This site shows third-party advertising that may use cookies to display relevant ads. You
      can disable personalization cookies in your browser settings. We do not collect personally
      identifiable data; traffic is measured anonymously.</p>
      {footer_ctas}</article>'''
    disc = f'''<article class="post"><h1>Disclaimer</h1>
      <p>This site publishes reviews and install guides for modified/debloated operating system
      builds created by third-party communities. We do not host or distribute any activators,
      cracks or pirated license keys. Download links point to the creators' own official pages or
      file-hosting links shared publicly by them. You are responsible for holding a valid license
      for any Windows installation. Always back up your data before reinstalling an OS.</p>
      {footer_ctas}</article>'''
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
      <p>Questions about these terms? Email <a href="mailto:{SITE['contact_email']}">{SITE['contact_email']}</a>.</p>
      {footer_ctas}</article>'''
    write("terms.html", head("Terms of Service — " + SITE['name'],
          "Terms of use for this site, its reviews and the PC Advisor tool.",
          SITE['domain']+"/terms") + terms + FOOT)

    contact = f'''<article class="post simple-page"><h1>Contact</h1>
      <p class="lead">Questions about a build, the PC Advisor tool, or anything else? Reach out
         directly:</p>
      <a class="btn" href="mailto:{SITE['contact_email']}">✉ {SITE['contact_email']}</a>
      <p style="margin-top:22px">You can also drop a comment on any video on the
         <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube channel</a> — I read
         and reply there too.</p>
      {footer_ctas}</article>'''
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
      <a class="btn" href="/contact">✉ Contact me</a>
      {footer_ctas}</article>'''
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

def legal_pl():
    nav_html = f'<a href="/pl/">{UI_PL["nav_home"]}</a> <a href="/pl/advisor">{UI_PL["nav_advisor"]}</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">{UI_PL["nav_youtube"]}</a>'
    priv = f'''<article class="post"><h1>{UI_PL['privacy_title']}</h1>
      <p>{UI_PL['privacy_body']}</p></article>'''
    disc = f'''<article class="post"><h1>{UI_PL['disclaimer_title']}</h1>
      <p>{UI_PL['disclaimer_body']}</p></article>'''
    write("pl/privacy.html", head(f"{UI_PL['privacy_title']} — " + SITE['name'],
          UI_PL['privacy_body'][:155], SITE['domain']+"/pl/privacy", lang="pl",
          en_url=SITE['domain']+"/privacy", pl_url=SITE['domain']+"/pl/privacy", nav=nav_html) + priv + FOOT_HTML("pl"))
    write("pl/disclaimer.html", head(f"{UI_PL['disclaimer_title']} — " + SITE['name'],
          UI_PL['disclaimer_body'][:155], SITE['domain']+"/pl/disclaimer", lang="pl",
          en_url=SITE['domain']+"/disclaimer", pl_url=SITE['domain']+"/pl/disclaimer", nav=nav_html) + disc + FOOT_HTML("pl"))

    items_html = "\n".join(f"<li>{it}</li>" for it in UI_PL['terms_items'])
    terms = f'''<article class="post simple-page"><h1>{UI_PL['terms_title']}</h1>
      <p>{UI_PL['terms_intro']}</p>
      <ul>{items_html}</ul>
      <p>{UI_PL['terms_contact']} <a href="mailto:{SITE['contact_email']}">{SITE['contact_email']}</a>.</p></article>'''
    write("pl/terms.html", head(f"{UI_PL['terms_title']} — " + SITE['name'],
          UI_PL['terms_intro'], SITE['domain']+"/pl/terms", lang="pl",
          en_url=SITE['domain']+"/terms", pl_url=SITE['domain']+"/pl/terms", nav=nav_html) + terms + FOOT_HTML("pl"))

    contact = f'''<article class="post simple-page"><h1>{UI_PL['contact_title']}</h1>
      <p class="lead">{UI_PL['contact_lead']}</p>
      <a class="btn" href="mailto:{SITE['contact_email']}">✉ {SITE['contact_email']}</a>
      <p style="margin-top:22px">{UI_PL['contact_alt']}
         <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a>
         {UI_PL['contact_alt_suffix']}</p></article>'''
    write("pl/contact.html", head(f"{UI_PL['contact_title']} — " + SITE['name'],
          UI_PL['contact_lead'][:155], SITE['domain']+"/pl/contact", lang="pl",
          en_url=SITE['domain']+"/contact", pl_url=SITE['domain']+"/pl/contact", nav=nav_html) + contact + FOOT_HTML("pl"))

    about = f'''<article class="post simple-page"><h1>{UI_PL['about_title']}</h1>
      <p class="lead">{UI_PL['about_lead']}</p>
      <p>{UI_PL['about_p1']}</p>
      <p>{UI_PL['about_p2']}</p>
      <p>{UI_PL['about_p3']} <a href="/pl/advisor">{UI_PL['nav_advisor']}</a>
         {UI_PL['about_p3_suffix']}</p>
      <a class="btn" href="/pl/contact">{UI_PL['about_contact_btn']}</a></article>'''
    write("pl/about.html", head(f"{UI_PL['about_title']} — " + SITE['name'],
          UI_PL['about_lead'][:155], SITE['domain']+"/pl/about", lang="pl",
          en_url=SITE['domain']+"/about", pl_url=SITE['domain']+"/pl/about", nav=nav_html) + about + FOOT_HTML("pl"))

def not_found_pl():
    nav_html = f'<a href="/pl/">{UI_PL["nav_home"]}</a> <a href="/pl/advisor">{UI_PL["nav_advisor"]}</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">{UI_PL["nav_youtube"]}</a>'
    body = f'''<article class="post simple-page" style="text-align:center">
      <h1>{UI_PL['notfound_title']}</h1>
      <p class="lead">{UI_PL['notfound_lead']}</p>
      <a class="btn" href="/pl/advisor">{UI_PL['notfound_btn']}</a>
      <a class="btn ghost" href="/pl/">{UI_PL['notfound_home']}</a></article>'''
    write("pl/404.html", head(f"{UI_PL['notfound_title']} — " + SITE['name'],
          UI_PL['notfound_lead'][:155], SITE['domain']+"/pl/404", lang="pl",
          en_url=SITE['domain']+"/404", pl_url=SITE['domain']+"/pl/404", nav=nav_html) + body + FOOT_HTML("pl"))

def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/privacy", SITE['domain'] + "/disclaimer",
            SITE['domain'] + "/advisor", SITE['domain'] + "/terms", SITE['domain'] + "/contact",
            SITE['domain'] + "/about", SITE['domain'] + "/" + BEST_BUILDS_PAGE['slug']]
    urls += [f"{SITE['domain']}/{v['slug']}" for v in VIDEO_HUBS]
    urls += [f"{SITE['domain']}/{a['slug']}" for a in ARTICLES]
    urls += [SITE['domain'] + "/pl/", SITE['domain'] + "/pl/privacy", SITE['domain'] + "/pl/disclaimer",
             SITE['domain'] + "/pl/advisor", SITE['domain'] + "/pl/terms", SITE['domain'] + "/pl/contact",
             SITE['domain'] + "/pl/about", SITE['domain'] + "/pl/" + BEST_BUILDS_PAGE_PL['slug']]
    urls += [f"{SITE['domain']}/pl/{a['slug']}" for a in ARTICLES_PL]
    items = "\n".join(f"  <url><loc>{u}</loc><changefreq>weekly</changefreq></url>" for u in urls)
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?>\n'
          f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{items}\n</urlset>')
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE['domain']}/sitemap.xml\n")

def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    os.makedirs(os.path.join(DIST, "pl", "get"))
    shutil.copy(os.path.join(HERE, "style.css"), os.path.join(DIST, "style.css"))
    shutil.copy(os.path.join(HERE, "sw.js"), os.path.join(DIST, "sw.js"))
    verify_file = os.path.join(HERE, "google1fa65511afa56808.html")
    if os.path.exists(verify_file):
        shutil.copy(verify_file, os.path.join(DIST, "google1fa65511afa56808.html"))
    home(); legal(); advisor_page(); best_builds_page()
    for v in VIDEO_HUBS:
        video_hub_page(v)
    for a in ARTICLES:
        article_page(a)
        download_page(a)
    not_found_page()

    home_pl(); legal_pl(); advisor_page_pl(); best_builds_page_pl()
    for a_pl in ARTICLES_PL:
        a = next(x for x in ARTICLES if x["slug"] == a_pl["slug"])
        article_page_pl(a_pl)
        download_page(a, lang="pl", a_pl=a_pl)
    not_found_pl()

    seo_files()
    print(f"OK -> {len(ARTICLES)} reviews + home + legal + sitemap + PL localization in {DIST}")

if __name__ == "__main__":
    main()
