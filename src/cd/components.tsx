import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame,
  useVideoConfig, spring, Easing, random,
} from 'remotion';
import {COLORS, FONT, FONT_BODY, accentColor} from './theme';

type Accent = 'amber' | 'teal' | 'red' | 'paper';

// ---------- Fondo: imagen con Ken Burns / punch-in ----------
export const KenBurns: React.FC<{
  src: string; motion?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
  durationInFrames: number;
}> = ({src, motion = 'punchIn', durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let scale = 1.1, tx = 0;
  if (motion === 'zoomIn') scale = interpolate(p, [0, 1], [1.06, 1.2]);
  else if (motion === 'zoomOut') scale = interpolate(p, [0, 1], [1.2, 1.06]);
  else if (motion === 'panLeft') {scale = 1.18; tx = interpolate(p, [0, 1], [4, -4]);}
  else if (motion === 'panRight') {scale = 1.18; tx = interpolate(p, [0, 1], [-4, 4]);}
  else scale = interpolate(frame, [0, 8, durationInFrames], [1.32, 1.16, 1.24], {extrapolateRight: 'clamp'}); // punch-in
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <Img src={src} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${tx}%)`}} />
    </AbsoluteFill>
  );
};

// ---------- Fondo: video ----------
export const VideoBG: React.FC<{src: string; startFrom?: number}> = ({src, startFrom = 0}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 90], [1.16, 1.24], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo src={src} muted startFrom={startFrom} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`}} />
    </AbsoluteFill>
  );
};

// ---------- Grade + viñeta + grano VHS ----------
export const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.62) 100%)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,4,0.28) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 68%, rgba(10,7,4,0.55) 100%)'}} />
    <AbsoluteFill style={{background: `radial-gradient(80% 60% at 50% 40%, ${COLORS.amber}14 0%, rgba(0,0,0,0) 70%)`, mixBlendMode: 'overlay'}} />
  </>
);

