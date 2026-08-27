# -*- coding: utf-8 -*-
"""Builds FreelanceMortgageCalc -> dist/.
Usage: python3 build.py"""
import os, html, shutil, json
from data import SITE, TOOLS, FAQ_GENERIC

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, "dist")

HILLTOP_INPAGE_PUSH = ''  # HilltopAds desactivado (pendiente: pasar zonas de Monetag para este sitio)

def write(path, content):
    full = os.path.join(DIST, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)

def faq_schema(pairs):
    return f'''<script type="application/ld+json">{json.dumps({
        "@context": "https://schema.org", "@type": "FAQPage",
        "mainEntity": [{"@type": "Question", "name": q,
                         "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in pairs]
    }, ensure_ascii=False)}</script>'''

def webapp_schema(name, desc):
    return f'''<script type="application/ld+json">{json.dumps({
        "@context": "https://schema.org", "@type": "WebApplication",
        "name": name, "description": desc, "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}
    }, ensure_ascii=False)}</script>'''

NAV_LINKS = "".join(f'<a href="/{t["slug"]}">{html.escape(t["nav"])}</a>' for t in TOOLS)

def head(title, desc, canonical):
    return f'''<!DOCTYPE html>
<html lang="en">
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
<meta name="66f5af64e590b74125198ccb430e341a30d6cc3a" content="66f5af64e590b74125198ccb430e341a30d6cc3a" />
<meta name="google-site-verification" content="4t1k_fsPm-BsPZ6JQFLArsFhmg_LqMMaYAX1iqdFg4E" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/favicon.svg">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="site-header">
  <a class="logo" href="/">Freelance<span>Mortgage</span>Calc</a>
  <button class="menu-button" data-menu-button aria-expanded="false" aria-controls="main-nav"><span></span><span></span><span></span></button>
  <nav id="main-nav" data-nav><a href="/">Home</a>{NAV_LINKS}</nav>
</header>
<main>'''

FOOT_SCRIPT = '''<script>
var menuButton = document.querySelector('[data-menu-button]'), nav = document.querySelector('[data-nav]');
if (menuButton && nav) {
  menuButton.addEventListener('click', function(){
    nav.classList.toggle('open');
  });
}
</script>'''

def foot():
    cols_tools = "".join(f'<a href="/{t["slug"]}">{html.escape(t["nav"])}</a>' for t in TOOLS)
    return f'''</main>
<footer class="site-footer">
  <p>{SITE['name']} — {SITE['tagline']}.</p>
  <div class="footer-cols">
    <div>
      <h4>Calculators</h4>
      {cols_tools}
    </div>
    <div>
      <h4>Legal</h4>
      <a href="/privacy">Privacy Policy</a>
      <a href="/terms">Terms of Use</a>
    </div>
  </div>
  <p class="disclaimer">Educational estimates only, not financial or lending advice. Always confirm
     numbers with a licensed mortgage professional before making a decision.</p>
</footer>
{FOOT_SCRIPT}
{HILLTOP_INPAGE_PUSH}
</body></html>'''

# ---------- shared calculator UI pieces ----------
def field(label, id_, type_="number", placeholder="", hint="", step=None, value=None):
    step_attr = f' step="{step}"' if step else ""
    value_attr = f' value="{value}"' if value is not None else ""
    return f'''<div class="field">
      <label for="{id_}">{label}</label>
      <input type="{type_}" id="{id_}" placeholder="{placeholder}"{step_attr}{value_attr}>
      {f'<span class="hint">{hint}</span>' if hint else ''}
    </div>'''

AD_SLOT = ''  # HilltopAds banner desactivado (pendiente: pasar zonas de Monetag para este sitio)

DISCLAIMER = '''<div class="disclaimer-box">⚠️ This is an educational estimate, not a loan offer or
  financial advice. Actual qualification depends on your full financial profile, credit score, assets
  and the specific lender's guidelines. Talk to a licensed mortgage professional before deciding.</div>'''

