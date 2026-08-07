#!/usr/bin/env python3
"""
Stock video downloader for Magrux - Forja Interior
Searches Pexels, Pixabay and Coverr and downloads the best match for each segment.

Usage:
    python download_stock.py segments.json
    python download_stock.py --segment "persona mirando telefono oscuro" --duration 8 --out ./clips
"""

import argparse
import json
import os
import sys
import time
import urllib.request
import urllib.parse
import urllib.error

# ── API KEYS ─────────────────────────────────────────────────────────────────
PEXELS_KEY  = "Ae2sAZkgueMj3auCuLuZhpLBzz1mpITlEt165NnkDMSKBsVW8uy7v5sm"
PIXABAY_KEY = "23419683-105869979e02b679473a4e9eb"
COVERR_KEY  = "a1f778d2af7cade22655486615337bd0"

# ── HELPERS ──────────────────────────────────────────────────────────────────

def get(url, headers=None):
    req = urllib.request.Request(url, headers=headers or {})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode())

def download(url, path):
    print(f"  ↓ {os.path.basename(path)}")
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as r, open(path, "wb") as f:
        while chunk := r.read(1024 * 256):
            f.write(chunk)

def best_file(files, target_dur):
    """Pick the video file closest to target duration, prefer HD."""
    scored = []
    for fi in files:
        w   = fi.get("width", 0)
        h   = fi.get("height", 0)
        dur = fi.get("duration", fi.get("length", 0))
        url = fi.get("link") or fi.get("url") or fi.get("mp4_url") or ""
        if not url or not url.endswith(".mp4"):
            continue
        res_score  = min(w, 1920) / 1920           # 0-1, prefer up to 1080p/1920w
        dur_score  = 1 - abs(dur - target_dur) / max(target_dur, 1)
        scored.append((res_score * 0.4 + dur_score * 0.6, url, dur))
    scored.sort(reverse=True)
    return scored[0] if scored else None

# ── SOURCES ──────────────────────────────────────────────────────────────────

def search_pexels(query, target_dur):
    q   = urllib.parse.quote(query)
    url = f"https://api.pexels.com/videos/search?query={q}&per_page=10&orientation=landscape"
    try:
        data = get(url, {"Authorization": PEXELS_KEY})
        results = []
        for v in data.get("videos", []):
            files = [
                {
                    "link": f["link"],
                    "width": f.get("width", 0),
                    "height": f.get("height", 0),
                    "duration": v.get("duration", 0),
                }
                for f in v.get("video_files", [])
                if f.get("link", "").endswith(".mp4")
            ]
            pick = best_file(files, target_dur)
            if pick:
                results.append(("pexels", pick[0], pick[1], pick[2]))
        return results
    except Exception as e:
        print(f"  [Pexels] {e}")
        return []

def search_pixabay(query, target_dur):
    q   = urllib.parse.quote(query)
    url = (
        f"https://pixabay.com/api/videos/"
        f"?key={PIXABAY_KEY}&q={q}&per_page=10&video_type=film"
    )
    try:
        data = get(url)
        results = []
        for v in data.get("hits", []):
            hits = v.get("videos", {})
            files = []
            for quality in ("large", "medium", "small"):
                h = hits.get(quality, {})
                if h.get("url"):
                    files.append({
                        "url": h["url"],
                        "width": h.get("width", 0),
                        "height": h.get("height", 0),
                        "duration": v.get("duration", 0),
                    })
            pick = best_file(files, target_dur)
            if pick:
                results.append(("pixabay", pick[0], pick[1], pick[2]))
        return results
    except Exception as e:
        print(f"  [Pixabay] {e}")
        return []

def search_coverr(query, target_dur):
    q   = urllib.parse.quote(query)
    url = f"https://api.coverr.co/videos?query={q}&per_page=10"
    try:
        headers = {"Authorization": f"Bearer {COVERR_KEY}"}
        data    = get(url, headers)
        results = []
        for v in data.get("hits", []):
            mp4 = (
                v.get("urls", {}).get("mp4")
                or v.get("url")
                or ""
            )
            if not mp4:
                continue
            dur = v.get("duration", 0)
            dur_score = 1 - abs(dur - target_dur) / max(target_dur, 1)
            results.append(("coverr", dur_score, mp4, dur))
        return results
    except Exception as e:
        print(f"  [Coverr] {e}")
        return []

# ── MAIN SEARCH ──────────────────────────────────────────────────────────────

