import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const IntroTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 120}});
  const exit = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(enter, [0, 1], [40, 0]);
  const opacity = enter * exit;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 40,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          textAlign: 'left',
          background: 'rgba(0,0,0,0.55)',
          borderRadius: 18,
          padding: '18px 28px',
          backdropFilter: 'blur(6px)',
          maxWidth: 380,
        }}
      >
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 30,
            color: '#ffffff',
            letterSpacing: 1,
            textTransform: 'uppercase',
            lineHeight: 1.2,
          }}
        >
          7 suplementos para hombres 50+
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 500,
            fontSize: 19,
            color: '#9be15d',
            marginTop: 8,
          }}
        >
          Recupera tu vitalidad, energía y bienestar
        </div>
      </div>
    </AbsoluteFill>
  );
};
