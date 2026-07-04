import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'radial-gradient(ellipse at center, rgba(0,0,0,0) 35%, rgba(0,0,0,0.75) 100%)',
    }}
  />
);

/** Intro solemne: "En Memoria" + subtítulo. */
export const TributeIntro: React.FC<{title: string; subtitle: string}> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 90}});
  const exit = interpolate(frame, [durationInFrames - 18, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = enter * exit;

  return (
    <AbsoluteFill style={{backgroundColor: '#050505'}}>
      <Vignette />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{opacity, textAlign: 'center', fontFamily: 'Georgia, serif'}}>
          <div
            style={{
              fontSize: 34 * scale,
              color: '#d4af37',
              letterSpacing: 8 * scale,
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 20 * scale,
              fontSize: 60 * scale,
              fontWeight: 700,
              color: '#f3ecd8',
              letterSpacing: 2 * scale,
              textShadow: '0 2px 20px rgba(0,0,0,0.7)',
            }}
          >
            {subtitle}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Outro: "Descansen en Paz" + llamado a suscribirse. */
export const TributeOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const scale = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 90}});
  const glow = Math.sin(frame * 0.06) * 0.25 + 0.75;

  return (
    <AbsoluteFill style={{backgroundColor: '#050505'}}>
      <Vignette />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{opacity: enter, textAlign: 'center', fontFamily: 'Georgia, serif'}}>
          <div
            style={{
              fontSize: 64 * scale,
              fontWeight: 700,
              color: '#f3ecd8',
              letterSpacing: 3 * scale,
              textShadow: `0 0 ${30 * glow * scale}px rgba(212,175,55,0.5)`,
            }}
          >
            Descansen en Paz
          </div>
          <div
            style={{
              marginTop: 28 * scale,
              fontSize: 26 * scale,
              color: '#d4af37',
              letterSpacing: 2 * scale,
            }}
          >
            Suscríbete para más homenajes 🕊️
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
