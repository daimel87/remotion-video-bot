#!/usr/bin/env python3
"""
Descarga clips VERTICALES de animales desde Pexels (licencia libre, uso comercial).

Uso (en tu PC, no en el entorno bloqueado):
    export PEXELS_API_KEY="tu_api_key"
    python3 pexels_download.py "mongoose" 5
    python3 pexels_download.py "eagle hunting" 5

Requisitos:  pip install requests
Guarda los .mp4 en la carpeta actual. Luego súbelos al chat.
"""
import os
import sys
import re
import requests

API_KEY = os.environ.get("PEXELS_API_KEY", "").strip()
if not API_KEY:
    sys.exit("Falta PEXELS_API_KEY (export PEXELS_API_KEY='...').")

query = sys.argv[1] if len(sys.argv) > 1 else "mongoose"
count = int(sys.argv[2]) if len(sys.argv) > 2 else 5

resp = requests.get(
    "https://api.pexels.com/videos/search",
    headers={"Authorization": API_KEY},
    params={"query": query, "orientation": "portrait", "size": "medium", "per_page": count},
    timeout=30,
)
resp.raise_for_status()
videos = resp.json().get("videos", [])
if not videos:
    sys.exit(f"Sin resultados para '{query}'.")

slug = re.sub(r"[^a-z0-9]+", "-", query.lower()).strip("-")
for v in videos:
    files = [f for f in v["video_files"] if f.get("width") and f.get("height")]
    portrait = [f for f in files if f["height"] >= f["width"]]
    pool = portrait or files
    # mejor calidad hasta 1080 de ancho (evita 4k innecesario)
    capped = [f for f in pool if f["width"] <= 1080] or pool
    best = max(capped, key=lambda f: f["height"])
    fname = f"pexels_{slug}_{v['id']}.mp4"
    print(f"↓ {fname}  ({best['width']}x{best['height']})  by {v['user']['name']}")
    with requests.get(best["link"], stream=True, timeout=120) as r:
        r.raise_for_status()
        with open(fname, "wb") as out:
            for chunk in r.iter_content(1 << 16):
                out.write(chunk)
print("Listo. Sube los .mp4 al chat.")
