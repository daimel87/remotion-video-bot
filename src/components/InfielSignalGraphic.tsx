import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

interface Props {
  number: string;
  title: string;
  subtitle?: string;
}

export const InfielSignalGraphic: React.FC<Props> = ({number, title, subtitle}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const numberEnter = spring({frame, fps, config: {damping: 200, stiffness: 200}});
  const titleEnter = spring({frame: Math.max(0, frame - 8), fps, config: {damping: 180, stiffness: 140}});
  const subtitleEnter = spring({frame: Math.max(0, frame - 16), fps, config: {damping: 180, stiffness: 140}});

  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const numberScale = interpolate(numberEnter, [0, 1], [0.5, 1]);
  const titleY = interpolate(titleEnter, [0, 1], [40, 0]) * scale;
  const subtitleY = interpolate(subtitleEnter, [0, 1], [30, 0]) * scale;

  const lineWidth = interpolate(titleEnter, [0, 1], [0, 900 * scale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 20 * scale}}>

        {/* Number badge */}
        <div
          style={{
            opacity: numberEnter * exit,
            transform: `scale(${numberScale})`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 120 * scale,
            color: '#ff3c3c',
            textShadow: '0 0 40px rgba(255,60,60,0.7)',
            lineHeight: 1,
          }}
        >
          {number}
        </div>

        {/* Divider */}
        <div
          style={{
            width: lineWidth,
            height: 4 * scale,
            background: 'linear-gradient(90deg, transparent, #ff3c3c, transparent)',
          }}
        />

        {/* Title */}
        <div
          style={{
            opacity: titleEnter * exit,
            transform: `translateY(${titleY}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 72 * scale,
            color: '#ffffff',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 3 * scale,
            maxWidth: 1400 * scale,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        {/* Optional subtitle */}
        {subtitle && (
          <div
            style={{
              opacity: subtitleEnter * exit,
              transform: `translateY(${subtitleY}px)`,
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 500,
              fontSize: 36 * scale,
              color: '#aaaaaa',
              textAlign: 'center',
              letterSpacing: 2 * scale,
              marginTop: 8 * scale,
            }}
          >
            {subtitle}
          </div>
        )}

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
