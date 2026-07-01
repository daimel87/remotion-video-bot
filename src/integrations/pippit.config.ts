/**
 * Configuración de Pippit AI
 * Gestiona las variables de entorno y credenciales para la integración con Pippit
 */

export interface PippitConfig {
  accessKey: string;
  apiUrl: string;
  outputDir: string;
  downloadVideos: boolean;
  socialPublishing: {
    tiktok: boolean;
    instagram: boolean;
    facebook: boolean;
  };
}

export function getPippitConfig(): PippitConfig {
  const accessKey = process.env.PIPPIT_ACCESS_KEY || '';

  if (!accessKey) {
    console.warn(
      '⚠️  PIPPIT_ACCESS_KEY no está configurada. ' +
      'Por favor, configura tu clave de acceso en .env.pippit'
    );
  }

  return {
    accessKey,
    apiUrl: process.env.PIPPIT_API_URL || 'https://api.pippit.ai',
    outputDir: process.env.PIPPIT_OUTPUT_DIR || './pippit-output',
    downloadVideos: process.env.PIPPIT_DOWNLOAD_VIDEOS !== 'false',
    socialPublishing: {
      tiktok: process.env.PIPPIT_PUBLISH_TIKTOK === 'true',
      instagram: process.env.PIPPIT_PUBLISH_INSTAGRAM === 'true',
      facebook: process.env.PIPPIT_PUBLISH_FACEBOOK === 'true',
    },
  };
}

export function validatePippitConfig(config: PippitConfig): boolean {
  if (!config.accessKey) {
    console.error('❌ Error: PIPPIT_ACCESS_KEY no está configurada');
    return false;
  }
  return true;
}
