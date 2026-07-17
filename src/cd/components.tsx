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
  else scale = interpolate(frame, [0, 8, durationInFrames], [1.4, 1.16, 1.26], {extrapolateRight: 'clamp'}); // punch-in
  const flash = interpolate(frame, [0, 3], [1.55, 1], {extrapolateRight: 'clamp'}); // pop de brillo en el corte
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <Img src={src} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${scale}) translateX(${tx}%)`,
        filter: `contrast(1.14) saturate(1.22) brightness(${flash})`,
      }} />
    </AbsoluteFill>
  );
};

// ---------- Fondo: video ----------
export const VideoBG: React.FC<{src: string; startFrom?: number}> = ({src, startFrom = 0}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 90], [1.16, 1.24], {extrapolateRight: 'clamp'});
  const flash = interpolate(frame, [0, 3], [1.5, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo src={src} muted startFrom={startFrom} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${scale})`, filter: `contrast(1.12) saturate(1.2) brightness(${flash})`,
      }} />
    </AbsoluteFill>
  );
};

// ---------- Grade + viñeta + duotono unificador + light-leak ----------
export const Grade: React.FC = () => {
  const frame = useCurrentFrame();
  const leakX = 20 + Math.sin(frame / 90) * 30;
  const leakO = 0.10 + Math.sin(frame / 40) * 0.04;
  const vig = 0.6 + Math.sin(frame / 70) * 0.06; // viñeta que respira
  return (
    <>
      {/* duotono: armoniza todo el stock en una sola paleta */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${COLORS.amber}1c 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0) 60%, ${COLORS.teal}1c 100%)`, mixBlendMode: 'soft-light'}} />
      {/* light-leak que deriva */}
      <AbsoluteFill style={{background: `radial-gradient(50% 70% at ${leakX}% 15%, rgba(255,176,32,${leakO}), rgba(0,0,0,0) 60%)`, mixBlendMode: 'screen'}} />
      {/* viñeta que respira */}
      <AbsoluteFill style={{background: `radial-gradient(130% 100% at 50% 45%, rgba(0,0,0,0) 42%, rgba(0,0,0,${vig}) 100%)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,4,0.3) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 66%, rgba(8,5,3,0.6) 100%)'}} />
      {/* scanlines VHS muy sutiles */}
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 2px, transparent 4px)', opacity: 0.28, mixBlendMode: 'multiply'}} />
    </>
  );
};

