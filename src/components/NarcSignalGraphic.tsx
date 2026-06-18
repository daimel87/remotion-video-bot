import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

interface Props {
  number: string;
  title: string;
}

export const NarcSignalGraphic: React.FC<Props> = ({number, title}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const numberEnter = spring({frame, fps, config: {damping: 200, stiffness: 200}});
  const titleEnter = spring({frame: Math.max(0, frame - 8), fps, config: {damping: 180, stiffness: 140}});

  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const numberScale = interpolate(numberEnter, [0, 1], [0.5, 1]);
  const titleY = interpolate(titleEnter, [0, 1], [40, 0]) * scale;

  const lineWidth = interpolate(titleEnter, [0, 1], [0, 1200 * scale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24 * scale}}>

        <div
          style={{
            opacity: numberEnter * exit,
            transform: `scale(${numberScale})`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 150 * scale,
            color: '#ff3c3c',
            textShadow: '0 0 50px rgba(255,60,60,0.7)',
            lineHeight: 1,
          }}
        >
          {number}
        </div>

        <div
          style={{
            width: lineWidth,
            height: 5 * scale,
            background: 'linear-gradient(90deg, transparent, #ff3c3c, transparent)',
          }}
        />

        <div
          style={{
            opacity: titleEnter * exit,
            transform: `translateY(${titleY}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 88 * scale,
            color: '#ffffff',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 3 * scale,
            maxWidth: 1600 * scale,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
