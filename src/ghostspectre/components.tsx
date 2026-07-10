import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  backOut,
  easeIn,
  easeInOut,
  easeOut,
  FONT_MONO,
  FONT_TITLE,
  panelBackdrop,
  panelShadow,
  textShadow,
  theme,
} from './theme';

const W = 1920;
const H = 1080;

// Lifecycle: 0 during entrance, 1 while held, back to 0 on exit.
// Returns {t} an eased visibility 0..1 plus raw progress for transforms.
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
// pos: pixel coordinates of the panel's anchor corner
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
            Step {step}
          </div>
          <div style={{fontFamily: FONT_MONO, fontWeight: 500, fontSize: 14, color: theme.textDim}}>
            {String(step).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 800,
            fontSize: 30,
            color: theme.text,
            lineHeight: 1.12,
            textShadow,
          }}
        >
          {title}
        </div>
        {sub ? (
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontWeight: 400,
              fontSize: 19,
              color: theme.textDim,
              marginTop: 6,
              lineHeight: 1.25,
            }}
          >
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
  label?: string;
  labelPos?: 'top' | 'bottom';
  eyes?: boolean;
  durationInFrames: number;
}> = ({x, y, w, h, color = theme.cyan, label, labelPos = 'top', eyes = true, durationInFrames}) => {
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
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        opacity: vis,
        transform: `scale(${grow})`,
        transformOrigin: 'center',
      }}
    >
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
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: labelPos === 'top' ? -46 : h + 12,
            whiteSpace: 'nowrap',
            fontFamily: FONT_TITLE,
            fontWeight: 800,
            fontSize: 20,
            color: '#0A0A0C',
            background: color,
            padding: '5px 14px',
            borderRadius: 8,
            boxShadow: panelShadow,
          }}
        >
          {eyes ? '👀 ' : ''}
          {label}
        </div>
      ) : null}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Arrow callout — draws an animated arrow pointing to a target point,
// with a label panel on the opposite side so it never covers the target.
// ---------------------------------------------------------------------------
export const Arrow: React.FC<{
  tx: number; // target x
  ty: number; // target y
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

  // current arrow tip position (animated growth toward target)
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
          transform:
            dir.anchor === 'left' || dir.anchor === 'right'
              ? 'translateY(-50%)'
              : 'translateX(-50%)',
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
// Monospace chip — for commands, paths, versions, exact values
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
// Click ripple — pulse at a click point
// ---------------------------------------------------------------------------
export const ClickRipple: React.FC<{x: number; y: number; durationInFrames: number}> = ({
  x,
  y,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const r = interpolate(p, [0, 1], [8, 60]);
  const op = interpolate(p, [0, 1], [0.9, 0]);
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      <div
        style={{
          position: 'absolute',
          left: -r,
          top: -r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          border: `3px solid ${theme.cyan}`,
          opacity: op,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -6,
          top: -6,
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: theme.cyan,
          opacity: op,
        }}
      />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Spotlight mask — darken everything except a rounded region
// ---------------------------------------------------------------------------
export const Spotlight: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  durationInFrames: number;
}> = ({x, y, w, h, durationInFrames}) => {
  const {vis} = useLife(durationInFrames, 16, 12);
  return (
    <AbsoluteFill style={{opacity: vis * 0.72}}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          borderRadius: 14,
          boxShadow: '0 0 0 4000px rgba(4,4,6,0.82)',
        }}
      />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Keycap — keyboard shortcut styled keys
// ---------------------------------------------------------------------------
export const Keys: React.FC<{keys: string[]; x: number; y: number; durationInFrames: number}> = ({
  keys,
  x,
  y,
  durationInFrames,
}) => {
  const {vis, enter} = useLife(durationInFrames, 12, 8);
  const s = interpolate(enter, [0, 1], [0.8, 1], {easing: backOut});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        display: 'flex',
        gap: 8,
        alignItems: 'center',
        opacity: vis,
        transform: `scale(${s})`,
      }}
    >
      {keys.map((k, i) => (
        <React.Fragment key={k}>
          {i > 0 ? (
            <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 24, color: theme.text}}>+</span>
          ) : null}
          <span
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 700,
              fontSize: 22,
              color: theme.text,
              background: 'linear-gradient(180deg,#2A2A30,#141418)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderBottom: '3px solid rgba(0,0,0,0.6)',
              padding: '8px 14px',
              borderRadius: 8,
              boxShadow: panelShadow,
            }}
          >
            {k}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Full-screen chapter card (on-brand) — hides the footage
