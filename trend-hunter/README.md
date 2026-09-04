# Trend Hunter

Encuentra videos que están "explotando" de forma anormal: un canal chico
(pocos suscriptores) con una cantidad de vistas fuera de lo normal para su
tamaño — ej. 13.000 suscriptores con 1.000.000 de vistas en una semana — y
que además el tema todavía tiene poca oferta en YouTube (oportunidad real
de producir antes de que se sature).

## Uso: la página HTML (`public/index.html`)

Igual que `outlier-tracker`: pegas tu clave de YouTube Data API v3 (se
guarda solo en tu navegador, nunca sale de tu dispositivo) y le das
**"🔍 Buscar outliers"**. La caja de temas es opcional:

- **Vacía** (por defecto): usa una lista de nichos específicos internos
  ("inundaciones", "terremoto", "historia real", "misterio sin resolver",
  "documental", "tragedia aérea", "sobrevivientes", "windows xp
  nostalgia") — no hace falta escribir nada, solo pegar la clave y buscar.
- **Con texto**: uno o más temas propios (uno por línea o separados por
  coma) para apuntar a algo específico en vez de los nichos por defecto.

**Importante: tienen que ser nichos acotados, no categorías anchas.**
Ordenar por vistas dentro de una categoría entera de YouTube (Noticias,
Entretenimiento...) o sin ningún filtro de tema siempre saca a los
canales gigantes — tienen millones de vistas de sobra y un canal chico
jamás les compite en ranking absoluto. Dentro de un nicho específico
("inundaciones" en vez de "noticias") hay muchísima menos competencia, y
ahí sí un canal chico puede aparecer entre los más vistos si de verdad
está explotando.

**100% YouTube, sin proxies ni servicios de terceros.** Versiones
anteriores de esta herramienta intentaban cruzar con Reddit, Google Trends
y Google News, pero esas fuentes bloquean por reputación de IP cualquier
tráfico que venga de proxies/datacenters (tu propio Worker incluido) — no
había forma confiable de arreglarlo. YouTube Data API sí funciona bien
desde el navegador con solo tu clave, sin bloqueos de ningún tipo.

## Qué es el % de viralidad

Combina dos cosas — **hace falta que ambas sean altas para llegar a
100%**:

- **Anomalía** (0-100%): `vistas ÷ suscriptores del canal`, comparado
  contra una referencia de 80x (80 veces sus suscriptores en vistas =
  100%). El ejemplo "13k subs, 1M vistas" (≈77x) da ≈99%.
- **Oportunidad** (0-100%): cuántos videos existen en total en YouTube
  sobre ese tema — menos oferta = más alto.

`viralidad% = raíz(anomalía × oportunidad)` — el mismo video outlier en un
tema saturado (miles de videos ya cubriéndolo) da un score mucho más bajo
que en un tema con poca competencia. Un canal grande con muchas vistas
pero proporcional a su tamaño normal (ej. 2M subs con 1M vistas) ni
aparece — no es anómalo.

## Los filtros

- **Publicado en los últimos N días**: ventana de tiempo para considerar
  el video "reciente" (default 7 días).
- **Canal chico: hasta N subs**: tope de suscriptores para considerar un
  canal "chico" (default 50.000). Si el canal oculta su contador de subs,
  se descarta (no se puede calcular la anomalía).
- **Vistas mínimas**: filtro de piso para no marcar como "outlier" un
  video con pocas vistas absolutas aunque el ratio sea alto (default
  100.000).
- **# de resultados**: cuántos outliers mostrar al final, de todos los
  temas combinados.

## Cuota de la API

Por cada tema: 1 búsqueda (100 unidades) + 1 lote de estadísticas de video
+ 1 lote de estadísticas de canal (1 unidad cada uno) ≈ 102 unidades. Con
los 5 temas por defecto son ~510 unidades de las 10.000 gratuitas diarias
— podés correrlo muchas veces al día sin problema.

## Limitaciones honestas

- Es una heurística sobre datos públicos de YouTube, no una predicción
  garantizada — revisa siempre el video antes de decidir producir sobre
  ese tema.
- "Oferta" se mide con `search.list` sobre el texto del tema tal cual lo
  escribiste — un tema mal redactado (muy genérico o muy específico) puede
  dar una cifra de oferta poco representativa.
- Los canales que ocultan su contador de suscriptores (`hiddenSubscriberCount`)
  quedan fuera del cálculo de anomalía porque no hay con qué comparar.
