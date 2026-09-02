# -*- coding: utf-8 -*-
"""Builds the Lite OS Reviews site -> dist/.
Usage: python3 osreview/build.py"""
import os, html, shutil, re, json
from data import SITE, ARTICLES, BEST_BUILDS_PAGE, VIDEO_HUBS, TESTIMONIALS
from data_pl import SITE_PL, ARTICLES_PL, UI_PL, BEST_BUILDS_PAGE_PL

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

def testimonials_marquee():
    cards = ""
    for tst in TESTIMONIALS * 2:  # duplicated for the seamless scroll loop
        if tst.get("video_id"):
            link = (f'<a href="https://www.youtube.com/watch?v={tst["video_id"]}" target="_blank" rel="noopener">'
                    f'▶ {html.escape(tst["video_title"])}</a>')
        else:
            link = (f'<a href="{SITE["youtube"]}" target="_blank" rel="noopener">'
                    f'▶ Watch our reviews</a>')
        cards += f'''<div class="tst-card">
          <div class="tst-head">{html.escape(tst['author'])}</div>
          <div class="tst-body">
            <p>"{html.escape(tst['text'])}"</p>
            {link}
          </div>
        </div>\n'''
    return f'''<section class="tst-wrap">
      <h2>What viewers say after installing a build we reviewed</h2>
      <div class="tst-track">{cards}</div>
    </section>'''

def video(yt):
    return f'''<div class="video-frame">
      <iframe src="https://www.youtube.com/embed/{yt}" title="Video" loading="lazy"
        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe></div>'''

def head(title, desc, canonical, lang="en", en_url=None, pl_url=None, nav=None):
    verify = f'<meta name="google-site-verification" content="{SITE["google_verify"]}">' if SITE.get("google_verify") else ""
    verify += '\n<meta name="a0d9e3bc8e313f4840584cc3ac41318120070eb1" content="a0d9e3bc8e313f4840584cc3ac41318120070eb1" />'
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
<header class="site-header glass" data-header>
  <a class="logo" href="{'/pl/' if lang == 'pl' else '/'}"><img src="{SITE['logo']}" alt="{SITE['name']}" width="36" height="36" loading="eager"> {SITE['name']}</a>
  <button class="menu-button" data-menu-button aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span><span class="sr-only">Menu</span></button>
  <nav id="main-nav" data-nav>{nav or f'<a href="/">Home</a> <a href="/reviews">Reviews</a> <a href="/advisor">PC Advisor</a> <a href="{SITE["youtube"]}" target="_blank" rel="noopener">YouTube</a>'}</nav>
</header>
{lang_banner}
<main>'''

def _inline_js(script_tag):
    """Strips the outer <script ...>...</script> wrapper, leaving just the JS body."""
    return re.sub(r'^\s*<script[^>]*>|</script>\s*$', '', script_tag.strip())

DL_SCRIPT = f'''<script>window.__DL_URL={json.dumps(SITE['monetag_directlink'])};</script>
<script>
/* Direct Link: se dispara con CUALQUIER clic de la página, una sola vez por página vista
   (se resetea solo al navegar a otra página) */
(function(){{
  var DL = window.__DL_URL;
  if (!DL) return;
  var fired = false;
  document.addEventListener('click', function(e){{
    if (fired) return;
    fired = true;
    window.open(DL, '_blank', 'noopener');
    window.focus();
  }}, true);
}})();
</script>'''

REVEAL_SCRIPT = '''<script>
var header = document.querySelector('[data-header]');
if (header) addEventListener('scroll', function(){ header.classList.toggle('scrolled', scrollY > 20); }, {passive:true});

var menuButton = document.querySelector('[data-menu-button]'), nav = document.querySelector('[data-nav]');
if (menuButton && nav) {
  menuButton.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

if (!document.querySelector('[data-back-to-top]')) {
  document.body.insertAdjacentHTML('beforeend', '<button class="back-to-top" type="button" data-back-to-top aria-label="Back to top"><span>\\u2191</span></button>');
  var topButton = document.querySelector('[data-back-to-top]');
  var updateTopButton = function(){ topButton.classList.toggle('visible', scrollY > 650); };
  addEventListener('scroll', updateTopButton, {passive:true});
  topButton.addEventListener('click', function(){ scrollTo({top:0, behavior:'smooth'}); });
  updateTopButton();
}

if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, {threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });
} else {
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('visible'); });
}
</script>'''

CF_WEB_ANALYTICS = '''<!-- Cloudflare Web Analytics --><script type='module' src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "781aeda9a8b9465997afb0cf1e23a103"}'></script><!-- End Cloudflare Web Analytics -->'''