MORTGAGE_JS_HELPERS = '''
function monthlyPayment(principal, annualRatePct, years){
  var r = (annualRatePct/100)/12, n = years*12;
  if (r === 0) return principal/n;
  return principal * r / (1 - Math.pow(1+r, -n));
}
function maxLoanFromPayment(maxMonthlyPayment, annualRatePct, years){
  var r = (annualRatePct/100)/12, n = years*12;
  if (maxMonthlyPayment <= 0) return 0;
  if (r === 0) return maxMonthlyPayment*n;
  return maxMonthlyPayment * (1 - Math.pow(1+r, -n)) / r;
}
function fmt(n){ return '$' + Math.round(n).toLocaleString('en-US'); }
'''

def faq_block(pairs):
    items = "\n".join(f'<details><summary>{html.escape(q)}</summary><p>{a}</p></details>' for q, a in pairs)
    return f'''<section class="faq">
      <h2>Frequently asked questions</h2>
      {items}
    </section>'''

def more_tools_block(current_slug):
    others = [t for t in TOOLS if t["slug"] != current_slug][:4]
    cards = "\n".join(
        f'''<a class="card" href="/{t['slug']}">
          <h3>{html.escape(t['nav'])}</h3>
          <p>{html.escape(t['intro'][:80])}…</p>
          <span class="go">Open tool →</span></a>'''
        for t in others
    )
    return f'''<section>
      <h2>More free tools</h2>
      <div class="grid">{cards}</div>
    </section>'''

# ---------- calculator 1: 1099 income ----------
def page_1099(t):
    canonical = f"{SITE['domain']}/{t['slug']}"
    body = f'''
  <article>
    <section class="hero">
      <p class="crumbs"><a href="/">Home</a> › {html.escape(t['nav'])}</p>
      <h1>{html.escape(t['h1'])}</h1>
      <p class="lead">{t['intro']}</p>
    </section>
    <div class="tool-card">
      <div class="tool-grid">
        {field("Year 1 net profit (Schedule C, line 31)", "y1", placeholder="60000")}
        {field("Year 2 net profit (Schedule C, line 31)", "y2", placeholder="72000")}
        {field("Other monthly debt payments", "debts", placeholder="400", hint="Car loans, credit cards, student loans, etc.")}
        {field("Interest rate (%)", "rate", placeholder="6.75", step="0.01")}
        {field("Loan term (years)", "term", placeholder="30")}
        {field("Max debt-to-income ratio (%)", "dti", placeholder="43", hint="43% is a common conservative lender max.")}
      </div>
      <button class="btn-calc" id="calcBtn" type="button">Calculate qualifying income</button>
      <div class="result-box" id="result">
        <p class="hint">Estimated qualifying monthly income</p>
        <div class="big" id="rIncome">$0</div>
        <div class="row"><span>Max monthly mortgage payment</span><b id="rPayment">$0</b></div>
        <div class="row"><span>Estimated max loan amount</span><b id="rLoan">$0</b></div>
      </div>
      <p class="privacy-badge">🔒 100% private — everything is calculated in your browser, nothing is sent to a server.</p>
    </div>
    {DISCLAIMER}
    {AD_SLOT}
    <section class="guide">
      <h2>Why lenders calculate 1099 income differently</h2>
      <p>{t['why']}</p>
      <ul class="check-list">
        <li>✅ Two years of net profit (not gross revenue) are averaged</li>
        <li>✅ The average is divided by 24 to get a monthly qualifying figure</li>
        <li>✅ Standard debt-to-income limits then apply, same as any borrower</li>
        <li>✅ A declining trend between year 1 and year 2 can trigger extra scrutiny</li>
      </ul>
    </section>
    {faq_block(FAQ_GENERIC + [
        ("Do lenders use gross revenue or net profit?",
         "Net profit — what's left after business expenses and deductions on Schedule C. This is usually much lower than gross revenue, which is why many self-employed borrowers qualify for less than they expect."),
        ("What if my income went up a lot in year 2?",
         "Most lenders still average both years rather than using only the most recent one, though some allow an exception with strong documentation of the trend. Ask your lender directly."),
    ])}
    {more_tools_block(t['slug'])}
  </article>
  {webapp_schema(t['title'], t['intro'])}
  {faq_schema(FAQ_GENERIC)}
  <script>
  {MORTGAGE_JS_HELPERS}
  document.getElementById('calcBtn').addEventListener('click', function(){{
    var y1 = parseFloat(document.getElementById('y1').value) || 0;
    var y2 = parseFloat(document.getElementById('y2').value) || 0;
    var debts = parseFloat(document.getElementById('debts').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 6.75;
    var term = parseFloat(document.getElementById('term').value) || 30;
    var dti = parseFloat(document.getElementById('dti').value) || 43;
    var monthlyIncome = (y1 + y2) / 24;
    var maxMonthlyDebt = monthlyIncome * (dti/100);
    var maxPayment = Math.max(0, maxMonthlyDebt - debts);
    var maxLoan = maxLoanFromPayment(maxPayment, rate, term);
    document.getElementById('rIncome').textContent = fmt(monthlyIncome);
    document.getElementById('rPayment').textContent = fmt(maxPayment);
    document.getElementById('rLoan').textContent = fmt(maxLoan);
    document.getElementById('result').classList.add('visible');
  }});
  </script>'''
    write(f"{t['slug']}.html", head(t['title'], t['intro'][:155], canonical) + body + foot())

