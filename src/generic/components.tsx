// Componentes de la composicion generica del pipeline automatico (audio ->
// video). Sigue las reglas del skill remotion-motion-graphics: nada de
// easing lineal en entradas/salidas, spring en 2-3 propiedades a la vez,
// salidas mas rapidas que las entradas, y una pila de 5 capas por plano
// (fondo -> grade -> grain+vineta por encima de todo).
//
// A diferencia de src/odisea/components.tsx (tema fijo "Cronicas
// Ilustradas"), esto es neutro: sirve para cualquier nicho/guion que suba
// el usuario.
import React from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {theme} from './theme';

export type ClipKind = 'photos' | 'videos';

// ============ CAPA 1: fondo (foto o video de stock) ============
export const KenBurnsPhoto: React.FC<{src: string; direction?: 'in' | 'out'; pan?: 'left' | 'right' | 'none'}> = ({
  src,
  direction = 'in',
  pan = 'none',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale =
    direction === 'in'
      ? interpolate(frame, [0, durationInFrames], [1, 1.1], {easing: theme.ease.inOut})
      : interpolate(frame, [0, durationInFrames], [1.1, 1], {easing: theme.ease.inOut});
  const panAmount = pan === 'left' ? -26 : pan === 'right' ? 26 : 0;
  const panX = interpolate(frame, [0, durationInFrames], [0, panAmount], {easing: theme.ease.inOut});
  return (
    <Img
      src={staticFile(src)}
      style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${panX}px)`}}
    />
  );
};

// Video de stock recortado a la duracion exacta del bloque (silenciado: la
// pista de audio real es siempre la locucion, nunca el sonido del clip).
export const StockVideo: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.04, 1.12], {easing: theme.ease.inOut});
  return (
    <OffthreadVideo
      src={staticFile(src)}
      muted
      style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}}
    />
  );
};

// ============ CAPA 2: color grade (unifica fotos IA + video stock) ============
export const Grade: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{backgroundColor: theme.colors.primary, mixBlendMode: 'soft-light', opacity: 0.14}} />
    <AbsoluteFill
      style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.24), transparent 30%, transparent 64%, rgba(0,0,0,0.52))'}}
    />
  </AbsoluteFill>
);

// ============ CAPA 3: grain + vineta (siempre arriba de todo) ============
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
        opacity: 0.05,
        mixBlendMode: 'multiply',
      }}
    />
  );
};

export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 56%, rgba(0,0,0,0.4) 100%)'}}
  />
);

// ============ LOWER THIRD (etiqueta de tema, por plano) ============
// Aparece los primeros ~2s de cada plano para dar contexto ("de que trata
// esto"), y se retira -- no se queda pegada toda la toma. Entrada: slide +
// fade + leve escala (spring). Salida notablemente mas rapida.
export const LowerThird: React.FC<{label: string}> = ({label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const HOLD_FRAMES = Math.round(fps * 1.9);
  const EXIT_FRAMES = Math.round(fps * 0.35);

  const enter = spring({frame, fps, config: theme.spring.smooth});
  const exit = interpolate(frame, [HOLD_FRAMES, HOLD_FRAMES + EXIT_FRAMES], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p = Math.min(enter, exit);
  if (p <= 0.001) return null;

  const x = interpolate(p, [0, 1], [-36, 0]);
  const barW = interpolate(p, [0, 1], [0, 42], {easing: theme.ease.out});

  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: '8%',
        opacity: p,
        transform: `translateX(${x}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'linear-gradient(90deg, rgba(10,11,15,0.82), rgba(10,11,15,0.55) 75%, rgba(10,11,15,0))',
        padding: '14px 60px 14px 18px',
        borderRadius: 6,
      }}
    >
      <div style={{width: 4, height: 30, background: theme.colors.primary, borderRadius: 2}} />
      <div style={{width: barW, height: 2, background: theme.colors.accent, position: 'absolute', left: 30, top: -6}} />
      <div
        style={{
          fontFamily: theme.fonts.body,
          fontWeight: 800,
          color: theme.colors.text,
          fontSize: 30,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          textShadow: '0 2px 10px rgba(0,0,0,0.9)',
        }}
      >
        {label}
      </div>
    </div>
  );
};

