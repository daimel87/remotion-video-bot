import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {theme} from '../theme';
import {Entrance, Grain, Vignette, WordReveal, useExit} from './components';
import {TextMaskReveal} from '../scenes-lib/scenes/TextAnimations/TextMaskReveal';
import {TextKinetic} from '../scenes-lib/scenes/TextAnimations/TextKinetic';

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

// Card de golpe (stinger) entre bloques -- reusa TextKinetic tal cual.
export const PunchCard: React.FC<{word: string}> = ({word}) => (
  <AbsoluteFill>
    <TextKinetic text={word} startDelay={2} />
    <Vignette />
    <Grain />
  </AbsoluteFill>
);

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
              fontSize: 22,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: theme.colors.primary,
              marginBottom: 14,
            }}
          >
            Capitulo {num}
          </div>
        </Entrance>
        <Entrance delay={18}>
          <div
            style={{
              fontFamily: theme.fonts.display,
              fontSize: 86,
              fontWeight: 700,
              color: theme.colors.text,
              maxWidth: 900,
              lineHeight: 1.05,
            }}
          >
            {title}
          </div>
        </Entrance>
        <Entrance delay={26}>
          <div
            style={{
              fontFamily: theme.fonts.body,
              fontSize: 26,
              color: theme.colors.textDim,
              marginTop: 20,
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
            fontSize: 64,
            fontWeight: 700,
            color: theme.colors.text,
            textAlign: 'center',
            letterSpacing: 2,
          }}
        >
          LA ODISEA
        </div>
      </Entrance>
      <Entrance delay={16}>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: 22,
            color: theme.colors.textDim,
            textAlign: 'center',
            marginTop: 14,
            letterSpacing: 1,
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
