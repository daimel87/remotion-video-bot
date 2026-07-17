import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame,
  useVideoConfig, spring,
} from 'remotion';
import {COLORS, FONT, FONT_SANS, accentColor} from './theme';

type Accent = 'amber' | 'teal' | 'red' | 'paper';

// ============ FONDOS ============
export const KenBurns: React.FC<{
  src: string; motion?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
  durationInFrames: number;
}> = ({src, motion = 'zoomIn', durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let scale = 1.1, tx = 0, ty = 0;
  if (motion === 'zoomIn') {scale = interpolate(p, [0, 1], [1.05, 1.22]); ty = interpolate(p, [0, 1], [1, -1]);}
  else if (motion === 'zoomOut') {scale = interpolate(p, [0, 1], [1.22, 1.06]); ty = interpolate(p, [0, 1], [-1, 1]);}
  else if (motion === 'panLeft') {scale = 1.2; tx = interpolate(p, [0, 1], [5, -5]);}
  else if (motion === 'panRight') {scale = 1.2; tx = interpolate(p, [0, 1], [-5, 5]);}
  else {scale = interpolate(p, [0, 1], [1.22, 1.08]); ty = interpolate(p, [0, 1], [2.5, -2.5]); tx = interpolate(p, [0, 1], [1.5, -1.5]);}
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <Img src={src} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
        filter: 'saturate(0.72) contrast(1.04) brightness(0.86)',
      }} />
    </AbsoluteFill>
  );
};

