import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import {MemorialCard} from './components/MemorialCard';

/**
 * Escena terminada de Sidney Poitier (14s, clip de OpenArt ya unido).
 * Nombre + fechas centrados abajo (MemorialCard), con fundidos a negro.
 * fps 24 para calzar con el clip fuente.
 */
export const PoitierScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Solo fade de entrada; sin fundido final para poder encadenar con la
  // siguiente escena (De Niro sale caminando a la derecha, corte limpio).
  const fade = 14;
  const dip = interpolate(frame, [0, fade], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AbsoluteFill style={{opacity: dip}}>
        <OffthreadVideo src={staticFile('poitier.mp4')} />

        {/* Nombre + fechas centrados abajo, casi toda la escena */}
        <Sequence from={30} durationInFrames={295}>
          <MemorialCard name="Sidney Poitier" born="1927" died="2022" />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