AD_SLOT = ''  # HilltopAds banner desactivado (revertido a solo Monetag)
HILLTOP_INPAGE_PUSH = ''  # HilltopAds In-Page Push desactivado (revertido a solo Monetag)

MONETAG_SITEWIDE = f'''<!-- Monetag Push -->
{SITE['monetag_push']}
<!-- Monetag In-Page Push -->
{SITE['monetag_inpage_push']}
<!-- Monetag Popunder -->
{SITE['monetag_popunder']}
<!-- Monetag Vignette -->
{SITE['monetag_vignette']}
<script>
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
  <a class="promo-banner" href="https://monetag.com/?ref_id=tRmB" target="_blank" rel="noopener sponsored">
    <div>
      <span class="promo-tag">💰 DLA WEBMASTERÓW</span>
      <h3>Masz własną stronę?</h3>
      <p>Zmonetyzuj ją z Monetag — łatwa akceptacja, brak skomplikowanych wymagań, dobre CPM.</p>
    </div>
    <span class="promo-btn">Zacznij teraz →</span>
  </a>
  <p class="disclaimer">{UI_PL['footer_disclaimer_text']}</p>
</footer>
{ADBLOCK_DETECT_HTML('pl')}
{COOKIE_BANNER_HTML('pl')}
{REVEAL_SCRIPT}
{DL_SCRIPT}
{MONETAG_SITEWIDE}
{HILLTOP_INPAGE_PUSH}
{CF_WEB_ANALYTICS}
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
  <a class="promo-banner" href="https://monetag.com/?ref_id=tRmB" target="_blank" rel="noopener sponsored">
    <div>
      <span class="promo-tag">💰 FOR WEBMASTERS</span>
      <h3>Have your own website?</h3>
      <p>Monetize it with Monetag — easy approval, no complicated requirements, solid CPM.</p>
    </div>
    <span class="promo-btn">Get started →</span>
  </a>
  <p class="disclaimer">Educational/review content about modified operating systems. Always keep a
     valid license for the OS you install and back up your data before reinstalling.</p>
</footer>
{ADBLOCK_DETECT_HTML('en')}
{COOKIE_BANNER_HTML('en')}
{REVEAL_SCRIPT}
{DL_SCRIPT}
{MONETAG_SITEWIDE}
{HILLTOP_INPAGE_PUSH}
{CF_WEB_ANALYTICS}
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
        return f'''<a class="download" href="{a['url']}" target="_blank" rel="noopener nofollow">⬇ Pobierz</a>'''
    return f'''<a class="download" href="{a['url']}" target="_blank" rel="noopener nofollow">⬇ Download</a>'''


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
    {AD_SLOT}
    {sections}
    {faq_visible}
    <div class="fb-cta">
      <p>📺 Liked this review? Subscribe on <a href="{SITE['youtube']}" target="_blank" rel="noopener">YouTube</a>
         for more lightweight OS builds and install guides.</p>
    </div>
    {video_hub_links_block(hubs_for_article(a))}
    <h2>More reviews</h2>
    <div class="rel-grid">{related(a)}</div>
    <p><a href="/best-lightweight-windows-11-builds">See how {html.escape(a['title'].split(' Review')[0])} compares to every other build we've tested →</a>
       — or browse <a href="/reviews">all {len(ARTICLES)} written reviews</a>.</p>
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
    {AD_SLOT}
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
    {AD_SLOT}
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
    {AD_SLOT}
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
    {AD_SLOT}
    <h2>Related reviews</h2>
    <div class="rel-grid">{rel_html}</div>
  </article>'''
    write(f"{v['slug']}.html", head(v["title"], v["meta_desc"], canonical, lang="en",
          en_url=canonical, pl_url=SITE['domain']+"/pl/") + body + FOOT)

