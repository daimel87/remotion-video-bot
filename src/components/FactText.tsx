import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

// Texto largo (fact) sobre fondo de video, con un scrim oscuro detrás para
// que se lea incluso en los momentos brillantes del clip. Soporta **negrita**
// en el texto de entrada para resaltar palabras clave.
export const FactText: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const scale = width / 720;

  const fadeIn = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <div
      style={{
        position: 'absolute',
        top: 90 * scale,
        left: 36 * scale,
        right: 36 * scale,
        opacity: fadeIn,
      }}
    >
      <div
        style={{
          background: 'rgba(0,0,0,0.55)',
          borderRadius: 20 * scale,
          padding: `${28 * scale}px ${26 * scale}px`,
        }}
      >
        <span
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: 26 * scale,
            lineHeight: 1.35,
            color: '#ffffff',
          }}
        >
          {parts.map((part, i) => {
            const isBold = part.startsWith('**') && part.endsWith('**');
            const content = isBold ? part.slice(2, -2) : part;
            return (
              <span key={i} style={{fontWeight: isBold ? 800 : 400}}>
                {content}
              </span>
            );
          })}
        </span>
      </div>
    </div>
  );
};
