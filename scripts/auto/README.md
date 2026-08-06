# Pipeline automático: audio → video con stock que SÍ ilustra lo narrado

Entregas un **audio** ya locutado y el sistema devuelve un **video** con
material de stock (Pexels/Pixabay) anclado a lo que se dice en cada momento.

La clave para que el material **coincida con la voz** (lo que MoneyPrinterTurbo
y similares hacen mal) son dos pasos de IA que hace **Claude en el flujo**:

1. **frase → query visual concreta en inglés** (no keywords abstractas), y
2. **verificación por visión**: mirar los clips candidatos y elegir el que de
   verdad ilustra la frase.

Todo se ancla al **SRT real** (regla del proyecto: *el SRT es ley*) y reutiliza
tu selector `pickFromPool` (sin repetir tomas) y tu render de Remotion.

## Requisitos

- `PEXELS_KEY` y/o `PIXABAY_KEY` (en el entorno, o pegadas en la UI paso 3).
- Whisper local para el paso 1: `pip install -U faster-whisper` (recomendado)
  — o pasar un SRT que ya tengas con `--srt`. La 1ª vez descarga el modelo
  (`small` por defecto; cambia con `WHISPER_MODEL=base|medium`) desde
  HuggingFace, así que necesita salida a `huggingface.co`.
- ffmpeg (ya viene con el compositor de Remotion).

## Interfaz web (recomendado)

```bash
node scripts/auto/server.mjs        # -> http://localhost:7788
```

Panel con los 4 pasos, **subida de audio** desde el navegador, editor de
queries y el **selector visual de candidatos** (clic en el clip que ilustra
cada frase). Las claves de Pexels/Pixabay se pueden pegar en el paso 3.

> Nota: el pipeline necesita salida a `huggingface.co` (modelo Whisper),
> `api.pexels.com` y `pixabay.com`. Correlo en una máquina/entorno con acceso
> a esos hosts.

## Flujo

```bash
# 1) Audio -> SRT real  (o --srt si ya lo tienes)
node scripts/auto/1-transcribe.mjs mi-audio.mp3 mivideo --lang es
#    (o)  node scripts/auto/1-transcribe.mjs mi-audio.mp3 mivideo --srt mi.srt

# 2) SRT -> tomas (~4s, texto+tiempos exactos) + plantilla de queries
node scripts/auto/2-shots.mjs mivideo

#  --> AQUÍ Claude rellena work/mivideo/queries.json:
#      por cada toma, un `pool`, un `kind` (videos|photos) y 2-4 `queries`
#      VISUALES CONCRETAS en inglés que ilustren la frase exacta.

# 3) Descargar candidatos de Pexels+Pixabay + sacar un frame de cada uno
PEXELS_KEY=xxx PIXABAY_KEY=yyy node scripts/auto/3-fetch.mjs mivideo

#  --> AQUÍ Claude mira los frames en work/mivideo/candidates/ y escribe
#      work/mivideo/picks.json = [{id, file, kind}] eligiendo, por cada toma,
#      el clip que MEJOR ilustra lo que se dice (descarta los que no).

# 4) Generar los ficheros que consume Remotion
node scripts/auto/4-emit.mjs mivideo
#    -> src/auto/cues.generated.ts + src/auto/pools.generated.ts

# 5) Render
npx remotion render AutoStockEdit renders/mivideo.mp4
```

## Ficheros de trabajo (por video, en `work/<nombre>/`)

| Fichero            | Lo escribe        | Contenido                                        |
|--------------------|-------------------|--------------------------------------------------|
| `meta.json`        | paso 1            | audio en public/, ruta del SRT, idioma           |
| `subtitles.srt`    | paso 1            | SRT real de la locución                          |
| `shots.json`       | paso 2            | tomas: texto exacto + startSec + durationSec     |
| `queries.json`     | paso 2 → **Claude** | pool + kind + queries visuales por toma        |
| `candidates.json`  | paso 3            | candidatos descargados + frame de cada uno       |
| `candidates/`      | paso 3            | frames JPG para revisión visual                  |
| `picks.json`       | **Claude**        | el clip elegido por toma `[{id, file, kind}]`    |

## Por qué coincide (y MPT no)

- **Por segmento, no global:** una query por frase, no 5 keywords para todo.
- **Query visual concreta en inglés:** "hombre triste mirando lluvia por la
  ventana", no "tristeza".
- **Verificación visual:** se descarta el clip que no ilustra la frase.
- **Anclado al SRT:** el clip se coloca en la ventana exacta donde se dice.
- **Sin repetir:** `pickFromPool` reparte el material (MIN_SEP).
