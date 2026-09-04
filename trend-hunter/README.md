# Trend Hunter

Detecta temas que están empezando a moverse **antes** de que exploten en
YouTube — el tipo de señal que hubiera marcado "inundaciones en Nepal" el 26
de agosto, antes de que el primer video viral saliera.

## Uso principal: la página HTML (`public/index.html`)

Es la forma recomendada — igual que `outlier-tracker`: abres la página,
pegas tu clave de YouTube Data API v3 (se guarda solo en tu navegador,
nunca sale de tu dispositivo) y ves los temas ordenados por **% de
viralidad**. Nada más que configurar — el cruce con Reddit/Trends/Noticias
funciona solo, sin cuentas ni claves extra.

### Qué es el % de viralidad

Combina dos cosas — **hace falta que ambas sean altas para llegar a 100%**:

- **Tendencia** (0-100%): sale de **cruzar Reddit + Google Trends + Google
  News + lo que tú pegues de X** — un tema que aparece en 3-4 fuentes a la
  vez puntúa mucho más alto que uno que solo suena en una. Esto es lo que
  de verdad detecta algo "antes de que explote", no solo lo que ya está
  viral en YouTube.
- **Oportunidad** (0-100%): qué tan poca "oferta" hay ya en YouTube para ese
  tema — menos videos existentes cubriéndolo = más alto.

`viralidad% = raíz(tendencia × oportunidad)` — un tema sonando fuerte en
todos lados pero con 500+ videos ya cubriéndolo da un score bajo; un tema
recién cruzando 3 fuentes y con casi nadie cubriéndolo en YouTube da un
score alto. Ese es justo el caso "Nepal el 26 de agosto, antes del primer
video viral".

### Cómo se salta el bloqueo de CORS

Reddit, Google Trends y Google News no dejan llamarlos directo desde el
navegador de otro sitio (bloqueo CORS). La página lo resuelve sola, sin que
tengas que instalar ni configurar nada: pasa por un proxy CORS público y
gratuito (`api.allorigins.win`). Al ser un servicio de terceros puede ser
algo más lento o fallar de vez en cuando — si eso pasa, esa fuente
simplemente devuelve 0 resultados esa vez y las demás siguen funcionando
(no se rompe la página).

Si ninguna fuente cruzada responde, la página cae como último recurso a
estimar la tendencia solo con la velocidad de vistas en YouTube — se avisa
en el resultado cuando pasa eso.

### X/Twitter

X no tiene API de tendencias gratuita desde 2023 y no se scrapea (no hay
forma confiable de hacerlo sin login). En vez de eso, hay un cuadro de
texto en la página para pegar a mano lo que tú veas trending en X — se
guarda en tu navegador y se cruza igual que las demás fuentes.

### Dos modos

1. **Descubrir tendencias cruzadas**: junta Reddit (rising + subs de
   noticias) + Google Trends + Google News + tu lista de X, agrupa por
   palabra clave y muestra los temas que aparecen en 2 o más fuentes a la
   vez, ordenados por % de viralidad.
2. **Buscar un tema puntual**: escribes cualquier cosa (ej. "inundaciones
   Nepal") y calcula tendencia (cruzando las fuentes disponibles) +
   oportunidad para ese tema específico. Si ninguna fuente cruzada tiene
   señal, cae a estimar con la velocidad de vistas de los videos que ya
   existen en YouTube sobre ese tema.

### Cuota de la API de YouTube

Cada tema revisado gasta ~100 unidades (por la búsqueda de oferta) de las
10.000 gratuitas diarias. Con 15 temas (default) son ~1.500 unidades —
puedes correrlo varias veces al día sin problema. Baja el "# de temas a
analizar" si quieres gastar menos por corrida. El cruce con Reddit/Trends/
Noticias no gasta cuota de YouTube (es tráfico aparte).

### Publicar la página

Se publica junto a `outlier-tracker` en el mismo sitio de GitHub Pages
(`.github/workflows/update-outliers.yml` ya incluye `trend-hunter/public/**`)
en la ruta `/trends/`. También puedes abrir `public/index.html` directo en
tu navegador sin publicar nada.

## Uso alternativo (avanzado): script de terminal

Además de la página HTML, hay un script de terminal equivalente (misma
lógica de cruce de fuentes) para quien prefiera correrlo desde la
consola o comparar corridas sucesivas guardadas en disco.

```bash
cd trend-hunter
echo "YOUTUBE_API_KEY=tu_clave" > ../.env   # opcional; reutiliza la del outlier-tracker
npm run hunt
```

Opciones:

```bash
npm run hunt -- --geo NP,US     # limitar a países específicos (por defecto: NP, US, MX, ES)
npm run hunt -- --top 15        # cuántos temas mostrar (default 20)
```

También se puede disparar desde GitHub: pestaña **Actions → "Trend Hunter
(corrida manual)" → Run workflow**. Guarda cada snapshot en la rama
`trend-hunter-data` para poder comparar corridas y medir aceleración; el
reporte completo queda en el resumen del run (Actions → el run →
"Summary").

Ajustar qué vigila: edita `config/seeds.json` (`geos`, `redditSubs`,
`watchKeywords`, `stopwords`).

## Limitaciones honestas

- El % de viralidad es una heurística por palabras (agrupa por token, no
  por evento/entidad real), no una predicción garantizada — revisa siempre
  las muestras/links de cada tarjeta antes de decidir producir.
- Reddit, Google Trends y Google News son endpoints no oficiales/públicos
  (tanto en el Worker como en el script de terminal): pueden cambiar de
  formato sin aviso. No truenan si una fuente cae — esa fuente devuelve 0
  resultados y las demás siguen funcionando.
- El cuadro de "tendencias en X" es 100% manual — nadie lo llena por ti.
