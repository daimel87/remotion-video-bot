import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';
import {CrossIcon, ChartIcon, FlameIcon} from './icons';

const Chip: React.FC<{delay: number; children: React.ReactNode; icon: React.ReactNode}> = ({
  delay,
  children,
  icon,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 200, stiffness: 160}});

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        background: 'rgba(20, 35, 80, 0.85)',
        border: '1px solid rgba(91, 140, 255, 0.6)',
        boxShadow: '0 0 22px rgba(91, 140, 255, 0.4)',
        borderRadius: 14,
        padding: '16px 30px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 700,
        fontSize: 26,
        color: '#ffffff',
      }}
    >
      {icon}
      {children}
    </div>
  );
};

export const ConditionsGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const titleEnter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 40,
            color: '#9be1ff',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 50,
            textAlign: 'center',
          }}
        >
          Cientos de casos tratados
        </div>

        <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
          <Chip delay={15} icon={<CrossIcon size={32} />}>
            Hiperplasia prostática benigna
          </Chip>
          <Chip delay={35} icon={<ChartIcon size={32} />}>
            PSA elevado
          </Chip>
          <Chip delay={55} icon={<FlameIcon size={32} />}>
            Prostatitis crónica
          </Chip>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
