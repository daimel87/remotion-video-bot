import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate} from 'remotion';

// Título: usa **texto** para marcar las palabras en verde (como "Helium Voices" en la referencia).
const TITLE = 'Ranking The Most **Ferocious** Dogs';

// Columna de puestos 1-5. color = color del número; label = texto corto opcional junto al número.
// Colores tomados de la referencia: 1 amarillo, 2 gris, 3 rojo, 4 amarillo, 5 amarillo.
const RANKS: {n: number; color: string; label: string}[] = [
  {n: 1, color: '#FFD23F', label: ''},
  {n: 2, color: '#C7C7C7', label: ''},
  {n: 3, color: '#FF3B30', label: ''},
  {n: 4, color: '#FFD23F', label: ''},
  {n: 5, color: '#FFD23F', label: ''},
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
        src={staticFile('beetle-fact-test.mp4')}
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

      {/* Columna de números 1-5 a la izquierda, con reveal escalonado */}
      {RANKS.map((r, i) => {
        const appearAt = i * 6;
        const opacity = interpolate(frame, [appearAt, appearAt + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const top = 300 + i * 95;
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
              opacity,
            }}
          >
            <span
              style={{
                fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
                fontWeight: 900,
                fontSize: 60,
                color: r.color,
                WebkitTextStroke: '3px ' + STROKE,
                paintOrder: 'stroke fill',
                textShadow: '0 3px 8px rgba(0,0,0,0.7)',
              }}
            >
              {r.n}.
            </span>
            {r.label ? (
              <span
                style={{
                  fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
                  fontWeight: 800,
                  fontSize: 26,
                  color: '#fff',
                  WebkitTextStroke: '2px ' + STROKE,
                  paintOrder: 'stroke fill',
                  textShadow: '0 2px 6px rgba(0,0,0,0.7)',
                }}
              >
                {r.label}
              </span>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
