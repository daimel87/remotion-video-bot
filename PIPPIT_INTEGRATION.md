# 🎬 Crear Shorts con Pippit AI

Guía simple para generar videos cortos (shorts) con el plan gratuito de Pippit AI.

## 📱 ¿Qué es un Short?

Un short es un video vertical de:
- **Duración**: 15 - 60 segundos
- **Formato**: 9:16 (vertical para TikTok, Instagram Reels, YouTube Shorts)
- **Ideal para**: Contenido viral, tutoriales rápidos, tips, recetas, entretenimiento

## 🚀 Cómo Empezar

### Paso 1: Crear cuenta en Pippit

1. Ve a https://www.pippit.ai/
2. Crea una cuenta gratuita (sin tarjeta de crédito necesaria)
3. Tendrás **150 créditos por semana** gratis

### Paso 2: Generar tu primer short

**Opción A: Directamente en Pippit (recomendado para empezar)**

```
1. Ve a https://www.pippit.ai/create
2. Escribe tu idea: "Tutorial rápido: 3 alimentos saludables"
3. Selecciona:
   - Aspecto: Vertical (9:16)
   - Duración: 30 segundos
   - Idioma: Español
4. Genera
5. Descarga cuando esté listo
```

**Opción B: Usar el Skill de Claude**

```
/pippit-skill

Genera un short vertical de 30 segundos sobre 
"3 tips para una vida saludable" en español.
```

### Paso 3: Publicar tu short

Puedes subir el video a:
- 🎵 **TikTok** - Viral, algoritmo fuerte
- 📸 **Instagram Reels** - Alcance masivo
- 🎬 **YouTube Shorts** - Monetización posible

## 📊 Créditos del Plan Gratuito

**150 créditos/semana = aproximadamente:**
- 2-3 shorts de 30 segundos
- O 10-15 imágenes de portada
- O 1 video de 60 segundos

Ejemplo de consumo:
- Short de 30 segundos: 50 créditos
- Short de 60 segundos: 100 créditos
- Imagen: 10 créditos

## 💡 Ideas para Shorts

### Si tienes un canal de nutrición:
- "5 formas de comer proteína en el desayuno"
- "El mejor snack saludable bajo en calorías"
- "Cómo leer las etiquetas de nutrición"
- "Receta rápida: Ensalada en 2 minutos"

### Si tienes un canal de educación:
- "Dato científico que no sabías"
- "Historia en 30 segundos"
- "Cómo recordar fórmulas fácilmente"

### Si tienes un canal de entretenimiento:
- "Trending challenge"
- "Prank rápido"
- "Trending song con idea original"

## 🔄 Flujo de Trabajo Recomendado

```
1. Idea (5 min)
   ↓
2. Generar en Pippit (5-15 min)
   ↓
3. Descargar (1-2 min)
   ↓
4. [Opcional] Editar en Remotion (si quieres agregar textos/gráficos)
   ↓
5. Subir a redes sociales (2-5 min)
```

## 📝 Script de Ejemplo

Si quieres usar nuestro código TypeScript para procesar los shorts:

```typescript
import { pippitService } from './src/integrations/pippit.service';

async function createShort() {
  // Generar short
  const short = await pippitService.generateVideo({
    prompt: '5 tips de productividad que funcionan',
    aspectRatio: '9:16',  // Vertical
    duration: 30,         // 30 segundos
    language: 'es',
  });

  console.log('Short generado:', short.id);
  console.log('Descárgalo desde: https://www.pippit.ai');
}
```

## 💰 Presupuesto Gratuito/Mensual

| Plan | Créditos/mes | Videos cortos | Precio |
|------|------------|---------------|--------|
| Gratuito | 600 (150/sem) | ~12 shorts | $0 |
| Starter | 21,600 | ~432 shorts | $25/mes |

**Mi recomendación**: Usa el plan gratuito primero. Si funciona bien, considera pagar.

## 🎯 Tips para Shorts Virales

1. **Primeros 3 segundos**: Gana atención inmediatamente
2. **Hook fuerte**: "Esto te va a sorprender..."
3. **Subtítulos**: Muchos ven sin sonido
4. **Call to action**: "Sígueme para más tips"
5. **Tendencias**: Usa música/trends populares
6. **Consistencia**: Publica regularmente

## 📚 Recursos

- [Guía de Pippit AI](https://www.pippit.ai/docs)
- [Cómo hacer shorts virales](https://www.pippit.ai/templates)
- [Trending en TikTok hoy](https://www.tiktok.com/discover)

## 🆘 Problemas Comunes

**P: ¿Cuánto tarda en generar?**
R: 5-15 minutos normalmente

**P: ¿Se agota mi cuota?**
R: Tienes 150 créditos/semana. Un short = ~50 créditos. Así que ~3 shorts/semana gratis.

**P: ¿Puedo usar mi propio script de Remotion?**
R: Sí, pero Pippit es más rápido. Usa Pippit para contenido genérico y Remotion para contenido personalizado.

**P: ¿Me lo monetiza?**
R: Sí, cuando cumplas requisitos de cada plataforma (10k subs en TikTok, 1000 en YouTube, etc.)

---

¡Listo! Ahora puedes crear shorts virales con el plan gratuito. 🚀