// ---------- Transición de corte (flashy dark doc) ----------
export const CutFX: React.FC<{type: number}> = ({type}) => {
  const frame = useCurrentFrame();
  const t = ((type % 6) + 6) % 6;
  if (t === 0) { // flash blanco
    const o = interpolate(frame, [0, 5], [0.8, 0], {extrapolateRight: 'clamp'});
    return <AbsoluteFill style={{background: '#fff', opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
  }
  if (t === 1) { // dip a negro
    const o = interpolate(frame, [0, 4], [1, 0], {extrapolateRight: 'clamp'});
    return <AbsoluteFill style={{background: '#000', opacity: o, pointerEvents: 'none'}} />;
  }
  if (t === 2) { // destello ámbar (light leak)
    const o = interpolate(frame, [0, 2, 9], [0, 0.75, 0], {extrapolateRight: 'clamp'});
    return <AbsoluteFill style={{background: 'radial-gradient(60% 80% at 78% 18%, rgba(255,176,32,0.95), rgba(0,0,0,0) 62%)', opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
  }
  if (t === 3) { // glitch RGB
    if (frame >= 4) return null;
    const dx = frame % 2 === 0 ? 8 : -8;
    return (
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        <AbsoluteFill style={{background: 'linear-gradient(0deg, transparent 38%, rgba(22,199,199,0.4) 46%, transparent 54%)', transform: `translateX(${dx}px)`, mixBlendMode: 'screen'}} />
        <AbsoluteFill style={{background: 'linear-gradient(0deg, transparent 56%, rgba(255,59,48,0.4) 62%, transparent 68%)', transform: `translateX(${-dx}px)`, mixBlendMode: 'screen'}} />
      </AbsoluteFill>
    );
  }
  if (t === 4) { // barrido de luz diagonal
    const x = interpolate(frame, [0, 9], [-30, 130], {extrapolateRight: 'clamp'});
    const o = interpolate(frame, [0, 4, 10], [0, 0.55, 0], {extrapolateRight: 'clamp'});
    return (
      <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
        <div style={{position: 'absolute', top: -40, bottom: -40, left: `${x}%`, width: '24%', background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent)', transform: 'skewX(-12deg)', opacity: o, mixBlendMode: 'screen'}} />
      </AbsoluteFill>
    );
  }
  // t === 5: pulso de zoom-oscuro (dip corto + flash tenue)
  const o = interpolate(frame, [0, 3, 6], [0.7, 0.15, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: 'radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.9) 100%)', opacity: o, pointerEvents: 'none'}} />;
};

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

const SERIF = `Georgia, 'Times New Roman', serif`;

// ---------- Slam de impacto (intro / curiosidad) ----------
export const ImpactSlam: React.FC<{text: string; accent?: Accent; durationInFrames: number}> = ({text, accent = 'amber', durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 11, stiffness: 220, mass: 0.6}});
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const shake = frame < 10 ? Math.sin(frame * 3) * (10 - frame) : 0;
  const color = accentColor(accent);
  const ink = accent === 'amber' ? COLORS.ink : COLORS.paper;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: Math.min(inS, out)}}>
      <div style={{transform: `translateX(${shake}px) scale(${interpolate(inS, [0, 1], [0.7, 1])}) rotate(-2deg)`}}>
        <PaintedBox color={color} rotate={0}>
          <div style={{fontFamily: FONT, fontWeight: 900, color: ink, fontSize: text.length > 14 ? 110 : 150, lineHeight: 0.9, textTransform: 'uppercase', letterSpacing: -1, textAlign: 'center'}}>{text}</div>
        </PaintedBox>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Recorte de periódico ----------
export const NewspaperCard: React.FC<{headline: string; dek?: string; img?: string; durationInFrames: number}> = ({headline, dek, img, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 16, stiffness: 140}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rot = interpolate(inS, [0, 1], [-8, -2.5]);
  const drift = Math.sin(frame / 30) * 0.6;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: Math.min(inS, out)}}>
      <div style={{
        width: 940, background: '#e9e4d6', padding: '26px 34px 34px',
        transform: `rotate(${rot + drift}deg) scale(${interpolate(inS, [0, 1], [0.86, 1])})`,
        boxShadow: '0 30px 80px rgba(0,0,0,0.7)', border: '1px solid #cabfa3',
      }}>
        <div style={{borderBottom: '3px double #1a1a1a', paddingBottom: 8, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
          <span style={{fontFamily: SERIF, fontWeight: 900, fontSize: 30, letterSpacing: 3, color: '#1a1a1a'}}>EL DIARIO</span>
          <span style={{fontFamily: SERIF, fontSize: 18, color: '#3a3a3a'}}>ÚLTIMA HORA</span>
        </div>
        <div style={{fontFamily: SERIF, fontWeight: 900, fontSize: 62, lineHeight: 1.02, color: '#111', textTransform: 'uppercase'}}>{headline}</div>
        <div style={{display: 'flex', gap: 20, marginTop: 16}}>
          {img && <Img src={img} style={{width: 300, height: 190, objectFit: 'cover', filter: 'grayscale(1) contrast(1.1)', border: '2px solid #1a1a1a'}} />}
          <div style={{flex: 1}}>
            {dek && <div style={{fontFamily: SERIF, fontSize: 26, lineHeight: 1.35, color: '#222', fontStyle: 'italic'}}>{dek}</div>}
            <div style={{marginTop: 10, columnCount: img ? 1 : 2, columnGap: 18, fontFamily: SERIF, fontSize: 13, lineHeight: 1.5, color: '#333', textAlign: 'justify'}}>
              {'▮▮▮▮ ▮▮▮ ▮▮▮▮▮ ▮▮ ▮▮▮▮▮▮ ▮▮▮ ▮▮ ▮▮▮▮ ▮▮▮▮▮ ▮▮▮ ▮▮▮▮ ▮▮ ▮▮▮▮▮ ▮▮▮▮ ▮▮ ▮▮▮ ▮▮▮▮▮ ▮▮ ▮▮▮▮ ▮▮▮ ▮▮▮▮▮ ▮▮.'.repeat(3)}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Tarjeta de cita ----------
export const QuoteCard: React.FC<{quote: string; author?: string; durationInFrames: number}> = ({quote, author, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 15, stiffness: 130}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(inS, [0, 1], [40, 0]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 12%', opacity: Math.min(inS, out)}}>
      <div style={{transform: `translateY(${y}px)`, textAlign: 'center'}}>
        <div style={{fontFamily: SERIF, fontWeight: 900, color: COLORS.amber, fontSize: 180, lineHeight: 0.4, height: 60}}>“</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, color: COLORS.paper, fontSize: 66, lineHeight: 1.15, textShadow: '0 4px 20px rgba(0,0,0,0.95)'}}>{quote}</div>
        {author && <div style={{marginTop: 26, fontFamily: FONT, fontWeight: 900, color: COLORS.amber, fontSize: 34, textTransform: 'uppercase', letterSpacing: 2}}>— {author}</div>}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Definición (estilo diccionario MM) ----------
export const DefinitionCard: React.FC<{term: string; pos?: string; def: string; durationInFrames: number}> = ({term, pos = 'sustantivo', def, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 15, stiffness: 140}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(inS, [0, 1], [40, 0]);
  const w = interpolate(inS, [0, 1], [0, 100]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: Math.min(inS, out)}}>
      <div style={{transform: `translateY(${y}px)`, textAlign: 'left', maxWidth: '80%'}}>
        <div style={{fontFamily: FONT, fontWeight: 900, color: COLORS.amber, fontSize: 100, textTransform: 'uppercase', lineHeight: 1, letterSpacing: -1, textShadow: '0 4px 18px rgba(0,0,0,0.9)'}}>{term}</div>
        <div style={{fontFamily: SERIF, fontStyle: 'italic', color: COLORS.dim, fontSize: 34, margin: '6px 0 14px'}}>{pos}</div>
        <div style={{height: 5, width: `${w}%`, background: COLORS.teal, marginBottom: 18}} />
        <div style={{fontFamily: FONT_BODY, fontWeight: 600, color: COLORS.paper, fontSize: 40, lineHeight: 1.3, textShadow: '0 3px 14px rgba(0,0,0,0.9)'}}>{def}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Rótulo de nombre (lower-third) ----------
export const LowerThird: React.FC<{name: string; role?: string}> = ({name, role}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 18, stiffness: 150}});
  const x = interpolate(s, [0, 1], [-60, 0]);
  return (
    <div style={{position: 'absolute', left: 80, bottom: 120, opacity: s, transform: `translateX(${x}px)`, display: 'flex', alignItems: 'stretch', gap: 0}}>
      <div style={{width: 10, background: COLORS.amber}} />
      <div style={{background: 'rgba(13,11,10,0.82)', padding: '14px 28px', backdropFilter: 'blur(2px)'}}>
        <div style={{fontFamily: FONT, fontWeight: 900, color: COLORS.paper, fontSize: 48, textTransform: 'uppercase', letterSpacing: 0.5, lineHeight: 1}}>{name}</div>
        {role && <div style={{fontFamily: FONT_BODY, fontWeight: 700, color: COLORS.amber, fontSize: 28, marginTop: 6, letterSpacing: 1}}>{role}</div>}
      </div>
    </div>
  );
};

// ---------- Barra de progreso ----------
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'absolute', bottom: 0, left: 0, height: 6, width: `${progress * 100}%`, background: COLORS.amber, boxShadow: `0 0 12px ${COLORS.amber}`}} />
);

// evita warning de import sin uso
export const _r = random;
