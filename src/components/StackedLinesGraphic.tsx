import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

export const StackedLinesGraphic: React.FC<{lines: string[]; highlightIndex?: number}> = ({lines, highlightIndex = 0}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;
  const perLine = durationInFrames / lines.length;

  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          padding: `${80 * scale}px`,
          flexDirection: 'column',
          gap: 20 * scale,
        }}
      >
        {lines.map((line, i) => {
          const lineFrame = Math.max(0, frame - Math.floor(i * perLine));
          const enter = spring({frame: lineFrame, fps, config: {damping: 200, stiffness: 150}});
          const translateY = interpolate(enter, [0, 1], [28, 0]) * scale;
          const isHighlight = i === highlightIndex;
          return (
            <div
              key={i}
              style={{
                opacity: enter,
                transform: `translateY(${translateY}px)`,
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 800,
                fontSize: 60 * scale,
                lineHeight: 1.2,
                color: isHighlight ? '#9be1ff' : '#ffffff',
                textShadow: isHighlight ? '0 0 20px rgba(91,140,255,0.8)' : 'none',
                textAlign: 'center',
              }}
            >
              {line}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
