import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const LowerThird: React.FC<{name: string; title: string}> = ({name, title}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 200}});
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateX = interpolate(enter, [0, 1], [-60, 0]) * scale;
  const opacity = enter * exit;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start'}}>
      <div
        style={{
          opacity,
          transform: `translateX(${translateX}px)`,
          marginLeft: 60 * scale,
          marginBottom: 80 * scale,
          display: 'flex',
          flexDirection: 'column',
          background: 'rgba(8, 16, 40, 0.82)',
          borderLeft: '6px solid #5b8cff',
          boxShadow: '0 0 24px rgba(70, 110, 255, 0.45)',
          borderRadius: '0 8px 8px 0',
          padding: `${14 * scale}px ${28 * scale}px`,
        }}
      >
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 36 * scale,
            color: '#ffffff',
            letterSpacing: 0.5,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            fontSize: 24 * scale,
            color: '#9be1ff',
            marginTop: 2 * scale,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};
