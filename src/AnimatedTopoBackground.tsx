import {useCurrentFrame} from 'remotion';

// Fondo animado de líneas topográficas en movimiento (estilo Spoody).
// Varias curvas onduladas que se desplazan lentamente en direcciones distintas.
export const AnimatedTopoBackground: React.FC = () => {
  const frame = useCurrentFrame();

  const lines = Array.from({length: 7}).map((_, i) => {
    const offset = (frame * (0.6 + i * 0.15) + i * 60) % 1400;
    const amp = 40 + i * 6;
    const yBase = 120 + i * 160;
    const points: string[] = [];
    for (let x = -100; x <= 820; x += 40) {
      const y = yBase + Math.sin((x + offset) * 0.012) * amp;
      points.push(`${x},${y}`);
    }
    return {id: i, d: `M ${points.join(' L ')}`};
  });

  return (
    <svg
      width="720"
      height="1280"
      viewBox="0 0 720 1280"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
    >
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0b1a2e" />
          <stop offset="100%" stopColor="#132a45" />
        </linearGradient>
      </defs>
      <rect width="720" height="1280" fill="url(#bgGrad)" />
      {lines.map((l) => (
        <path key={l.id} d={l.d} fill="none" stroke="#3ea0d8" strokeWidth={2} opacity={0.35} />
      ))}
    </svg>
  );
};
