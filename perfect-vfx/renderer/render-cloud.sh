#!/usr/bin/env bash
# Perfect VFX - cloud render helper (adapts the skill's render step to the
# Claude Code cloud environment: no browser download, proxy CA for fonts).
#
# Usage: ./render-cloud.sh <source.mp4> <spec.json> <output.mp4>
#
# One-time per container, this script:
#   1. imports the agent-proxy CA into the browser NSS store (so Google Fonts load)
#   2. uses the pre-installed headless_shell instead of downloading Remotion's browser
set -euo pipefail

SRC="${1:?source mp4 required}"
SPEC="${2:?spec.json required}"
OUT="${3:?output mp4 required}"

HEADLESS_SHELL="/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"
CA="/root/.ccr/ca-bundle.crt"
NSSDB="/root/.pki/nssdb"
HERE="$(cd "$(dirname "$0")" && pwd)"

# --- 1. trust the proxy CA in the browser NSS store (idempotent) ---
if [ -f "$CA" ] && command -v certutil >/dev/null 2>&1; then
  if ! certutil -d "sql:$NSSDB" -L 2>/dev/null | grep -q ccr-ca-0; then
    echo "[render-cloud] importing proxy CA into NSS store..."
    mkdir -p "$NSSDB"
    tmp=$(mktemp -d)
    csplit -z -f "$tmp/ca-" -b '%03d.crt' "$CA" '/-----BEGIN CERTIFICATE-----/' '{*}' >/dev/null 2>&1 || true
    i=0
    for f in "$tmp"/ca-*.crt; do
      certutil -d "sql:$NSSDB" -A -t "C,," -n "ccr-ca-$i" -i "$f" 2>/dev/null || true
      i=$((i+1))
    done
    rm -rf "$tmp"
  fi
fi

# --- 2. link source into public/ ---
ln -f "$SRC" "$HERE/public/src.mp4" 2>/dev/null || cp -f "$SRC" "$HERE/public/src.mp4"

# --- 3. render ---
cd "$HERE"
npx remotion render src/index.ts PerfectVfx "$OUT" \
  --props="$SPEC" --crf=16 --color-space=bt709 \
  --browser-executable="$HEADLESS_SHELL" \
  --log=error

echo "[render-cloud] done -> $OUT"
