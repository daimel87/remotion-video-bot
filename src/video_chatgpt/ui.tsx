import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {theme, F, animIn, animOut, lifecycle} from './theme';

const S = 1920; // design width

// Scale helper: all components authored at 1920 and scaled to comp width.
const useScale = () => {
  const {width} = useVideoConfig();
  return width / S;
};

// ============================================================
// Watermark — marca de agua D-TECH USB (se oculta en full-screen)
// ============================================================
export const Watermark: React.FC = () => {
  const s = useScale();
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
      <div
        style={{
          marginBottom: 70 * s,
          marginRight: 34 * s,
          display: 'flex',
          alignItems: 'center',
          gap: 8 * s,
          padding: `${7 * s}px ${14 * s}px`,
          background: theme.panel,
          backdropFilter: 'blur(8px)',
          borderRadius: 8 * s,
          border: `1px solid ${theme.border}`,
          boxShadow: theme.shadow,
          opacity: 0.9,
        }}
      >
        <div
          style={{
            width: 12 * s,
            height: 12 * s,
            borderRadius: 3 * s,
            background: theme.gradient,
            boxShadow: theme.glow(theme.primary),
          }}
        />
        <span
          style={{
            fontFamily: F.mont,
            fontWeight: 800,
            fontSize: 20 * s,
            letterSpacing: 1.5 * s,
            color: theme.text,
          }}
        >
          D-TECH USB
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// StepBadge — número de paso + título (arriba, on-brand)
// ============================================================
export const StepBadge: React.FC<{
  n: number | string;
  title: string;
  side?: 'left' | 'right';
  accent?: string;
}> = ({n, title, side = 'left', accent = theme.primary}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {opacity, enter} = lifecycle(frame, fps, durationInFrames, {outLen: 8});
  const tx = interpolate(enter, [0, 1], [side === 'left' ? -40 : 40, 0]) * s;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: side === 'left' ? 'flex-start' : 'flex-end',
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateX(${tx}px)`,
          marginTop: 34 * s,
          marginLeft: side === 'left' ? 34 * s : 0,
          marginRight: side === 'right' ? 34 * s : 0,
          display: 'flex',
          alignItems: 'center',
          gap: 16 * s,
          padding: `${12 * s}px ${22 * s}px ${12 * s}px ${12 * s}px`,
          background: theme.panel,
          backdropFilter: 'blur(8px)',
          borderRadius: 14 * s,
          border: `1px solid ${theme.border}`,
          boxShadow: `${theme.shadow}, ${theme.glow('rgba(34,211,238,0.25)')}`,
        }}
      >
        <div
          style={{
            width: 52 * s,
            height: 52 * s,
            borderRadius: 12 * s,
            background: theme.gradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: F.mont,
            fontWeight: 900,
            fontSize: 30 * s,
            color: '#04121A',
            boxShadow: theme.glow(accent),
          }}
        >
          {n}
        </div>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <span
            style={{
              fontFamily: F.mont,
              fontWeight: 700,
              fontSize: 15 * s,
              letterSpacing: 3 * s,
              color: accent,
            }}
          >
            PASO {n}
          </span>
          <span
            style={{
              fontFamily: F.mont,
              fontWeight: 800,
              fontSize: 30 * s,
              color: theme.text,
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// HighlightBox — rectángulo animado alrededor de un elemento de la UI
// coords en px del diseño 1920x1080
// ============================================================
export const HighlightBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  label?: string;
  labelSide?: 'top' | 'bottom' | 'left' | 'right';
  labelAlign?: 'left' | 'right';
  pulse?: boolean;
}> = ({
  x,
  y,
  w,
  h,
  color = theme.primary,
  label,
  labelSide = 'top',
  labelAlign = 'left',
  pulse = true,
}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = animIn(frame, fps);
  const exit = animOut(frame, durationInFrames, 8);
  const draw = interpolate(enter, [0, 1], [0.82, 1]);
  const pulseK = pulse
    ? 1 + 0.02 * Math.sin((frame / fps) * Math.PI * 2 * 1.1)
    : 1;
  const opacity = enter * exit;

  const bx = x * s;
  const by = y * s;
  const bw = w * s;
  const bh = h * s;

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    fontFamily: F.mont,
    fontWeight: 800,
    fontSize: 22 * s,
    color: '#04121A',
    background: color,
    padding: `${6 * s}px ${14 * s}px`,
    borderRadius: 8 * s,
    whiteSpace: 'nowrap',
    boxShadow: theme.glow(color),
  };
  const lp: React.CSSProperties = {};
  // labelAlign 'right' ancla el borde derecho de la etiqueta al del recuadro
  // (se extiende hacia la izquierda) para no salirse por el borde de pantalla.
  const hx = labelAlign === 'right' ? {right: 0} : {left: 0};
  if (labelSide === 'top') Object.assign(lp, {...hx, top: -44 * s});
  if (labelSide === 'bottom') Object.assign(lp, {...hx, top: bh + 12 * s});
  if (labelSide === 'left') Object.assign(lp, {right: bw + 12 * s, top: 0});
  if (labelSide === 'right') Object.assign(lp, {left: bw + 12 * s, top: 0});

  return (
    <AbsoluteFill style={{opacity}}>
      <div
        style={{
          position: 'absolute',
          left: bx,
          top: by,
          width: bw,
          height: bh,
          transform: `scale(${draw * pulseK})`,
          transformOrigin: 'center',
          border: `${3.5 * s}px solid ${color}`,
          borderRadius: 12 * s,
          boxShadow: `${theme.glow(color)}, inset 0 0 12px ${color}44`,
        }}
      >
        {label ? <div style={{...labelStyle, ...lp}}>{label}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Spotlight — oscurece todo menos una zona (foco con hueco)
// ============================================================
export const Spotlight: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  dim?: number;
}> = ({x, y, w, h, dim = 0.6}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = animIn(frame, fps);
  const exit = animOut(frame, durationInFrames, 8);
  const op = enter * exit * dim;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x * s,
          top: y * s,
          width: w * s,
          height: h * s,
          borderRadius: 14 * s,
          boxShadow: `0 0 0 ${9999}px rgba(4,8,18,${op})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// Arrow — flecha que apunta a un punto (sin tapar lo importante)
// angle en grados; from es la cola.
// ============================================================
export const Arrow: React.FC<{
  x: number; // punta
  y: number;
  angle?: number; // dirección hacia la que apunta (deg). 0 = derecha
  len?: number;
  color?: string;
}> = ({x, y, angle = 0, len = 120, color = theme.accent}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = animIn(frame, fps);
  const exit = animOut(frame, durationInFrames, 8);
  const grow = interpolate(enter, [0, 1], [0.3, 1]);
  const nudge = 6 * Math.sin((frame / fps) * Math.PI * 2 * 1.3);
  return (
    <AbsoluteFill style={{opacity: enter * exit}}>
      <div
        style={{
          position: 'absolute',
          left: x * s,
          top: y * s,
          transform: `rotate(${angle}deg) translateX(${nudge * s}px)`,
          transformOrigin: 'left center',
        }}
      >
        <div
          style={{
            width: len * s * grow,
            height: 6 * s,
            background: color,
            borderRadius: 4 * s,
            boxShadow: theme.glow(color),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: -2 * s,
            top: -9 * s,
            width: 0,
            height: 0,
            borderTop: `${12 * s}px solid transparent`,
            borderBottom: `${12 * s}px solid transparent`,
            borderRight: `${18 * s}px solid ${color}`,
            filter: `drop-shadow(0 0 8px ${color})`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// ClickRipple — pulso en el punto de clic
// ============================================================
export const ClickRipple: React.FC<{x: number; y: number; color?: string}> = ({
  x,
  y,
  color = theme.accent,
}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = (frame / fps) % 1.1;
  const r = interpolate(t, [0, 1], [0, 70], {extrapolateRight: 'clamp'});
  const op = interpolate(t, [0, 0.8], [0.9, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x * s,
          top: y * s,
          width: r * 2 * s,
          height: r * 2 * s,
          marginLeft: -r * s,
          marginTop: -r * s,
          borderRadius: '50%',
          border: `${3 * s}px solid ${color}`,
          opacity: op,
          boxShadow: theme.glow(color),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x * s,
          top: y * s,
          width: 16 * s,
          height: 16 * s,
          marginLeft: -8 * s,
          marginTop: -8 * s,
          borderRadius: '50%',
          background: color,
          boxShadow: theme.glow(color),
        }}
      />
    </AbsoluteFill>
  );
};

// ============================================================
// KeyCap — tecla estilizada (atajos de teclado)
// ============================================================
export const KeyCap: React.FC<{children: React.ReactNode}> = ({children}) => {
  const s = useScale();
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40 * s,
        padding: `${6 * s}px ${14 * s}px`,
        margin: `0 ${4 * s}px`,
        fontFamily: F.mono,
        fontWeight: 700,
        fontSize: 24 * s,
        color: theme.text,
        background: '#1A2340',
        border: `1px solid ${theme.border}`,
        borderBottom: `${4 * s}px solid ${theme.primary}`,
        borderRadius: 8 * s,
        boxShadow: theme.shadow,
      }}
    >
      {children}
    </span>
  );
};

// ============================================================
// Callout — panel con respaldo legible; posicionable
// ============================================================
export const Callout: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  color?: string;
  icon?: string;
  align?: 'left' | 'center';
  maxW?: number;
}> = ({children, x, y, color = theme.primary, icon, align = 'left', maxW = 620}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {opacity, enter} = lifecycle(frame, fps, durationInFrames, {outLen: 8});
  const ty = interpolate(enter, [0, 1], [22, 0]) * s;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x * s,
          top: y * s,
          opacity,
          transform: `translateY(${ty}px)`,
          maxWidth: maxW * s,
          display: 'flex',
          alignItems: 'center',
          gap: 14 * s,
          padding: `${16 * s}px ${22 * s}px`,
          background: theme.panel,
          backdropFilter: 'blur(8px)',
          borderRadius: 14 * s,
          border: `1px solid ${color}99`,
          borderLeft: `${6 * s}px solid ${color}`,
          boxShadow: `${theme.shadow}, ${theme.glow(color + '33')}`,
          textAlign: align,
        }}
      >
        {icon ? <span style={{fontSize: 34 * s}}>{icon}</span> : null}
        <span
          style={{
            fontFamily: F.mont,
            fontWeight: 700,
            fontSize: 27 * s,
            color: theme.text,
            lineHeight: 1.28,
          }}
        >
          {children}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// MonoChip — comando / ruta / valor exacto en monospace
