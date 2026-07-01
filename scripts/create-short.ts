#!/usr/bin/env ts-node
/**
 * Script simple para crear shorts con Pippit AI
 *
 * Uso:
 *   npm run create:short "Tu idea para el short aquí"
 *
 * Ejemplo:
 *   npm run create:short "3 tips de productividad que funcionan"
 */

import { pippitService } from '../src/integrations/pippit.service';

const prompt = process.argv[2];

if (!prompt) {
  console.error('❌ Por favor proporciona una idea para el short');
  console.error('');
  console.error('Uso: npm run create:short "Tu idea aquí"');
  console.error('');
  console.error('Ejemplos:');
  console.error('  npm run create:short "3 alimentos ricos en proteína"');
  console.error('  npm run create:short "Tutorial: Cómo hacer ejercicio en 5 minutos"');
  process.exit(1);
}

async function createShort() {
  try {
    console.log('🎬 Creando short...');
    console.log(`📝 Tema: ${prompt}`);
    console.log('');

    const short = await pippitService.generateVideo({
      prompt,
      aspectRatio: '9:16', // Vertical para TikTok/Instagram Reels
      duration: 30, // 30 segundos es perfecto
      language: 'es',
    });

    console.log('✅ Short generado exitosamente');
    console.log(`📌 ID: ${short.id}`);
    console.log(`⏱️  Estado: ${short.status}`);
    console.log('');
    console.log('📱 Próximos pasos:');
    console.log('1. Ve a https://www.pippit.ai');
    console.log('2. Descarga tu short generado');
    console.log('3. Sube a: TikTok, Instagram Reels o YouTube Shorts');
    console.log('');
    console.log('💡 Tips:');
    console.log('- Primeros 3 segundos son críticos');
    console.log('- Añade subtítulos (muchos ven sin sonido)');
    console.log('- Incluye call to action: "Sígueme para más"');
    console.log('- Publica con tendencias/hashtags populares');
    console.log('');

  } catch (error) {
    console.error('❌ Error creando short:', error);
    process.exit(1);
  }
}

createShort();
