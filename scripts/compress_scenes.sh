#!/bin/bash
# Comprime cada clip a buena calidad (CRF 21) para reducir tamaño sin perder
# calidad visible, manteniendo la numeracion 01-94.
cd /home/user/remotion-video-bot/out || exit 1
FF=/home/user/remotion-video-bot/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg
mkdir -p papa-scenes-c
for i in $(seq 1 94); do
  n=$(printf '%02d' $i)
  in="papa-scenes/$n.mp4"
  out="papa-scenes-c/$n.mp4"
  [ -f "$out" ] && continue
  [ -f "$in" ] || continue
  "$FF" -y -i "$in" -c:v libx264 -crf 27 -preset veryfast -pix_fmt yuv420p -an "$out.part.mp4" >> /tmp/papa-compress.log 2>&1 \
    && mv "$out.part.mp4" "$out" \
    && echo "[$(date -u +%H:%M:%S)] C $n done" >> /tmp/papa-compress.log \
    || echo "[$(date -u +%H:%M:%S)] C $n FAILED" >> /tmp/papa-compress.log
done
echo "[$(date -u +%H:%M:%S)] COMPRESS ALL DONE" >> /tmp/papa-compress.log
