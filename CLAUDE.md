# Directivas del proyecto (videos documentales tipo Crónicas Ilustradas)

## Regla de producción — NO REPETIR ARCHIVOS (obligatoria)

Para cada video nuevo se sigue este flujo, en orden, y **no se empieza a
producir hasta que TODO el guión esté cubierto con material único**:

1. **El usuario entrega el guión ANTES de empezar.** Nada de storyboard ni
   render hasta tener el guión.

2. **Cobertura sin repeticiones.** Cada frase/tramo del guión debe poder
   ilustrarse con un archivo (foto/video/archivo) **distinto**. Está prohibido
   repetir la misma toma para rellenar. Descargar material **de sobra** (más del
   necesario) para tener variedad y margen.

3. **Chequeo de cobertura antes de trabajar.** Al revisar el guión contra el
   material disponible: si el material se queda **corto** para cubrir todo sin
   repetir, **modificar/avisar en el mensaje** exactamente qué falta (qué frases
   quedan sin cubrir y qué se necesita descargar). Repetir el chequeo hasta que
   **no quede ningún hueco**.

4. **Solo entonces** se arma el storyboard y se renderiza.

### Notas de implementación ya en uso
- El sistema de *pools* temáticos con selector "menos usado + separación mínima"
  (`src/gc/plan.ts`, `pickFromPool`, `MIN_SEP`) evita repetir la misma toma
  seguida y reparte todo el material. Mantenerlo y ampliarlo con el material
  extra que se descargue.

## Regla de subtítulos — EL SRT ES LEY (obligatoria)

Los subtítulos SIEMPRE se arman a partir del **SRT real de la locución**:
- El **texto** de cada corte son las **palabras exactas del SRT** en su ventana
  de tiempo (solo se corrige ortografía/puntuación). **Nunca** parafrasear,
  resumir ni reordenar: eso desincroniza el subtítulo con la voz.
- Los **tiempos** (durationSec de cada corte) salen del SRT; la suma total debe
  coincidir con la duración real del audio.
- Antes de renderizar, verificar corte por corte que texto+tiempo = SRT.

## Otras reglas fijas del estilo (ya aprobadas)
- Cada frame ilustra lo que se está narrando; nada fuera de contexto.
- HUD arriba-izquierda: texto genérico (p.ej. "El joven que creó la TV a color"),
  **nunca** revelar el nombre/protagonista si el título/miniatura lo ocultan.
- Cortes rápidos y dinámicos (~4–5s), no lento ni denso.
- Los textos centrados y los capítulos entran **con** la frase, nunca antes.
- Entregar los links en una cajita con botón de copia (el usuario revisa desde
  el teléfono).
