import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {ZincIcon, SunIcon} from './icons';

const useItemAnimation = (delay: number) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: {damping: 200, stiffness: 140},
  });
  const exit = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(enter, [0, 1], [30, 0]);
  const opacity = enter * exit;

  return {opacity, translateY};
};

const Card: React.FC<{
  delay: number;
  number: string;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}> = ({delay, number, title, subtitle, icon}) => {
  const {opacity, translateY} = useItemAnimation(delay);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        background: 'rgba(15, 30, 20, 0.75)',
        borderRadius: 14,
        padding: '14px 24px',
        marginTop: 14,
        minWidth: 420,
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 28,
          color: '#9be15d',
          width: 40,
        }}
      >
        {number}
      </div>
      {icon}
      <div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            fontSize: 24,
            color: '#ffffff',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            fontSize: 17,
            color: '#cfe9d6',
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
};

export const RecapList: React.FC = () => {
  const {opacity: titleOpacity, translateY: titleY} = useItemAnimation(0);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-end', paddingRight: 40}}>
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 32,
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: 1,
          background: 'rgba(0,0,0,0.5)',
          borderRadius: 12,
          padding: '10px 24px',
          marginBottom: 6,
        }}
      >
        Recapitulando
      </div>

      <Card
        delay={15}
        number="1"
        title="Zinc"
        subtitle="Testosterona y sistema inmune"
        icon={<ZincIcon />}
      />
      <Card
        delay={45}
        number="2"
        title="Vitamina D"
        subtitle="Fuerza y estado de ánimo"
        icon={<SunIcon />}
      />
      <Card delay={75} number="+5" title="Más suplementos" subtitle="Sigue viendo para descubrirlos" />
    </AbsoluteFill>
  );
};
