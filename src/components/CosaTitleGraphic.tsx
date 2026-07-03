import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

interface Props {
  title: string;
  subtitle?: string;
}

export const CosaTitleGraphic: React.FC<Props> = ({title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const titleEnter = spring({frame, fps, config: {damping: 180, stiffness: 130}});
  const subtitleEnter = spring({frame: Math.max(0, frame - 12), fps, config: {damping: 180, stiffness: 130}});

  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(titleEnter, [0, 1], [50, 0]) * scale;
  const subtitleY = interpolate(subtitleEnter, [0, 1], [30, 0]) * scale;

  const lineWidth = interpolate(titleEnter, [0, 1], [0, 900 * scale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 24 * scale}}>

        <div
          style={{
            opacity: titleEnter * exit,
            transform: `translateY(${titleY}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 110 * scale,
            lineHeight: 1.1,
            color: '#ff3c3c',
            textAlign: 'center',
            maxWidth: 1600 * scale,
            textTransform: 'uppercase',
            letterSpacing: 2 * scale,
            textShadow: '0 0 50px rgba(255,60,60,0.7)',
          }}
        >
          {title}
        </div>

        <div
          style={{
            width: lineWidth,
            height: 5 * scale,
            background: 'linear-gradient(90deg, transparent, #ff3c3c, transparent)',
          }}
        />

        {subtitle ? (
          <div
            style={{
              opacity: subtitleEnter * exit,
              transform: `translateY(${subtitleY}px)`,
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              fontSize: 46 * scale,
              color: '#cccccc',
              textAlign: 'center',
              letterSpacing: 4 * scale,
              textTransform: 'uppercase',
              maxWidth: 1500 * scale,
            }}
          >
            {subtitle}
          </div>
        ) : null}

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
