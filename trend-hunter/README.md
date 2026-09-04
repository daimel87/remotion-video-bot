# Trend Hunter

Detecta temas que están empezando a moverse **antes** de que exploten en
YouTube — el tipo de señal que hubiera marcado "inundaciones en Nepal" el 26
de agosto, antes de que el primer video viral saliera.

## Cómo detecta "temprano" (lo importante)

Cruzar fuentes en un solo momento **no basta** — te dice "esto ya suena en
2+ lugares ahora", pero no si está acelerando. La detección temprana real
viene de comparar **corridas sucesivas** en el tiempo:

1. Cada corrida guarda su resultado (`output/latest.json` +
   `output/history/`).
2. La siguiente corrida carga el snapshot anterior y calcula, por cada
   tema, `scorePerHour` = cuánto subió su score entre una corrida y la
   otra. Un tema con `⚡ +12.8/h` está acelerando de verdad; uno con score
   alto pero estable no.
3. Los temas se ordenan primero por **🆕 NUEVO** (no existía en la corrida
   anterior) o **aceleración alta**, y solo después por score absoluto —
   así lo que importa no se pierde entre lo que ya es viejo pero grande.
4. Se cruza con YouTube: si el tema acelera pero YouTube casi no tiene
   videos todavía, se marca `🟢 HUECO EN YOUTUBE` — el momento óptimo para
   producir.

**El tiempo mínimo de detección depende de qué tan seguido corras el
script.** Una corrida suelta de vez en cuando no detecta aceleración (no
tiene con qué comparar). Por eso se agregó automatización (ver abajo):
corriendo cada 30 min, el peor caso para notar que algo está acelerando es
~30-60 min desde que empezó a moverse — limitado por qué tan seguido
actualizan sus datos las fuentes gratuitas (Reddit `rising` es casi en
tiempo real; Google Trends "daily trends" solo se actualiza unas pocas
veces al día, no en tiempo real, aunque el paso de noticias/Reddit sí
puede adelantarse a eso).

## Automatizar (para no depender de correrlo a mano)

`.github/workflows/trend-hunter.yml` corre el script cada 30 minutos en
GitHub Actions, sin que tengas que hacer nada:

- Guarda cada snapshot en la rama `trend-hunter-data` (rama de datos
  gestionada por el bot, separada del código — no la edites a mano).
- Publica el reporte de cada corrida como **resumen del run** (pestaña
  Actions → el run → "Summary"), así puedes revisar rápido sin descargar
  nada.
- Necesita el secreto `YOUTUBE_API_KEY` en
  `Settings → Secrets and variables → Actions` del repo (opcional: sin él,
  se omite solo el chequeo de "hueco en YouTube").

**Importante:**
- Los workflows con `schedule` de GitHub solo se disparan cuando el
  archivo vive en la rama por defecto (`main`). Mientras este cambio no
  esté fusionado, solo puedes dispararlo a mano desde la pestaña Actions
  ("Run workflow").
- GitHub **desactiva automáticamente** los workflows programados si el
  repo pasa 60 días sin actividad — si un día ves que dejó de correr,
  revisa la pestaña Actions y reactívalo.
- Reddit y Google (Trends/News) son endpoints no oficiales; correr cada 30
  min desde los runners compartidos de GitHub Actions puede eventualmente
  toparse con límites de tasa. Si empiezas a ver muchos 403 en el resumen,
  baja la frecuencia del cron en el workflow (por ejemplo a cada hora).

## Cómo funciona (fuentes)

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
