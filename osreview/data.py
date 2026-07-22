# -*- coding: utf-8 -*-
"""Site data for the modified Windows / lightweight OS review site (English).
Edit here, then run build.py"""

SITE = {
    "name": "Lite OS Reviews",
    "tagline": "Reviews of modified Windows builds & lightweight OS for gaming and low-end PCs",
    "domain": "https://liteosreviews.pages.dev",  # update once deployed on Cloudflare Pages
    "youtube": "https://www.youtube.com/@YOUR_CHANNEL",  # TODO: paste your channel URL
    "google_verify": "",  # paste Google Search Console verification code
    "description": "Honest reviews and install guides for modified Windows builds (Ghost Spectre, "
                   "AtlasOS, KernelOS, ReviOS, X-Lite) and lightweight operating systems built for "
                   "gaming and low-end PCs.",
    # ==== ADSTERRA AD SLOTS (paste your <script> codes once this site exists in your Adsterra panel) ====
    "ad_top": "<script type=\"text/javascript\">atOptions={'key':'ab53cfe039a1c5e505d5c7cc66f5f7c8','format':'iframe','height':90,'width':728,'params':{}};</script><script type=\"text/javascript\" src=\"https://russiaexternalknew.com/ab53cfe039a1c5e505d5c7cc66f5f7c8/invoke.js\"></script>",        # 728x90 banner
    "ad_incontent": "<script type=\"text/javascript\">atOptions={'key':'4aadfd4a7309458cf7bc2bf2ebf24ecf','format':'iframe','height':250,'width':300,'params':{}};</script><script type=\"text/javascript\" src=\"https://russiaexternalknew.com/4aadfd4a7309458cf7bc2bf2ebf24ecf/invoke.js\"></script>",  # 300x250 in-article
    "ad_native": "",      # native banner
    "ad_bottom": "<script type=\"text/javascript\">atOptions={'key':'ab53cfe039a1c5e505d5c7cc66f5f7c8','format':'iframe','height':90,'width':728,'params':{}};</script><script type=\"text/javascript\" src=\"https://russiaexternalknew.com/ab53cfe039a1c5e505d5c7cc66f5f7c8/invoke.js\"></script>",      # 728x90 banner (bottom)
    "ad_social": "",      # social bar script src
    "ad_modal": "4aadfd4a7309458cf7bc2bf2ebf24ecf",       # key for the 300x250 shown inside the download modal
    "smartlink": "",      # smartlink URL opened on download click (optional, leave "" to skip)
}

