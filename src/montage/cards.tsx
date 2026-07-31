import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {Entrance, Grain, Vignette, WordReveal, useExit} from './components';
import {TextMaskReveal} from '../scenes-lib/scenes/TextAnimations/TextMaskReveal';

// Card de apertura -- reusa TextMaskReveal del skill remotion-scenes tal
// cual viene instalado (parametrizado con `text`/`startDelay`).
export const HeroCard: React.FC = () => (
  <AbsoluteFill>
    <TextMaskReveal text="LA ODISEA" startDelay={4} />
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 190}}>
      <WordReveal
        text="La historia real detras del mito"
        delay={40}
        per={4}
        style={{
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: theme.fonts.body,
          fontSize: 30,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: theme.colors.primary,
        }}
      />
    </AbsoluteFill>
    <Vignette />
    <Grain />
  </AbsoluteFill>
);

// Card de golpe (stinger) entre bloques -- construido a medida (la version
// original reusaba TextKinetic de remotion-scenes tal cual, pero su rebote
// juguetón + acento indigo no encajaban con el tono serio/editorial del
// documental). Mismo lenguaje visual que ChapterCard/ClosingCard: serif
// dorado, spring "smooth" (no bouncy), sin mas color heroe que el dorado.
export const PunchCard: React.FC<{word: string; eyebrow?: string}> = ({word, eyebrow}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const exitO = useExit(durationInFrames);
  const p = spring({frame: frame - 6, fps, config: theme.spring.smooth});
  const tracking = interpolate(p, [0, 1], [0.4, 0.02]); // em -- de disperso a compacto
  const lineW = interpolate(frame, [26, 56], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: theme.ease.out,
  });
  const glow = 1 + Math.sin(frame / 20) * 0.06;
  return (
    <AbsoluteFill
      style={{
        background: theme.colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: exitO,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 900px 500px at 50% 50%, ${theme.colors.glow}, transparent 70%)`,
          opacity: 0.5 * glow,
        }}
      />
      {eyebrow && (
        <Entrance delay={0}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 20,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: theme.colors.primary,
              textAlign: 'center',
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </div>
        </Entrance>
      )}
      <div
        style={{
          fontFamily: theme.fonts.display,
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 128,
          color: theme.colors.text,
          textAlign: 'center',
          letterSpacing: `${tracking}em`,
          opacity: p,
          transform: `scale(${interpolate(p, [0, 1], [0.96, 1])})`,
        }}
      >
        {word}
      </div>
      <div
        style={{
          width: lineW,
          height: 2,
          background: theme.colors.primary,
          marginTop: 22,
        }}
      />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

// Card de capitulo -- construido a medida (inspirado en el patron
// ListTimeline de remotion-scenes) pero con datos reales de Odisea y la
// paleta dorada del proyecto en vez del bg plano generico de la libreria.
export const ChapterCard: React.FC<{num: string; title: string; sub: string}> = ({
  num,
  title,
  sub,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const exitO = useExit(durationInFrames);
  const lineW = interpolate(frame, [10, 45], [0, 260], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: theme.ease.out,
  });
  const breathe = 1 + Math.sin(frame / 24) * 0.012;
  return (
    <AbsoluteFill style={{background: theme.colors.bg, opacity: exitO}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.colors.bgAlt} 1px, transparent 1px), linear-gradient(90deg, ${theme.colors.bgAlt} 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 60,
          bottom: -40,
          fontFamily: theme.fonts.display,
          fontSize: 420,
          fontWeight: 700,
          color: theme.colors.bgAlt,
          transform: `scale(${breathe})`,
        }}
      >
        {num}
      </div>
      <div style={{position: 'absolute', left: 110, top: '38%'}}>
        <Entrance delay={5}>
          <div
            style={{
              width: lineW,
              height: 3,
              background: theme.colors.primary,
              marginBottom: 26,
            }}
          />
        </Entrance>
        <Entrance delay={12}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 20,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: theme.colors.primary,
              marginBottom: 16,
            }}
          >
            Capitulo {num}
          </div>
        </Entrance>
        <Entrance delay={18}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontWeight: 800,
              fontSize: 96,
              color: theme.colors.text,
              maxWidth: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </div>
        </Entrance>
        <Entrance delay={28}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 28,
              color: theme.colors.textDim,
              marginTop: 22,
              maxWidth: 720,
            }}
          >
            {sub}
          </div>
        </Entrance>
      </div>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

export const ClosingCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const glow = 1 + Math.sin(frame / 18) * 0.05;
  return (
    <AbsoluteFill
      style={{background: theme.colors.bg, alignItems: 'center', justifyContent: 'center'}}
    >
      <Entrance delay={4}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: theme.colors.primary,
            margin: '0 auto 26px',
            boxShadow: `0 0 ${30 * glow}px ${theme.colors.glow}`,
          }}
        />
      </Entrance>
      <Entrance delay={8}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 800,
            fontSize: 66,
            color: theme.colors.text,
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          LA ODISEA
        </div>
      </Entrance>
      <Entrance delay={16}>
        <div
          style={{
            fontFamily: theme.fonts.display,
            fontStyle: 'italic',
            fontWeight: 500,
            fontSize: 24,
            color: theme.colors.textDim,
            textAlign: 'center',
            marginTop: 14,
          }}
        >
          Bloque 1 -- en produccion
        </div>
      </Entrance>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
