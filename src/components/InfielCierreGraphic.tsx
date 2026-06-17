import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

export const InfielCierreGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const titleEnter = spring({frame, fps, config: {damping: 180, stiffness: 120}});
  const line1Enter = spring({frame: Math.max(0, frame - 15), fps, config: {damping: 180, stiffness: 120}});
  const line2Enter = spring({frame: Math.max(0, frame - 25), fps, config: {damping: 180, stiffness: 120}});
  const line3Enter = spring({frame: Math.max(0, frame - 35), fps, config: {damping: 180, stiffness: 120}});

  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(titleEnter, [0, 1], [40, 0]) * scale;

  const lineStyle = (enter: number, color: string): React.CSSProperties => ({
    opacity: enter * exit,
    transform: `translateX(${interpolate(enter, [0, 1], [60, 0]) * scale}px)`,
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontWeight: 700,
    fontSize: 36 * scale,
    color,
    textAlign: 'left' as const,
    padding: `${12 * scale}px ${24 * scale}px`,
    borderLeft: `4px solid ${color}`,
    marginTop: 12 * scale,
  });

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 30 * scale}}>

        <div
          style={{
            opacity: titleEnter * exit,
            transform: `translateY(${titleY}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 64 * scale,
            color: '#ffffff',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2 * scale,
            maxWidth: 1400 * scale,
          }}
        >
          ¿Cuántas de estas señales{' '}
          <span style={{color: '#ff3c3c', textShadow: '0 0 30px rgba(255,60,60,0.8)'}}>reconoces</span>?
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 4 * scale, marginTop: 20 * scale}}>
          <div style={lineStyle(line1Enter, '#4ade80')}>
            1-2: Observa
          </div>
          <div style={lineStyle(line2Enter, '#facc15')}>
            3-4: Presta atención
          </div>
          <div style={lineStyle(line3Enter, '#ff3c3c')}>
            5 o más: Necesitas una conversación
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
