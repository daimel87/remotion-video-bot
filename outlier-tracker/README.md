# Outlier Tracker

Sitio que muestra videos de canales de YouTube con menos de 10.000 suscriptores
que están teniendo un desempeño "outlier": **+100% de vistas** (2x o más) sobre
la mediana de vistas de ese mismo canal, publicados en los **últimos 30 días**.

## Cómo funciona

Todo corre **en tu navegador**, bajo demanda:

1. La primera vez que abres el sitio te pide tu clave de YouTube Data API v3.
   Se guarda solo en `localStorage` de tu navegador — nunca se envía a ningún
   servidor propio ni se sube al repositorio.
2. Al pulsar **"Actualizar ahora"**, `public/outliers-engine.js` llama
   directo a `googleapis.com` desde tu navegador: busca en los nichos de
   `public/data/niches.json`, filtra canales pequeños, calcula la mediana de vistas
   de cada uno y arma la lista de outliers.
3. El resultado se guarda en `localStorage` para que la próxima vez que
   abras el sitio veas los últimos datos sin gastar cuota, hasta que vuelvas
   a pulsar "Actualizar ahora".

No hay cron ni workflow corriendo en segundo plano ni consumiendo tu cuota
cuando no usas el sitio — solo se gasta cuota cuando tú decides refrescar.

## Publicar el sitio (una sola vez)

1. En GitHub: `Settings → Pages` → en "Source" elige **"GitHub Actions"**.
2. Cada vez que hagas push a `main` con cambios en `outlier-tracker/public/`,
   el workflow `.github/workflows/update-outliers.yml` publica el sitio
   automáticamente. También puedes dispararlo a mano desde la pestaña
   **Actions**.

No hace falta ningún secreto en GitHub: la clave la pone cada visitante en su
propio navegador.

## Uso local

```bash
cd outlier-tracker
npm run serve   # sirve el sitio en http://localhost:4173
```

Abre esa URL y pega tu clave cuando te la pida.

## (Opcional) Generar un snapshot desde la terminal

Si prefieres generar `public/data/outliers.json` desde línea de comandos en
vez de hacerlo en el navegador (por ejemplo para tener datos de respaldo la
primera vez que alguien visita el sitio):

```bash
echo "YOUTUBE_API_KEY=tu_clave" > ../.env
npm run fetch
```

## Ajustar nichos

Edita `public/data/niches.json`. Cada entrada es `{ id, label, query }`, donde
`query` es el texto de búsqueda que se manda a la YouTube Search API.

## Ajustar umbrales

En `public/outliers-engine.js` (y opcionalmente en `scripts/fetch-outliers.mjs`
si usas el snapshot por terminal):

- `MAX_SUBSCRIBERS` (por defecto 10.000)
- `MIN_OUTLIER_PERCENT` (por defecto 100, es decir 2x la mediana del canal)
- `DAYS_WINDOW` (por defecto 30 días)

## Cuota de la API

Cada búsqueda consume aproximadamente 500-700 unidades de las 10.000
gratuitas diarias de YouTube Data API v3 (con 5 nichos). Como solo se gasta
cuota cuando pulsas "Actualizar ahora", puedes usarlo varias veces al día sin
problema.
