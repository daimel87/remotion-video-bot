import {Actor} from './TributeScene';

/**
 * ============ STORYBOARD + DATOS DEL VIDEO DE TRIBUTO ============
 * Concepto: Robert De Niro recorre un cementerio, se arrodilla ante la lápida
 * de cada leyenda fallecida; el actor aparece con alas y lo abraza; De Niro se
 * levanta y camina a la siguiente lápida.
 *
 * FLUJO POR ESCENA:
 *  1. IMAGEN-STORYBOARD (Nano Banana): usa `storyboardPrompt` + STYLE_ANCHOR +
 *     tus fotos de referencia (De Niro + el fallecido). Capta el instante ANTES
 *     del abrazo. Guarda en public/ y ponla en `startImage`.
 *  2. ANIMAR (Kling/Runway/Veo): pasa la imagen como first-frame con `motionPrompt`.
 *     Encadena por keyframe: último frame de una escena → imagen inicial de la
 *     siguiente (De Niro entrando por la izquierda, mirando a la derecha).
 *  3. Guarda el clip en public/ y ponlo en `clip`.
 *
 * La lápida se deja BLANCA en la imagen: el nombre + fechas los graba Remotion.
 */

export const TRIBUTE_FPS = 30;
export const DEFAULT_SCENE_FRAMES = 240; // 8s a 30fps
export const INTRO_FRAMES = 90;
export const OUTRO_FRAMES = 120;

export const TRIBUTE_TITLE = 'En Memoria';
export const TRIBUTE_SUBTITLE = 'Leyendas Que Nos Dejaron';

export const TRIBUTE_MUSIC: string | null = null;

/** Pega esto al final de CADA storyboardPrompt en Nano Banana para coherencia. */
export const STYLE_ANCHOR =
  'STYLE: cinematic photoreal, 16:9, misty overcast cemetery at dawn, rows of old ' +
  'weathered gravestones, soft volumetric god-rays through fog, muted teal-and-amber ' +
  'palette, shallow depth of field, 35mm film look. Robert De Niro is elderly, wearing ' +
  'a long black wool coat and dark scarf. The deceased actor appears as a glowing spirit ' +
  'with large white feathered angel wings, soft ethereal rim light. Keep BOTH faces ' +
  'photorealistic and faithful to the reference photos. Leave the gravestone surface ' +
  'BLANK / plain stone (no engraved text).';

// Orden sugerido: build-up emocional, clímax con Brando.
export const tributeActors: Actor[] = [
  {
    name: 'Sidney Poitier',
    born: '1927',
    died: '2022',
    startImage: 'sb_poitier.jpg', // ← crea esta imagen en Nano Banana
    storyboardPrompt:
      "Robert De Niro kneels on one knee before a weathered gravestone, head slightly bowed. " +
      "Behind him stands the winged spirit of Sidney Poitier, dignified, one hand reaching " +
      "toward De Niro's shoulder, about to embrace him. Both turned slightly toward the right of frame.",
    motionPrompt:
      "The winged spirit of Sidney Poitier steps forward and gently embraces the kneeling De Niro; " +
      "De Niro rests a hand on his arm and closes his eyes; both slowly turn to look to the right; " +
      "De Niro rises and takes a step to the right. Slow motion, emotional, gentle camera push.",
    // clip: 'poitier.mp4',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    name: 'Paul Newman',
    born: '1925',
    died: '2008',
    startImage: 'sb_newman.jpg',
    storyboardPrompt:
      "Robert De Niro kneels before a gravestone. Behind him the winged spirit of Paul Newman, " +
      "warm faint smile, hand on De Niro's shoulder, about to embrace. Both angled to the right.",
    motionPrompt:
      "Paul Newman's winged spirit embraces the kneeling De Niro from behind; they hold the embrace; " +
      "both turn to look right; De Niro stands and steps right, camera follows right. Slow motion, cinematic, emotional.",
    // clip: 'newman.mp4',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    name: 'Sean Connery',
    born: '1930',
    died: '2020',
    startImage: 'sb_connery.jpg',
    storyboardPrompt:
      "Robert De Niro kneels at a gravestone. The winged spirit of Sean Connery stands behind, calm " +
      "and stately, one hand extended to De Niro's shoulder, about to embrace. Turned toward the right.",
    motionPrompt:
      "Sean Connery's winged spirit embraces the kneeling De Niro; De Niro grips his forearm; both slowly " +
      "turn to look right; De Niro rises and walks off to the right. Slow motion, soft light, emotional.",
    // clip: 'connery.mp4',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    name: 'Robin Williams',
    born: '1951',
    died: '2014',
    startImage: 'sb_williams.jpg',
    storyboardPrompt:
      "Robert De Niro kneels before a gravestone, emotional. Behind him the winged spirit of Robin Williams, " +
      "gentle knowing smile, both hands opening to embrace him. Angled to the right.",
    motionPrompt:
      "Robin Williams' winged spirit wraps the kneeling De Niro in a warm embrace; De Niro's eyes glisten; " +
      "both turn to look right; De Niro stands and steps to the right. Slow motion, tender, cinematic.",
    // clip: 'williams.mp4',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    name: 'James Gandolfini',
    born: '1961',
    died: '2013',
    startImage: 'sb_gandolfini.jpg',
    storyboardPrompt:
      "Robert De Niro kneels at a gravestone. The large winged spirit of James Gandolfini stands behind, " +
      "heavy and warm, hand on De Niro's shoulder, about to embrace. Turned to the right.",
    motionPrompt:
      "Gandolfini's winged spirit pulls the kneeling De Niro into a strong embrace; they hold it; both turn " +
      "to look right; De Niro rises and walks right, camera follows. Slow motion, emotional, cinematic.",
    // clip: 'gandolfini.mp4',
    engraveAt: 30,
    gravestoneY: 0.52,
  },
  {
    // CLÍMAX: De Niro y Brando interpretaron al mismo Vito Corleone.
    name: 'Marlon Brando',
    born: '1924',
    died: '2004',
    startImage: 'sb_brando.jpg',
    storyboardPrompt:
      "Robert De Niro kneels before a grand weathered gravestone, deeply moved. Behind him the winged spirit " +
      "of Marlon Brando as elder Vito Corleone, solemn and powerful, both hands lowering to embrace him. " +
      "Angled to the right, brightest god-rays of the film.",
    motionPrompt:
      "Marlon Brando's winged spirit embraces the kneeling De Niro; De Niro breaks with emotion and holds him; " +
      "both turn to look toward the bright light on the right; De Niro rises. Camera pushes into the light. " +
      "Slow motion, powerful, cinematic climax.",
    // clip: 'brando.mp4',
    engraveAt: 30,
    gravestoneY: 0.52,
    sceneFrames: 300, // clímax un poco más largo (10s)
  },
];

/** Total de frames del video, calculado a partir de la lista. */
export const totalTributeFrames =
  INTRO_FRAMES +
  tributeActors.reduce((sum, a) => sum + (a.sceneFrames ?? DEFAULT_SCENE_FRAMES), 0) +
  OUTRO_FRAMES;