# ---------- calculator 2: bank statement loan ----------
def page_bankstatement(t):
    canonical = f"{SITE['domain']}/{t['slug']}"
    body = f'''
  <article>
    <section class="hero">
      <p class="crumbs"><a href="/">Home</a> › {html.escape(t['nav'])}</p>
      <h1>{html.escape(t['h1'])}</h1>
      <p class="lead">{t['intro']}</p>
    </section>
    <div class="tool-card">
      <div class="tool-grid">
        {field("Average monthly deposits", "deposits", placeholder="9000")}
        {field("Expense factor (%)", "expense", placeholder="50", hint="Portion of deposits treated as business expense. 50% is a common default; some lenders use 25–65% depending on industry.")}
        {field("Other monthly debt payments", "debts", placeholder="500")}
        {field("Interest rate (%)", "rate", placeholder="7.25", step="0.01")}
        {field("Loan term (years)", "term", placeholder="30")}
        {field("Max debt-to-income ratio (%)", "dti", placeholder="45")}
      </div>
      <button class="btn-calc" id="calcBtn" type="button">Calculate qualifying income</button>
      <div class="result-box" id="result">
        <p class="hint">Estimated qualifying monthly income</p>
        <div class="big" id="rIncome">$0</div>
        <div class="row"><span>Max monthly mortgage payment</span><b id="rPayment">$0</b></div>
        <div class="row"><span>Estimated max loan amount</span><b id="rLoan">$0</b></div>
      </div>
      <p class="privacy-badge">🔒 100% private — everything is calculated in your browser, nothing is sent to a server.</p>
    </div>
    {DISCLAIMER}
    {AD_SLOT}
    <section class="guide">
      <h2>How bank statement (Non-QM) loans work</h2>
      <p>{t['why']}</p>
      <ul class="check-list">
        <li>✅ No tax returns required — 12 or 24 months of bank statements instead</li>
        <li>✅ An expense factor discounts deposits to estimate real income</li>
        <li>✅ Rates are usually higher than a conventional loan (more risk for the lender)</li>
        <li>✅ Popular with business owners whose tax returns show heavy deductions</li>
      </ul>
    </section>
    {faq_block(FAQ_GENERIC + [
        ("What expense factor should I use?",
         "50% is a common default many lenders start from, but it varies by industry and lender — service businesses with low overhead sometimes get a lower factor (meaning higher qualifying income), while businesses with heavy expenses get a higher one."),
        ("12 months or 24 months of statements?",
         "Both exist. 24-month programs usually require a slightly lower rate than 12-month programs since they show more history — try both in this calculator to compare."),
    ])}
    {more_tools_block(t['slug'])}
  </article>
  {webapp_schema(t['title'], t['intro'])}
  {faq_schema(FAQ_GENERIC)}
  <script>
  {MORTGAGE_JS_HELPERS}
  document.getElementById('calcBtn').addEventListener('click', function(){{
    var deposits = parseFloat(document.getElementById('deposits').value) || 0;
    var expense = parseFloat(document.getElementById('expense').value) || 50;
    var debts = parseFloat(document.getElementById('debts').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 7.25;
    var term = parseFloat(document.getElementById('term').value) || 30;
    var dti = parseFloat(document.getElementById('dti').value) || 45;
    var monthlyIncome = deposits * (1 - expense/100);
    var maxMonthlyDebt = monthlyIncome * (dti/100);
    var maxPayment = Math.max(0, maxMonthlyDebt - debts);
    var maxLoan = maxLoanFromPayment(maxPayment, rate, term);
    document.getElementById('rIncome').textContent = fmt(monthlyIncome);
    document.getElementById('rPayment').textContent = fmt(maxPayment);
    document.getElementById('rLoan').textContent = fmt(maxLoan);
    document.getElementById('result').classList.add('visible');
  }});
  </script>'''
    write(f"{t['slug']}.html", head(t['title'], t['intro'][:155], canonical) + body + foot())

