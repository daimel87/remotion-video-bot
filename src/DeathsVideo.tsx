import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {DeathCard} from './components/DeathCard';
import {DEATHS} from './deathsData';

const BG = '#17131f';

/**
 * "Celebridades fallecidas en 2026" — una FILA de tarjetas que se desplaza
 * lento de derecha a izquierda (paneo suave). Las tarjetas van llegando por
 * la derecha. 3 minutos. Colores nuevos (carbón + oro + carmesí).
 */
export const DeathsVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, durationInFrames} = useVideoConfig();

  const cardW = 600;
  const gap = 56;
  const pad = 70;
  const rowW = DEATHS.length * cardW + (DEATHS.length - 1) * gap;

  // Paneo continuo: primera tarjeta a la izquierda -> última a la derecha.
  const startX = pad;
  const endX = width - rowW - pad;
  const x = interpolate(frame, [0, durationInFrames - 1], [startX, endX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: BG, justifyContent: 'center'}}>
      {/* Fila de tarjetas que se desplaza */}
      <div style={{display: 'flex', gap, width: 'max-content', transform: `translateX(${x}px)`}}>
        {DEATHS.map((d, i) => (
          <DeathCard key={i} {...d} cardW={cardW} />
        ))}
      </div>

      {/* Desvanecido en los bordes */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background: `linear-gradient(90deg, ${BG} 0%, rgba(23,19,31,0) 10%, rgba(23,19,31,0) 90%, ${BG} 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
