import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

/**
 * Grabado sobre la lápida: retrato ovalado opcional (tipo porcelana) + nombre
 * tallado + fechas (+ epitafio opcional). Se posiciona con x/y como fracción
 * del cuadro (0-1) porque cada clip IA coloca la lápida en un sitio distinto.
 */
export const Gravestone: React.FC<{
  name: string;
  born: string;
  died: string;
  epitaph?: string;
  x?: number; // 0-1, centro horizontal
  y?: number; // 0-1, centro vertical
  appearAt?: number;
  fadeDuration?: number;
  hideAt?: number;
  /** Retrato del fallecido (archivo en public/, ej: 'poitier_face.jpg'). */
  photo?: string;
  /** Muestra un óvalo gris de marcador de posición si aún no hay foto. */
  photoPlaceholder?: boolean;
  /** Ancho del retrato ovalado (fracción del ancho del cuadro). */
  photoWidth?: number;
  /** Tamaño del nombre (fracción del ancho). */
  nameSize?: number;
}> = ({
  name,
  born,
  died,
  epitaph,
  x = 0.5,
  y = 0.52,
  appearAt = 24,
  fadeDuration = 22,
  hideAt,
  photo,
  photoPlaceholder,
  photoWidth = 0.07,
  nameSize = 0.02,
}) => {
  const frame = useCurrentFrame();
  const {width, durationInFrames} = useVideoConfig();
  const scale = width / 1920;

  const outStart = hideAt ?? durationInFrames - 16;
  const opacity = interpolate(
    frame,
    [appearAt, appearAt + fadeDuration, outStart, outStart + fadeDuration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  const ovalW = photoWidth * width;
  const ovalH = ovalW * 1.25;

  // Texto tallado: letras oscuras con relieve (sombra clara abajo + oscura arriba)
  const engraved = {
    color: '#2f2c27',
    textShadow: `0 1px 0 rgba(255,255,255,0.35), 0 -1px 1px rgba(0,0,0,0.45)`,
  } as const;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: 'translate(-50%, -50%)',
          opacity,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        {(photo || photoPlaceholder) && (
          <div
            style={{
              width: ovalW,
              height: ovalH,
              borderRadius: '50%',
              overflow: 'hidden',
              border: `${Math.max(2 * scale, 1)}px solid rgba(0,0,0,0.35)`,
              boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)',
              marginBottom: 12 * scale,
              background: 'rgba(120,120,115,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {photo ? (
              <Img
                src={staticFile(photo)}
                style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.15) contrast(0.95)'}}
              />
            ) : (
              <span style={{fontSize: ovalW * 0.5, color: 'rgba(60,60,58,0.7)'}}>👤</span>
            )}
          </div>
        )}

        <div
          style={{
            fontSize: nameSize * width,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2.5 * scale,
            ...engraved,
          }}
        >
          {name}
        </div>
        <div style={{fontSize: nameSize * width * 0.58, marginTop: 6 * scale, ...engraved}}>
          {born} — {died}
        </div>
        {epitaph ? (
          <div
            style={{
              fontSize: nameSize * width * 0.44,
              marginTop: 8 * scale,
              fontStyle: 'italic',
              ...engraved,
            }}
          >
            {epitaph}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