# ---------- calculator 3: freelance affordability ----------
def page_freelance(t):
    canonical = f"{SITE['domain']}/{t['slug']}"
    body = f'''
  <article>
    <section class="hero">
      <p class="crumbs"><a href="/">Home</a> › {html.escape(t['nav'])}</p>
      <h1>{html.escape(t['h1'])}</h1>
      <p class="lead">{t['intro']}</p>
    </section>
    <div class="tool-card">
      <div class="tool-grid">
        {field("Day rate", "dayrate", placeholder="450")}
        {field("Billable days per month", "days", placeholder="16", hint="Average across the year, including slower months.")}
        {field("Other monthly debt payments", "debts", placeholder="300")}
        {field("Interest rate (%)", "rate", placeholder="6.9", step="0.01")}
        {field("Loan term (years)", "term", placeholder="30")}
        {field("Max debt-to-income ratio (%)", "dti", placeholder="43")}
      </div>
      <button class="btn-calc" id="calcBtn" type="button">Calculate affordability</button>
      <div class="result-box" id="result">
        <p class="hint">Estimated annualized income</p>
        <div class="big" id="rIncome">$0</div>
        <div class="row"><span>Max monthly mortgage payment</span><b id="rPayment">$0</b></div>
        <div class="row"><span>Estimated max loan amount</span><b id="rLoan">$0</b></div>
      </div>
      <p class="privacy-badge">🔒 100% private — everything is calculated in your browser, nothing is sent to a server.</p>
    </div>
    {DISCLAIMER}
    {AD_SLOT}
    <section class="guide">
      <h2>Turning a day rate into a mortgage estimate</h2>
      <p>{t['why']}</p>
      <ul class="check-list">
        <li>✅ Use a realistic average of billable days, not your best month</li>
        <li>✅ Lenders will still want 1–2 years of documented history, not just a rate card</li>
        <li>✅ Slow seasons and gaps between contracts count against your average</li>
      </ul>
    </section>
    {faq_block(FAQ_GENERIC + [
        ("Should I use my best month or a realistic average?",
         "A realistic average across a full year, including slow months and gaps between contracts. Using your best month will give you an inflated number that a lender won't actually approve."),
        ("Do I need 1099s to prove this income?",
         "Usually yes — lenders want documented history (1099s, invoices, bank deposits) matching the day rate and volume you enter here, not just a stated rate."),
    ])}
    {more_tools_block(t['slug'])}
  </article>
  {webapp_schema(t['title'], t['intro'])}
  {faq_schema(FAQ_GENERIC)}
  <script>
  {MORTGAGE_JS_HELPERS}
  document.getElementById('calcBtn').addEventListener('click', function(){{
    var dayrate = parseFloat(document.getElementById('dayrate').value) || 0;
    var days = parseFloat(document.getElementById('days').value) || 0;
    var debts = parseFloat(document.getElementById('debts').value) || 0;
    var rate = parseFloat(document.getElementById('rate').value) || 6.9;
    var term = parseFloat(document.getElementById('term').value) || 30;
    var dti = parseFloat(document.getElementById('dti').value) || 43;
    var monthlyIncome = dayrate * days;
    var annualIncome = monthlyIncome * 12;
    var maxMonthlyDebt = monthlyIncome * (dti/100);
    var maxPayment = Math.max(0, maxMonthlyDebt - debts);
    var maxLoan = maxLoanFromPayment(maxPayment, rate, term);
    document.getElementById('rIncome').textContent = fmt(annualIncome);
    document.getElementById('rPayment').textContent = fmt(maxPayment);
    document.getElementById('rLoan').textContent = fmt(maxLoan);
    document.getElementById('result').classList.add('visible');
  }});
  </script>'''
    write(f"{t['slug']}.html", head(t['title'], t['intro'][:155], canonical) + body + foot())

