import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {backOut, easeIn, easeOut, FONT_MONO, FONT_TITLE, panelBackdrop, panelShadow, textShadow, theme} from './theme';

const W = 1920;
const H = 1080;

// Lifecycle: 0 during entrance, 1 while held, back to 0 on exit.
export const useLife = (
  durationInFrames: number,
  inDur = 12,
  outDur = 10,
): {vis: number; enter: number; exit: number} => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, inDur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const exit = interpolate(
    frame,
    [durationInFrames - outDur, durationInFrames],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeIn},
  );
  return {vis: Math.min(enter, exit), enter, exit};
};

// ---------------------------------------------------------------------------
// Glass panel
// ---------------------------------------------------------------------------
export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}> = ({children, style, accent}) => (
  <div
    style={{
      background: theme.panel,
      backdropFilter: panelBackdrop,
      WebkitBackdropFilter: panelBackdrop,
      border: `1px solid ${theme.panelBorder}`,
      borderLeft: accent ? `4px solid ${accent}` : `1px solid ${theme.panelBorder}`,
      borderRadius: 16,
      boxShadow: panelShadow,
      padding: '18px 24px',
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Step badge + guiding label — placed where it does NOT cover the action
// ---------------------------------------------------------------------------
export const StepCard: React.FC<{
  step: number;
  total: number;
  title: string;
  sub?: string;
  x: number;
  y: number;
  align?: 'left' | 'right';
  accent?: string;
  durationInFrames: number;
}> = ({step, total, title, sub, x, y, align = 'left', accent = theme.red, durationInFrames}) => {
  const {vis} = useLife(durationInFrames, 14, 10);
  const dy = interpolate(vis, [0, 1], [26, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: align === 'left' ? x : undefined,
        right: align === 'right' ? W - x : undefined,
        top: y,
        opacity: vis,
        transform: `translateY(${dy}px)`,
        maxWidth: 620,
      }}
    >
      <Panel accent={accent} style={{padding: '16px 22px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: sub || title ? 8 : 0}}>
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontWeight: 900,
              fontSize: 15,
              letterSpacing: 2,
              color: '#fff',
              background: accent,
              padding: '5px 12px',
              borderRadius: 8,
              textTransform: 'uppercase',
            }}
          >
            Paso {step}
          </div>
          <div style={{fontFamily: FONT_MONO, fontWeight: 500, fontSize: 14, color: theme.textDim}}>
            {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 30, color: theme.text, lineHeight: 1.12, textShadow}}>
          {title}
        </div>
        {sub ? (
          <div style={{fontFamily: FONT_TITLE, fontWeight: 400, fontSize: 19, color: theme.textDim, marginTop: 6, lineHeight: 1.25}}>
            {sub}
          </div>
        ) : null}
      </Panel>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Highlight box with snapping corner brackets + 👀 cue
// ---------------------------------------------------------------------------
export const Highlight: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  durationInFrames: number;
}> = ({x, y, w, h, color = theme.cyan, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {vis, enter} = useLife(durationInFrames, 14, 10);
  const grow = interpolate(enter, [0, 1], [1.14, 1], {easing: backOut});
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  const bracket = 26;
  const bw = 4;
  const corner = (cx: number, cy: number, sx: number, sy: number): React.CSSProperties => ({
    position: 'absolute',
    left: cx,
    top: cy,
    width: bracket,
    height: bracket,
    borderTop: sy > 0 ? `${bw}px solid ${color}` : undefined,
    borderBottom: sy < 0 ? `${bw}px solid ${color}` : undefined,
    borderLeft: sx > 0 ? `${bw}px solid ${color}` : undefined,
    borderRight: sx < 0 ? `${bw}px solid ${color}` : undefined,
    borderRadius: 3,
  });
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: vis, transform: `scale(${grow})`, transformOrigin: 'center'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: `2px solid ${color}`,
          borderRadius: 10,
          boxShadow: `0 0 ${12 + pulse * 16}px ${color}66, inset 0 0 0 1px rgba(0,0,0,0.25)`,
          opacity: 0.5 + pulse * 0.4,
        }}
      />
      <div style={corner(-6, -6, 1, 1)} />
      <div style={corner(w - bracket + 6, -6, -1, 1)} />
      <div style={corner(-6, h - bracket + 6, 1, -1)} />
      <div style={corner(w - bracket + 6, h - bracket + 6, -1, -1)} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Arrow callout — points to a target with a label on the opposite side
// ---------------------------------------------------------------------------
export const Arrow: React.FC<{
  tx: number;
  ty: number;
  from: 'left' | 'right' | 'top' | 'bottom';
  label: string;
  color?: string;
  len?: number;
  durationInFrames: number;
}> = ({tx, ty, from, label, color = theme.amber, len = 190, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {vis, enter} = useLife(durationInFrames, 12, 9);
  const draw = interpolate(enter, [0, 1], [0, 1], {easing: easeOut});
  const bob = Math.sin(frame / 9) * 5;

  const dir = {
    left: {sx: tx - len, sy: ty, lx: tx - len, ly: ty, anchor: 'right'},
    right: {sx: tx + len, sy: ty, lx: tx + len, ly: ty, anchor: 'left'},
    top: {sx: tx, sy: ty - len, lx: tx, ly: ty - len, anchor: 'bottom'},
    bottom: {sx: tx, sy: ty + len, lx: tx, ly: ty + len, anchor: 'top'},
  }[from];

  const cx = interpolate(draw, [0, 1], [dir.sx, tx]);
  const cy = interpolate(draw, [0, 1], [dir.sy, ty]);
  const bobX = from === 'left' ? bob : from === 'right' ? -bob : 0;
  const bobY = from === 'top' ? bob : from === 'bottom' ? -bob : 0;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);

  return (
    <AbsoluteFill style={{opacity: vis}}>
      <svg width={W} height={H} style={{position: 'absolute', overflow: 'visible'}}>
        <defs>
          <marker id={`ah-${tx}-${ty}`} markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={color} />
          </marker>
        </defs>
        <line
          x1={dir.sx + bobX}
          y1={dir.sy + bobY}
          x2={cx + bobX}
          y2={cy + bobY}
          stroke={color}
          strokeWidth={5}
          strokeLinecap="round"
          markerEnd={`url(#ah-${tx}-${ty})`}
        />
        <circle cx={tx} cy={ty} r={10 + pulse * 10} fill="none" stroke={color} strokeWidth={2} opacity={0.7 - pulse * 0.4} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: dir.anchor === 'left' ? dir.lx + 16 : dir.anchor === 'right' ? undefined : dir.lx,
          right: dir.anchor === 'right' ? W - dir.lx + 16 : undefined,
          top: dir.anchor === 'top' ? dir.ly + 16 : dir.anchor === 'bottom' ? undefined : dir.ly,
          bottom: dir.anchor === 'bottom' ? H - dir.ly + 16 : undefined,
          transform: dir.anchor === 'left' || dir.anchor === 'right' ? 'translateY(-50%)' : 'translateX(-50%)',
        }}
      >
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 800,
            fontSize: 22,
            color: '#0A0A0C',
            background: color,
            padding: '8px 16px',
            borderRadius: 10,
            boxShadow: panelShadow,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Monospace chip — for exact values (VID, PID, file names…)
// ---------------------------------------------------------------------------
export const Chip: React.FC<{
  text: string;
  x: number;
  y: number;
  accent?: boolean;
  durationInFrames: number;
}> = ({text, x, y, accent, durationInFrames}) => {
  const {vis} = useLife(durationInFrames, 10, 8);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: vis,
        fontFamily: FONT_MONO,
        fontWeight: 700,
        fontSize: 22,
        color: accent ? theme.amber : theme.text,
        background: theme.chipBg,
        border: `1px solid ${accent ? theme.amber : theme.panelBorder}`,
        padding: '8px 14px',
        borderRadius: 8,
        boxShadow: panelShadow,
      }}
    >
      {text}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Click ripple — pulse at a click point (right-click Setup, Start button…)
// ---------------------------------------------------------------------------
export const ClickRipple: React.FC<{x: number; y: number; durationInFrames: number}> = ({x, y, durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp', easing: easeOut});
  const r = interpolate(p, [0, 1], [8, 60]);
  const op = interpolate(p, [0, 1], [0.9, 0]);
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div style={{position: 'absolute', left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: '50%', border: `3px solid ${theme.cyan}`, opacity: op}} />
      <div style={{position: 'absolute', left: -6, top: -6, width: 12, height: 12, borderRadius: '50%', background: theme.cyan, opacity: op}} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Like & Subscribe nudge (retention)
// ---------------------------------------------------------------------------
export const SubNudge: React.FC<{durationInFrames: number; text?: string}> = ({
  durationInFrames,
  text = '¿Te sirve? Deja tu LIKE y SUSCRÍBETE',
}) => {
  const frame = useCurrentFrame();
  const {vis, enter} = useLife(durationInFrames, 12, 10);
  const s = interpolate(enter, [0, 1], [0.85, 1], {easing: backOut});
  const beat = 1 + Math.max(0, Math.sin(frame / 6)) * 0.05;
  return (
    <div style={{position: 'absolute', left: '50%', bottom: 130, transform: `translateX(-50%) scale(${s})`, opacity: vis}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, background: theme.gradient, padding: '14px 26px', borderRadius: 999, boxShadow: panelShadow}}>
        <span style={{fontSize: 34, transform: `scale(${beat})`}}>👍</span>
        <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 26, color: '#fff'}}>{text}</span>
        <span style={{fontSize: 34, transform: `scale(${beat})`}}>🔔</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Watermark (brand) — bottom-left, subtle
// ---------------------------------------------------------------------------
export const Watermark: React.FC = () => (
  <div style={{position: 'absolute', left: 40, bottom: 34, display: 'flex', alignItems: 'center', gap: 10, opacity: 0.9}}>
    <div style={{width: 30, height: 30, background: theme.gradient, borderRadius: 8, clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)'}} />
    <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 22, color: '#fff', textShadow, letterSpacing: 0.5}}>
      Alcor<span style={{color: theme.red}}>·</span>Truco
    </span>
  </div>
);
