import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

export const MentirasTitleGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const titleEnter = spring({frame, fps, config: {damping: 180, stiffness: 120}});
  const subtitleEnter = spring({frame: Math.max(0, frame - 12), fps, config: {damping: 180, stiffness: 120}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(titleEnter, [0, 1], [50, 0]) * scale;
  const subtitleY = interpolate(subtitleEnter, [0, 1], [30, 0]) * scale;

  const lineWidth = interpolate(subtitleEnter, [0, 1], [0, 680 * scale], {
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
            fontSize: 84 * scale,
            lineHeight: 1.15,
            color: '#ffffff',
            textAlign: 'center',
            maxWidth: 1600 * scale,
            textTransform: 'uppercase',
            letterSpacing: 2 * scale,
          }}
        >
          Las 5{' '}
          <span style={{color: '#ff3c3c', textShadow: '0 0 30px rgba(255,60,60,0.8)'}}>mentiras</span>
          {' '}más comunes de una mujer infiel
        </div>

        <div
          style={{
            width: lineWidth,
            height: 3 * scale,
            background: 'linear-gradient(90deg, transparent, #ff3c3c, transparent)',
            borderRadius: 2,
          }}
        />

        <div
          style={{
            opacity: subtitleEnter * exit,
            transform: `translateY(${subtitleY}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            fontSize: 44 * scale,
            color: '#cccccc',
            textAlign: 'center',
            letterSpacing: 4 * scale,
            textTransform: 'uppercase',
          }}
        >
          Y cómo detectarlas al instante
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