# ---------- password generator ----------
def page_password(t):
    canonical = f"{SITE['domain']}/{t['slug']}"
    body = f'''
  <article>
    <section class="hero">
      <p class="crumbs"><a href="/">Home</a> › {html.escape(t['nav'])}</p>
      <h1>{html.escape(t['h1'])}</h1>
      <p class="lead">{t['intro']}</p>
    </section>
    <div class="tool-card">
      <div class="tool-grid">
        {field("Length", "len", type_="number", value="16")}
        <div class="field">
          <label>Character sets</label>
          <label style="font-weight:400"><input type="checkbox" id="upper" checked> Uppercase (A-Z)</label>
          <label style="font-weight:400"><input type="checkbox" id="lower" checked> Lowercase (a-z)</label>
          <label style="font-weight:400"><input type="checkbox" id="nums" checked> Numbers (0-9)</label>
          <label style="font-weight:400"><input type="checkbox" id="symbols" checked> Symbols (!@#...)</label>
        </div>
      </div>
      <button class="btn-calc" id="calcBtn" type="button">Generate password</button>
      <div class="result-box visible" id="result">
        <div class="big" id="rPass" style="word-break:break-all;font-size:1.5rem">••••••••••••••••</div>
        <button class="btn-calc" id="copyBtn" type="button" style="margin-top:14px;background:var(--green)">Copy to clipboard</button>
      </div>
      <p class="privacy-badge">🔒 Generated locally with your browser's cryptographic random source — never transmitted anywhere.</p>
    </div>
    {AD_SLOT}
    <section class="guide">
      <h2>Why use a generated password</h2>
      <p>{t['why']}</p>
    </section>
    {faq_block(FAQ_GENERIC[:2] + [
        ("How long should my password be?",
         "16 characters or more is a solid default for most accounts today. For anything protecting financial or highly sensitive data, consider 20+."),
    ])}
    {more_tools_block(t['slug'])}
  </article>
  {webapp_schema(t['title'], t['intro'])}
  <script>
  function generate(){{
    var len = parseInt(document.getElementById('len').value) || 16;
    var sets = '';
    if (document.getElementById('upper').checked) sets += 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    if (document.getElementById('lower').checked) sets += 'abcdefghijkmnpqrstuvwxyz';
    if (document.getElementById('nums').checked) sets += '23456789';
    if (document.getElementById('symbols').checked) sets += '!@#$%^&*()-_=+';
    if (!sets) sets = 'abcdefghijkmnpqrstuvwxyz23456789';
    var arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    var out = '';
    for (var i=0;i<len;i++){{ out += sets[arr[i] % sets.length]; }}
    document.getElementById('rPass').textContent = out;
  }}
  document.getElementById('calcBtn').addEventListener('click', generate);
  document.getElementById('copyBtn').addEventListener('click', function(){{
    navigator.clipboard.writeText(document.getElementById('rPass').textContent).then(function(){{
      var b = document.getElementById('copyBtn'); var old = b.textContent;
      b.textContent = '✓ Copied'; setTimeout(function(){{ b.textContent = old; }}, 1500);
    }});
  }});
  generate();
  </script>'''
    write(f"{t['slug']}.html", head(t['title'], t['intro'][:155], canonical) + body + foot())

