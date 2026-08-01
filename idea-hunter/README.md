# 🎯 Cazador de Ideas

Pipeline multi-nicho que encuentra temas **evergreen** con **alta demanda + poca oferta**
en el mercado latino, con ángulo de **information gain**. Salida: dashboard HTML con pestañas.

## Uso

1. Copia la plantilla y pon TU clave (nunca se sube al repo):
   ```bash
   cp .env.example .env
   # edita .env y pon tu YOUTUBE_API_KEY
   ```
   (o `export YOUTUBE_API_KEY=...`)

2. Corre:
   ```bash
   python3 hunt.py            # real (usa la API)
   python3 hunt.py --demo     # ejemplo, sin API, para ver el formato
   ```

3. Abre `dashboard.html` en tu navegador.

## Cómo puntúa
- **Demanda** = mediana de vistas de los videos top del tema (log-escalado).
- **Hueco** = premia videos top viejos + canales chicos ganando + baja mediana de subs → poca oferta.
- **Information gain** = preguntas minadas de los comentarios (lo que los top NO responden).
- Config de nichos y pesos en `config.json`.

## Cuota
YouTube Data API: 10.000 unidades/día gratis. `search.list` = 100 u c/u.
Con 2 nichos × 6 semillas ≈ 1.200 u. Sobra.

## Seguridad
`.env` está gitignoreado. La clave vive solo en tu entorno; el código la lee con `os.environ`.