// ============================================================
export const MonoChip: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  color?: string;
}> = ({children, x, y, color = theme.secondary}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {opacity, enter} = lifecycle(frame, fps, durationInFrames, {outLen: 8});
  const ty = interpolate(enter, [0, 1], [16, 0]) * s;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x * s,
          top: y * s,
          opacity,
          transform: `translateY(${ty}px)`,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10 * s,
          padding: `${10 * s}px ${18 * s}px`,
          background: '#0A0F1E',
          borderRadius: 10 * s,
          border: `1px solid ${color}88`,
          boxShadow: theme.shadow,
        }}
      >
        <span style={{color, fontFamily: F.mono, fontWeight: 700, fontSize: 22 * s}}>{'>'}</span>
        <span
          style={{
            fontFamily: F.mono,
            fontWeight: 600,
            fontSize: 24 * s,
            color: theme.text,
            whiteSpace: 'nowrap',
          }}
        >
          {children}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// Pill / Badge — etiqueta pequeña (GRATIS, ILIMITADO...)
// ============================================================
export const Pill: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  color?: string;
  filled?: boolean;
}> = ({children, x, y, color = theme.ok, filled = true}) => {
  const s = useScale();
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = animIn(frame, fps);
  const exit = animOut(frame, durationInFrames, 8);
  const pop = interpolate(enter, [0, 0.6, 1], [0.6, 1.08, 1]);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: x * s,
          top: y * s,
          opacity: enter * exit,
          transform: `scale(${pop})`,
          transformOrigin: 'left center',
          padding: `${8 * s}px ${18 * s}px`,
          background: filled ? color : 'transparent',
          border: `${2 * s}px solid ${color}`,
          borderRadius: 999,
          fontFamily: F.mont,
          fontWeight: 900,
          fontSize: 24 * s,
          letterSpacing: 1 * s,
          color: filled ? '#04121A' : color,
          boxShadow: theme.glow(color),
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
