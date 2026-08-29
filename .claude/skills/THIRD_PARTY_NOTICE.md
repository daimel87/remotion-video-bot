# Origen de estos skills

`ffmpeg/`, `video-download/`, `video-edit/` y `video-understand/` se copiaron
tal cual desde el proyecto open-source **OpenMontage**
(https://github.com/calesthio/OpenMontage), licenciado bajo **GNU AGPLv3**.

No se instaló el framework completo de OpenMontage (12 pipelines, generación
de video con IA en la nube, avatares, etc.) — solo estos 4 skills de
referencia de comandos (ffmpeg, yt-dlp, análisis de video), que no dependen
de su librería de componentes ni de sus scripts Python de orquestación
(salvo `video-understand/scripts/understand_video.py`, que sí es un script
independiente, standalone, sin llamadas a servicios externos de pago).

Requisitos para que funcionen en esta máquina: `ffmpeg`/`ffprobe` en el PATH
(el proyecto ya trae su propio ffmpeg vía `@remotion/compositor-linux-x64-gnu`,
pero estos skills asumen el binario del sistema), `yt-dlp` (ya usado en el
proyecto), y opcionalmente `pip install openai-whisper` para transcripción
en `video-understand`.

## youtube-skills (títulos, miniaturas, ganchos, plan de contenido)

`yt-title-optimizer/`, `yt-thumbnail-brief/`, `yt-hook-scripter/`,
`yt-description-writer/`, `yt-content-planner/`, `yt-community-post-writer/`,
`yt-channel-optimizer/`, `yt-repurposer/`, `yt-audience-insights/` y la carpeta
compartida `.claude/references/` se copiaron tal cual desde el proyecto
open-source **youtube-skills** de Sergey Bulaev
(https://github.com/sergebulaev/youtube-skills), licenciado bajo **MIT**.

No se instalaron `lib/`, `scripts/` ni la integración de auto-publicación vía
Publora (requiere credenciales propias en `.env`) — solo los 9 skills de
referencia (formulas de título/gancho, principios de miniatura, heurísticas
de algoritmo) que no dependen de esas piezas. Los skills referencian
`../../references/*.md`, por eso esos archivos compartidos viven en
`.claude/references/` (dos niveles arriba de cada `.claude/skills/yt-*/`).
