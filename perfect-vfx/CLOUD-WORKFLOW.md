# Perfect VFX — flujo adaptado a la nube (Claude Code)

La skill original está pensada para correr en la máquina local del usuario
(WhisperX local, fuentes instaladas, `~/Documents/Perfect VFX/`, descarga del
navegador de Remotion). En este entorno de nube adaptamos SOLO la parte de
infraestructura; toda la lógica creativa del Director sigue igual.

## Qué cambia respecto a SKILL.md

| Paso original | Adaptación en la nube |
|---|---|
| Transcripción con WhisperX local (`scripts/transcribe_to_srt.py`) | El usuario provee el **SRT de Buzz**. No se corre WhisperX. |
| `node setup.mjs` descarga el navegador de Remotion (`remotion.media`) | Host bloqueado. Se usa el **headless_shell preinstalado** del entorno. |
| Fuentes de Google Fonts al render | Chrome no confía en el CA del proxy por defecto → se importa el CA al **NSS store** (lo hace `render-cloud.sh`, idempotente). |
| Carpetas en `~/Documents/Perfect VFX/` | Todo vive en el repo. |
| El usuario sube solo la sección | El usuario sube el clip al repo con la **GitHub app**. |

## Flujo

1. **Usuario:** sube el clip HeyGen (la sección a tratar) al repo + pasa el SRT de Buzz.
2. **Director (Claude):** intake (ffprobe + volumedetect + cut list + shot map),
   segmenta beats sobre el SRT, escribe `spec.json` anclado al habla
   (validar contra `schemas/edit-decision-spec.schema.json`).
   Tema por defecto acordado: **liquid-glass**.
3. **Plan gate:** se presenta el beat chart en el chat, el usuario aprueba/edita.
4. **Render:**
   ```bash
   cd perfect-vfx/renderer
   ./render-cloud.sh <clip.mp4> <spec.json> <out/baked.mp4>
   ```
5. **Verificación:** paridad ffprobe (w/h/fps/frames/pix_fmt yuv420p/bt709),
   extraer frames de cada evento y mirarlos vs el board del tema, cut-sync check.
6. **Entrega:** MP4 baked + link raw de GitHub.

## Requisitos del entorno (ya resueltos en este contenedor)

- Node 22 ✅
- ffmpeg/ffprobe ✅ (`apt-get install -y ffmpeg`)
- headless_shell ✅ (`/opt/pw-browsers/chromium_headless_shell-1194/...`)
- CA del proxy en NSS ✅ (lo hace `render-cloud.sh`; requiere `libnss3-tools`)
- deps del renderer ✅ (`npm install` en `renderer/`)

> Nota: `node_modules/` del renderer NO se commitea (gitignored, ~677MB).
> En un contenedor nuevo hay que reinstalar: `cd perfect-vfx/renderer && npm install`
> y `apt-get install -y ffmpeg libnss3-tools`.
