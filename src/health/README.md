# Canal de salud / cocina frugal para seniors (50+)

Plantilla basada en el análisis del video de referencia (listicle de comidas
económicas). Reutiliza el sistema del documental del CD, re-skineado para
seniors: **texto grande, alto contraste, paleta cálida de cocina, ritmo calmado**.

## Estado
- ✅ Componentes, textos, transiciones (crossfade), HUD y barra de progreso.
- ✅ Renderiza HOY con **fondos procedurales** (no necesita media descargada).
- ⏳ Falta enchufar: tu voz (MP3), transcripción de Buzz, música de fondo y el stock real.

## Cómo terminar el video real (mañana)
1. **Voz:** copia tu MP3 a `public/audio/health-narration.mp3`.
2. **Música (opcional):** copia la cama a `public/audio/health-music.mp3`.
   Va a volumen `0.14` (~18 dB bajo la voz, como en el video de referencia).
3. **Transcripción:** reemplaza `src/health/sampleCues.ts` por los cues de Buzz
   (mismo formato `{i, start, end, text}`) y ajusta `DURATION_SECONDS`.
4. **Overlays:** en `src/health/plan.ts` ajusta `RECIPES` (lista de recetas) y
   `OVERLAYS` (qué texto/precio/tarjeta sale en cada cue).
5. **Flags** en `src/HealthCookingEdit.tsx`:
   - `HAS_NARRATION = true`
   - `HAS_MUSIC = true` (si hay música)
   - `ASSET_MODE = 'media'` (cuando ya haya stock descargado)

## Descargar el material (te doy la lista exacta cuando vea la transcripción)
- **Stock de comida (Pexels):** `node scripts/download-health-stock.mjs TU_CLAVE`
  → `public/stock-health/{photos,videos}`, nombrado por `base` (p.ej. `lentil-soup-1.jpg`).
- **Archivo vintage (yt-dlp, fair use):** `node scripts/download-health-archival.mjs`
  → `public/archival-health/`.

Con el stock descargado, se completa el resolver `mediaFor()` en
`HealthCookingEdit.tsx` (base → archivo) y se pone `ASSET_MODE = 'media'`.

## Preview
`npx remotion studio` → composición **HealthCookingEdit**, o
`npx remotion render HealthCookingEdit salida.mp4`.
