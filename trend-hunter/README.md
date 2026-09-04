# Trend Hunter

Detecta temas que están empezando a moverse **antes** de que exploten en
YouTube — el tipo de señal que hubiera marcado "inundaciones en Nepal" el 26
de agosto, antes de que el primer video viral saliera.

## Uso principal: la página HTML (`public/index.html`)

Es la forma recomendada — igual que `outlier-tracker`: abres la página, pegas
tu clave de YouTube Data API v3 (se guarda solo en tu navegador, nunca sale
de tu dispositivo) y ves la lista ordenada por **% de viralidad**.

### Qué es el % de viralidad

Combina dos cosas — **hace falta que ambas sean altas para llegar a 100%**:

- **Tendencia** (0-100%): qué tan rápido está ganando vistas el video
  (vistas/hora), comparado contra los demás temas de esa corrida.
- **Oportunidad** (0-100%): qué tan poca "oferta" hay ya en YouTube para ese
  tema — menos videos existentes cubriéndolo = más alto. Se calcula
  buscando el tema en YouTube y viendo cuántos resultados hay.

`viralidad% = raíz(tendencia × oportunidad)` — un tema con tendencia 100%
pero mucha oferta (500+ videos ya cubriéndolo) da un score bajo; un tema con
tendencia alta y casi nadie cubriéndolo todavía da un score alto. Ese es
justo el caso "Nepal el 26 de agosto, antes del primer video viral".

### Dos modos

1. **Tendencias oficiales**: llama al `chart=mostPopular` de YouTube por
   país/categoría (la lista oficial de trending) y calcula el % para los N
   temas más fuertes.
2. **Buscar un tema puntual**: escribes cualquier cosa (ej. "inundaciones
   Nepal", "terremoto Turquía") y calcula tendencia + oportunidad para ese
   tema específico, aunque no esté en el trending oficial — útil para
   monitorear un tema que viste en noticias/Reddit/X y quieres saber si
   conviene producir ya.

### Cuota de la API

Cada video candidato revisado cuesta ~100 unidades (por la búsqueda de
oferta). Con 15 temas (default) son ~1.500 unidades de las 10.000 gratuitas
diarias — puedes correrlo varias veces al día sin problema. Baja el "# de
temas a analizar" si quieres gastar menos por corrida.

### Publicar la página

Se publica junto a `outlier-tracker` en el mismo sitio de GitHub Pages
(`.github/workflows/update-outliers.yml` ya incluye `trend-hunter/public/**`)
en la ruta `/trends/`. También puedes abrir `public/index.html` directo en
tu navegador sin publicar nada.

## Uso alternativo (avanzado): script de terminal multi-fuente

Además de la página HTML, hay un script de terminal más elaborado que cruza
**Reddit + Google Trends + Google News (prensa/TV) + YouTube** — útil si
quieres vigilancia más amplia que solo YouTube, o comparar corridas
sucesivas para medir aceleración real (`⚡ +X/h`) en vez de una sola foto.
No corre automático (sin cron): tú decides cuándo.

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

### X/Twitter

X no tiene API de tendencias gratuita desde 2023. No se scrapea porque no
hay forma confiable/estable de hacerlo sin login. Si ves algo trending en X,
o bien lo escribes directo en el buscador de la página HTML, o lo agregas a
`config/seeds.json → watchKeywords` para el script de terminal.

## Limitaciones honestas

- El % de viralidad es una heurística, no una predicción garantizada:
  "oferta" se mide buscando un texto derivado del título/tema, no
  entendiendo el evento real — revisa siempre el video/búsqueda antes de
  decidir producir.
- `chart=mostPopular` es el trending general de YouTube (dominado a veces
  por música/entretenimiento) — para temas de noticias/desastres el modo
  "buscar un tema puntual" suele ser más útil que el trending oficial.
- El script de terminal usa Google Trends y RSS de Google News, que son
  endpoints no oficiales/públicos y pueden cambiar de formato sin aviso. No
  falla si una fuente cae — la reporta como 0 resultados y sigue con las
  demás.