export const VideoBG: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [1.08, 1.15], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo src={src} muted style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${scale})`, filter: 'saturate(0.7) contrast(1.1) brightness(0.92)',
      }} />
    </AbsoluteFill>
  );
};

// ============ GRADE CINEMATOGRÁFICO (transparencias normales, SIN mixBlendMode) ============
export const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,26,10,0.14) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0) 58%, rgba(6,16,20,0.20) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(125% 105% at 50% 46%, rgba(0,0,0,0) 44%, rgba(0,0,0,0.52) 100%)'}} />
  </>
);

// ============ ATMÓSFERA (desactivada para evitar parpadeo) ============
export const Atmosphere: React.FC = () => null;

// ============ BARRAS DE CINE ============
export const Letterbox: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '11%', background: '#000'}} />
    <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '11%', background: '#000'}} />
  </AbsoluteFill>
);

// ============ TRANSICIÓN (disolvencia — la maneja el fade del fondo) ============
export const CutFX: React.FC<{type?: number}> = () => null;

// ============ TEXTO ============
const fadeInOut = (frame: number, dur: number, inF = 14, outF = 12) =>
  Math.min(interpolate(frame, [0, inF], [0, 1], {extrapolateRight: 'clamp'}), interpolate(frame, [dur - outF, dur], [1, 0], {extrapolateLeft: 'clamp'}));

// Título del documental (pantalla completa)
export const TitleCard: React.FC<{pre?: string; text: string; durationInFrames: number}> = ({pre, text, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 20, 14);
  const scale = interpolate(frame, [0, durationInFrames], [1.04, 1.09]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{textAlign: 'center', transform: `scale(${scale})`}}>
        {pre && <div style={{fontFamily: FONT_SANS, fontWeight: 600, color: COLORS.dim, fontSize: 30, letterSpacing: 10, textTransform: 'uppercase', marginBottom: 22}}>{pre}</div>}
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 150, lineHeight: 0.95, letterSpacing: 2, textShadow: '0 6px 40px rgba(0,0,0,0.9)'}}>{text}</div>
        <div style={{height: 2, width: 260, background: COLORS.amber, margin: '32px auto 0'}} />
      </div>
    </AbsoluteFill>
  );
};

// Texto a pantalla completa (declaración dramática)
export const FullScreenText: React.FC<{text: string; accent?: Accent; durationInFrames: number}> = ({text, accent, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const y = interpolate(frame, [0, 20], [24, 0], {extrapolateRight: 'clamp'});
  const lines = text.split('\n');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 12%', opacity: o}}>
      <div style={{textAlign: 'center', transform: `translateY(${y}px)`}}>
        <div style={{width: 70, height: 2, background: accentColor(accent), margin: '0 auto 30px'}} />
        {lines.map((l, i) => (
          <div key={i} style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: text.length > 34 ? 78 : 104, lineHeight: 1.08, letterSpacing: 1, textShadow: '0 6px 34px rgba(0,0,0,0.95)'}}>{l}</div>
        ))}
        <div style={{width: 70, height: 2, background: accentColor(accent), margin: '30px auto 0'}} />
      </div>
    </AbsoluteFill>
  );
};

// Capítulo (elegante)
export const ChapterTitle: React.FC<{num: number; title: string; durationInFrames: number}> = ({num, title, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 18, 14);
  const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][num] ?? String(num);
  const lineW = interpolate(frame, [0, 30], [0, 340], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: FONT_SANS, fontWeight: 700, color: COLORS.amber, fontSize: 28, letterSpacing: 12, textTransform: 'uppercase'}}>Capítulo {roman}</div>
        <div style={{height: 1.5, width: lineW, background: 'rgba(236,231,220,0.4)', margin: '20px auto'}} />
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 96, lineHeight: 1, letterSpacing: 1, textShadow: '0 6px 34px rgba(0,0,0,0.95)'}}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// Sello de fecha
export const DateStamp: React.FC<{year: string; durationInFrames: number}> = ({year, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 12, 12);
  const lineW = interpolate(frame, [0, 22], [0, 70], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: '20%', left: 100, opacity: o}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div style={{width: lineW, height: 2, background: COLORS.amber}} />
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 92, letterSpacing: 3, textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>{year}</div>
      </div>
    </div>
  );
};

// Rótulo de nombre (lower third)
export const LowerThird: React.FC<{name: string; role?: string}> = ({name, role}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 20, stiffness: 130}});
  const x = interpolate(s, [0, 1], [-50, 0]);
  return (
    <div style={{position: 'absolute', left: 100, bottom: '17%', opacity: s, transform: `translateX(${x}px)`, display: 'flex', gap: 18}}>
      <div style={{width: 3, background: COLORS.amber}} />
      <div>
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 52, letterSpacing: 1, lineHeight: 1, textShadow: '0 3px 16px rgba(0,0,0,0.95)'}}>{name}</div>
        {role && <div style={{fontFamily: FONT_SANS, fontWeight: 600, color: COLORS.amber, fontSize: 26, marginTop: 8, letterSpacing: 3, textTransform: 'uppercase'}}>{role}</div>}
      </div>
    </div>
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

// Cifra grande (elegante, sin caja)
export const StatBox: React.FC<{
  value?: number; display?: string; prefix?: string; suffix?: string; label?: string;
  decimals?: number; format?: 'plain' | 'comma'; accent?: Accent;
}> = ({value = 0, display, prefix = '', suffix = '', label, decimals = 0, format, accent = 'amber'}) => {
  const frame = useCurrentFrame();
  const ramp = interpolate(frame, [0, 40], [0, 1], {extrapolateRight: 'clamp'});
  const o = interpolate(frame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
  const shown = display ?? `${prefix}${fmt(value * ramp, format, decimals)}${suffix}`;
  const y = interpolate(frame, [0, 20], [30, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{textAlign: 'center', transform: `translateY(${y}px)`}}>
        <div style={{fontFamily: FONT, fontWeight: 700, color: accentColor(accent), fontSize: 180, lineHeight: 0.9, letterSpacing: 1, textShadow: '0 8px 40px rgba(0,0,0,0.9)'}}>{shown}</div>
        {label && <div style={{marginTop: 18, fontFamily: FONT_SANS, fontWeight: 600, color: COLORS.paper, fontSize: 34, textTransform: 'uppercase', letterSpacing: 6, textShadow: '0 3px 16px rgba(0,0,0,0.95)'}}>{label}</div>}
      </div>
    </AbsoluteFill>
  );
};

// Gráfica de barras (elegante)
export const BarChart: React.FC<{mode: 'growth' | 'decline'}> = ({mode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const growth = mode === 'growth';
  const left = {year: growth ? '1983' : '2000', val: growth ? 4 : 14};
  const right = {year: growth ? '1998' : '2010', val: growth ? 14 : 4};
  const color = growth ? COLORS.amber : COLORS.red;
  const rise = (d: number) => spring({frame, fps, delay: d, config: {damping: 22, stiffness: 70}});
  const Bar = ({d, year, val}: {d: number; year: string; val: number}) => {
    const g = rise(d); const h = (val / 14) * 440 * g;
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 220}}>
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 52, marginBottom: 12, opacity: g}}>${(val * g).toFixed(0)}B</div>
        <div style={{width: 120, height: h, background: `linear-gradient(180deg, ${color}, ${color}66)`, boxShadow: `0 0 50px ${color}55`}} />
        <div style={{fontFamily: FONT_SANS, fontWeight: 600, color: COLORS.dim, fontSize: 32, marginTop: 14, letterSpacing: 3}}>{year}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 100, height: 520, paddingTop: 40, borderBottom: '2px solid rgba(236,231,220,0.3)'}}>
        <Bar d={0} year={left.year} val={left.val} />
        <Bar d={14} year={right.year} val={right.val} />
      </div>
    </AbsoluteFill>
  );
};

// Recorte de periódico
export const NewspaperCard: React.FC<{headline: string; dek?: string; img?: string; durationInFrames: number}> = ({headline, dek, img, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 14, 12);
  const rot = interpolate(frame, [0, 20], [-6, -2.5], {extrapolateRight: 'clamp'});
  const drift = Math.sin(frame / 34) * 0.5;
  const scale = interpolate(frame, [0, 20], [0.9, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{width: 900, background: '#ddd7c6', padding: '24px 32px 30px', transform: `rotate(${rot + drift}deg) scale(${scale})`, boxShadow: '0 30px 80px rgba(0,0,0,0.8)', filter: 'sepia(0.15)'}}>
        <div style={{borderBottom: '3px double #1a1a1a', paddingBottom: 8, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 28, letterSpacing: 3, color: '#1a1a1a'}}>EL DIARIO</span>
          <span style={{fontFamily: FONT, fontSize: 17, color: '#3a3a3a'}}>ÚLTIMA HORA</span>
        </div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 58, lineHeight: 1.02, color: '#111', textTransform: 'uppercase'}}>{headline}</div>
        <div style={{display: 'flex', gap: 18, marginTop: 14}}>
          {img && <Img src={img} style={{width: 290, height: 180, objectFit: 'cover', filter: 'grayscale(1) contrast(1.1)', border: '2px solid #1a1a1a'}} />}
          <div style={{flex: 1}}>
            {dek && <div style={{fontFamily: FONT, fontSize: 25, lineHeight: 1.35, color: '#222', fontStyle: 'italic'}}>{dek}</div>}
            <div style={{marginTop: 8, fontFamily: FONT, fontSize: 12.5, lineHeight: 1.5, color: '#333', textAlign: 'justify'}}>
              {'▮▮▮▮ ▮▮▮ ▮▮▮▮▮ ▮▮ ▮▮▮▮▮▮ ▮▮▮ ▮▮ ▮▮▮▮ ▮▮▮▮▮ ▮▮▮ ▮▮▮▮ ▮▮ ▮▮▮▮▮ ▮▮▮▮ ▮▮ ▮▮▮ ▮▮▮▮▮ ▮▮ ▮▮▮▮ ▮▮▮ ▮▮▮▮▮ ▮▮.'.repeat(3)}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Cita
export const QuoteCard: React.FC<{quote: string; author?: string; durationInFrames: number}> = ({quote, author, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const y = interpolate(frame, [0, 22], [26, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 13%', opacity: o}}>
      <div style={{transform: `translateY(${y}px)`, textAlign: 'center'}}>
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.amber, fontSize: 150, lineHeight: 0.3, height: 48}}>“</div>
        <div style={{fontFamily: FONT, fontStyle: 'italic', fontWeight: 500, color: COLORS.paper, fontSize: 72, lineHeight: 1.18, textShadow: '0 4px 24px rgba(0,0,0,0.95)'}}>{quote}</div>
        {author && <div style={{marginTop: 28, fontFamily: FONT_SANS, fontWeight: 600, color: COLORS.amber, fontSize: 30, textTransform: 'uppercase', letterSpacing: 5}}>— {author}</div>}
      </div>
    </AbsoluteFill>
  );
};

// Definición
export const DefinitionCard: React.FC<{term: string; pos?: string; def: string; durationInFrames: number}> = ({term, pos = 'sustantivo', def, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const y = interpolate(frame, [0, 22], [26, 0], {extrapolateRight: 'clamp'});
  const w = interpolate(frame, [6, 30], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{transform: `translateY(${y}px)`, textAlign: 'left', maxWidth: '76%'}}>
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 96, lineHeight: 1, letterSpacing: 1, textShadow: '0 4px 20px rgba(0,0,0,0.9)'}}>{term}</div>
        <div style={{fontFamily: FONT, fontStyle: 'italic', color: COLORS.dim, fontSize: 32, margin: '8px 0 14px'}}>{pos}</div>
        <div style={{height: 2, width: `${w}%`, background: COLORS.amber, marginBottom: 18}} />
        <div style={{fontFamily: FONT_SANS, fontWeight: 500, color: COLORS.paper, fontSize: 38, lineHeight: 1.35, textShadow: '0 3px 14px rgba(0,0,0,0.9)'}}>{def}</div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MOTION GRAPHIC: compresión MP3 (40 MB → 4 MB) ============
export const ShrinkBar: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const g1 = spring({frame, fps, delay: 6, config: {damping: 20, stiffness: 70}});
  const g2 = spring({frame, fps, delay: 24, config: {damping: 20, stiffness: 70}});
  const Row = ({label, w, val, g, color}: {label: string; w: number; val: string; g: number; color: string}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 24, marginBottom: 26}}>
      <div style={{width: 150, textAlign: 'right', fontFamily: FONT_SANS, fontWeight: 700, color: COLORS.dim, fontSize: 30, letterSpacing: 2}}>{label}</div>
      <div style={{width: w * g, height: 52, background: color, boxShadow: `0 0 40px ${color}55`}} />
      <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 44, opacity: g}}>{val}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <AbsoluteFill style={{background: 'rgba(5,7,10,0.6)'}} />
      <div style={{position: 'relative'}}>
        <Row label="CD" w={680} val="40 MB" g={g1} color={COLORS.teal} />
        <Row label="MP3" w={68} val="4 MB" g={g2} color={COLORS.amber} />
        <div style={{marginTop: 18, textAlign: 'center', fontFamily: FONT, fontWeight: 700, color: COLORS.amber, fontSize: 64, opacity: g2}}>−90% de tamaño</div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MOTION GRAPHIC: red P2P de Napster (sin servidor central) ============
export const NetworkDiagram: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const N = 9, R = 260, cx = 960, cy = 470;
  const nodes = Array.from({length: N}, (_, i) => {
    const a = (i / N) * Math.PI * 2 - Math.PI / 2;
    return {x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R};
  });
  const edges: [number, number][] = [];
  for (let i = 0; i < N; i++) {edges.push([i, (i + 1) % N]); edges.push([i, (i + 2) % N]); edges.push([i, (i + 4) % N]);}
  const draw = interpolate(frame, [8, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <AbsoluteFill style={{background: 'rgba(5,7,10,0.4)'}} />
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        {edges.map(([a, b], i) => {
          const na = nodes[a], nb = nodes[b];
          const p = Math.max(0, Math.min(1, draw * 1.4 - (i / edges.length) * 0.4));
          return <line key={i} x1={na.x} y1={na.y} x2={na.x + (nb.x - na.x) * p} y2={na.y + (nb.y - na.y) * p} stroke={`${COLORS.teal}`} strokeOpacity={0.5} strokeWidth={2} />;
        })}
        {nodes.map((n, i) => {
          const pulse = 1 + Math.sin(frame / 10 + i) * 0.12;
          return <g key={i}>
            <circle cx={n.x} cy={n.y} r={22 * pulse} fill={COLORS.amber} />
            <circle cx={n.x} cy={n.y} r={22 * pulse} fill="none" stroke={COLORS.paper} strokeOpacity={0.25} strokeWidth={2} />
          </g>;
        })}
      </svg>
      <div style={{position: 'absolute', bottom: '15%', textAlign: 'center'}}>
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 64, letterSpacing: 1}}>Sin servidor central</div>
        <div style={{marginTop: 8, fontFamily: FONT_SANS, fontWeight: 600, color: COLORS.amber, fontSize: 30, letterSpacing: 6, textTransform: 'uppercase'}}>usuario ↔ usuario</div>
      </div>
    </AbsoluteFill>
  );
};

// ============ MOTION GRAPHIC: línea de tiempo ============
export const Timeline: React.FC<{active: string; durationInFrames: number}> = ({active, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const years = ['1979', '1982', '1991', '1997', '1999', '2003', '2007', '2015'];
  const grow = interpolate(frame, [8, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const activeIdx = years.indexOf(active);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <AbsoluteFill style={{background: 'rgba(5,7,10,0.6)'}} />
      <div style={{width: '82%', position: 'relative'}}>
        <div style={{position: 'absolute', top: 40, left: 0, height: 3, width: `${grow * 100}%`, background: 'rgba(236,231,220,0.4)'}} />
        <div style={{display: 'flex', justifyContent: 'space-between', position: 'relative'}}>
          {years.map((y, i) => {
            const on = i <= activeIdx * grow * 1.2;
            const isActive = i === activeIdx;
            return (
              <div key={y} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: interpolate(frame, [8 + i * 3, 20 + i * 3], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
                <div style={{width: isActive ? 26 : 14, height: isActive ? 26 : 14, borderRadius: '50%', background: isActive ? COLORS.amber : on ? COLORS.teal : 'rgba(236,231,220,0.3)', boxShadow: isActive ? `0 0 28px ${COLORS.amber}` : 'none'}} />
                <div style={{fontFamily: FONT, fontWeight: 700, color: isActive ? COLORS.amber : COLORS.dim, fontSize: isActive ? 44 : 34}}>{y}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Alias para compatibilidad (intro slam / pregunta usan FullScreenText)
export const ImpactSlam = FullScreenText;
export const ChapterRibbon = ChapterTitle;

// Barra de progreso
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'absolute', bottom: 0, left: 0, height: 4, width: `${progress * 100}%`, background: COLORS.amber, opacity: 0.85}} />
);