# ---------- age calculator ----------
def page_age(t):
    canonical = f"{SITE['domain']}/{t['slug']}"
    body = f'''
  <article>
    <section class="hero">
      <p class="crumbs"><a href="/">Home</a> › {html.escape(t['nav'])}</p>
      <h1>{html.escape(t['h1'])}</h1>
      <p class="lead">{t['intro']}</p>
    </section>
    <div class="tool-card">
      <div class="tool-grid">
        {field("Birth date", "bdate", type_="date")}
        {field("Compare to date", "cdate", type_="date", hint="Defaults to today.")}
      </div>
      <button class="btn-calc" id="calcBtn" type="button">Calculate age</button>
      <div class="result-box" id="result">
        <div class="big" id="rAge">0 years</div>
        <div class="row"><span>Total days</span><b id="rDays">0</b></div>
        <div class="row"><span>Total months</span><b id="rMonths">0</b></div>
      </div>
      <p class="privacy-badge">🔒 Calculated locally in your browser.</p>
    </div>
    {AD_SLOT}
    {faq_block(FAQ_GENERIC[:2])}
    {more_tools_block(t['slug'])}
  </article>
  {webapp_schema(t['title'], t['intro'])}
  <script>
  document.getElementById('calcBtn').addEventListener('click', function(){{
    var b = document.getElementById('bdate').value;
    if (!b) return;
    var bd = new Date(b);
    var cdVal = document.getElementById('cdate').value;
    var cd = cdVal ? new Date(cdVal) : new Date();
    var years = cd.getFullYear() - bd.getFullYear();
    var months = cd.getMonth() - bd.getMonth();
    var days = cd.getDate() - bd.getDate();
    if (days < 0) {{ months--; }}
    if (months < 0) {{ years--; months += 12; }}
    var totalDays = Math.round((cd - bd) / 86400000);
    var totalMonths = years*12 + months;
    document.getElementById('rAge').textContent = years + ' years, ' + months + ' months, ' + Math.max(days,0) + ' days';
    document.getElementById('rDays').textContent = totalDays.toLocaleString('en-US');
    document.getElementById('rMonths').textContent = totalMonths.toLocaleString('en-US');
    document.getElementById('result').classList.add('visible');
  }});
  </script>'''
    write(f"{t['slug']}.html", head(t['title'], t['intro'][:155], canonical) + body + foot())

PAGE_FN = {
    "1099-income-calculator": page_1099,
    "bank-statement-loan-calculator": page_bankstatement,
    "freelance-affordability-calculator": page_freelance,
    "password-generator": page_password,
    "age-calculator": page_age,
}

# ---------- home ----------
def home():
    cards = "\n".join(
        f'''<a class="card" href="/{t['slug']}">
          <h3>{html.escape(t['nav'])}</h3>
          <p>{html.escape(t['intro'][:90])}…</p>
          <span class="go">Open tool →</span></a>'''
        for t in TOOLS
    )
    body = f'''
  <section class="hero">
    <p class="eyebrow">Free · No signup · Runs in your browser</p>
    <h1>Freelance &amp; Self-Employed Mortgage Calculator</h1>
    <p class="lead">{SITE['description']}</p>
  </section>
  <section>
    <div class="grid">{cards}</div>
  </section>
  {AD_SLOT}
  <section class="guide">
    <h2>Why self-employed borrowers need different tools</h2>
    <p>Generic mortgage calculators assume a W-2 paystub with a fixed monthly income. If you're a 1099
       contractor, freelancer, or small business owner, lenders qualify you differently — averaging tax
       returns, applying expense factors to bank deposits, or annualizing a day rate. These calculators
       model those specific methods so you get a realistic estimate before you talk to a lender.</p>
  </section>
  {faq_block(FAQ_GENERIC)}
  '''
    write("index.html", head("1099 & Freelance Mortgage Calculator | Estimate Your Approval",
          SITE['description'], SITE['domain'] + "/") + body + faq_schema(FAQ_GENERIC) + foot())

