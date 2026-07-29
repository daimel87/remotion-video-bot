#!/bin/bash
# Relanza el render de escenas si el proceso node muere, hasta tener las 94.
cd /home/user/remotion-video-bot || exit 1
while [ "$(ls out/papa-scenes/[0-9][0-9].mp4 2>/dev/null | wc -l)" -lt 94 ]; do
  echo "[$(date -u +%H:%M:%S)] supervisor: (re)lanzando node render_scenes.mjs" >> /tmp/papa-supervisor.log
  node scripts/render_scenes.mjs
  echo "[$(date -u +%H:%M:%S)] supervisor: node termino/murio, reintentando en 5s" >> /tmp/papa-supervisor.log
  sleep 5
done
echo "[$(date -u +%H:%M:%S)] supervisor: 94/94 LISTO" >> /tmp/papa-supervisor.log
