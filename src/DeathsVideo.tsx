import {AbsoluteFill, Series} from 'remotion';
import {DeathCard} from './components/DeathCard';
import {DEATHS, DEATHS_FPS, SECONDS_PER_CARD} from './deathsData';

/**
 * "Celebridades que murieron en 2026" — una tarjeta por persona, encadenadas.
 * Colores nuevos (carbón + oro + carmesí). Datos verificados en deathsData.ts.
 */
export const DeathsVideo: React.FC = () => {
  const perCard = Math.round(DEATHS_FPS * SECONDS_PER_CARD);
  return (
    <AbsoluteFill style={{backgroundColor: '#17131f'}}>
      <Series>
        {DEATHS.map((d, i) => (
          <Series.Sequence key={i} durationInFrames={perCard}>
            <DeathCard {...d} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
