import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {Gravestone} from './components/Gravestone';

/**
 * Escena terminada de Sidney Poitier (14s, clip de OpenArt ya unido).
 * Graba la lápida durante el duelo + abrazo y la desvanece antes de que
 * De Niro camine (ahí la cámara se mueve). Tarjeta de nombre en el abrazo.
 * fps 24 para calzar con el clip fuente.
 */
export const PoitierScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const fade = 14;
  const dip = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: dip}}>
        <OffthreadVideo src={staticFile('poitier.mp4')} />

        {/* Grabado sobre la piedra: visible durante duelo + abrazo (~1.7s a ~8s) */}
        <Gravestone
          name="Sidney Poitier"
          born="1927"
          died="2022"
          x={0.72}
          y={0.63}
          appearAt={40}
          fadeDuration={24}
          hideAt={190}
          photoPlaceholder
          photoWidth={0.06}
          nameSize={0.016}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
