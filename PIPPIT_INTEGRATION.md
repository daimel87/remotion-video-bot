# 🎬 Integración de Pippit AI con Remotion Video Bot

Esta guía te explica cómo usar Pippit AI para generar videos automáticamente junto con tu proyecto de Remotion.

## ¿Qué es Pippit AI?

Pippit AI es una plataforma de creación de contenido con IA que permite:
- **Generar videos completos** desde texto o imágenes
- **Crear y editar videos** automáticamente
- **Generar imágenes** con IA
- **Publicar automáticamente** en TikTok, Instagram, Facebook
- **Analizar rendimiento** de videos generados

## Instalación y Configuración

### 1. Crear cuenta en Pippit

1. Ve a https://www.pippit.ai/
2. Crea una cuenta (opción gratuita disponible)
3. Obtén tu **Access Key** desde las configuraciones de API

### 2. Configurar el proyecto

Copia el archivo de ejemplo y añade tu clave:

```bash
cp .env.pippit.example .env.pippit
```

Edita `.env.pippit` y agrega tu clave:

```env
PIPPIT_ACCESS_KEY=tu_clave_aqui
PIPPIT_OUTPUT_DIR=./pippit-output
PIPPIT_DOWNLOAD_VIDEOS=true
```

**IMPORTANTE:** Nunca hagas commit de `.env.pippit` con tus credenciales reales. Añadelo a `.gitignore` si no está ya.

### 3. Cargar variables de entorno

```bash
# En Linux/Mac
export $(cat .env.pippit | xargs)

# O crear un script load-env.sh
source .env.pippit
```

## Uso del Skill Pippit

El skill `pippit-skill` está disponible en tu proyecto. Puedes usarlo de varias formas:

### Opción 1: Usar el Skill directamente con Claude

Puedes invocar el skill escribiendo en Claude:

```
/pippit-skill

Genera un video sobre "Los beneficios de una dieta equilibrada" 
con estilo moderno y publica en TikTok
```

El skill manejará automáticamente:
- Generación del video
- Descarga de archivos
- Publicación en redes sociales
- Tracking de tareas

### Opción 2: Usar el Servicio de Pippit en TypeScript

Para usar Pippit programáticamente:

```typescript
import { pippitService } from './src/integrations/pippit.service';

async function generateFoodVideo() {
  const result = await pippitService.generateVideo({
    prompt: 'Video educativo sobre alimentos saludables',
    aspectRatio: '16:9',
    duration: 60,
    language: 'es',
  });

  console.log('Video generado:', result);

  // Descargar el video
  await pippitService.downloadGeneration(
    result.id,
    './pippit-output/video.mp4'
  );

  // Publicar en redes sociales
  await pippitService.publishToSocial(result.id, [
    'tiktok',
    'instagram'
  ]);
}
```

### Opción 3: Scripts de CLI

Crea un script en `package.json`:

```json
{
  "scripts": {
    "generate:video": "node -r ts-node/register scripts/generate-video.ts",
    "generate:image": "node -r ts-node/register scripts/generate-image.ts"
  }
}
```

## Casos de Uso

### 1. Generar Videos de Productos

```typescript
const productVideo = await pippitService.generateVideo({
  prompt: 'Video promocional de producto con demo y beneficios',
  style: 'professional',
  duration: 30,
});
```

### 2. Crear Variaciones de Contenido

```typescript
// Generar múltiples versiones del mismo contenido
const variations = await Promise.all([
  pippitService.generateVideo({
    prompt: 'Video: Cómo hacer una ensalada saludable',
    aspectRatio: '16:9',
  }),
  pippitService.generateVideo({
    prompt: 'Video: Receta de ensalada saludable',
    aspectRatio: '9:16',
  }),
]);
```

### 3. Publicación Automática

```typescript
// Generar y publicar automáticamente
const video = await pippitService.generateVideo({
  prompt: 'Tips de nutrición',
});

await pippitService.publishToSocial(video.id, [
  'tiktok',
  'instagram',
  'facebook'
]);
```

## Estructura de Archivos

```
remotion-video-bot/
├── .env.pippit                    # Configuración (no commitear)
├── .env.pippit.example            # Ejemplo de configuración
├── PIPPIT_INTEGRATION.md          # Esta guía
├── .agents/skills/pippit-skill/   # Skill instalado
├── src/
│   ├── integrations/
│   │   ├── index.ts               # Exporta todos los módulos
│   │   ├── pippit.config.ts       # Configuración de Pippit
│   │   └── pippit.service.ts      # Servicio principal
│   └── ...
├── pippit-output/                 # Archivos generados (gitignored)
└── ...
```

## Limitaciones y Notas

### Gratuito vs Pago
- **Plan Gratuito**: 150 créditos por semana
- **Starter Pro**: 1,800 créditos IA por mes (US$9)
- Cada generación de video consume créditos

### Tiempos de Generación
- Videos: 5-30 minutos según complejidad
- Imágenes: 30 segundos - 2 minutos

### Modelos de Video Soportados
- Aspect ratios: 16:9, 9:16, 1:1
- Duraciones: 15s - 120s
- Formatos: MP4
- Idiomas: Inglés, Español, Francés, Alemán, Chino, Japonés

## Troubleshooting

### Error: "PIPPIT_ACCESS_KEY no está configurada"

Solución:
```bash
# Verifica que .env.pippit existe
ls -la .env.pippit

# Carga las variables
source .env.pippit

# Verifica que está configurada
echo $PIPPIT_ACCESS_KEY
```

### Error: "Generación fallida"

Posibles causas:
- Créditos insuficientes (revisa tu cuenta en pippit.ai)
- Access key inválida o expirada
- Servidor de Pippit no disponible

### Los videos no se descargan

Solución:
```bash
# Verifica que la carpeta de salida existe
mkdir -p pippit-output

# Verifica permisos
chmod 755 pippit-output
```

## Próximos Pasos

1. **Integración con Remotion**: Combina videos generados por Pippit con composiciones de Remotion
2. **Automatización**: Crea workflows que generen contenido automáticamente
3. **Analytics**: Monitorea el rendimiento de videos generados
4. **Multi-idioma**: Genera contenido en diferentes idiomas automáticamente

## Recursos

- [Documentación de Pippit AI](https://www.pippit.ai/docs)
- [Repositorio del Skill](https://github.com/Pippit-dev/pippit-skills)
- [Documentación de Remotion](https://www.remotion.dev)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)

## Soporte

Para problemas o preguntas:
1. Revisa la documentación de Pippit
2. Verifica tu configuración de Access Key
3. Contacta al soporte de Pippit en https://www.pippit.ai/support

---

¡Listo! Ahora puedes generar videos con Pippit AI integrado en tu proyecto de Remotion.
