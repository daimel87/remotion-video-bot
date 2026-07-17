import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame,
  useVideoConfig, spring, Easing,
} from 'remotion';
import {COLORS, FONT, FONT_BODY, accentColor} from './theme';

// ---------- Fondo: imagen con Ken Burns ----------
export const KenBurns: React.FC<{
  src: string;
  motion?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn' | 'static';
  durationInFrames: number;
}> = ({src, motion = 'zoomIn', durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  let scale = 1.12, tx = 0, ty = 0;
  if (motion === 'zoomIn') scale = interpolate(p, [0, 1], [1.05, 1.22]);
  else if (motion === 'zoomOut') scale = interpolate(p, [0, 1], [1.22, 1.05]);
  else if (motion === 'panLeft') {scale = 1.2; tx = interpolate(p, [0, 1], [4, -4]);}
  else if (motion === 'panRight') {scale = 1.2; tx = interpolate(p, [0, 1], [-4, 4]);}
  else if (motion === 'punchIn') scale = interpolate(p, [0, 0.12, 1], [1.35, 1.12, 1.18], {extrapolateRight: 'clamp'});
  else scale = 1.08;
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <Img src={src} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
      }} />
    </AbsoluteFill>
  );
};

// ---------- Fondo: video ----------
export const VideoBG: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 300], [1.08, 1.14], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo src={src} muted playbackRate={1} style={{
        width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`,
      }} />
    </AbsoluteFill>
  );
};

// ---------- Viñeta + grano + degradado inferior ----------
export const Grade: React.FC<{strong?: boolean}> = ({strong}) => (
  <>
    <AbsoluteFill style={{
      background:
        'radial-gradient(120% 90% at 50% 42%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.55) 100%)',
    }} />
    <AbsoluteFill style={{
      background: strong
        ? 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 32%, rgba(0,0,0,0.35) 62%, rgba(0,0,0,0.9) 100%)'
        : 'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 34%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.82) 100%)',
    }} />
  </>
);

// ---------- Barras cinematográficas ----------
export const Letterbox: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'transparent'}}>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '9%', background: '#000'}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '9%', background: '#000'}} />
    </AbsoluteFill>
  </>
);

// ---------- Etiqueta de año / lugar (esquina) ----------
export const YearTag: React.FC<{label: string}> = ({label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 16, stiffness: 140}});
  const x = interpolate(s, [0, 1], [-40, 0]);
  return (
    <div style={{
      position: 'absolute', top: 70, left: 70, opacity: s,
      transform: `translateX(${x}px)`, display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{width: 8, height: 46, background: COLORS.red}} />
      <div style={{
        fontFamily: FONT, fontSize: 44, fontWeight: 900, color: COLORS.ink,
        letterSpacing: 2, textShadow: '0 3px 14px rgba(0,0,0,0.8)',
      }}>{label}</div>
    </div>
  );
};

// ---------- Titular cinético (centro) ----------
export const Headline: React.FC<{
  text: string; sub?: string; accent?: 'red' | 'gold' | 'white'; holdFrames: number;
}> = ({text, sub, accent, holdFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 14, stiffness: 160, mass: 0.7}});
  const out = interpolate(frame, [holdFrames - 10, holdFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const opacity = Math.min(inS, out);
  const y = interpolate(inS, [0, 1], [40, 0]);
  const scale = interpolate(inS, [0, 1], [0.86, 1]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 8%'}}>
      <div style={{
        opacity, transform: `translateY(${y}px) scale(${scale})`, textAlign: 'center',
      }}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, color: COLORS.ink,
          fontSize: text.length > 22 ? 92 : 128, lineHeight: 0.98, letterSpacing: -1,
          textShadow: '0 6px 30px rgba(0,0,0,0.9)', textTransform: 'uppercase',
        }}>
          {text}
        </div>
        <div style={{height: 10}} />
        <div style={{
          height: 12, width: interpolate(inS, [0, 1], [0, 220]),
          background: accentColor(accent), margin: '0 auto', borderRadius: 2,
        }} />
        {sub && (
          <div style={{
            marginTop: 22, fontFamily: FONT_BODY, fontWeight: 700, color: COLORS.dim,
            fontSize: 34, letterSpacing: 1, textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}>{sub}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Tarjeta de texto a pantalla completa (negra) ----------
export const TextCard: React.FC<{
  text: string; sub?: string; accent?: 'red' | 'gold' | 'white'; durationInFrames: number;
}> = ({text, sub, accent, durationInFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 15, stiffness: 150}});
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const opacity = Math.min(inS, out);
  const scale = interpolate(inS, [0, 1], [0.9, 1]);
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', padding: '0 9%'}}>
      <div style={{opacity, transform: `scale(${scale})`, textAlign: 'center'}}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, color: accentColor(accent),
          fontSize: text.length > 18 ? 108 : 148, lineHeight: 0.98,
          textTransform: 'uppercase', letterSpacing: -1,
          textShadow: '0 6px 34px rgba(0,0,0,0.6)',
        }}>{text}</div>
        {sub && (
          <div style={{
            marginTop: 26, fontFamily: FONT_BODY, fontWeight: 600, color: COLORS.ink,
            fontSize: 38, letterSpacing: 0.5,
          }}>{sub}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const fmt = (v: number, format?: 'plain' | 'comma', decimals = 0) => {
  const fixed = v.toFixed(decimals);
  if (format === 'comma') {
    const [int, dec] = fixed.split('.');
    const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return dec ? `${withSep}.${dec}` : withSep;
  }
  return fixed;
};

// ---------- Contador de cifra animado ----------
export const StatBig: React.FC<{
  value: number; prefix?: string; suffix?: string; label?: string;
  decimals?: number; format?: 'plain' | 'comma'; accent?: 'red' | 'gold' | 'white';
}> = ({value, prefix = '', suffix = '', label, decimals = 0, format, accent = 'gold'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inS = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const ramp = interpolate(frame, [0, Math.min(45, fps * 1.5)], [0, 1], {
    extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
  const shown = value * ramp;
  const y = interpolate(inS, [0, 1], [50, 0]);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{opacity: inS, transform: `translateY(${y}px)`, textAlign: 'center'}}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, color: accentColor(accent),
          fontSize: 190, lineHeight: 1, letterSpacing: -3,
          textShadow: '0 8px 40px rgba(0,0,0,0.85)',
        }}>
          {prefix}{fmt(shown, format, decimals)}{suffix}
        </div>
        {label && (
          <div style={{
            marginTop: 6, fontFamily: FONT, fontWeight: 900, color: COLORS.ink,
            fontSize: 46, textTransform: 'uppercase', letterSpacing: 1,
            textShadow: '0 3px 16px rgba(0,0,0,0.9)',
          }}>{label}</div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Gráfica de barras (crecimiento o caída) ----------
export const BarChart: React.FC<{mode: 'growth' | 'decline'}> = ({mode}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const growth = mode === 'growth';
  const left = {year: growth ? '1983' : '2000', val: growth ? 4 : 14};
  const right = {year: growth ? '1998' : '2010', val: growth ? 14 : 4};
  const maxVal = 14;
  const rise = (delay: number) =>
    spring({frame, fps, delay, config: {damping: 20, stiffness: 80}});
  const barH = (v: number, g: number) => (v / maxVal) * 460 * g;
  const color = growth ? COLORS.gold : COLORS.red;
  const Bar = ({d, year, val}: {d: number; year: string; val: number}) => {
    const g = rise(d);
    const h = barH(val, g);
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: 240}}>
        <div style={{
          fontFamily: FONT, fontWeight: 900, color: COLORS.ink, fontSize: 54,
          marginBottom: 10, opacity: g, textShadow: '0 3px 14px rgba(0,0,0,0.9)',
        }}>${(val * g).toFixed(0)}B</div>
        <div style={{
          width: 150, height: h, background: `linear-gradient(180deg, ${color}, ${color}aa)`,
          borderRadius: '8px 8px 0 0', boxShadow: `0 0 40px ${color}66`,
        }} />
        <div style={{
          fontFamily: FONT, fontWeight: 900, color: COLORS.dim, fontSize: 40,
          marginTop: 14, letterSpacing: 1,
        }}>{year}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 90, height: 560,
        paddingTop: 40, borderBottom: `4px solid rgba(255,255,255,0.25)`,
      }}>
        <Bar d={0} year={left.year} val={left.val} />
        <Bar d={12} year={right.year} val={right.val} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- Subtítulo inferior (con palabras destacadas) ----------
export const Caption: React.FC<{text: string; emphasis?: string[]}> = ({text, emphasis = []}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const words = text.split(' ');
  const isEm = (w: string) => {
    const clean = w.toLowerCase().replace(/[.,;:¿?¡!"]/g, '');
    return emphasis.some((e) => clean.includes(e.toLowerCase()));
  };
  return (
    <div style={{
      position: 'absolute', bottom: 70, left: '50%', transform: 'translateX(-50%)',
      width: '82%', textAlign: 'center', opacity,
    }}>
      <span style={{
        fontFamily: FONT_BODY, fontWeight: 800, fontSize: 42, lineHeight: 1.28,
        color: COLORS.ink, letterSpacing: 0.2,
        textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.95)',
      }}>
        {words.map((w, i) => (
          <span key={i} style={{color: isEm(w) ? COLORS.gold : COLORS.ink}}>{w}{' '}</span>
        ))}
      </span>
    </div>
  );
};

// ---------- Palabras clave animadas (reemplaza subtítulos) ----------
export const KeywordPop: React.FC<{words: string[]; accent?: 'red' | 'gold' | 'white'}> = ({words, accent = 'gold'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const color = accentColor(accent);
  return (
    <div style={{
      position: 'absolute', left: '50%', bottom: '13%', transform: 'translateX(-50%)',
      width: '86%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
    }}>
      {words.slice(0, 3).map((w, i) => {
        const s = spring({frame, fps, delay: i * 7, config: {damping: 13, stiffness: 170, mass: 0.6}});
        const y = interpolate(s, [0, 1], [34, 0]);
        return (
          <div key={i} style={{
            opacity: s, transform: `translateY(${y}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
            fontFamily: FONT, fontWeight: 900, color, fontSize: 74, lineHeight: 1,
            textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center',
            textShadow: '0 4px 20px rgba(0,0,0,0.95), 0 0 4px rgba(0,0,0,0.9)',
            WebkitTextStroke: '1px rgba(0,0,0,0.35)',
          }}>{w}</div>
        );
      })}
    </div>
  );
};

// ---------- Barra de progreso del video (retención) ----------
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'absolute', bottom: 0, left: 0, height: 6, width: `${progress * 100}%`, background: COLORS.red, boxShadow: `0 0 12px ${COLORS.red}`}} />
);