// ---------------------------------------------------------------------------
export const ChapterCard: React.FC<{
  part: string;
  title: string;
  durationInFrames: number;
}> = ({part, title, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 16, 14);
  const rise = spring({frame, fps, config: {damping: 200}});
  const slide = interpolate(rise, [0, 1], [60, 0]);
  const barW = interpolate(frame, [8, 30], [0, 260], {extrapolateRight: 'clamp', easing: easeOut});
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <AbsoluteFill style={{background: theme.gradientDark}} />
      {/* brand geometric red shard */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            right: -200,
            bottom: -260,
            width: 1200,
            height: 1200,
            background: theme.gradient,
            transform: `rotate(35deg) translateY(${interpolate(vis, [0, 1], [120, 0])}px)`,
            opacity: 0.9,
            clipPath: 'polygon(0 40%, 55% 0, 100% 45%, 60% 100%, 0 80%)',
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 150}}>
        <div style={{transform: `translateY(${slide}px)`}}>
          <div style={{width: barW, height: 6, background: theme.red, borderRadius: 4, marginBottom: 26}} />
          <div
            style={{
              fontFamily: FONT_MONO,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 6,
              color: theme.red,
              textTransform: 'uppercase',
            }}
          >
            {part}
          </div>
          <div
            style={{
              fontFamily: FONT_TITLE,
              fontWeight: 900,
              fontSize: 92,
              color: theme.text,
              lineHeight: 1.02,
              marginTop: 10,
              maxWidth: 1300,
              textShadow: '0 6px 30px rgba(0,0,0,0.5)',
            }}
          >
            {title}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Opening title (hook)
// ---------------------------------------------------------------------------
export const TitleIntro: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 14, 16);
  const s1 = spring({frame, fps, config: {damping: 200}});
  const s2 = spring({frame: frame - 8, fps, config: {damping: 200}});
  const s3 = spring({frame: frame - 18, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{opacity: vis, background: theme.gradientDark, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: -320,
            width: 1500,
            height: 1100,
            transform: 'translateX(-50%)',
            background: theme.gradient,
            clipPath: 'polygon(0 60%, 30% 12%, 52% 42%, 74% 4%, 100% 55%, 100% 100%, 0 100%)',
            opacity: interpolate(s1, [0, 1], [0, 0.9]),
          }}
        />
      </AbsoluteFill>
      <div style={{textAlign: 'center', transform: `translateY(${interpolate(s1, [0, 1], [40, 0])}px)`}}>
        <div
          style={{
            fontFamily: FONT_MONO,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 8,
            color: theme.cyan,
            opacity: s1,
          }}
        >
          FULL REVIEW · WINDOWS 11 25H2
        </div>
        {/* GHOST-SPECTRE-TITLE */}
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 108,
            color: theme.text,
            lineHeight: 0.98,
            marginTop: 8,
            transform: `scale(${interpolate(s2, [0, 1], [0.9, 1])})`,
            textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}
        >
          GHOST <span style={{color: theme.red}}>SPECTRE</span>
          <br />
          SUPERLIGHT SE
        </div>
        <div
          style={{
            display: 'inline-flex',
            gap: 14,
            marginTop: 26,
            opacity: s3,
            transform: `translateY(${interpolate(s3, [0, 1], [20, 0])}px)`,
          }}
        >
          {['ONLY 8 GB', '11 PROCESSES', 'NO BLOAT'].map((t) => (
            <span
              key={t}
              style={{
                fontFamily: FONT_TITLE,
                fontWeight: 800,
                fontSize: 24,
                color: theme.text,
                border: `2px solid ${theme.red}`,
                padding: '8px 18px',
                borderRadius: 999,
              }}
            >
              ✓ {t}
            </span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Progress bar with % — for install / analyze / config waits
// ---------------------------------------------------------------------------
export const ProgressBar: React.FC<{
  label: string;
  x: number;
  y: number;
  from?: number;
  to?: number;
  accent?: string;
  durationInFrames: number;
}> = ({label, x, y, from = 0, to = 100, accent = theme.red, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {vis} = useLife(durationInFrames, 12, 10);
  const p = interpolate(frame, [8, durationInFrames - 8], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 560, opacity: vis}}>
      <Panel accent={accent}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12}}>
          <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 24, color: theme.text}}>{label}</span>
          <span style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 26, color: accent}}>
            {Math.round(p)}%
          </span>
        </div>
        <div style={{height: 14, borderRadius: 8, background: 'rgba(255,255,255,0.12)', overflow: 'hidden'}}>
          <div
            style={{
              width: `${p}%`,
              height: '100%',
              borderRadius: 8,
              background: `linear-gradient(90deg, ${accent}, ${theme.amber})`,
            }}
          />
        </div>
      </Panel>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Like & Subscribe nudge (retention)
