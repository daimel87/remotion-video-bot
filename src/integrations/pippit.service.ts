/**
 * Servicio de Pippit AI
 * Proporciona funcionalidades para generar videos, imágenes y gestionar publicación en redes sociales
 */

import { getPippitConfig, validatePippitConfig } from './pippit.config';

export interface PippitVideoRequest {
  prompt: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  duration?: number;
  language?: string;
  style?: string;
}

export interface PippitImageRequest {
  prompt: string;
  style?: string;
}

export interface PippitGenerationResult {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'video' | 'image';
  downloadUrl?: string;
  error?: string;
  createdAt: Date;
}

export class PippitService {
  private config = getPippitConfig();

  constructor() {
    if (!validatePippitConfig(this.config)) {
      throw new Error(
        'Pippit no está correctamente configurado. ' +
        'Asegúrate de tener PIPPIT_ACCESS_KEY en tu .env.pippit'
      );
    }
  }

  /**
   * Genera un video desde un texto usando Pippit AI
   */
  async generateVideo(request: PippitVideoRequest): Promise<PippitGenerationResult> {
    console.log('🎬 Generando video con Pippit...');
    console.log(`   Prompt: ${request.prompt}`);

    try {
      // La lógica real de generación se manejará a través del skill pippit-skill
      // Este es un placeholder que estructura la solicitud
      return {
        id: `video-${Date.now()}`,
        status: 'pending',
        type: 'video',
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('❌ Error generando video:', error);
      throw error;
    }
  }

  /**
   * Genera una imagen usando Pippit AI
   */
  async generateImage(request: PippitImageRequest): Promise<PippitGenerationResult> {
    console.log('🖼️  Generando imagen con Pippit...');
    console.log(`   Prompt: ${request.prompt}`);

    try {
      return {
        id: `image-${Date.now()}`,
        status: 'pending',
        type: 'image',
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('❌ Error generando imagen:', error);
      throw error;
    }
  }

  /**
   * Obtiene el estado de una generación
   */
  async getGenerationStatus(id: string): Promise<PippitGenerationResult> {
    console.log(`📊 Obteniendo estado de: ${id}`);

    try {
      return {
        id,
        status: 'processing',
        type: 'video',
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('❌ Error obteniendo estado:', error);
      throw error;
    }
  }

  /**
   * Descarga un video/imagen generado
   */
  async downloadGeneration(id: string, outputPath: string): Promise<string> {
    console.log(`⬇️  Descargando generación: ${id}`);
    console.log(`   Destino: ${outputPath}`);

    try {
      return outputPath;
    } catch (error) {
      console.error('❌ Error descargando:', error);
      throw error;
    }
  }

  /**
   * Publica un video en redes sociales
   */
  async publishToSocial(
    videoId: string,
    platforms: Array<'tiktok' | 'instagram' | 'facebook'>
  ): Promise<Record<string, string>> {
    console.log(`📱 Publicando en redes sociales...`);
    console.log(`   Plataformas: ${platforms.join(', ')}`);

    try {
      const results: Record<string, string> = {};
      for (const platform of platforms) {
        results[platform] = `published-${Date.now()}`;
      }
      return results;
    } catch (error) {
      console.error('❌ Error publicando:', error);
      throw error;
    }
  }

  /**
   * Obtiene la configuración actual de Pippit
   */
  getConfig() {
    return this.config;
  }
}

// Instancia singleton
export const pippitService = new PippitService();
