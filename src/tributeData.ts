import {Actor} from './TributeScene';

/**
 * ============ STORYBOARD + DATOS DEL VIDEO DE TRIBUTO ============
 * Este archivo es a la vez tu GUION DE RODAJE y lo que alimenta el render.
 *
 * FLUJO DE PRODUCCIÓN (por actor = una escena):
 *  1. IMAGEN-STORYBOARD: compón una imagen fija con el actor vivo + el
 *     fallecido (con alas) ya colocados en el cementerio.
 *     → Nano Banana / Flux Kontext / Seedream / Midjourney.
 *     → Usa SIEMPRE el mismo fondo de cementerio para coherencia.
 *     → Guárdala en public/ (ej: public/sb_actor_1.jpg) y ponla en `startImage`.
 *     Con solo esto ya puedes renderizar el video entero como storyboard
 *     animado (stills) antes de gastar créditos de video.
 *  2. ANIMACIÓN: pasa cada `startImage` como first-frame a una IA
 *     imagen-a-video (Kling / Runway / Veo) con el `motionPrompt`.
 *     Encadena por keyframe: el último frame de una escena = imagen inicial
 *     de la siguiente, para continuidad.
 *  3. Guarda el clip en public/ y ponlo en `clip`. En cuanto exista, el
 *     render usa el video en vez de la imagen.
 *  4. Ajusta engraveAt / nameCardAt / gravestoneY viendo el clip real.
 */

export const TRIBUTE_FPS = 30;

// Duración por defecto de cada escena (frames). 240 = 8s a 30fps.
export const DEFAULT_SCENE_FRAMES = 240;

export const INTRO_FRAMES = 90; // 3s
export const OUTRO_FRAMES = 120; // 4s

export const TRIBUTE_TITLE = 'En Memoria';
export const TRIBUTE_SUBTITLE = 'Actores Que Nos Dejaron';

// Música de fondo opcional: nombre de un archivo en public/ o null.
export const TRIBUTE_MUSIC: string | null = null;

const MOTION_PROMPT_BASE =
  'The kneeling man bows his head at the grave, the winged figure behind him ' +
  'steps forward and gently embraces him, both slowly turn to look to the right, ' +
  'soft volumetric light, misty cemetery, cinematic, slow motion, emotional.';

export const tributeActors: Actor[] = [
  {
    name: 'Nombre del Actor 1',
    born: '1950',
    died: '2022',
    epitaph: 'Siempre en nuestros corazones',
    // Storyboard: reemplazar por tu imagen compuesta 'sb_actor_1.jpg'
    startImage: 'assets/Simple_cartoon_illustration_on_solid_202606271610.jpeg',
    motionPrompt: MOTION_PROMPT_BASE,
    shot: 'Plano medio, actor vivo arrodillado izq., fallecido con alas detrás; ambos giran a la derecha.',
    // clip: 'actor_1.mp4',  // ← descomentar cuando tengas el clip animado
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    name: 'Nombre del Actor 2',
    born: '1945',
    died: '2021',
    startImage: 'assets/Simple_cartoon_illustration_on_solid_202606271610.jpeg',
    motionPrompt: MOTION_PROMPT_BASE,
    shot: 'Continuidad: entra por la izquierda mirando a la derecha desde la escena anterior.',
    // clip: 'actor_2.mp4',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    // Ejemplo de escena YA animada (usa video en vez de imagen)
    name: 'Nombre del Actor 3',
    born: '1962',
    died: '2023',
    clip: 'input.mp4', // ← reemplazar por 'actor_3.mp4'
    motionPrompt: MOTION_PROMPT_BASE,
    shot: 'Cierre del grupo, cámara retrocede lentamente.',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
];

/** Total de frames del video, calculado a partir de la lista. */
export const totalTributeFrames =
  INTRO_FRAMES +
  tributeActors.reduce((sum, a) => sum + (a.sceneFrames ?? DEFAULT_SCENE_FRAMES), 0) +
  OUTRO_FRAMES;
