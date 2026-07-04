import {Actor} from './TributeScene';

/**
 * ================== DATOS DEL VIDEO DE TRIBUTO ==================
 * Rellena esta lista por video. Cada entrada = un actor fallecido.
 *
 * FLUJO:
 *  1. Genera el clip IA de cada actor (actor se arrodilla → el fallecido
 *     emerge con alas → se abrazan → ambos miran a la derecha).
 *  2. Guarda cada clip en la carpeta public/  (ej: public/actor_1.mp4).
 *  3. Pon aquí el nombre del archivo + nombre real + fechas.
 *  4. Ajusta engraveAt / nameCardAt / gravestoneY según cada clip.
 *
 * NOTA: los clips de ejemplo apuntan a 'input.mp4' (que ya existe en public/)
 * solo para que la composición se previsualice sin errores. Reemplázalos.
 */

export const TRIBUTE_FPS = 30;

// Duración por defecto de cada escena (frames). 240 = 8s a 30fps.
export const DEFAULT_SCENE_FRAMES = 240;

export const INTRO_FRAMES = 90; // 3s
export const OUTRO_FRAMES = 120; // 4s

export const TRIBUTE_TITLE = 'En Memoria';
export const TRIBUTE_SUBTITLE = 'Actores Que Nos Dejaron';

// Música de fondo opcional: pon el nombre de un archivo en public/ (ej:
// 'memorial.mp3') o déjalo como null para renderizar sin música.
export const TRIBUTE_MUSIC: string | null = null;

export const tributeActors: Actor[] = [
  {
    clip: 'input.mp4', // ← reemplazar por 'actor_1.mp4'
    name: 'Nombre del Actor 1',
    born: '1950',
    died: '2022',
    epitaph: 'Siempre en nuestros corazones',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    clip: 'input.mp4', // ← reemplazar por 'actor_2.mp4'
    name: 'Nombre del Actor 2',
    born: '1945',
    died: '2021',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    clip: 'input.mp4', // ← reemplazar por 'actor_3.mp4'
    name: 'Nombre del Actor 3',
    born: '1962',
    died: '2023',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
];

/** Total de frames del video, calculado a partir de la lista. */
export const totalTributeFrames =
  INTRO_FRAMES +
  tributeActors.reduce((sum, a) => sum + (a.sceneFrames ?? DEFAULT_SCENE_FRAMES), 0) +
  OUTRO_FRAMES;
