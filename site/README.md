# D-TECH USB — Web de herramientas de reparación USB

Web estática generada para reemplazar el Linktree del canal. Optimizada para SEO
(indexación en Google) y preparada para monetizar con **Adsterra** o **AdSense**.

## Estructura

- `data.py` — lista de herramientas + contenido de cada guía. **Edita aquí** para añadir/quitar.
- `build.py` — genera la web en `dist/`.
- `style.css` — estilos (modo claro/oscuro, responsive).
- `dist/` — web final lista para subir (home, 16 herramientas, legales, sitemap, robots).

## Generar la web

```bash
cd site
python3 build.py     # regenera dist/
```

## Desplegar GRATIS

### Opción A — Cloudflare Pages (recomendada)
1. Entra en https://pages.cloudflare.com → *Create project* → *Direct Upload*.
2. Sube la carpeta `dist/`. Listo, te da una URL `https://tuproyecto.pages.dev`.
3. (Opcional) Conecta tu dominio propio en *Custom domains*.

### Opción B — GitHub Pages
1. Sube el contenido de `dist/` a una rama `gh-pages` o carpeta `/docs`.
2. Settings → Pages → elige la rama. URL: `https://usuario.github.io/repo`.

## Monetización

1. **Adsterra** (acepta subdominio gratis): regístrate, crea la web, copia el código
   de anuncio y pégalo en `build.py` dentro de la función `ad()` (reemplaza el comentario
   `<!-- ADSTERRA ... -->`). Regenera con `python3 build.py`.
2. **AdSense** (recomendado dominio propio ~10€/año): añade el script en el `head()`
   de `build.py` y verifica el sitio en Google AdSense.

## SEO / Indexar en Google

1. Cambia `domain` en `data.py` por tu URL/dominio real y regenera.
2. Verifica el sitio en https://search.google.com/search-console
3. Envía `sitemap.xml` en Search Console para acelerar la indexación.
