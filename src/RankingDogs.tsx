import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate} from 'remotion';

// Título: usa **texto** para marcar las palabras en verde (como "Helium Voices" en la referencia).
const TITLE = 'Ranking The Most **Ferocious** Dogs';

// Puestos 4->1 (countdown). El número siempre visible; el nombre de la raza aparece
// junto a su número justo cuando ese perro entra en el video (revealFrame, a 30fps).
// Colores: 4 amarillo, 3 rojo, 2 naranja, 1 verde.
const RANKS: {n: number; color: string; label: string; revealFrame: number}[] = [
  {n: 4, color: '#FFD23F', label: 'Doberman', revealFrame: 10}, //   0-12s
  {n: 3, color: '#FF3B30', label: 'Rottweiler', revealFrame: 360}, // 12-24s
  {n: 2, color: '#FF8C00', label: 'German Shepherd', revealFrame: 720}, // 24-36s
  {n: 1, color: '#39E75F', label: 'Kangal', revealFrame: 1080}, // 36-50s
];

const GREEN = '#39E75F';
const STROKE = '#000';

const renderTitle = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    const isGreen = part.startsWith('**') && part.endsWith('**');
    const content = isGreen ? part.slice(2, -2) : part;
    return (
      <span key={i} style={{color: isGreen ? GREEN : '#fff'}}>
        {content}
      </span>
    );
  });
};

export const RankingDogs: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Video de fondo llenando todo el encuadre, como en la referencia */}
      <OffthreadVideo
        src={staticFile('ferocious-dogs.mp4')}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {/* Título arriba, centrado, con contorno negro */}
      <div
        style={{
          position: 'absolute',
          top: 70,
          left: 20,
          right: 20,
          textAlign: 'center',
          fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
          fontWeight: 900,
          fontSize: 46,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          WebkitTextStroke: '3px ' + STROKE,
          paintOrder: 'stroke fill',
          textShadow: '0 3px 8px rgba(0,0,0,0.6)',
        }}
      >
        {renderTitle(TITLE)}
      </div>

      {/* Subtítulo "Watch until the end" */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 22,
          color: '#fff',
          WebkitTextStroke: '2px ' + STROKE,
          paintOrder: 'stroke fill',
          textShadow: '0 2px 6px rgba(0,0,0,0.6)',
        }}
      >
        Watch until the end
      </div>

      {/* Columna de números 4->1 a la izquierda. Número siempre visible; el nombre
          de la raza se revela cuando ese perro entra en el video. */}
      {RANKS.map((r, i) => {
        const labelOpacity = interpolate(frame, [r.revealFrame, r.revealFrame + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const top = 330 + i * 115;
        return (
          <div
            key={r.n}
            style={{
              position: 'absolute',
              left: 34,
              top,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
                fontWeight: 900,
                fontSize: 64,
                color: r.color,
                WebkitTextStroke: '3px ' + STROKE,
                paintOrder: 'stroke fill',
                textShadow: '0 3px 8px rgba(0,0,0,0.7)',
              }}
            >
              {r.n}.
            </span>
            <span
              style={{
                fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
                fontWeight: 800,
                fontSize: 30,
                color: '#fff',
                WebkitTextStroke: '2px ' + STROKE,
                paintOrder: 'stroke fill',
                textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                opacity: labelOpacity,
              }}
            >
              {r.label}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
