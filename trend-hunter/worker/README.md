# Proxy social (Cloudflare Worker)

Reddit, Google Trends y Google News no dejan llamarlos directo desde el
navegador de otro sitio (bloqueo CORS), así que la página de Trend Hunter
necesita un pequeño servidor intermedio que sí pueda hacerlo — igual que
`youtube-research-copilot/worker` hace para las transcripciones de YouTube.
Cloudflare Workers tiene una capa gratuita generosa (100.000 peticiones/día)
que no debería pedirte tarjeta de crédito para este uso.

## Desplegar (5 minutos, sin instalar nada)

1. Crea una cuenta gratis en https://dash.cloudflare.com/sign-up (si no
   tienes una; puedes reutilizar la misma que uses para el worker de
   transcripciones).
2. En el panel, ve a **Workers & Pages** → **Create** → **Create Worker**.
3. Ponle un nombre (ej: `trend-hunter-proxy`) y dale a **Deploy**.
4. Dale a **Edit code**.
5. Borra todo el contenido del editor y pega el contenido completo de
   `social-proxy.js` (este mismo folder).
6. Dale a **Deploy** (o **Save and deploy**).
7. Copia la URL que te da (algo como
   `https://trend-hunter-proxy.tu-usuario.workers.dev`).
8. Pégala en la página de Trend Hunter, en **🔑 Cambiar clave API** → "URL
   de tu proxy social".

## Probarlo

Abre en el navegador (reemplaza `TU-WORKER`):

```
https://TU-WORKER.workers.dev/?source=reddit&mode=rising
https://TU-WORKER.workers.dev/?source=trends&geo=US&hl=en-US
https://TU-WORKER.workers.dev/?source=news&hl=en-US&gl=US&ceid=US:en
```

Deberías ver un JSON con `items: [...]`. Si ves `error` en vez de eso, la
fuente puede estar temporalmente caída o haber cambiado de formato — revisa
el mensaje.

## Sin el proxy configurado

La página funciona igual, pero **el % de viralidad se calcula solo con
YouTube** (tendencia = vistas/hora del video, en vez del cruce con
Reddit/Google Trends/Noticias). En la página se avisa claramente cuando
está en ese modo.

## Notas

- No usa tu clave de YouTube ni gasta su cuota — es tráfico aparte, directo
  a Reddit/Google.
- Son endpoints no oficiales/públicos (igual que el mecanismo de
  transcripciones): pueden cambiar de formato sin aviso. El Worker no
  truena si una fuente falla — devuelve `items: []` para esa fuente y la
  página sigue con las demás.
- Si más adelante actualizas el código del Worker, repite el paso 5 con la
  versión nueva del archivo.
