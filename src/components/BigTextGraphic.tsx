import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

export const BigTextGraphic: React.FC<{text: string; highlight?: string}> = ({text, highlight}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(enter, [0, 1], [40, 0]) * scale;
  const opacity = enter * exit;

  const parts = highlight ? text.split(highlight) : [text];

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80 * scale}}>
        <div
          style={{
            opacity,
            transform: `translateY(${translateY}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 64 * scale,
            lineHeight: 1.25,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 1500 * scale,
          }}
        >
          {highlight ? (
            <>
              {parts[0]}
              <span style={{color: '#9be1ff', textShadow: '0 0 20px rgba(91,140,255,0.8)'}}>{highlight}</span>
              {parts[1]}
            </>
          ) : (
            text
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
