import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

export const NarcCierreGraphic: React.FC = () => {
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
    fontSize: 42 * scale,
    color,
    textAlign: 'left' as const,
    padding: `${14 * scale}px ${28 * scale}px`,
    borderLeft: `5px solid ${color}`,
    marginTop: 14 * scale,
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
            fontSize: 72 * scale,
            color: '#ffffff',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2 * scale,
            maxWidth: 1500 * scale,
          }}
        >
          ¿Cuántas de estas{' '}
          <span style={{color: '#ff3c3c', textShadow: '0 0 30px rgba(255,60,60,0.8)'}}>trampas</span>
          {' '}reconoces?
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 6 * scale, marginTop: 20 * scale}}>
          <div style={lineStyle(line1Enter, '#4ade80')}>
            1-2: Mantén los ojos abiertos
          </div>
          <div style={lineStyle(line2Enter, '#facc15')}>
            3-4: Establece límites ahora
          </div>
          <div style={lineStyle(line3Enter, '#ff3c3c')}>
            5 o más: Necesitas salir de ahí
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};
