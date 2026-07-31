// Componentes base del skill "remotion-motion-graphics" (Ken Burns, grade,
// grano, vineta, reveal de texto por palabra, entradas/salidas con spring),
// adaptados al theme documental de Odisea. Ver
// .claude/skills/remotion-motion-graphics/references/motion-patterns.md
import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {theme} from '../theme';

export const Entrance: React.FC<{delay?: number; children: React.ReactNode}> = ({
  delay = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: theme.spring.smooth});
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px) scale(${interpolate(p, [0, 1], [0.94, 1])})`,
      }}
    >
      {children}
    </div>
  );
};

export const WordReveal: React.FC<{
  text: string;
  delay?: number;
  per?: number;
  style?: React.CSSProperties;
}> = ({text, delay = 0, per = 3, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.26em', ...style}}>
      {text.split(' ').map((word, i) => {
        const p = spring({frame: frame - delay - i * per, fps, config: theme.spring.snappy});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill
      style={{backgroundColor: theme.colors.primary, mixBlendMode: 'soft-light', opacity: 0.16}}
    />
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.28), transparent 28%, transparent 68%, rgba(0,0,0,0.4))',
      }}
    />
  </AbsoluteFill>
);

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const noise =
    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        backgroundImage: noise,
        backgroundSize: '220px',
        backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
        opacity: 0.06,
        mixBlendMode: 'multiply',
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.55) 100%)',
    }}
  />
);

type KenBurnsDirection = 'in' | 'out';

export const KenBurns: React.FC<{
  src: string;
  direction?: KenBurnsDirection;
  pan?: 'left' | 'right' | 'none';
}> = ({src, direction = 'in', pan = 'none'}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale =
    direction === 'in'
      ? interpolate(frame, [0, durationInFrames], [1, 1.12], {easing: theme.ease.inOut})
      : interpolate(frame, [0, durationInFrames], [1.12, 1], {easing: theme.ease.inOut});
  const panAmount = pan === 'left' ? -30 : pan === 'right' ? 30 : 0;
  const panX = interpolate(frame, [0, durationInFrames], [0, panAmount]);
  return (
    <Img
      src={staticFile(src)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${scale}) translateX(${panX}px)`,
      }}
    />
  );
};

export const RunningCaption: React.FC<{text: string; delay?: number}> = ({text, delay = 0}) => (
  <AbsoluteFill
    style={{
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 96,
      pointerEvents: 'none',
    }}
  >
    <WordReveal
      text={text}
      delay={delay}
      per={2}
      style={{
        maxWidth: '78%',
        justifyContent: 'center',
        textAlign: 'center',
        fontFamily: theme.fonts.body,
        fontSize: 40,
        fontWeight: 600,
        color: theme.colors.text,
        textShadow: '0 3px 18px rgba(0,0,0,0.85)',
        lineHeight: 1.25,
      }}
    />
  </AbsoluteFill>
);

export const useExit = (durationInFrames: number) => {
  const frame = useCurrentFrame();
  const exitO = interpolate(frame, [durationInFrames - 12, durationInFrames - 2], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return exitO;
};

export const ImageShot: React.FC<{
  src: string;
  caption: string;
  direction?: KenBurnsDirection;
  pan?: 'left' | 'right' | 'none';
  captionDelay?: number;
}> = ({src, caption, direction = 'in', pan = 'none', captionDelay = 10}) => {
  const {durationInFrames} = useVideoConfig();
  const exitO = useExit(durationInFrames);
  return (
    <AbsoluteFill style={{opacity: exitO}}>
      <KenBurns src={src} direction={direction} pan={pan} />
      <Grade />
      <RunningCaption text={caption} delay={captionDelay} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