def find_best(query, target_dur):
    """Search all sources and return (source, url, duration) of the best match."""
    print(f'  Buscando: "{query}" (~{target_dur}s)')
    all_results = []
    all_results += search_pexels(query, target_dur)
    all_results += search_pixabay(query, target_dur)
    all_results += search_coverr(query, target_dur)

    if not all_results:
        return None

    # Sort by score descending
    all_results.sort(key=lambda x: x[1], reverse=True)
    best = all_results[0]
    print(f"  ✓ Mejor resultado: {best[0]} ({best[3]:.1f}s) → {best[2][:60]}...")
    return best[0], best[2], best[3]

# ── SEGMENT PROCESSING ───────────────────────────────────────────────────────

def process_segment(seg, out_dir, index):
    """
    seg = {
        "id":       "habito_1",
        "query":    "person scrolling phone dark room",
        "query_es": "persona mirando telefono oscuro",
        "duration": 8,
        "label":    "Hábito #1 — Consumo Pasivo"
    }
    """
    slug  = seg.get("id") or f"segment_{index:02d}"
    query = seg.get("query") or seg.get("query_es", "")
    dur   = float(seg.get("duration", 8))

    out_path = os.path.join(out_dir, f"{index:02d}_{slug}.mp4")
    if os.path.exists(out_path):
        print(f"[{index:02d}] Ya existe: {out_path}")
        return out_path

    print(f"\n[{index:02d}] {seg.get('label', slug)}")
    result = find_best(query, dur)
    if not result:
        # Fallback: try a simpler query
        simple = query.split()[:2]
        print(f"  → Reintentando con: {' '.join(simple)}")
        result = find_best(" ".join(simple), dur)

    if not result:
        print(f"  ✗ No se encontró video para este segmento.")
        return None

    _, url, _ = result
    download(url, out_path)
    time.sleep(0.5)   # be polite to APIs
    return out_path

# ── CLI ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Descarga videos de stock para segmentos de video")
    parser.add_argument("segments_file", nargs="?", help="JSON con lista de segmentos")
    parser.add_argument("--segment", help="Búsqueda de un solo segmento")
    parser.add_argument("--duration", type=float, default=8, help="Duración objetivo (segundos)")
    parser.add_argument("--out", default="./clips", help="Carpeta de salida")
    args = parser.parse_args()

    os.makedirs(args.out, exist_ok=True)

    if args.segment:
        seg = {"id": "clip", "query": args.segment, "duration": args.duration}
        path = process_segment(seg, args.out, 1)
        if path:
            print(f"\n✓ Guardado: {path}")
        return

    if not args.segments_file:
        # Demo: segmentos del video "Hábitos Cotidianos"
        segments = [
            {"id": "intro",     "query": "person phone bed dark room night",        "duration": 10, "label": "INTRO — Gancho"},
            {"id": "habito_1",  "query": "person scrolling phone passive mindless",  "duration": 10, "label": "Hábito #1 — Consumo Pasivo"},
            {"id": "habito_2",  "query": "person bored alone silence thinking",      "duration": 10, "label": "Hábito #2 — Evitar el aburrimiento"},
            {"id": "habito_3",  "query": "people talking meeting conversation",       "duration": 10, "label": "Hábito #3 — Hablar más que escuchar"},
            {"id": "habito_4",  "query": "person internet research computer typing", "duration": 10, "label": "Hábito #4 — Sesgo de confirmación"},
            {"id": "habito_5",  "query": "impulsive decision shopping angry typing", "duration": 10, "label": "Hábito #5 — Decisiones por impulso"},
            {"id": "habito_6",  "query": "unfinished projects desk books abandoned", "duration": 10, "label": "Hábito #6 — No terminar lo que empiezas"},
            {"id": "cierre",    "query": "person looking horizon city reflection",   "duration": 8,  "label": "CIERRE"},
        ]
    else:
        with open(args.segments_file, encoding="utf-8") as f:
            segments = json.load(f)

    print(f"Procesando {len(segments)} segmentos → {args.out}\n")
    downloaded = []
    for i, seg in enumerate(segments, 1):
        path = process_segment(seg, args.out, i)
        downloaded.append({"segment": seg.get("label", seg.get("id")), "file": path})

    print("\n── Resumen ──────────────────────────────────")
    for d in downloaded:
        status = "✓" if d["file"] else "✗"
        print(f"  {status} {d['segment']}: {d['file'] or 'NO DESCARGADO'}")

    # Save manifest for next step
    manifest_path = os.path.join(args.out, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(downloaded, f, ensure_ascii=False, indent=2)
    print(f"\n→ Manifest guardado: {manifest_path}")

if __name__ == "__main__":
    main()
