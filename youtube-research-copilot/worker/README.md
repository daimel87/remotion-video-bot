# Proxy de transcripciones (Cloudflare Worker)

YouTube no permite leer la página de un video desde el navegador de otro
sitio (bloqueo CORS), así que la app web necesita un pequeño servidor
intermedio que sí pueda hacerlo. Cloudflare Workers tiene una capa gratuita
generosa (100.000 peticiones/día) que no debería pedirte tarjeta de crédito
para este uso.

## Desplegar (5 minutos, sin instalar nada)

1. Crea una cuenta gratis en https://dash.cloudflare.com/sign-up (si no tienes una).
2. En el panel, ve a **Workers & Pages** → **Create** → **Create Worker**.
3. Ponle un nombre (ej: `yt-transcript-proxy`) y dale a **Deploy** (se crea con código de ejemplo).
4. Dale a **Edit code**.
5. Borra todo el contenido del editor y pega el contenido completo de
   `transcript-proxy.js` (este mismo folder).
6. Dale a **Deploy** (o **Save and deploy**).
7. Copia la URL que te da (algo como `https://yt-transcript-proxy.tu-usuario.workers.dev`).
8. Pégala en la app web del Research Copilot, en **⚙ Configurar claves** → "URL de tu proxy de transcripciones".

## Probarlo

Abre en el navegador (reemplaza `TU-WORKER` y `VIDEO_ID`):

```
https://TU-WORKER.workers.dev/?videoId=VIDEO_ID
```

Deberías ver un JSON con `text`, `hook`, `language`. Si da `null`, ese video
no tiene subtítulos disponibles (pasa con algunos videos) — probá con otro.

## Notas

- No usa tu clave de YouTube ni gasta cuota de la API oficial — es una
  petición aparte, directa a youtube.com.
- Sigue siendo el mismo método no oficial (ver advertencia en el README
  principal): puede fallar sin aviso si YouTube cambia algo.
- Si más adelante quieres actualizar el código del Worker, repite el paso 5
  con la versión nueva del archivo.
