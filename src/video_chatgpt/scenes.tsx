import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {theme, F, animIn, animOut, lifecycle} from './theme';

const S = 1920;
const useScale = () => {
  const {width} = useVideoConfig();
  return width / S;
};

// ============================================================
// BrandBackdrop — fondo de marca con grid sutil + degradado
// ============================================================
export const BrandBackdrop: React.FC = () => {
  const s = useScale();
  const frame = useCurrentFrame();
  const drift = (frame * 0.15) % 60;
  return (
    <AbsoluteFill style={{background: theme.bg}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${theme.primary}22 1px, transparent 1px), linear-gradient(90deg, ${theme.primary}22 1px, transparent 1px)`,
          backgroundSize: `${60 * s}px ${60 * s}px`,
          backgroundPosition: `${drift * s}px ${drift * s}px`,
          opacity: 0.5,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 40%, ${theme.qwen}33 0%, transparent 55%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// ZoomWrap — punch-in hacia una zona (transform-origin en el foco)
// zx,zy = punto de interés en px de diseño; scale >= 1
// ============================================================
export const ZoomWrap: React.FC<{
  zx: number;
  zy: number;
  scale: number;
  children: React.ReactNode;
  hold?: boolean;
}> = ({zx, zy, scale, children, hold = true}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width, height} = useVideoConfig();
  const inK = interpolate(animIn(frame, fps), [0, 1], [1, scale]);
  const outStart = durationInFrames - 12;
  const outK = hold
    ? interpolate(frame, [outStart, durationInFrames], [scale, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.in(Easing.ease),
      })
    : scale;
  const k = frame < outStart ? inK : Math.min(inK, outK);
  const ox = (zx / S) * 100;
  const oy = (zy / (S * (height / width))) * 100;
  return (
    <AbsoluteFill style={{transform: `scale(${k})`, transformOrigin: `${ox}% ${oy}%`}}>
      {children}
    </AbsoluteFill>
  );
};

// ============================================================
// ChapterCard — transición full-screen entre bloques
// ============================================================
export const ChapterCard: React.FC<{
  kicker?: string;
  title: string;
  highlight?: string;
  accent?: string;
}> = ({kicker, title, highlight, accent = theme.primary}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = animIn(frame, fps);
  const exit = animOut(frame, durationInFrames, 14);
  const ty = interpolate(enter, [0, 1], [50, 0]) * s;
  const barW = interpolate(enter, [0, 1], [0, 120]) * s;

  const parts = highlight ? title.split(highlight) : [title];
  return (
    <AbsoluteFill style={{opacity: exit}}>
      <BrandBackdrop />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 100 * s}}>
        <div style={{opacity: enter, transform: `translateY(${ty}px)`, textAlign: 'center'}}>
          <div
            style={{
              width: barW,
              height: 6 * s,
              background: theme.gradient,
              borderRadius: 4 * s,
              margin: `0 auto ${28 * s}px`,
              boxShadow: theme.glow(accent),
            }}
          />
          {kicker ? (
            <div
              style={{
                fontFamily: F.mont,
                fontWeight: 700,
                fontSize: 30 * s,
                letterSpacing: 6 * s,
                color: accent,
                marginBottom: 18 * s,
              }}
            >
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              fontFamily: F.mont,
              fontWeight: 900,
              fontSize: 92 * s,
              lineHeight: 1.08,
              color: theme.text,
              maxWidth: 1500 * s,
              textShadow: theme.shadow,
            }}
          >
            {highlight ? (
              <>
                {parts[0]}
                <span style={{color: accent, textShadow: theme.glow(accent)}}>{highlight}</span>
                {parts[1]}
              </>
            ) : (
              title
            )}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================
// VersusCard — comparación Qwen vs ChatGPT (full-screen)
// ============================================================
export const VersusCard: React.FC<{
  rows: {label: string; qwen: string; gpt: string; win?: boolean}[];
}> = ({rows}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const exit = animOut(frame, durationInFrames, 14);
  const head = animIn(frame, fps);

  const col = (
    name: string,
    color: string,
    delay: number,
    highlight: boolean
  ) => {
    const e = animIn(frame, fps, delay);
    return (
      <div
        style={{
          flex: 1,
          opacity: e,
          transform: `translateY(${interpolate(e, [0, 1], [40, 0]) * s}px)`,
          background: theme.panel,
          border: `${2 * s}px solid ${highlight ? color : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 20 * s,
          padding: `${30 * s}px`,
          boxShadow: highlight ? theme.glow(color + '55') : theme.shadow,
        }}
      >
        <div
          style={{
            fontFamily: F.mont,
            fontWeight: 900,
            fontSize: 42 * s,
            color,
            textAlign: 'center',
            marginBottom: 24 * s,
          }}
        >
          {name}
        </div>
        {rows.map((r, i) => {
          const val = name.toLowerCase().includes('qwen') ? r.qwen : r.gpt;
          const good = name.toLowerCase().includes('qwen') ? r.win : !r.win;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12 * s,
                padding: `${14 * s}px 0`,
                borderBottom:
                  i < rows.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
            >
              <span style={{fontSize: 30 * s}}>{good ? '✅' : '⚠️'}</span>
              <span
                style={{
                  fontFamily: F.mont,
                  fontWeight: 700,
                  fontSize: 28 * s,
                  color: theme.text,
                }}
              >
                {val}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <BrandBackdrop />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 90 * s}}>
        <div
          style={{
            opacity: head,
            fontFamily: F.mont,
            fontWeight: 900,
            fontSize: 60 * s,
            color: theme.text,
            marginBottom: 40 * s,
          }}
        >
          Qwen <span style={{color: theme.textDim, fontSize: 40 * s}}>vs</span> ChatGPT
        </div>
        <div style={{display: 'flex', gap: 40 * s, width: '100%', maxWidth: 1400 * s}}>
          {col('Qwen', theme.primary, 6, true)}
          {col('ChatGPT', theme.warn, 12, false)}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================
// AspectRatios — explicador de proporciones 1:1 4:3 16:9 9:16
// pick = índice destacado (el que elige en el video)
// ============================================================
export const AspectRatios: React.FC<{pick?: number}> = ({pick = 2}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const exit = animOut(frame, durationInFrames, 14);
  const items = [
    {r: '1:1', w: 90, h: 90, note: 'Cuadrada'},
    {r: '4:3', w: 110, h: 82, note: 'Clásica'},
    {r: '16:9', w: 130, h: 73, note: 'YouTube'},
    {r: '9:16', w: 60, h: 107, note: 'Shorts / TikTok'},
  ];
  return (
    <AbsoluteFill style={{opacity: exit}}>
      <BrandBackdrop />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            fontFamily: F.mont,
            fontWeight: 900,
            fontSize: 56 * s,
            color: theme.text,
            marginBottom: 50 * s,
            opacity: animIn(frame, fps),
          }}
        >
          Elige la <span style={{color: theme.primary}}>proporción</span>
        </div>
        <div style={{display: 'flex', gap: 46 * s, alignItems: 'center'}}>
          {items.map((it, i) => {
            const e = animIn(frame, fps, 6 + i * 5);
            const chosen = i === pick;
            return (
              <div
                key={i}
                style={{
                  opacity: e,
                  transform: `translateY(${interpolate(e, [0, 1], [40, 0]) * s}px) scale(${
                    chosen ? 1.06 : 1
                  })`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16 * s,
                }}
              >
                <div
                  style={{
                    width: it.w * 1.7 * s,
                    height: it.h * 1.7 * s,
                    borderRadius: 12 * s,
                    background: chosen ? theme.gradient : 'rgba(255,255,255,0.06)',
                    border: `${3 * s}px solid ${chosen ? theme.accent : theme.border}`,
                    boxShadow: chosen ? theme.glow(theme.accent) : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: F.mont,
                    fontWeight: 900,
                    fontSize: 30 * s,
                    color: chosen ? '#04121A' : theme.text,
                  }}
                >
                  {it.r}
                </div>
                <span
                  style={{
                    fontFamily: F.mont,
                    fontWeight: 700,
                    fontSize: 22 * s,
                    color: chosen ? theme.accent : theme.textDim,
                  }}
                >
                  {it.note}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================
// FeatureGrid — cuadrícula de capacidades (opción "Más")
// ============================================================
export const FeatureGrid: React.FC<{title: string; items: {icon: string; label: string}[]}> = ({
  title,
  items,
}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const exit = animOut(frame, durationInFrames, 14);
  return (
    <AbsoluteFill style={{opacity: exit}}>
      <BrandBackdrop />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80 * s}}>
        <div
          style={{
            fontFamily: F.mont,
            fontWeight: 900,
            fontSize: 58 * s,
            color: theme.text,
            marginBottom: 44 * s,
            opacity: animIn(frame, fps),
            textAlign: 'center',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24 * s,
            width: '100%',
            maxWidth: 1350 * s,
          }}
        >
          {items.map((it, i) => {
            const e = animIn(frame, fps, 5 + i * 4);
            return (
              <div
                key={i}
                style={{
                  opacity: e,
                  transform: `scale(${interpolate(e, [0, 1], [0.85, 1])})`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16 * s,
                  padding: `${20 * s}px ${24 * s}px`,
                  background: theme.panel,
                  borderRadius: 14 * s,
                  border: `1px solid ${theme.border}`,
                  boxShadow: theme.shadow,
                }}
              >
                <span style={{fontSize: 38 * s}}>{it.icon}</span>
                <span
                  style={{
                    fontFamily: F.mont,
                    fontWeight: 700,
                    fontSize: 27 * s,
                    color: theme.text,
                  }}
                >
                  {it.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================================
// ClosingCard — cierre: checklist + CTA
// ============================================================
export const ClosingCard: React.FC<{items: string[]}> = ({items}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const exit = animOut(frame, durationInFrames, 16);
  const head = animIn(frame, fps);
  return (
    <AbsoluteFill style={{opacity: exit}}>
      <BrandBackdrop />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 90 * s}}>
        <div
          style={{
            opacity: head,
            fontFamily: F.mont,
            fontWeight: 900,
            fontSize: 66 * s,
            color: theme.text,
            textAlign: 'center',
            marginBottom: 12 * s,
          }}
        >
          Todo esto, <span style={{color: theme.ok}}>GRATIS</span>
        </div>
        <div
          style={{
            opacity: head,
            fontFamily: F.mont,
            fontWeight: 700,
            fontSize: 30 * s,
            color: theme.primary,
            marginBottom: 40 * s,
          }}
        >
          con Qwen · chat.qwen.ai
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16 * s}}>
          {items.map((it, i) => {
            const e = animIn(frame, fps, 10 + i * 6);
            return (
              <div
                key={i}
                style={{
                  opacity: e,
                  transform: `translateX(${interpolate(e, [0, 1], [-40, 0]) * s}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16 * s,
                  fontFamily: F.mont,
                  fontWeight: 700,
                  fontSize: 34 * s,
                  color: theme.text,
                }}
              >
                <span style={{fontSize: 34 * s}}>✅</span>
                {it}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 54 * s,
            opacity: animIn(frame, fps, 46),
            display: 'flex',
            alignItems: 'center',
            gap: 18 * s,
            padding: `${18 * s}px ${34 * s}px`,
            background: theme.gradient,
            borderRadius: 16 * s,
            boxShadow: theme.glow(theme.primary),
          }}
        >
          <span style={{fontSize: 40 * s}}>🔔</span>
          <span style={{fontFamily: F.mont, fontWeight: 900, fontSize: 38 * s, color: '#04121A'}}>
            Suscríbete · D-TECH USB
          </span>
        </div>
        <div
          style={{
            marginTop: 22 * s,
            opacity: animIn(frame, fps, 54),
            fontFamily: F.mont,
            fontWeight: 700,
            fontSize: 26 * s,
            color: theme.secondary,
          }}
        >
          🔗 Link en el primer comentario
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
