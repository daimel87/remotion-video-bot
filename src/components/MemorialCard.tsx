import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

/**
 * Tarjeta de nombre solemne (centrada abajo) que entra en el momento del
 * abrazo. Acento dorado + serif para un tono memorial, no el azul-tech.
 */
export const MemorialCard: React.FC<{name: string; born: string; died: string}> = ({
  name,
  born,
  died,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 120}});
  const exit = interpolate(frame, [durationInFrames - 16, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(enter, [0, 1], [30, 0]) * scale;
  const opacity = enter * exit;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90 * scale}}>
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: 'center',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        <div
          style={{
            fontSize: 52 * scale,
            fontWeight: 700,
            color: '#f3ecd8',
            letterSpacing: 2 * scale,
            textShadow: '0 2px 14px rgba(0,0,0,0.65)',
          }}
        >
          {name}
        </div>
        <div
          style={{
            marginTop: 10 * scale,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14 * scale,
          }}
        >
          <span
            style={{
              height: 1,
              width: 70 * scale,
              background: 'linear-gradient(90deg, transparent, #d4af37)',
            }}
          />
          <span style={{fontSize: 26 * scale, color: '#d4af37', letterSpacing: 1 * scale}}>
            {born} – {died}
          </span>
          <span
            style={{
              height: 1,
              width: 70 * scale,
              background: 'linear-gradient(90deg, #d4af37, transparent)',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
