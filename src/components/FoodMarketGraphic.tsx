import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';
import {TomatoIcon, LeafIcon, TagIcon} from './icons';

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

export const FoodMarketGraphic: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const titleEnter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const numberScale = interpolate(titleEnter, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            opacity: titleEnter,
            transform: `scale(${numberScale})`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 140,
            color: '#ffffff',
            textShadow: '0 0 40px rgba(91,140,255,0.8)',
            lineHeight: 1,
          }}
        >
          10
        </div>
        <div
          style={{
            opacity: titleEnter,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 44,
            color: '#9be1ff',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginTop: -10,
            marginBottom: 50,
          }}
        >
          Alimentos para tu próstata
        </div>

        <div style={{display: 'flex', gap: 24}}>
          <Chip delay={20} icon={<TagIcon size={32} />}>
            Menos de $15 MXN
          </Chip>
          <Chip delay={40} icon={<TomatoIcon size={32} />}>
            Mercado de México
          </Chip>
          <Chip delay={60} icon={<LeafIcon size={32} />}>
            Sin suplementos
          </Chip>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
