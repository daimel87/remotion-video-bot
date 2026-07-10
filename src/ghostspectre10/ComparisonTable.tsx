import React from 'react';
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import '../revios/fonts.css';
import {backOut, easeOut, FONT_MONO, FONT_TITLE, panelShadow, textShadow, theme} from '../ghostspectre/theme';

const W10 = theme.cyan; // Windows 10 column accent
const W11 = theme.red; // Windows 11 column accent

type Row = {icon: string; label: string; w10: string; w11: string};

const ROWS: Row[] = [
  {icon: '🪟', label: 'Windows version', w10: 'Windows 10 · 22H2 (Pro)', w11: 'Windows 11 · 25H2 (26200.8457)'},
  {icon: '⚡', label: 'Idle performance', w10: '29 proc · 2–3% CPU · 1.4 GB', w11: '11 proc · 2–4% CPU · 1.3 GB'},
  {icon: '💾', label: 'Disk space', w10: '8.19 GB installed', w11: '8.18 GB installed'},
  {icon: '📦', label: 'Apps installed', w10: '7 apps · no bloatware', w11: '4 apps · no bloatware'},
  {icon: '🔄', label: 'Windows Update', w10: 'Resumable · not advised', w11: 'Resumable · not advised'},
];

const FontGate: React.FC = () => {
  const [handle] = React.useState(() => delayRender('brand-fonts'));
  React.useEffect(() => {
    let cleared = false;
    const clear = () => {
      if (!cleared) {
        cleared = true;
        continueRender(handle);
      }
    };
    Promise.all([
      document.fonts.load('900 40px Montserrat'),
      document.fonts.load('800 40px Montserrat'),
      document.fonts.load('700 40px Montserrat'),
      document.fonts.load('400 40px Montserrat'),
      document.fonts.load('700 40px "JetBrains Mono"'),
    ])
      .then(() => document.fonts.ready)
      .then(clear)
      .catch((e) => cancelRender(e));
    const t = setTimeout(clear, 6000);
    return () => clearTimeout(t);
  }, [handle]);
  return null;
};

const ColHeader: React.FC<{title: string; sub: string; accent: string; delay: number}> = ({title, sub, accent, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: frame - delay, fps, config: {damping: 200}});
  const pop = interpolate(sp, [0, 1], [0.86, 1], {easing: backOut});
  return (
    <div
      style={{
        flex: 1,
        opacity: sp,
        transform: `scale(${pop})`,
        background: theme.gradient,
        border: `1px solid ${accent}`,
        borderRadius: 16,
        padding: '18px 24px',
        textAlign: 'center',
        boxShadow: panelShadow,
      }}
    >
      <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 40, color: '#fff', lineHeight: 1, textShadow}}>{title}</div>
      <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 19, color: 'rgba(255,255,255,0.9)', marginTop: 6, letterSpacing: 1}}>{sub}</div>
    </div>
  );
};

const Cell: React.FC<{text: string; accent: string}> = ({text, accent}) => (
  <div
    style={{
      flex: 1,
      background: theme.panel,
      border: `1px solid ${theme.panelBorder}`,
      borderLeft: `4px solid ${accent}`,
      borderRadius: 12,
      padding: '16px 22px',
      display: 'flex',
      alignItems: 'center',
      minHeight: 70,
    }}
  >
    <span style={{fontFamily: FONT_TITLE, fontWeight: 700, fontSize: 26, color: theme.text, lineHeight: 1.2}}>{text}</span>
  </div>
);

const TableRow: React.FC<{row: Row; delay: number}> = ({row, delay}) => {
  const frame = useCurrentFrame();
  const ap = interpolate(frame, [delay, delay + 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  const dx = interpolate(ap, [0, 1], [-40, 0]);
  return (
    <div style={{display: 'flex', gap: 20, alignItems: 'stretch', opacity: ap, transform: `translateX(${dx}px)`}}>
      <div
        style={{
          width: 420,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${theme.panelBorder}`,
          borderRadius: 12,
          padding: '16px 22px',
        }}
      >
        <span style={{fontSize: 34, lineHeight: 1}}>{row.icon}</span>
        <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 27, color: theme.text, textShadow}}>{row.label}</span>
      </div>
      <Cell text={row.w10} accent={W10} />
      <Cell text={row.w11} accent={W11} />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Full-screen animated comparison table — Ghost Spectre W10 SE vs W11 SE.
// ---------------------------------------------------------------------------
export const GhostSpectre10v11Table: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const titleSp = spring({frame, fps, config: {damping: 200}});
  const barW = interpolate(frame, [6, 26], [0, 300], {extrapolateRight: 'clamp', easing: easeOut});
  const fadeOut = interpolate(frame, [durationInFrames - 16, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    easing: easeOut,
  });
  const footerAp = interpolate(frame, [ROWS.length * 12 + 30, ROWS.length * 12 + 46], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  return (
    <AbsoluteFill style={{background: theme.gradientDark, opacity: fadeOut}}>
      <FontGate />
      {/* brand shard */}
      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            right: -260,
            top: -260,
            width: 1100,
            height: 1100,
            background: theme.gradient,
            opacity: 0.16,
            clipPath: 'polygon(40% 0, 100% 45%, 60% 100%, 0 55%)',
            transform: `rotate(${interpolate(titleSp, [0, 1], [12, 0])}deg)`,
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill style={{padding: '70px 100px', justifyContent: 'flex-start'}}>
        {/* Title */}
        <div style={{transform: `translateY(${interpolate(titleSp, [0, 1], [30, 0])}px)`, opacity: titleSp}}>
          <div style={{width: barW, height: 6, background: theme.red, borderRadius: 4, marginBottom: 16}} />
          <div style={{fontFamily: FONT_MONO, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: theme.cyan, textTransform: 'uppercase'}}>
            Ghost Spectre · Superlight SE
          </div>
          <div style={{fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 62, color: theme.text, lineHeight: 1, marginTop: 6, textShadow}}>
            Windows 10 <span style={{color: theme.textDim, fontWeight: 800}}>vs</span> Windows 11
          </div>
        </div>

        {/* Column headers */}
        <div style={{display: 'flex', gap: 20, marginTop: 34}}>
          <div style={{width: 420}} />
          <ColHeader title="Windows 10 SE" sub="22H2 · 2026" accent={W10} delay={10} />
          <ColHeader title="Windows 11 SE" sub="25H2 · 2026" accent={W11} delay={16} />
        </div>

        {/* Rows */}
        <div style={{display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20}}>
          {ROWS.map((r, i) => (
            <TableRow key={r.label} row={r} delay={24 + i * 12} />
          ))}
        </div>

        {/* Footer verdict */}
        <div
          style={{
            marginTop: 30,
            alignSelf: 'center',
            opacity: footerAp,
            transform: `translateY(${interpolate(footerAp, [0, 1], [16, 0])}px)`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            background: theme.gradient,
            padding: '14px 30px',
            borderRadius: 999,
            boxShadow: panelShadow,
          }}
        >
          <span style={{fontSize: 30}}>👻</span>
          <span style={{fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 26, color: '#fff'}}>
            Both: debloated · optimized · ~8 GB · no bloatware
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