def legal():
    priv = f'''<article><h1>Privacy Policy</h1>
      <p>This site may show advertising from third-party networks. These networks may use cookies to
      show relevant ads based on your browsing. You can disable personalization cookies in your browser
      settings.</p>
      <p>We do not collect personally identifiable information. All calculator inputs are processed
      locally in your browser and are never transmitted to or stored on any server.</p>
      <p>Questions: <a href="mailto:{SITE['contact_email']}">{SITE['contact_email']}</a></p></article>'''
    write("privacy.html", head("Privacy Policy — " + SITE['name'],
          "Privacy policy and cookie usage.", SITE['domain']+"/privacy") + priv + foot())
    terms = f'''<article><h1>Terms of Use</h1>
      <ul class="check-list">
        <li>All calculators on this site provide educational estimates only, not financial, legal or
            lending advice.</li>
        <li>Results depend on the accuracy of the numbers you enter and simplified assumptions — real
            loan qualification involves additional factors (credit score, assets, lender-specific
            guidelines) not modeled here.</li>
        <li>Always confirm any figures with a licensed mortgage professional before making a financial
            decision.</li>
        <li>This site is provided "as is" with no warranty of accuracy or fitness for a particular
            purpose.</li>
      </ul>
      <p>Questions: <a href="mailto:{SITE['contact_email']}">{SITE['contact_email']}</a></p></article>'''
    write("terms.html", head("Terms of Use — " + SITE['name'],
          "Terms of use for the calculators on this site.", SITE['domain']+"/terms") + terms + foot())

def not_found():
    body = '''<article style="text-align:center">
      <h1>404 — Page not found</h1>
      <p class="lead">That page doesn't exist, but the calculators are still here.</p>
      <a class="btn-calc" style="display:inline-block;width:auto" href="/">Back to home</a></article>'''
    write("404.html", head("Page not found — " + SITE['name'], "Page not found.",
          SITE['domain']+"/404") + body + foot())

def seo_files():
    urls = [SITE['domain'] + "/", SITE['domain'] + "/privacy", SITE['domain'] + "/terms"]
    urls += [f"{SITE['domain']}/{t['slug']}" for t in TOOLS]
    items = "\n".join(f"  <url><loc>{u}</loc><changefreq>monthly</changefreq></url>" for u in urls)
    write("sitemap", f'<?xml version="1.0" encoding="UTF-8"?>\n'
          f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{items}\n</urlset>')
    write("robots.txt", f"User-agent: *\nAllow: /\nSitemap: {SITE['domain']}/sitemap\n")
    write("_headers", "/sitemap\n  Content-Type: application/xml; charset=utf-8\n")

def main():
    if os.path.exists(DIST):
        shutil.rmtree(DIST)
    os.makedirs(DIST)
    shutil.copy(os.path.join(HERE, "style.css"), os.path.join(DIST, "style.css"))
    shutil.copy(os.path.join(HERE, "66f5af64e590b7412519.txt"), os.path.join(DIST, "66f5af64e590b7412519.txt"))
    shutil.copy(os.path.join(HERE, "favicon.svg"), os.path.join(DIST, "favicon.svg"))
    home()
    for t in TOOLS:
        PAGE_FN[t["slug"]](t)
    legal()
    not_found()
    seo_files()
    print(f"OK -> {len(TOOLS)} tools + home + legal + sitemap generated in {DIST}")

if __name__ == "__main__":
    main()
