import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';
import {ZincIcon, SunIcon} from './icons';

const Row: React.FC<{delay: number; icon: React.ReactNode; title: string; subtitle: string}> = ({
  delay,
  icon,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 200, stiffness: 160}});

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        background: 'rgba(20, 35, 80, 0.85)',
        border: '1px solid rgba(91, 140, 255, 0.6)',
        boxShadow: '0 0 22px rgba(91, 140, 255, 0.4)',
        borderRadius: 14,
        padding: '18px 32px',
        marginTop: 18,
        minWidth: 460,
      }}
    >
      {icon}
      <div>
        <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 28, color: '#fff'}}>
          {title}
        </div>
        <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 400, fontSize: 18, color: '#9be1ff'}}>
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export const RecapGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const titleEnter = spring({frame, fps, config: {damping: 200, stiffness: 160}});
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
            fontSize: 36,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          Recapitulando
        </div>
        <Row delay={15} icon={<ZincIcon size={44} />} title="1. Zinc" subtitle="Testosterona y sistema inmune" />
        <Row delay={40} icon={<SunIcon size={44} />} title="2. Vitamina D" subtitle="Fuerza y estado de ánimo" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
