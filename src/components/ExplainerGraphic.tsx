import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

const Pill: React.FC<{children: React.ReactNode; delay: number}> = ({children, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 200, stiffness: 180}});
  const opacity = enter;
  const scale = interpolate(enter, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        background: 'rgba(20, 35, 80, 0.85)',
        border: '1px solid rgba(91, 140, 255, 0.7)',
        boxShadow: '0 0 22px rgba(91, 140, 255, 0.5)',
        borderRadius: 999,
        padding: '22px 48px',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontWeight: 800,
        fontSize: 46,
        color: '#ffffff',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
};

export const ExplainerGraphic: React.FC<{
  icon: React.ReactNode;
  from: string;
  to: string;
  caption: string;
}> = ({icon, from, to, caption}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const iconEnter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
  const lineProgress = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionEnter = spring({frame: Math.max(0, frame - 55), fps, config: {damping: 200, stiffness: 150}});

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
            opacity: iconEnter,
            transform: `scale(${interpolate(iconEnter, [0, 1], [0.6, 1])})`,
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: 'rgba(20, 35, 80, 0.85)',
            border: '2px solid rgba(91, 140, 255, 0.8)',
            boxShadow: '0 0 30px rgba(91, 140, 255, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 50,
          }}
        >
          {icon}
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <Pill delay={0}>{from}</Pill>
          <div
            style={{
              width: 140,
              height: 2,
              background: 'rgba(91, 140, 255, 0.8)',
              boxShadow: '0 0 10px rgba(91, 140, 255, 0.8)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${lineProgress * 100}%`,
                background: '#9be1ff',
              }}
            />
          </div>
          <Pill delay={30}>{to}</Pill>
        </div>

        <div
          style={{
            marginTop: 60,
            opacity: captionEnter,
            transform: `translateY(${interpolate(captionEnter, [0, 1], [20, 0])}px)`,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            fontSize: 42,
            color: '#c9e8ff',
            textAlign: 'center',
            maxWidth: 1250,
            lineHeight: 1.35,
          }}
        >
          {caption}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
