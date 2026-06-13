import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {SparkleIcon} from './icons';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 120}});
  const scale = interpolate(enter, [0, 1], [0.85, 1]);
  const bgOpacity = interpolate(frame, [0, 10], [0, 0.7], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{background: '#0b1f12', opacity: bgOpacity}} />
      <div
        style={{
          opacity: enter,
          transform: `scale(${scale})`,
          textAlign: 'center',
        }}
      >
        <div style={{display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 16}}>
          <SparkleIcon size={40} />
          <SparkleIcon size={40} />
          <SparkleIcon size={40} />
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 44,
            color: '#ffffff',
            textTransform: 'uppercase',
          }}
        >
          Empieza hoy, paso a paso
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 500,
            fontSize: 24,
            color: '#9be15d',
            marginTop: 12,
          }}
        >
          Sígueme para más consejos de salud y vitalidad
        </div>
      </div>
    </AbsoluteFill>
  );
};
