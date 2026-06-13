import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateX = interpolate(enter, [0, 1], [-300, 0]);
  const opacity = enter * exit;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start'}}>
      <div
        style={{
          opacity,
          transform: `translateX(${translateX}px)`,
          marginLeft: 50,
          marginBottom: 70,
          background: 'linear-gradient(90deg, #1f6f43 0%, #43a868 100%)',
          borderRadius: 10,
          padding: '14px 28px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
        }}
      >
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 28,
            color: '#ffffff',
          }}
        >
          Dra. Laura
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            fontSize: 18,
            color: '#e3ffe9',
          }}
        >
          Nutrición y bienestar masculino
        </div>
      </div>
    </AbsoluteFill>
  );
};
