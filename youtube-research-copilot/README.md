# YouTube Research Copilot

Investiga los videos que mejor funcionan sobre un tema y detecta patrones para
producir un video propio con más probabilidad de pegar.

## Estado actual

**Fase 1 (lista): investigación sin IA**, usando solo la YouTube Data API v3
(gratis, misma clave que `outlier-tracker`):

1. Busca los videos con más vistas sobre el tema.
2. Filtra Shorts (se queda solo con long-form, +4 minutos).
3. Descarga la transcripción pública de cada uno (método no oficial — ver
   advertencia abajo) y guarda el "gancho" (primeras líneas).
4. Calcula patrones: duración típica, vistas típicas, % de títulos con número
   o signo de pregunta, palabras más repetidas en títulos y en los ganchos.
5. Guarda todo en `output/<tema>.json`.

**Fase 2 (pendiente): generación con IA** — escribir el guion optimizado,
sugerir 3 títulos + 3 miniaturas (con Gemini) y puntuarlos contra los
patrones encontrados. Falta una clave de Gemini con cuota gratuita activa.

## Uso

```bash
cd youtube-research-copilot
echo "YOUTUBE_API_KEY=tu_clave" > ../.env   # o reutiliza el .env del repo
npm run research "tu tema"
```

Genera `output/tu-tema.json` con el reporte completo.

## Advertencia sobre las transcripciones

`scripts/transcript.mjs` usa el mismo mecanismo no documentado que usan
extensiones gratuitas de "YouTube transcript": lee la página del video y
pide el track de subtítulos automáticos directo a YouTube. No es parte de
la API oficial:

- Puede dejar de funcionar sin aviso si YouTube cambia el mecanismo.
- Técnicamente está en zona gris de los Términos de Servicio de YouTube
  (prohíben scraping fuera de la API). Para uso personal/bajo volumen el
  riesgo práctico es mínimo, pero es bueno saberlo.
- No afecta ni usa tu clave de YouTube Data API — es una petición aparte
  directa a youtube.com.
- Corre solo en este script local (Node), nunca en un sitio web público,
  porque YouTube no permite esas peticiones desde el navegador de otro
  dominio (CORS).
- Algunos videos no tienen subtítulos disponibles; el script simplemente
  los deja sin transcripción y sigue con el resto.

## Cuota de la API

Cada corrida consume ~101 unidades de las 10.000 gratuitas diarias
(1 búsqueda de 100 + 1 lote de estadísticas). Las transcripciones no gastan
cuota de la API oficial.