// ============ CAPTION (subtitulo tipo "card": pill + reveal por palabra) ============
const WordReveal: React.FC<{text: string; delay?: number}> = ({text, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px'}}>
      {text.split(' ').map((word, i) => {
        const p = spring({frame: frame - delay - i * 2.4, fps, config: theme.spring.snappy});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px) scale(${interpolate(p, [0, 1], [0.9, 1])})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const Caption: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  if (!text) return null;

  const enter = spring({frame, fps, config: theme.spring.smooth});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames - 2], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const p = Math.min(enter, exit);
  const breathe = 1 + Math.sin(frame / 26) * 0.008; // respira si queda mucho tiempo en pantalla

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96, pointerEvents: 'none'}}>
      <div
        style={{
          opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px) scale(${breathe})`,
          maxWidth: '84%',
          background: 'rgba(10,11,15,0.62)',
          borderRadius: 16,
          padding: '18px 34px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontFamily: theme.fonts.body,
            fontSize: 42,
            fontWeight: 800,
            color: theme.colors.text,
            lineHeight: 1.25,
          }}
        >
          <WordReveal text={text} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============ TITLE CARD (apertura, superpuesta sobre el primer plano) ============
export const TitleCard: React.FC<{title: string; durationInFrames: number}> = ({title, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const kickerP = spring({frame, fps, config: theme.spring.smooth});
  const titleP = spring({frame: frame - 5, fps, config: theme.spring.smooth});
  const exit = interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [1, 0], {
    easing: theme.ease.in,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const barW = interpolate(titleP, [0, 1], [0, 120], {easing: theme.ease.out});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: exit, pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{background: 'radial-gradient(70% 68% at 50% 50%, rgba(10,11,15,0.72), rgba(10,11,15,0.3) 70%, rgba(10,11,15,0) 100%)'}}
      />
      <div style={{textAlign: 'center', position: 'relative', padding: '0 8%'}}>
        <div
          style={{
            opacity: kickerP,
            transform: `translateY(${interpolate(kickerP, [0, 1], [18, 0])}px)`,
            fontFamily: theme.fonts.body,
            fontWeight: 800,
            color: theme.colors.accent,
            fontSize: 26,
            letterSpacing: 7,
            textTransform: 'uppercase',
            marginBottom: 18,
            textShadow: '0 2px 10px rgba(0,0,0,0.9)',
          }}
        >
          Hoy en el video
        </div>
        <div
          style={{
            opacity: titleP,
            transform: `translateY(${interpolate(titleP, [0, 1], [26, 0])}px) scale(${interpolate(titleP, [0, 1], [0.94, 1])})`,
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            color: theme.colors.text,
            fontSize: 84,
            lineHeight: 1.08,
            letterSpacing: -0.5,
            textShadow: '0 6px 30px rgba(0,0,0,0.95)',
          }}
        >
          {title}
        </div>
        <div style={{width: barW, height: 4, background: theme.colors.primary, margin: '26px auto 0', borderRadius: 2}} />
      </div>
    </AbsoluteFill>
  );
};

// ============ PROGRESS BAR (global, discreta) ============
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: 4,
      width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
      background: theme.colors.primary,
      boxShadow: `0 0 12px ${theme.colors.glow}`,
    }}
  />
);

// ============ PLANO COMPLETO (fondo + grade + lower third + caption) ============
export const GenericShot: React.FC<{
  src: string;
  kind: ClipKind;
  caption: string;
  keyword?: string;
  direction?: 'in' | 'out';
  pan?: 'left' | 'right' | 'none';
}> = ({src, kind, caption, keyword, direction = 'in', pan = 'none'}) => (
  <AbsoluteFill style={{backgroundColor: theme.colors.bg}}>
    {kind === 'videos' ? <StockVideo src={src} /> : <KenBurnsPhoto src={src} direction={direction} pan={pan} />}
    <Grade />
    {keyword && <LowerThird label={keyword} />}
    <Caption text={caption} />
    <Vignette />
    <Grain />
  </AbsoluteFill>
);