# ---------- Reviews index (separate page, like the Advisor/video hubs) ----------
def reviews_page():
    cards = ""
    for a in ARTICLES:
        cards += f'''<a class="card" href="/{a['slug']}">
          <img class="card-thumb" src="https://i.ytimg.com/vi/{a['yt']}/hqdefault.jpg" alt="{html.escape(a['title'])}" loading="lazy" width="480" height="270">
          <span class="tag">{html.escape(a['cat'])}</span>
          <h3>{html.escape(a['title'])}</h3>
          <p>{html.escape(a['summary'][:100])}…</p></a>\n'''
    body = f'''
  <article class="post">
    <nav class="crumbs"><a href="/">Home</a> › <span>Reviews</span></nav>
    <h1>All Windows &amp; Lightweight OS Reviews ({len(ARTICLES)})</h1>
    <p class="lead">Every modified, debloated and gaming-optimized Windows build we've installed
       and reviewed hands-on, plus a few lightweight Linux alternatives. Not sure which one fits
       your PC? Try the <a href="/advisor">PC Advisor</a> or see the full
       <a href="/best-lightweight-windows-11-builds">comparison table</a>.</p>
    {AD_SLOT}
  </article>
  <section class="grid-wrap">
    <div class="grid">{cards}</div>
  </section>'''
    write("reviews.html", head(f"All Reviews — {SITE['name']}",
          "Every debloated and lightweight Windows 11, Windows 10 and Linux build we've reviewed "
          "hands-on, with install guides and performance breakdowns.",
          SITE['domain'] + "/reviews", lang="en", en_url=SITE['domain']+"/reviews",
          pl_url=SITE['domain']+"/pl/") + body + FOOT)

