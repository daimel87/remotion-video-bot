import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {Gravestone} from './components/Gravestone';
import {MemorialCard} from './components/MemorialCard';

export type Actor = {
  // ---- Datos que salen en pantalla (lápida + tarjeta) ----
  name: string;
  born: string; // año de nacimiento, ej: '1965'
  died: string; // año de fallecimiento, ej: '2023'
  epitaph?: string;

  // ---- STORYBOARD → PRODUCCIÓN ----
  /**
   * Imagen-storyboard de la escena: composición fija con el actor vivo +
   * el fallecido (con alas) ya colocados en el cementerio. Archivo en
   * public/ (ej: 'sb_actor_1.jpg'). Se usa como vista previa mientras el
   * clip animado no existe todavía — así puedes renderizar el video entero
   * con puros stills antes de gastar créditos de video.
   */
  startImage?: string;
  /** Prompt para Nano Banana que compone la imagen-storyboard (still). */
  storyboardPrompt?: string;
  /** Prompt de animación que le das a la IA imagen-a-video para esta escena. */
  motionPrompt?: string;
  /** Nota de la toma (encuadre, dirección de miradas, etc.). Solo documentación. */
  shot?: string;

  /**
   * Clip IA ya animado (archivo en public/, ej: 'actor_1.mp4'). Cuando existe,
   * reemplaza a startImage. Déjalo vacío mientras solo tienes el storyboard.
   */
  clip?: string;

  // ---- Timing / posición ----
  /** Duración de la escena en frames (por defecto se usa la global) */
  sceneFrames?: number;
  /** Frame en que se graba la lápida (cuando se arrodilla) */
  engraveAt?: number;
  /** Frame en que entra la tarjeta de nombre (el abrazo). Por defecto ~55% */
  nameCardAt?: number;
  /** Posición del grabado sobre la lápida (fracción 0-1) */
  gravestoneX?: number;
  gravestoneY?: number;
};

/**
 * Una escena = un actor. Reproduce el clip IA, graba la lápida cuando se
 * arrodilla y saca la tarjeta de nombre en el abrazo. Los bordes hacen
 * "dip to black" (funde a negro) para un encadenado reverente entre actores.
 */
export const TributeScene: React.FC<Actor> = ({
  clip,
  startImage,
  name,
  born,
  died,
  epitaph,
  engraveAt = 30,
  nameCardAt,
  gravestoneX,
  gravestoneY,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fade = 18;
  const dip = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const cardStart = nameCardAt ?? Math.round(durationInFrames * 0.55);
  const cardDur = Math.max(durationInFrames - cardStart - 4, 30);

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: dip}}>
        {clip ? (
          <OffthreadVideo src={staticFile(clip)} />
        ) : startImage ? (
          // Vista previa con la imagen-storyboard mientras no hay clip animado
          <Img src={staticFile(startImage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : null}
        <Gravestone
          name={name}
          born={born}
          died={died}
          epitaph={epitaph}
          appearAt={engraveAt}
          x={gravestoneX}
          y={gravestoneY}
        />
        <Sequence from={cardStart} durationInFrames={cardDur}>
          <MemorialCard name={name} born={born} died={died} />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
