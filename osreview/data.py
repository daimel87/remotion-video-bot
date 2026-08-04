# -*- coding: utf-8 -*-
"""Site data for the modified Windows / lightweight OS review site (English).
Edit here, then run build.py"""

SITE = {
    "name": "Lite OS Reviews",
    "tagline": "Reviews of modified Windows builds & lightweight OS for gaming and low-end PCs",
    "domain": "https://paginaingles.pages.dev",  # Cloudflare Pages production URL
    "youtube": "https://www.youtube.com/channel/UCsAZA8xdUfr41QsX8WoyOQA?sub_confirmation=1",  # channel subscribe link
    "google_verify": "",  # paste Google Search Console verification code
    "admaven_verify": "BqTY4rTaF",  # AdMaven site verification meta tag content
    "description": "Honest reviews and install guides for modified Windows builds (Ghost Spectre, "
                   "AtlasOS, KernelOS, ReviOS, X-Lite) and lightweight operating systems built for "
                   "gaming and low-end PCs.",
    # ==== MONETAG (all zones for this site) ====
    "monetag_push": '<script src="https://5gvci.com/act/files/tag.min.js?z=11425169" data-cfasync="false" async></script>',
    "monetag_inpage_push": "<script>(function(s){s.dataset.zone='11443747',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_vignette": "<script>(function(s){s.dataset.zone='11443748',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_popunder": "<script>(function(s){s.dataset.zone='11424953',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>",
    "monetag_directlink": "https://omg10.com/4/11443749",  # Direct Link (opened on download button click)
}

# slug, title, cat, summary, yt (YouTube id), url (download link), body=[(subtitle,[paragraphs])]
ARTICLES = [
    {
        "slug": "kernelos-11-25h2-aio",
        "title": "KernelOS 11 25H2 AIO v1.5.1 Review: Best Gaming Windows for GTA 6, Roblox and More",
        "cat": "Gaming OS",
        "yt": "fUBxSvXTw50",
        "url": "https://pixeldrain.com/u/EJp47HDq",
        "summary": "KernelOS 11 25H2 AIO v1.5.1 is a modified and optimized Windows 11 build for gaming — "
                   "low idle resource usage, a built-in post-install toolbox, and support for titles "
                   "like Roblox, Valorant and the upcoming GTA 6.",
        "body": [
            ("What is KernelOS 11 25H2",
             ["KernelOS 11 25H2 AIO v1.5.1 is a modified and optimized Windows 11 operating system "
              "built specifically for gaming — whether you play Roblox, Valorant, or are getting "
              "ready for the upcoming GTA 6. It's based on Windows 11 25H2, build 26200.7462."]),
            ("Post-install script",
             ["Once installation finishes, KernelOS runs a post-install script. You'll be asked "
              "whether to verify system integrity — optional, and can be skipped to continue setup "
              "faster. The script then installs Explorer Patcher, disables unnecessary options and "
              "temporary files, installs the KernelOS power plan, 7-Zip, the latest DirectX "
              "components, and the Microsoft Visual C++ redistributables required by most modern "
              "games. Once it's done, the PC restarts to apply all the changes."]),
            ("Desktop and the KernelOS toolbox",
             ["After the reboot you'll find desktop shortcuts to the Recycle Bin, the official "
              "KernelOS website, its YouTube and TikTok channels, Discord server, X account, and the "
              "KernelOS post-installation toolbox. That toolbox lets you install popular web browsers "
              "(none is included by default), access a useful tools section, a solutions section with "
              "fixes for common issues, and a tweaking section for Windows registry tweaks and other "
              "optimizations. The Start Menu stays the official Windows 11 layout, aligned left."]),
            ("Performance and footprint",
             ["At idle, KernelOS 11 25H2 runs only 19 background processes, with CPU usage sitting "
              "around 3% and memory usage at just 1.2GB out of 4GB available. File Explorer keeps the "
              "stock Windows 11 icons with no visual changes. The ISO is 6.56GB and available in "
              "English, and after installation the OS occupies only 13.6GB of disk space."]),
            ("Default apps and two integrated updates",
             ["Out of the box you'll find 7-Zip, Explorer Patcher, the KernelOS Toolbox, Microsoft "
              "Visual C++ Redistributables from 2005 to 2022, Microsoft Desktop Runtime, Paint, Remote "
              "Desktop Connection and Snipping Tool. This build also ships with two updates already "
              "integrated by its creator. Under Windows Features you'll still find .NET Framework 3.5 "
              "and 4.8, Legacy Components, Multimedia Features and other optional components."]),
            ("What's missing: Defender and Windows Update",
             ["Under Privacy & Security, Microsoft Defender is not included, so you'll need a "
              "third-party antivirus if you want real-time protection. Windows Update is also "
              "completely disabled — KernelOS 11 25H2 cannot be updated through Windows Update, so "
              "plan on reinstalling a newer build when one is released instead of patching in place."]),
            ("Install walkthrough",
             ["Flash the ISO to a USB drive with Rufus, boot from it, and follow the setup — the full "
              "step-by-step, including the post-install script and toolbox walkthrough, is in the "
              "video above."]),
        ],
    },
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
