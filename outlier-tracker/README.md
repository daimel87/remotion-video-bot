# Outlier Tracker

Sitio que muestra videos de canales de YouTube con menos de 10.000 suscriptores
que están teniendo un desempeño "outlier": **+100% de vistas** (2x o más) sobre
la mediana de vistas de ese mismo canal, publicados en los **últimos 30 días**.

## Cómo funciona

1. `scripts/fetch-outliers.mjs` consulta la YouTube Data API v3 por cada nicho
   definido en `data/niches.json`, filtra canales pequeños, calcula la mediana
   de vistas reciente de cada canal y guarda los que superan el umbral en
   `public/data/outliers.json`.
2. `public/index.html` + `public/app.js` leen ese JSON y muestran una galería
   filtrable por nicho.
3. Un workflow de GitHub Actions (`.github/workflows/update-outliers.yml`)
   ejecuta el script cada 6 horas y publica `public/` en GitHub Pages
   automáticamente — así el sitio se mantiene actualizado solo.

## Configuración inicial (una sola vez)

1. **Secreto del repo**: en GitHub, ve a `Settings → Secrets and variables →
   Actions → New repository secret` y crea uno llamado `YOUTUBE_API_KEY` con
   tu clave de YouTube Data API v3.
2. **GitHub Pages**: en `Settings → Pages`, en "Source" elige **"GitHub
   Actions"** (no "Deploy from a branch").
3. Listo. El workflow correrá automáticamente cada 6 horas, o puedes
   dispararlo manualmente desde la pestaña **Actions → "Actualizar outliers y
   publicar sitio" → Run workflow**.

## Uso local

```bash
cd outlier-tracker
echo "YOUTUBE_API_KEY=tu_clave" > ../.env   # o exporta la variable de entorno
npm run fetch   # genera public/data/outliers.json
npm run serve   # sirve el sitio en http://localhost:4173
```

## Ajustar nichos

Edita `data/niches.json`. Cada entrada es `{ id, label, query }`, donde
`query` es el texto de búsqueda que se manda a la YouTube Search API.

## Ajustar umbrales

En `scripts/fetch-outliers.mjs`:

- `MAX_SUBSCRIBERS` (por defecto 10.000)
- `MIN_OUTLIER_PERCENT` (por defecto 100, es decir 2x la mediana del canal)
- `DAYS_WINDOW` (por defecto 30 días)

## Cuota de la API

Cada corrida consume aproximadamente 500-700 unidades de las 10.000
gratuitas diarias de YouTube Data API v3 (con 5 nichos). Correr cada 6 horas
(4 veces al día) usa ~2.000-3.000 unidades/día, dejando margen de sobra.
