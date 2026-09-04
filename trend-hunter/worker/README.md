# Proxy propio (Cloudflare Worker) — la forma que sí funciona

La página intenta primero varios proxies CORS públicos gratuitos
(allorigins.win, corsproxy.io, codetabs.com) para que funcione sin
configurar nada. **En la práctica fallan seguido**, no porque estén caídos,
sino porque muchos ad-blockers y navegadores con protección de privacidad
(uBlock Origin, Brave Shields, Firefox con protección estricta, DuckDuckGo
Browser...) los tienen en sus listas de bloqueo — son dominios conocidos
como "proxies de evasión" y las listas los tapan por defecto, sin avisarte.

La forma confiable es tener **tu propio** proxy: un Cloudflare Worker con tu
propio dominio (`tu-nombre.workers.dev`), que no está en ninguna lista de
bloqueo. Gratis, 100.000 peticiones/día, sin tarjeta.

## Desplegar (5 minutos)

1. Cuenta gratis en https://dash.cloudflare.com/sign-up.
2. **Workers & Pages** → **Create** → **Create Worker**.
3. Nómbralo (ej: `trend-hunter-proxy`) y **Deploy**.
4. **Edit code** → borra todo → pega el contenido completo de
   `social-proxy.js` (este mismo folder) → **Deploy**.
5. Copia la URL (`https://trend-hunter-proxy.tu-usuario.workers.dev`).
6. Pégala en la página de Trend Hunter, en **🔑 Clave de YouTube y proxy**.

## Probarlo

```
https://TU-WORKER.workers.dev/?source=reddit&mode=rising
https://TU-WORKER.workers.dev/?source=trends&geo=US&hl=en-US
https://TU-WORKER.workers.dev/?source=news&hl=en-US&gl=US&ceid=US:en
```

Deberías ver `{"items": [...]}`. Si ves `error`, esa fuente puede estar
temporalmente caída o haber cambiado de formato — revisa el mensaje.

## Sin proxy propio configurado

La página igual lo intenta con los proxies públicos por si tu navegador no
los bloquea, pero si te sigue dando "no se pudo contactar", esta es la
solución real, no un parche temporal.
