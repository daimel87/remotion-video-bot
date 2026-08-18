# -*- coding: utf-8 -*-
SITE = {
    "name": "FreelanceMortgageCalc",
    "tagline": "Mortgage calculators built for the self-employed",
    "domain": "https://mortagecalculator.pages.dev",
    "description": "Free mortgage affordability calculators for 1099 contractors, "
                   "freelancers and self-employed borrowers — no login, no signup, "
                   "runs entirely in your browser.",
    "contact_email": "contact@freelancemortgagecalc.pages.dev",
}

TOOLS = [
    {
        "slug": "1099-income-calculator",
        "kind": "calc",
        "nav": "1099 Income Calculator",
        "title": "1099 Income Calculator for Mortgage Qualification (Free)",
        "h1": "1099 Income Calculator for a Mortgage",
        "intro": "Lenders average your last two years of 1099/Schedule C net "
                 "profit to figure out your qualifying income. Enter your numbers "
                 "below to estimate your qualifying monthly income and the "
                 "mortgage payment you could realistically afford.",
        "why": "Unlike a W-2 employee, a 1099 contractor's income isn't a fixed "
               "number a lender can just read off a paystub. Most conventional "
               "lenders average the net profit from the last two years of tax "
               "returns (Schedule C, line 31) and divide by 24 to get a stable "
               "monthly qualifying income — even if your income varies a lot "
               "month to month.",
    },
    {
        "slug": "bank-statement-loan-calculator",
        "kind": "calc",
        "nav": "Bank Statement Loan Calculator",
        "title": "Bank Statement Loan Calculator — Non-QM Mortgage Estimate",
        "h1": "Bank Statement Loan Calculator",
        "intro": "Bank statement (Non-QM) loans qualify you using your average "
                 "monthly deposits instead of tax returns. Enter your average "
                 "deposits and an expense factor to estimate your qualifying "
                 "income and mortgage payment.",
        "why": "Bank statement loans exist because tax deductions make a "
               "self-employed borrower's net income look much lower than their "
               "real cash flow. Instead of tax returns, the lender averages 12–24 "
               "months of bank deposits and applies an \"expense factor\" "
               "(commonly 50%, though it varies by lender and industry) to "
               "estimate real qualifying income from gross deposits.",
    },
    {
        "slug": "freelance-affordability-calculator",
        "kind": "calc",
        "nav": "Freelance Affordability Calculator",
        "title": "Freelance & Day-Rate Contractor Mortgage Affordability Calculator",
        "h1": "Freelance Affordability Calculator",
        "intro": "If you bill by the day or by the project, this calculator "
                 "turns your day rate and typical work volume into an estimated "
                 "qualifying income and mortgage payment — useful for a quick "
                 "gut-check before you talk to a lender.",
        "why": "Day-rate contractors and freelancers often don't have a clean "
               "\"annual salary\" figure to hand a lender. This tool converts "
               "your day rate and average working days into an annualized "
               "income estimate, then applies the same debt-to-income logic a "
               "lender would use to gauge what you could afford.",
    },
    {
        "slug": "password-generator",
        "kind": "tool",
        "nav": "Password Generator",
        "title": "Secure Password Generator — Free, Runs In Your Browser",
        "h1": "Secure Password Generator",
        "intro": "Generate a strong, random password with custom length and "
                 "character sets. Nothing is sent anywhere — it's generated "
                 "locally in your browser.",
        "why": "Weak or reused passwords are one of the most common causes of "
               "account breaches. A password generated with a cryptographically "
               "secure random source and enough length/character variety is "
               "far harder to crack than anything a human would pick.",
    },
    {
        "slug": "age-calculator",
        "kind": "tool",
        "nav": "Age Calculator",
        "title": "Age Calculator — Calculate Your Exact Age in Years, Months, Days",
        "h1": "Age Calculator",
        "intro": "Find your exact age in years, months and days, or count the "
                 "days between any two dates.",
        "why": "Simple, but genuinely useful for forms, eligibility checks, "
               "anniversaries and countdowns — calculated instantly in your "
               "browser, no data sent anywhere.",
    },
]

FAQ_GENERIC = [
    ("Is this financial advice?",
     "No. This tool gives a rough, educational estimate only. Actual mortgage "
     "qualification depends on your full financial picture, credit score, "
     "assets, the specific lender's guidelines, and current rates. Always talk "
     "to a licensed mortgage professional before making a decision."),
    ("Is my data saved or sent anywhere?",
     "No. Every calculation runs locally in your browser with plain "
     "JavaScript. Nothing you type is sent to a server, stored, or shared."),
    ("Why do self-employed borrowers need a different calculator?",
     "Because lenders don't use your gross revenue — they use net qualifying "
     "income after specific averaging and expense-factor rules that only "
     "apply to 1099/self-employed income, which a generic mortgage calculator "
     "doesn't account for."),
]
