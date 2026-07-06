import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

/**
 * Texto "grabado" sobre la lápida: nombre + fechas (+ epitafio opcional).
 * Se posiciona con x/y como fracción del cuadro (0-1) porque cada clip IA
 * coloca la lápida en un sitio distinto — ajústalo por actor.
 * Aparece con un fade suave (appearAt) para que coincida con el momento
 * en que el actor se arrodilla, y se va con la escena.
 */
export const Gravestone: React.FC<{
  name: string;
  born: string;
  died: string;
  epitaph?: string;
  x?: number; // 0-1, centro horizontal del grabado
  y?: number; // 0-1, centro vertical del grabado
  appearAt?: number; // frame de la escena en que empieza a aparecer
  fadeDuration?: number;
  /** Frame en que empieza a desvanecerse (ej. antes de que la cámara se mueva). */
  hideAt?: number;
}> = ({name, born, died, epitaph, x = 0.5, y = 0.52, appearAt = 24, fadeDuration = 22, hideAt}) => {
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

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: 'translate(-50%, -50%)',
          opacity,
          textAlign: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
          color: '#e7e1d1',
          // efecto grabado en piedra: sombra oscura abajo + luz arriba
          textShadow:
            '0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.12)',
        }}
      >
        <div
          style={{
            fontSize: 44 * scale,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 3 * scale,
          }}
        >
          {name}
        </div>
        <div style={{fontSize: 25 * scale, marginTop: 8 * scale, opacity: 0.9}}>
          {born} — {died}
        </div>
        {epitaph ? (
          <div
            style={{
              fontSize: 19 * scale,
              marginTop: 10 * scale,
              fontStyle: 'italic',
              opacity: 0.8,
            }}
          >
            {epitaph}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
