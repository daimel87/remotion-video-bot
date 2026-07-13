import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const CaptionBox: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1280;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 200}});
  const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(enter, [0, 1], [24, 0]) * scale;
  const opacity = enter * exit;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60 * scale}}>
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          maxWidth: 1180 * scale,
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(8, 16, 40, 0.82)',
          border: '1px solid rgba(91, 140, 255, 0.6)',
          boxShadow: '0 0 24px rgba(70, 110, 255, 0.45)',
          borderRadius: 10 * scale,
          padding: `${16 * scale}px ${28 * scale}px`,
        }}
      >
        <div
          style={{
            width: 6 * scale,
            alignSelf: 'stretch',
            background: '#5b8cff',
            borderRadius: 4 * scale,
            marginRight: 18 * scale,
            boxShadow: '0 0 12px #5b8cff',
          }}
        />
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            fontSize: 38 * scale,
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