# slug, title, cat, summary, yt (YouTube id), url (download link), body=[(subtitle,[paragraphs])]
ARTICLES = [
    {
        "slug": "windows-x-lite-optimum-11-26h1",
        "title": "Windows X-Lite Optimum 11 26H1 Pro V2 Review: The Best Windows 11 Lite for Low-End PCs?",
        "cat": "Windows 11 Lite",
        "yt": "gxZ62u0h5sE",
        "url": "https://pixeldrain.com/u/FTatEzd7",
        "summary": "A stripped-down, debloated build of Windows 11 26H1 Pro aimed at squeezing more "
                   "performance out of low-end and older hardware. Here's what's removed, what stays, "
                   "and whether it's worth installing.",
        "body": [
            ("What is Windows X-Lite Optimum 11?",
             ["Windows X-Lite Optimum 11 26H1 Pro V2 is a pre-configured, debloated version of "
              "Windows 11 built for people running low-end or aging PCs. Instead of manually removing "
              "bloatware, disabling telemetry and tweaking services after every fresh install, this "
              "build ships with most of that already done for you."]),
            ("What's removed",
             ["Unnecessary background services, most pre-installed Microsoft Store apps, Cortana "
              "leftovers, OneDrive integration and a chunk of telemetry are stripped or disabled out "
              "of the box. The result is a noticeably lighter footprint on both RAM and disk compared "
              "to a stock Windows 11 26H1 install."]),
            ("Performance and stability",
             ["Boot times and general responsiveness improve on machines with 4-8GB of RAM, which is "
              "where this build makes the most sense. It's still core Windows 11 underneath, so "
              "compatibility with regular apps and games stays intact — this isn't a fork, just a "
              "trimmed installer."]),
            ("Who should install it",
             ["If you're running an older laptop, a budget desktop, or just want a leaner Windows 11 "
              "without spending hours debloating it yourself, this build is worth trying. Gamers on "
              "modest hardware will also notice a bit more headroom for frame rates."]),
            ("Requirements & install notes",
             ["Same minimum requirements as standard Windows 11 (64-bit CPU, 4GB RAM minimum, "
              "TPM 2.0 recommended but usually bypassable). Always back up your files before "
              "reinstalling Windows, and grab a fresh download link if the one below ever expires."]),
        ],
    },
    {
        "slug": "ghost-spectre-windows-11",
        "title": "Ghost Spectre Windows 11 Review: Pure Performance, No Bloat!",
        "cat": "Windows 11 Lite",
        "yt": "quhv2vD6LoU",
        "url": "https://mega.nz/file/XSomDR7R#CDA_IrTFBeo55-WkVj7fDSzJ-gua1jvgmY5LHXd_Das",
        "summary": "Ghost Spectre is one of the most popular modified Windows 11 builds for gamers. "
                   "We cover what makes it different from a stock install and whether the performance "
                   "gains are real.",
        "body": [
            ("What is Ghost Spectre Windows 11?",
             ["Ghost Spectre is a long-running, community-trusted project that produces heavily "
              "optimized Windows builds. The Windows 11 edition rips out telemetry, unnecessary "
              "services and background scheduled tasks while keeping the OS fully functional and "
              "up to date."]),
            ("Why gamers pick it",
             ["The build focuses on reducing background CPU/disk usage so more resources are "
              "available for games. Combined with a cleaner startup and fewer forced updates "
              "interrupting sessions, it's a common choice for competitive and casual gamers alike."]),
            ("Compatibility",
             ["Because it's based on genuine Windows 11 sources with tweaks applied at install time "
              "(not a third-party fork), driver and game compatibility is essentially identical to "
              "a normal Windows 11 installation — you're not sacrificing anything to get the "
              "performance benefits."]),
            ("Should you install it?",
             ["If your priority is squeezing extra FPS and reducing background noise on a gaming rig, "
              "Ghost Spectre Windows 11 is one of the safest, most established options out there. "
              "Watch the full walkthrough above before installing."]),
        ],
    },
    {
        "slug": "ghost-spectre-windows-10-superlite-se",
        "title": "Windows 10 Ghost Spectre Superlite SE Review: Should You Install It in 2026?",
        "cat": "Windows 10 Lite",
        "yt": "PcxGzfQk-RI",
        "url": "https://pixeldrain.com/u/Sh1xEfbB",
        "summary": "Ghost Spectre's Superlite SE edition for Windows 10 goes even further than the "
                   "standard build. Is it still a smart pick now that Windows 10 support is winding down?",
        "body": [
            ("What makes the Superlite SE edition different",
             ["Superlite SE is the most aggressively trimmed Ghost Spectre release for Windows 10 — "
              "it cuts even more components than the regular Ghost Spectre build, aiming at the "
              "smallest possible footprint while staying stable for daily use and gaming."]),
            ("Best use cases",
             ["This edition shines on genuinely low-spec hardware: old laptops, machines with 4GB RAM "
              "or spinning hard drives, and secondary PCs you want to keep snappy without upgrading "
              "parts. It's also popular for retro-gaming rigs and older CPUs that struggle with "
              "stock Windows 10's overhead."]),
            ("Is Windows 10 still worth it in 2026?",
             ["With Windows 10's official support cycle ending, Superlite SE is mostly aimed at "
              "offline machines, gaming-only rigs, or hardware that can't run Windows 11. If your PC "
              "connects to the internet daily, weigh the security trade-offs before committing "
              "long term."]),
            ("Installation tips",
             ["As with any lite build, do a clean install rather than an upgrade, and keep a backup "
              "of your files. Check the video above for the full step-by-step walkthrough."]),
        ],
    },
    {
        "slug": "ghost-spectre-windows-10-superlite-2025",
        "title": "Windows 10 Ghost Spectre Superlite (2025) Review: The Ultimate Performance Boost",
        "cat": "Windows 10 Lite",
        "yt": "c_9IIgFvSFA",
        "url": "https://www.mediafire.com/file/n6xi6ea9looevlp/WIN10.PRO.AIO.U25.X64.iso/file",
        "summary": "The 2025 refresh of Ghost Spectre's Windows 10 Superlite build, packaged as an "
                   "AIO (All-In-One) ISO. Here's what changed and how it performs.",
        "body": [
            ("What's in this AIO build",
             ["This release packages several Windows 10 editions into a single AIO ISO, so you pick "
              "your edition (Home/Pro) during setup instead of downloading separate installers. "
              "Under the hood it carries the same Ghost Spectre debloating philosophy: fewer "
              "background services, less telemetry, faster boot."]),
            ("Performance in practice",
             ["Users report noticeably lower idle RAM usage and quicker cold boots compared to a "
              "stock Windows 10 Pro install, particularly on mechanical drives and older quad-core "
              "CPUs. It remains one of the most requested Ghost Spectre releases for that reason."]),
            ("Gaming and everyday use",
             ["Because the build stays close to vanilla Windows 10 under the hood, games, drivers and "
              "regular software all install and run normally — the optimizations are about removing "
              "overhead, not changing how the OS behaves."]),
            ("Download & install notes",
             ["It's a full AIO ISO, so flash it to a USB drive with Rufus (or similar) and boot from "
              "it to install. Watch the video above for the exact steps."]),
        ],
    },
    {
        "slug": "kernelos-atlasos-gaming",
        "title": "KernelOS + AtlasOS Review: Transform Your PC Into a Gaming Beast",
        "cat": "Gaming OS",
        "yt": "SbLxCxGe2Zg",
        "url": "https://atlasos.dev/",
        "summary": "AtlasOS takes a different approach from a modified ISO: it's a set of tools (Ame "
                   "Wizard + Playbook) applied on top of your existing genuine Windows install. Paired "
                   "with KernelOS, it's a favorite combo among competitive gamers.",
        "body": [
            ("How AtlasOS works",
             ["Unlike Ghost Spectre or X-Lite, AtlasOS isn't a pre-built ISO — it's the Ame Wizard "
              "tool plus a Playbook of tweaks that you run on top of your own genuine Windows "
              "installation. This means you keep your existing license and just apply the "
              "optimizations on demand."]),
            ("Why pair it with KernelOS",
             ["KernelOS provides a heavily optimized base build, and AtlasOS's Playbook adds another "
              "layer of scheduler, network and background-process tweaks on top. Together they're "
              "one of the most talked-about combos in the lite-gaming-OS community."]),
            ("What to expect",
             ["Lower input latency, more consistent frame times and less background interference "
              "during gaming sessions. The gains are more noticeable on mid-range hardware than on "
              "already high-end rigs, where the bottleneck usually isn't the OS."]),
            ("Getting started",
             ["Download the Ame Wizard and Playbook from the official AtlasOS site linked below, and "
              "follow the walkthrough in the video above for the safest configuration for gaming."]),
        ],
    },
    {
        "slug": "kernelos-11-23h2-aio",
        "title": "KernelOS 11 23H2 AIO Review: The Best Windows Build for Gamers?",
        "cat": "Gaming OS",
        "yt": "BeTOlW3rzO4",
        "url": "https://www.mediafire.com/file/bxmmumuq17124v9/KernelOS11_23H2_AiO_Public.iso/file",
        "summary": "KernelOS is a purpose-built Windows 11 distribution aimed squarely at gaming "
                   "performance. This AIO 23H2 release is the most downloaded version — here's why.",
        "body": [
            ("What is KernelOS",
             ["KernelOS is a community-maintained Windows 11 build focused entirely on gaming "
              "performance: reduced input latency, trimmed background services, and scheduler "
              "tweaks designed to prioritize foreground game processes."]),
            ("The 23H2 AIO release",
             ["This All-In-One ISO bundles the core KernelOS build so you can install straight from "
              "USB without extra steps. It's the version most creators (including this channel) "
              "recommend as the starting point."]),
            ("Community support",
             ["KernelOS has an active Discord where updates, troubleshooting and new Playbook-style "
              "tweaks get shared regularly — worth joining if you plan on using the build long term "
              "or run into install issues."]),
            ("Install walkthrough",
             ["Flash the ISO to a USB drive with Rufus, boot from it and follow the setup — the full "
              "step-by-step is in the video above, including a dedicated companion guide if you want "
              "extra detail on the install process."]),
        ],
    },
    {
        "slug": "revios-2026",
        "title": "How to Install ReviOS in 2026: The Best Gaming OS This Year?",
        "cat": "Gaming OS",
        "yt": "DEK7N_Av8hY",
        "url": "https://www.revi.cc/download",
        "summary": "ReviOS keeps climbing in popularity as a gaming-focused Windows build. We break "
                   "down what's new for 2026 and how to install it without errors.",
        "body": [
            ("What is ReviOS",
             ["ReviOS is a debloated, gaming-oriented Windows distribution with its own installer and "
              "toolset for applying additional tweaks after setup. It's built and maintained "
              "specifically with frame-time consistency and low latency in mind."]),
            ("What's new in the 2026 build",
             ["The latest release refines driver bundling and post-install tweaks so fewer manual "
              "steps are needed after setup, cutting down on the common installation errors earlier "
              "versions were known for."]),
            ("Avoiding common install errors",
             ["Most ReviOS install failures come from using an outdated USB flashing tool or skipping "
              "a BIOS setting (like disabling Secure Boot when required). Follow the video above "
              "step-by-step to avoid the most common pitfalls."]),
            ("Is it worth it",
             ["If you want a gaming-first Windows build with an active update cycle and a dedicated "
              "installer (rather than a static ISO you flash once), ReviOS is one of the strongest "
              "options in 2026."]),
        ],
    },
    {
        "slug": "atomos-11",
        "title": "Is AtomOS 11 Worth Installing in 2026?",
        "cat": "Windows 11 Lite",
        "yt": "FM8vlh5YeBU",
        "url": "https://www.atom-os.com/",
        "summary": "AtomOS 11 is a lesser-known but growing modified Windows 11 build. We look at what "
                   "sets it apart from the bigger names like Ghost Spectre and ReviOS.",
        "body": [
            ("What is AtomOS 11",
             ["AtomOS 11 is a debloated Windows 11 build distributed through its own official site, "
              "aiming for a balance between a clean, lightweight system and staying close enough to "
              "stock Windows to avoid compatibility headaches."]),
            ("How it compares to the big names",
             ["It doesn't have the size of community behind Ghost Spectre or ReviOS yet, but the "
              "core approach is similar: strip telemetry and bloat, keep the update mechanism and "
              "driver compatibility intact."]),
            ("Performance impressions",
             ["Boot and idle resource usage are in line with other lite Windows 11 builds covered on "
              "this channel — a solid pick if you want an alternative to the more mainstream options "
              "or if a specific tweak set works better for your hardware."]),
            ("Should you try it",
             ["Worth testing if you've already tried Ghost Spectre or X-Lite and want to compare. "
              "Full install walkthrough and first impressions are in the video above."]),
        ],
    },
    {
        "slug": "deepin-os-25",
        "title": "Deepin OS 25.1 Review: This Chinese Linux Distro Runs on 1.5GB RAM",
        "cat": "Linux",
        "yt": "uLh_0cbcL7c",
        "url": "https://www.deepin.org/en/download/",
        "summary": "Forget Windows entirely — Deepin is a polished Linux distribution out of China "
                   "that runs comfortably on hardware Windows 11 would refuse to boot on.",
        "body": [
            ("What is Deepin OS",
             ["Deepin is a Linux distribution known for its own custom desktop environment (DDE), "
              "which looks and feels closer to macOS/Windows than most Linux desktops — a big reason "
              "it's often recommended to people switching from Windows for the first time."]),
            ("Why it's so light",
             ["Deepin 25.1 runs smoothly on as little as 1.5GB of RAM, making it one of the best "
              "options for genuinely old hardware that can no longer handle Windows 10 or 11 at all — "
              "no debloating tricks needed, it's simply built lighter from the ground up."]),
            ("What you give up moving from Windows",
             ["No native Windows software or most AAA games without extra compatibility layers "
              "(Steam Proton covers a good chunk, but not everything). It's best suited for browsing, "
              "office work, and general productivity on aging machines rather than as a gaming rig."]),
            ("Getting started",
             ["Download the ISO from the official Deepin site, flash it with Rufus or Balena Etcher, "
              "and boot from USB. The video above covers the full install and first-look at the "
              "desktop environment."]),
        ],
    },
]
