# Plan: App local de audio → video automático

## Objetivo final
Abrir una página web local (`http://localhost:3000`), subir un audio,
hacer clic en "Generar", y recibir el video final. Sin cmd, sin Claude
Code, sin pasos manuales. Claude Code solo se usa UNA VEZ, el martes,
para construir todo esto.

## Arquitectura completa

```
[Interfaz web local]  ← subes el audio aquí, ves progreso, descargas el video
        │
        ▼
[servidor Express local] recibe el audio y dispara el pipeline
        │
        ▼
[1] transcribe.py (faster-whisper, local, gratis)
        │
        ▼
[2] generar-keywords.mjs (compromise, local, gratis, sin API)
        │
        ▼
[3] download-generico.mjs (Pexels/Pixabay, ya lo tienes)
        │
        ▼
[4] Remotion render → video final
        │
        ▼
[Interfaz web] muestra "✅ Listo" + botón de descarga
```

## Preparación antes de abrir Claude Code (10 min)

1. Verificar Python instalado: `python --version`
2. Tener a mano las API keys de Pexels y Pixabay
3. Tener un audio corto de prueba (30-60 seg) en `audio/prueba.mp3`
4. Abrir Claude Code dentro del proyecto:
   ```
   cd C:\Users\Daimel\Documents\GitHub\remotion-video-bot
   claude
   ```

## PROMPT 1 — Exploración (pegar primero)

```
Tengo un proyecto Remotion en Node.js para generar videos automáticamente
a partir de un audio narrado. Antes de escribir código, explora el repo
y dime cómo está estructurado, específicamente:

1. Qué hace exactamente scripts/download-odisea.mjs y los otros scripts
   .mjs similares que tengo (cómo llaman a Pexels/Pixabay, qué formato
   de keywords usan, dónde guardan los clips descargados)
2. Cómo está armada la composición de Remotion en src/ (qué props recibe,
   cómo consume los clips de video para renderizar)
3. Qué scripts ya existen en package.json

Dame un resumen antes de que sigamos.
```

Espera la respuesta y confirma que coincide con lo que tú sabes del repo.

## PROMPT 2 — Construcción del pipeline (backend)

```
Perfecto. Ahora quiero automatizar todo el flujo para que reciba solo
un archivo de audio y entregue el video final, SIN usar ninguna API de
pago para generar las keywords — todo debe correr localmente y gratis.
Necesito que crees:

1. scripts/transcribe.py — usa faster-whisper para transcribir el audio
   recibido como argumento, y genera output/transcripcion.json con esta
   estructura: [{"texto": "...", "inicio": 0.0, "fin": 3.2}, ...]
   Instala faster-whisper si no está en el entorno. Usa el modelo "base"
   o "small" para que sea rápido en CPU.

2. scripts/generar-keywords.mjs — lee transcripcion.json, agrupa los
   segmentos en bloques de ~5-8 segundos, y usa la librería "compromise"
   para extraer sustantivos, nombres y frases clave de cada bloque, sin
   llamar a ninguna API externa. Ajusta las keywords a inglés (los bancos
   de stock funcionan mejor en inglés). Guarda en output/keywords.json:
   [{"inicio": 0.0, "fin": 6.5, "keywords": ["dark forest", "man walking"]}]

3. scripts/download-generico.mjs — basado en el patrón de mis scripts
   existentes, pero que lea keywords.json en vez de tener las keywords
   escritas a mano.

4. scripts/run-all.mjs — el orquestador que corre todo en orden:
   transcribe.py → generar-keywords.mjs → download-generico.mjs →
   render de Remotion. Debe aceptar un callback o emitir eventos de
   progreso (lo vamos a necesitar para la interfaz web en el siguiente
   paso), y devolver la ruta del video final al terminar.

5. Agrega en package.json: "make-video": "node scripts/run-all.mjs"

Ve paso por paso, prueba cada script con audio/prueba.mp3, y no avances
al siguiente hasta que el anterior funcione bien.
```

## PROMPT 3 — Interfaz web local (una vez que el backend funcione)

```
El pipeline por línea de comandos ya funciona bien. Ahora quiero una
interfaz web local simple para no depender de cmd ni de Claude Code
para generar videos en el día a día. Necesito:

1. Un servidor Express (scripts/server.mjs) que:
   - Sirva una página web simple en http://localhost:3000
   - Tenga un endpoint POST /generar que reciba un archivo de audio
     subido (usa multer para el upload)
   - Ejecute run-all.mjs con ese audio
   - Use Server-Sent Events o WebSockets para enviar el progreso en
     tiempo real a la página ("Transcribiendo...", "Descargando clips...",
     "Renderizando...", "Listo")
   - Al terminar, exponga el video final para descargar

2. Una página HTML simple (public/index.html) con:
   - Un botón/zona de "arrastrar audio aquí" o input de archivo
   - Un botón "Generar video"
   - Una barra o lista de progreso que se actualice en tiempo real
   - Un botón de descarga que aparezca cuando el video esté listo
   - Diseño simple pero limpio, no hace falta que sea elaborado

3. Agrega en package.json: "start": "node scripts/server.mjs"
   Así el uso final es: correr `npm start` una vez, dejar esa ventana
   abierta, y usar http://localhost:3000 en el navegador para generar
   videos cuantas veces quiera, sin volver a tocar cmd ni Claude Code.

4. Opcional: crea un archivo iniciar.bat que corra "npm start" y abra
   automáticamente el navegador en localhost:3000, para que sea un
   doble clic y listo.

Prueba todo el flujo completo: subir audio de prueba desde el navegador
y confirmar que el video final se genera y se puede descargar.
```

## Uso final (después del martes)

1. Doble clic en `iniciar.bat` (o `npm start` una vez)
2. Se abre `http://localhost:3000` en el navegador
3. Subes el audio, clic en "Generar"
4. Ves el progreso en pantalla
5. Descargas el video cuando esté listo

Cero cmd, cero Claude Code, cero costo por video generado.

## Notas importantes

- Todo el procesamiento (Whisper, keywords, FFmpeg/Remotion) sigue
  corriendo en tu PC — la "app web" es solo la interfaz, no cambia
  el motor de fondo.
- Los únicos costos recurrentes son las llamadas a Pexels/Pixabay
  (gratis dentro de sus límites de API) — nada de IA de pago en el
  ciclo normal de generar videos.
- Si algún día quieres mejorar la calidad de las keywords y no te
  importa gastar un poco, se puede agregar Claude Code en modo
  headless (`claude -p`) como opción alternativa dentro de
  generar-keywords.mjs — pero no es necesario para que la app funcione.