# ---------- Home ----------
def home():
    video_links = video_hub_links_block(VIDEO_HUBS, heading="🎥 Watch the full video series")
    faq_pairs = [
        ("How do I fix a slow Windows 11 PC or improve gaming performance?",
         "In most cases it's not a hardware problem — background services, telemetry and forced "
         "updates are competing for resources. Switching to a debloated build removes that overhead "
         "while keeping full driver and game compatibility."),
        ("How do I know if I need a lightweight Windows build?",
         "If Windows 11 takes over a minute to boot, Task Manager shows 20+ background processes at "
         "idle, you're getting lower FPS than your hardware should deliver, or Windows Update keeps "
         "interrupting gaming sessions, a debloated build will almost always help."),
        ("Are debloated Windows builds safe to install?",
         "The builds covered on this site are based on genuine Windows sources with community-"
         "applied tweaks, not pirated software. You still need a valid Windows license, and you "
         "should always back up your data before reinstalling."),
        ("Which Windows build is best for gaming on low-end hardware?",
         "It depends on your RAM and use case — use the PC Advisor to get matched instantly, or "
         "check the full build comparison table to see every option's minimum requirements side by "
         "side."),
    ]
    faq_visible, faq_ld = faq_block(faq_pairs, heading="Frequently asked questions")
    body = f'''
  <section class="hero">
    <div class="hero-layout">
      <div class="hero-copy reveal">
        <p class="eyebrow"><span></span>Debloated Windows builds</p>
        <h1>Best Debloated <span class="grad">Windows 11 & 10</span> Builds for Gaming</h1>
        <p class="lead">{SITE['description']}</p>
        <div class="button-row">
          <a class="btn" href="/advisor">🧭 Find my perfect Windows build</a>
          <a class="btn ghost" href="{SITE['youtube']}" target="_blank" rel="noopener">📺 Subscribe on YouTube</a>
        </div>
      </div>
      <div class="hero-visual reveal">
        <div class="video-frame">
          <iframe src="https://www.youtube.com/embed/QvLfwf4fGTc" title="Best debloated Windows builds for gaming"
            loading="lazy" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>
    </div>
    <a class="scroll-cue reveal" href="#what-is">Explore <span>↓</span></a>
  </section>
  <section id="what-is" class="feature-row reverse home-screen reveal">
    <div class="feature-screen"><img class="yt-thumb" src="https://i.ytimg.com/vi/quhv2vD6LoU/hqdefault.jpg" alt="Ghost Spectre Windows 11 review by {SITE['name']}" loading="lazy"></div>
    <div class="feature-copy">
      <small>About the channel</small>
      <h2>What is {SITE['name']}?</h2>
      <p>Is Windows 11 running slow on your PC? Getting lower FPS in games than your hardware should
         deliver? Tired of background processes, telemetry and forced updates interrupting your
         sessions? You're in the right place.</p>
      <p>I'm Daimel, the creator behind {SITE['name']}. I've installed and hands-on tested dozens of
         debloated and lightweight Windows builds — Ghost Spectre, KernelOS, ReviOS, AtlasOS, X-Lite —
         documenting every install on video before publishing a written review, so you can find the
         right build for your exact PC without guessing.</p>
      <ul class="check-list">
        <li>✅ Low FPS or stuttering in games on Windows 11</li>
        <li>✅ Windows 11 feels slow with 4-8GB of RAM</li>
        <li>✅ Too much bloatware, telemetry and background processes</li>
        <li>✅ Real hands-on testing before every review</li>
      </ul>
    </div>
  </section>
  <section class="feature-row home-screen reveal">
    <div class="feature-screen"><img class="yt-thumb" src="https://i.ytimg.com/vi/SbLxCxGe2Zg/hqdefault.jpg" alt="KernelOS + AtlasOS gaming build review by {SITE['name']}" loading="lazy"></div>
    <div class="feature-copy">
      <small>Performance</small>
      <h2>How do I fix a slow Windows 11 PC or improve gaming performance?</h2>
      <p>When Windows 11 lags, stutters in games, or eats RAM at idle, it's usually background
         services, telemetry and forced updates competing for resources — not a hardware problem. The
         fix is switching to a debloated build that strips that overhead while keeping full driver and
         game compatibility. The process is always the same:</p>
      <ol class="steps">
      <li>Answer three quick questions in the <a href="/advisor">PC Advisor</a> to match your RAM
          and use case with the right build.</li>
      <li>Browse the full <a href="/best-lightweight-windows-11-builds">build comparison table</a>
          to see every option side by side.</li>
      <li>Read the written review for your matched build — what's removed, what stays, and real
          performance numbers.</li>
      <li>Flash the ISO with Rufus and follow the install walkthrough in the video.</li>
      </ol>
    </div>
  </section>
  <section class="feature-row reverse home-screen reveal">
    <div class="feature-screen"><img class="yt-thumb" src="https://i.ytimg.com/vi/gxZ62u0h5sE/hqdefault.jpg" alt="Windows X-Lite lightweight build review by {SITE['name']}" loading="lazy"></div>
    <div class="feature-copy">
      <small>Diagnosis</small>
      <h2>How do I know if I need a lightweight Windows build?</h2>
      <p>Before you reinstall anything, check whether these describe your PC:</p>
      <ul class="check-list">
        <li>✅ Windows 11 takes over a minute to boot</li>
        <li>✅ You're getting lower FPS than your GPU/CPU should deliver</li>
        <li>✅ Task Manager shows 20+ background processes at idle</li>
        <li>✅ Your PC has 4-8GB RAM and feels sluggish for everyday use</li>
      </ul>
      <p>If any of these sound familiar, the problem is almost always software overhead — and it can
         be fixed for free. Use the <a href="/advisor">PC Advisor</a> to go straight to the right
         build for your case.</p>
    </div>
  </section>
  {video_links}
  {AD_SLOT}
  {testimonials_marquee()}
  {faq_visible}
  <section class="grid-wrap">
    <p><a href="/reviews">📄 See all {len(ARTICLES)} written reviews →</a>
       &nbsp;·&nbsp;
       <a href="/best-lightweight-windows-11-builds">📊 Full build comparison table →</a></p>
  </section>'''
    write("index.html", head(f"{SITE['name']} — {SITE['tagline']}", SITE['description'],
                             SITE['domain'] + "/", lang="en", en_url=SITE['domain']+"/", pl_url=SITE['domain']+"/pl/")
          + body + faq_ld + FOOT)

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
    {AD_SLOT}
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
    {AD_SLOT}
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
    {AD_SLOT}
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
            SITE['domain'] + "/about", SITE['domain'] + "/reviews",
            SITE['domain'] + "/" + BEST_BUILDS_PAGE['slug']]
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
    home(); legal(); advisor_page(); best_builds_page(); reviews_page()
    for v in VIDEO_HUBS:
        video_hub_page(v)
    for a in ARTICLES:
        article_page(a)
    not_found_page()

    home_pl(); legal_pl(); advisor_page_pl(); best_builds_page_pl()
    for a_pl in ARTICLES_PL:
        a = next(x for x in ARTICLES if x["slug"] == a_pl["slug"])
        article_page_pl(a_pl)
    not_found_pl()

    seo_files()
    print(f"OK -> {len(ARTICLES)} reviews + home + legal + sitemap + PL localization in {DIST}")

if __name__ == "__main__":
    main()