// grano animado ligero (una capa SVG)
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 6;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.05, mixBlendMode: 'overlay'}}>
      <svg width="100%" height="100%">
        <filter id={`n${seed}`}><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} /></filter>
        <rect width="100%" height="100%" filter={`url(#n${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

// ---------- Caja pintada (bordes irregulares tipo MM) ----------
export const PaintedBox: React.FC<{color?: string; rotate?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({color = COLORS.amber, rotate = -1.2, children, style}) => (
  <div style={{
    position: 'relative', display: 'inline-block', backgroundColor: color,
    padding: '14px 34px', transform: `rotate(${rotate}deg)`,
    clipPath: 'polygon(1% 6%, 8% 0%, 26% 4%, 52% 0%, 74% 5%, 93% 1%, 100% 8%, 99% 92%, 90% 100%, 66% 95%, 42% 100%, 18% 96%, 5% 100%, 0% 88%)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.55)', ...style,
  }}>{children}</div>
);

// ---------- Tarjeta de título (intro) ----------
export const TitleCard: React.FC<{pre?: string; text: string; durationInFrames: number}> = ({pre, text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 13, stiffness: 150}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(s, [0, 1], [50, 0]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: Math.min(s, out)}}>
      <div style={{transform: `translateY(${y}px)`, textAlign: 'center'}}>
        {pre && <div style={{fontFamily: FONT_BODY, fontWeight: 800, fontStyle: 'italic', color: COLORS.paper, fontSize: 46, marginBottom: 18, textShadow: '0 3px 14px rgba(0,0,0,0.9)', letterSpacing: 1}}>{pre}</div>}
        <PaintedBox color={COLORS.amber} rotate={-1.5}>
          <div style={{fontFamily: FONT, fontWeight: 900, color: COLORS.ink, fontSize: text.length > 12 ? 120 : 168, lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: -1}}>{text}</div>
        </PaintedBox>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Divisor de capítulo (banda inclinada que barre) ----------
export const ChapterRibbon: React.FC<{num: number; title: string; durationInFrames: number}> = ({num, title, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 18, stiffness: 120}});
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const x = interpolate(inS, [0, 1], [-1400, 0]) + interpolate(out, [0, 1], [0, 1500]);
  const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][num] ?? String(num);
  return (
    <AbsoluteFill style={{justifyContent: 'center'}}>
      <div style={{transform: `translateX(${x}px) skewY(-3deg)`, background: COLORS.amber, padding: '30px 0', boxShadow: '0 20px 60px rgba(0,0,0,0.6)'}}>
        <div style={{transform: 'skewY(3deg)', paddingLeft: 120}}>
          <div style={{fontFamily: FONT, fontWeight: 900, color: COLORS.ink, fontSize: 34, letterSpacing: 8, opacity: 0.8}}>CAPÍTULO {roman}</div>
          <div style={{fontFamily: FONT, fontWeight: 900, color: COLORS.ink, fontSize: 92, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: -1, marginTop: 4}}>{title}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const fmt = (v: number, format?: 'plain' | 'comma', decimals = 0) => {
  const fixed = v.toFixed(decimals);
  if (format === 'comma') {
    const [int, dec] = fixed.split('.');
    return (dec ? `${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}.${dec}` : int.replace(/\B(?=(\d{3})+(?!\d))/g, '.'));
  }
  return fixed;
};

// ---------- Cifra en caja pintada (count-up) ----------
export const StatBox: React.FC<{
  value?: number; display?: string; prefix?: string; suffix?: string; label?: string;
  decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;
}> = ({value = 0, display, prefix = '', suffix = '', label, decimals = 0, format, accent = 'amber'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 14, stiffness: 130, mass: 0.7}});
  const ramp = interpolate(frame, [0, Math.min(40, fps * 1.3)], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const shown = display ?? `${prefix}${fmt(value * ramp, format, decimals)}${suffix}`;
  const y = interpolate(inS, [0, 1], [46, 0]);
  const color = accentColor(accent);
  const ink = accent === 'amber' ? COLORS.ink : COLORS.paper;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{transform: `translateY(${y}px) scale(${interpolate(inS, [0, 1], [0.8, 1])})`, opacity: inS, textAlign: 'center'}}>
        <PaintedBox color={color} rotate={-1.5}>
          <div style={{fontFamily: FONT, fontWeight: 900, color: ink, fontSize: 150, lineHeight: 0.9, letterSpacing: -2}}>{shown}</div>
        </PaintedBox>
        {label && <div style={{marginTop: 20, fontFamily: FONT, fontWeight: 900, color: COLORS.paper, fontSize: 42, textTransform: 'uppercase', letterSpacing: 1, textShadow: '0 3px 16px rgba(0,0,0,0.95)'}}>{label}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Gráfica de barras ----------
export const BarChart: React.FC<{mode: 'growth' | 'decline'}> = ({mode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const growth = mode === 'growth';
  const left = {year: growth ? '1983' : '2000', val: growth ? 4 : 14};
  const right = {year: growth ? '1998' : '2010', val: growth ? 14 : 4};
  const color = growth ? COLORS.amber : COLORS.red;
  const rise = (d: number) => spring({frame, fps, delay: d, config: {damping: 20, stiffness: 80}});
  const Bar = ({d, year, val}: {d: number; year: string; val: number}) => {
    const g = rise(d); const h = (val / 14) * 480 * g;
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 240}}>
        <div style={{fontFamily: FONT, fontWeight: 900, color: COLORS.paper, fontSize: 56, marginBottom: 10, opacity: g, textShadow: '0 3px 14px rgba(0,0,0,0.9)'}}>${(val * g).toFixed(0)}B</div>
        <div style={{width: 155, height: h, background: color, borderRadius: '6px 6px 0 0', boxShadow: `0 0 46px ${color}77`}} />
        <div style={{fontFamily: FONT, fontWeight: 900, color: COLORS.dim, fontSize: 42, marginTop: 14}}>{year}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 90, height: 580, paddingTop: 40, borderBottom: '5px solid rgba(247,240,225,0.3)'}}>
        <Bar d={0} year={left.year} val={left.val} />
        <Bar d={12} year={right.year} val={right.val} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Barra de progreso ----------
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'absolute', bottom: 0, left: 0, height: 6, width: `${progress * 100}%`, background: COLORS.amber, boxShadow: `0 0 12px ${COLORS.amber}`}} />
);

// evita warning de import sin uso
export const _r = random;
