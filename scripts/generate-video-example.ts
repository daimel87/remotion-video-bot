/**
 * Script de ejemplo: Generar video con Pippit
 *
 * Uso:
 *   npx ts-node scripts/generate-video-example.ts
 */

import { pippitService } from '../src/integrations/pippit.service';

async function main() {
  try {
    console.log('🚀 Iniciando generación de video con Pippit AI...\n');

    // Ejemplo 1: Generar video educativo
    console.log('📹 Ejemplo 1: Generar video educativo');
    const educativeVideo = await pippitService.generateVideo({
      prompt: 'Video educativo: Los beneficios de una alimentación balanceada',
      aspectRatio: '16:9',
      duration: 60,
      language: 'es',
      style: 'professional',
    });

    console.log('✅ Video generado:', educativeVideo.id);
    console.log('   Estado:', educativeVideo.status);
    console.log();

    // Ejemplo 2: Generar video para redes sociales (vertical)
    console.log('📹 Ejemplo 2: Generar video para TikTok/Instagram');
    const socialVideo = await pippitService.generateVideo({
      prompt: 'Quick tips: 3 alimentos ricos en proteína que debes probar',
      aspectRatio: '9:16',
      duration: 30,
      language: 'es',
    });

    console.log('✅ Video generado:', socialVideo.id);
    console.log('   Estado:', socialVideo.status);
    console.log();

    // Ejemplo 3: Generar imagen
    console.log('🖼️  Ejemplo 3: Generar imagen');
    const image = await pippitService.generateImage({
      prompt: 'Imagen profesional de un plato de comida saludable bien presentado',
      style: 'product_photography',
    });

    console.log('✅ Imagen generada:', image.id);
    console.log('   Estado:', image.status);
    console.log();

    // Información de configuración
    console.log('⚙️  Configuración actual:');
    const config = pippitService.getConfig();
    console.log(`   Output Dir: ${config.outputDir}`);
    console.log(`   Descargar videos: ${config.downloadVideos}`);
    console.log(`   Publicación automática:`);
    console.log(`     - TikTok: ${config.socialPublishing.tiktok}`);
    console.log(`     - Instagram: ${config.socialPublishing.instagram}`);
    console.log(`     - Facebook: ${config.socialPublishing.facebook}`);
    console.log();

    console.log('ℹ️  Próximos pasos:');
    console.log('   1. Ve a https://www.pippit.ai para ver el estado de tus generaciones');
    console.log('   2. Descarga los videos generados cuando estén listos');
    console.log('   3. Intégralos con tus composiciones de Remotion');
    console.log();

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

main();
