import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const CaptionBox: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 200}});
  const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(enter, [0, 1], [24, 0]);
  const opacity = enter * exit;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60}}>
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          maxWidth: 1080,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(8, 16, 40, 0.82)',
          border: '1px solid rgba(91, 140, 255, 0.6)',
          boxShadow: '0 0 24px rgba(70, 110, 255, 0.45)',
          borderRadius: 10,
          padding: '16px 28px',
        }}
      >
        <div
          style={{
            width: 6,
            alignSelf: 'stretch',
            background: '#5b8cff',
            borderRadius: 4,
            marginRight: 18,
            boxShadow: '0 0 12px #5b8cff',
          }}
        />
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            fontSize: 30,
            color: '#ffffff',
            lineHeight: 1.3,
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};