// ---------------------------------------------------------------------------
export const SubNudge: React.FC<{durationInFrames: number; text?: string}> = ({
  durationInFrames,
  text = 'Enjoying it? Drop a LIKE & SUBSCRIBE',
}) => {
  const frame = useCurrentFrame();
  const {vis, enter} = useLife(durationInFrames, 12, 10);
  const s = interpolate(enter, [0, 1], [0.85, 1], {easing: backOut});
  const beat = 1 + Math.max(0, Math.sin(frame / 6)) * 0.05;
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 130,
        transform: `translateX(-50%) scale(${s})`,
        opacity: vis,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: theme.gradient,
          padding: '14px 26px',
          borderRadius: 999,
          boxShadow: panelShadow,
        }}
      >
        <span style={{fontSize: 34, transform: `scale(${beat})`}}>👍</span>
        <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 26, color: '#fff'}}>{text}</span>
        <span style={{fontSize: 34, transform: `scale(${beat})`}}>🔔</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Animated checklist (innovation scene)
// ---------------------------------------------------------------------------
export const CheckList: React.FC<{
  title: string;
  items: string[];
  durationInFrames: number;
}> = ({title, items, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {vis} = useLife(durationInFrames, 16, 12);
  return (
    <AbsoluteFill style={{opacity: vis, background: theme.gradientDark, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 1100}}>
        <div
          style={{
            fontFamily: FONT_TITLE,
            fontWeight: 900,
            fontSize: 64,
            color: theme.text,
            marginBottom: 40,
          }}
        >
          {title}
        </div>
        {items.map((it, i) => {
          const start = 16 + i * 14;
          const ap = interpolate(frame, [start, start + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: easeOut,
          });
          const checked = frame > start + 8;
          return (
            <div
              key={it}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 22,
                marginBottom: 22,
                opacity: ap,
                transform: `translateX(${interpolate(ap, [0, 1], [-30, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: checked ? theme.green : 'transparent',
                  border: `3px solid ${checked ? theme.green : theme.textDim}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                  color: '#0A0A0C',
                  fontWeight: 900,
                }}
              >
                {checked ? '✓' : ''}
              </div>
              <div style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 34, color: theme.text}}>{it}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// End card — recap + CTA
// ---------------------------------------------------------------------------
export const EndCard: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {vis} = useLife(durationInFrames, 18, 12);
  const s = spring({frame, fps, config: {damping: 200}});
  const steps = ['Windows 11 25H2 · Build 26200.8457', 'Only 8.18 GB installed', '11 processes · 1.3 GB RAM idle', 'No bloatware · No Defender'];
  return (
    <AbsoluteFill style={{opacity: vis, background: theme.gradientDark, justifyContent: 'center', alignItems: 'center'}}>
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: -200,
            top: -200,
            width: 1000,
            height: 1000,
            background: theme.gradient,
            opacity: 0.85,
            clipPath: 'polygon(0 0, 60% 0, 30% 100%, 0 70%)',
          }}
        />
      </AbsoluteFill>
      <div style={{textAlign: 'center', transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px)`}}>
        <div style={{fontSize: 74, marginBottom: 6}}>✅</div>
        <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 92, color: theme.text}}>
          Ghost Spectre <span style={{color: theme.green}}>SE</span>
        </div>
        <div style={{display: 'flex', gap: 16, justifyContent: 'center', marginTop: 34, flexWrap: 'wrap', maxWidth: 1400}}>
          {steps.map((t, i) => {
            const ap = interpolate(frame, [20 + i * 8, 34 + i * 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: easeOut,
            });
            return (
              <div
                key={t}
                style={{
                  opacity: ap,
                  transform: `translateY(${interpolate(ap, [0, 1], [18, 0])}px)`,
                  fontFamily: FONT_TITLE,
                  fontWeight: 700,
                  fontSize: 22,
                  color: theme.text,
                  background: theme.panel,
                  border: `1px solid ${theme.panelBorder}`,
                  padding: '12px 20px',
                  borderRadius: 12,
                }}
              >
                <span style={{color: theme.green, fontWeight: 900, marginRight: 8}}>✓</span>
                {t}
              </div>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 44,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            background: theme.gradient,
            padding: '16px 34px',
            borderRadius: 999,
            boxShadow: panelShadow,
          }}
        >
          <span style={{fontSize: 34}}>🔔</span>
          <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 30, color: '#fff'}}>
            Ghost Spectre link in the pinned comment · Subscribe
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Watermark (brand) — bottom-left, subtle
// ---------------------------------------------------------------------------
export const Watermark: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        bottom: 34,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity: 0.9,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          background: theme.gradient,
          borderRadius: 7,
          clipPath: 'polygon(50% 0, 100% 30%, 82% 100%, 18% 100%, 0 30%)',
        }}
      />
      <span
        style={{
          fontFamily: FONT_TITLE,
          fontWeight: 800,
          fontSize: 22,
          color: '#fff',
          textShadow,
          letterSpacing: 0.5,
        }}
      >
Ghost<span style={{color: theme.red}}>·</span>Spectre
      </span>
    </div>
  );
};
