import {
  AbsoluteFill,
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
  /** Nombre del archivo del clip IA dentro de public/ (ej: 'actor_1.mp4') */
  clip: string;
  name: string;
  born: string; // año de nacimiento, ej: '1965'
  died: string; // año de fallecimiento, ej: '2023'
  epitaph?: string;
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
        <OffthreadVideo src={staticFile(clip)} />
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
