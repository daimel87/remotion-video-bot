import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';
import {BrainIcon} from './icons';

export const BrainTextGraphic: React.FC<{text: string; highlight?: string}> = ({text, highlight}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const iconX = interpolate(enter, [0, 1], [-60, 0]) * scale;
  const textX = interpolate(enter, [0, 1], [60, 0]) * scale;

  const parts = highlight ? text.split(highlight) : [text];

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: `${80 * scale}px`,
          gap: 64 * scale,
        }}
      >
        <div style={{opacity: enter, transform: `translateX(${iconX}px)`, flexShrink: 0}}>
          <BrainIcon size={160 * scale} />
        </div>
        <div
          style={{
            opacity: enter,
            transform: `translateX(${textX}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 52 * scale,
            lineHeight: 1.3,
            color: '#ffffff',
            maxWidth: 960 * scale,
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
