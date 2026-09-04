# Trend Hunter

Detecta temas que están empezando a moverse **antes** de que exploten en
YouTube — el tipo de señal que hubiera marcado "inundaciones en Nepal" el 26
de agosto, antes de que el primer video viral saliera.

## Cómo funciona

No hay una sola "API de tendencias" confiable y gratuita, así que este
script cruza varias fuentes públicas y busca **temas que aparecen en dos o
más fuentes distintas al mismo tiempo** — esa coincidencia es la señal de
que algo está subiendo de verdad, no ruido de una sola fuente:

1. **Reddit** (sin API key): `r/all/rising` (la señal más temprana: posts
   ganando tracción rápido) + top diario de subs de noticias
   (`r/worldnews`, `r/news`, etc.) + búsqueda de palabras "vigía".
2. **Google Trends** (sin API key, endpoint no documentado que usa la propia
   web de Google Trends): tendencias diarias por país.
3. **Prensa y TV** (sin API key, vía RSS de Google News, que agrega miles de
   medios incluyendo canales de TV): titulares top por país + búsqueda de
   palabras "vigía".
4. **YouTube Data API v3** (reutiliza la misma `YOUTUBE_API_KEY` que
   `outlier-tracker` y `youtube-research-copilot`): para los temas que ya
   tienen señal cruzada, revisa cuántos videos recientes hay y a qué
   velocidad (vistas/hora). Si el tema tiene mucha señal en noticias/Reddit/
   Trends pero **casi ningún video todavía**, se marca como
   `🟢 HUECO EN YOUTUBE` — el momento ideal para producir antes que otros.

### X/Twitter

X no tiene API de tendencias gratuita desde 2023 (requiere plan de pago). No
se scrapea porque no hay forma confiable/estable de hacerlo sin login. Si ves
algo trending en X a simple vista, agrégalo a mano en
`config/seeds.json` → `watchKeywords` y se cruzará automáticamente con las
demás fuentes en la siguiente corrida.

## Uso

```bash
cd trend-hunter
echo "YOUTUBE_API_KEY=tu_clave" > ../.env   # opcional pero recomendado; reutiliza la del outlier-tracker
npm run hunt
```

Opciones:

```bash
npm run hunt -- --geo NP,US     # limitar a países específicos (por defecto: NP, US, MX, ES)
npm run hunt -- --top 15        # cuántos temas mostrar (default 20)
```

Cada corrida guarda el reporte completo en `output/hunt-<fecha>.json`
(ignorado por git) para que puedas revisar el detalle de cada fuente.

## Ajustar qué vigila

Edita `config/seeds.json`:

- `geos`: países/idiomas a monitorear (Google Trends + Google News).
- `redditSubs`: subreddits de noticias a revisar.
- `watchKeywords`: palabras clave tipo "desastre/disturbio" que se buscan
  activamente en Reddit y noticias en cada corrida (no dependen de que ya
  estén en portada).
- `stopwords`: palabras comunes que se ignoran al cruzar títulos.

## Limitaciones honestas

- Google Trends y el scraping de RSS usan endpoints no oficiales/públicos;
  pueden cambiar de formato sin aviso (igual que el mecanismo de
  transcripciones de `youtube-research-copilot`). El script no falla si una
  fuente cae — simplemente la reporta como 0 resultados y sigue con las
  demás.
- El cruce de señales es una heurística por palabras (tokenización simple),
  no NLP real: agrupa por token, no por evento/entidad. Para temas con
  nombres poco comunes (p. ej. un lugar específico) puede que el token
  correcto no coincida entre fuentes con la misma frecuencia — revisa
  siempre las `samples` de cada fila antes de decidir producir.
- Es una foto del momento en que corres el script, no monitoreo continuo.
  Para vigilancia real, corre `npm run hunt` varias veces al día (o
  automatízalo con un workflow de GitHub Actions con cron) y compara los
  JSON entre corridas para ver qué temas están **acelerando**.
