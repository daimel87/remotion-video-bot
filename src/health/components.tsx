import React from 'react';
import {
  AbsoluteFill, Img, OffthreadVideo, interpolate, useCurrentFrame,
  useVideoConfig, spring,
} from 'remotion';
import {COLORS, FONT, FONT_SANS, accentColor, Accent} from './theme';

// ================================================================
// Canal de salud / cocina frugal para SENIORS (50+).
// Reusa el sistema del documental del CD, re-skineado:
//  - texto ~20% más grande y con más contraste (legibilidad 50+)
//  - grade cálido y MÁS CLARO (los seniors necesitan brillo, no cine oscuro)
//  - fondos procedurales para poder renderizar sin material descargado
// ================================================================

// ============ FONDO PROCEDURAL (placeholder mientras no hay stock) ============
// Gradiente cálido determinista (varía por 'seed'); con leve deriva tipo Ken Burns.
export const ProceduralBG: React.FC<{seed?: number; durationInFrames: number}> = ({seed = 0, durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hue = (28 + seed * 37) % 360;          // gira por receta pero se mantiene cálido de base
  const scale = interpolate(p, [0, 1], [1.06, 1.16]);
  const tx = interpolate(p, [0, 1], [2, -2]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: COLORS.bg}}>
      <AbsoluteFill style={{
        transform: `scale(${scale}) translateX(${tx}%)`,
        background: `radial-gradient(120% 120% at 32% 28%, hsl(${hue} 45% 24%) 0%, hsl(${(hue + 18) % 360} 40% 12%) 55%, #120c06 100%)`,
      }} />
      {/* textura suave para que no sea un plano liso */}
      <AbsoluteFill style={{opacity: 0.16, background: `repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 2px, rgba(0,0,0,0) 2px 9px)`}} />
    </AbsoluteFill>
  );
};

// ============ FONDOS REALES (cuando ya haya stock/archivo) ============
export const KenBurns: React.FC<{
  src: string; motion?: 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'punchIn';
  durationInFrames: number;
}> = ({src, motion = 'zoomIn', durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  let scale = 1.1, tx = 0, ty = 0;
  if (motion === 'zoomIn') {scale = interpolate(p, [0, 1], [1.05, 1.2]); ty = interpolate(p, [0, 1], [1, -1]);}
  else if (motion === 'zoomOut') {scale = interpolate(p, [0, 1], [1.2, 1.06]); ty = interpolate(p, [0, 1], [-1, 1]);}
  else if (motion === 'panLeft') {scale = 1.18; tx = interpolate(p, [0, 1], [5, -5]);}
  else if (motion === 'panRight') {scale = 1.18; tx = interpolate(p, [0, 1], [-5, 5]);}
  else {scale = interpolate(p, [0, 1], [1.2, 1.08]); ty = interpolate(p, [0, 1], [2.5, -2.5]);}
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <Img src={src} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${scale}) translate(${tx}%, ${ty}%)`,
        // cocina: cálido y CLARO (seniors), apetitoso
        filter: 'saturate(1.06) contrast(1.04) brightness(1.02)',
      }} />
    </AbsoluteFill>
  );
};

export const VideoBG: React.FC<{src: string; startFrom?: number; archival?: boolean}> = ({src, startFrom = 0, archival}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 150], [1.06, 1.13], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <OffthreadVideo src={src} muted startFrom={startFrom} style={{
        width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${scale})`,
        filter: archival
          ? 'saturate(0.6) contrast(1.12) brightness(0.98) sepia(0.14)' // archivo vintage cocina
          : 'saturate(1.05) contrast(1.03) brightness(1.02)',
      }} />
    </AbsoluteFill>
  );
};

// ============ GRADE CÁLIDO Y CLARO (mucho menos oscuro que el del CD) ============
export const Grade: React.FC = () => (
  <>
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(60,38,12,0.10) 0%, rgba(0,0,0,0) 42%, rgba(0,0,0,0) 62%, rgba(20,14,8,0.16) 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(130% 115% at 50% 46%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.34) 100%)'}} />
  </>
);

// Barras de cine SUAVES (delgadas; los seniors no quieren pantalla recortada)
export const Letterbox: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: '6.5%', background: '#000'}} />
    <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: '6.5%', background: '#000'}} />
  </AbsoluteFill>
);

// ============ TEXTO ============
const fadeInOut = (frame: number, dur: number, inF = 14, outF = 12) =>
  Math.min(interpolate(frame, [0, inF], [0, 1], {extrapolateRight: 'clamp'}), interpolate(frame, [dur - outF, dur], [1, 0], {extrapolateLeft: 'clamp'}));

// Scrim reutilizable para legibilidad garantizada sobre cualquier fondo.
const Scrim: React.FC<{o?: number}> = ({o = 0.55}) => (
  <AbsoluteFill style={{background: `radial-gradient(70% 68% at 50% 50%, rgba(10,7,3,${o + 0.28}), rgba(10,7,3,${o}) 72%, rgba(0,0,0,${o - 0.2}) 100%)`}} />
);

// Título / gancho a pantalla completa (texto GRANDE para 50+)
export const HookText: React.FC<{text: string; accent?: Accent; durationInFrames: number}> = ({text, accent, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const y = interpolate(frame, [0, 20], [26, 0], {extrapolateRight: 'clamp'});
  const lines = text.split('\n');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 10%', opacity: o}}>
      <Scrim o={0.6} />
      <div style={{textAlign: 'center', transform: `translateY(${y}px)`, position: 'relative'}}>
        <div style={{width: 90, height: 4, background: accentColor(accent), margin: '0 auto 34px', borderRadius: 2}} />
        {lines.map((l, i) => (
          <div key={i} style={{fontFamily: FONT, fontWeight: 800, color: COLORS.paper, fontSize: text.length > 30 ? 92 : 118, lineHeight: 1.06, letterSpacing: 0.5, textShadow: '0 6px 30px rgba(0,0,0,0.98)'}}>{l}</div>
        ))}
        <div style={{width: 90, height: 4, background: accentColor(accent), margin: '34px auto 0', borderRadius: 2}} />
      </div>
    </AbsoluteFill>
  );
};

// Número de alimento (countdown): sección SÍ/NO con color + "N.º X" + nombre.
export const FoodNumber: React.FC<{num: number; title: string; kind?: 'good' | 'bad'; durationInFrames: number}> = ({num, title, kind = 'good', durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const lineW = interpolate(frame, [0, 26], [0, 400], {extrapolateRight: 'clamp'});
  const col = kind === 'bad' ? COLORS.tomato : COLORS.sage;
  const section = kind === 'bad' ? 'Mejor dejar atrás' : 'Lo que sí te cae bien';
  const badge = kind === 'bad' ? '✕' : '✓';
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <Scrim o={0.5} />
      <div style={{textAlign: 'center', position: 'relative'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 8}}>
          <span style={{display: 'inline-flex', justifyContent: 'center', alignItems: 'center', width: 54, height: 54, borderRadius: '50%', background: col, color: '#fff', fontFamily: FONT_SANS, fontWeight: 900, fontSize: 34}}>{badge}</span>
          <span style={{fontFamily: FONT_SANS, fontWeight: 800, color: col, fontSize: 38, letterSpacing: 7, textTransform: 'uppercase'}}>{section} · N.º {num}</span>
        </div>
        <div style={{height: 3, width: lineW, background: 'rgba(251,246,236,0.5)', margin: '22px auto', borderRadius: 2}} />
        <div style={{fontFamily: FONT, fontWeight: 800, color: COLORS.paper, fontSize: 112, lineHeight: 1.02, letterSpacing: 0.5, textShadow: '0 6px 30px rgba(0,0,0,0.98)'}}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// Cifra / precio grande ("$2" · "por semana")
const fmt = (v: number, decimals = 0) => v.toFixed(decimals);
export const PriceTag: React.FC<{
  value?: number; display?: string; prefix?: string; suffix?: string; label?: string;
  decimals?: number; accent?: Accent;
}> = ({value = 0, display, prefix = '', suffix = '', label, decimals = 0, accent = 'amber'}) => {
  const frame = useCurrentFrame();
  const ramp = interpolate(frame, [0, 34], [0, 1], {extrapolateRight: 'clamp'});
  const o = interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'});
  const shown = display ?? `${prefix}${fmt(value * ramp, decimals)}${suffix}`;
  const y = interpolate(frame, [0, 20], [30, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <Scrim o={0.5} />
      <div style={{textAlign: 'center', transform: `translateY(${y}px)`, position: 'relative'}}>
        <div style={{fontFamily: FONT, fontWeight: 800, color: accentColor(accent), fontSize: 210, lineHeight: 0.9, letterSpacing: 0.5, textShadow: '0 8px 36px rgba(0,0,0,0.95)'}}>{shown}</div>
        {label && <div style={{marginTop: 20, fontFamily: FONT_SANS, fontWeight: 700, color: COLORS.paper, fontSize: 42, textTransform: 'uppercase', letterSpacing: 7, textShadow: '0 3px 14px rgba(0,0,0,0.98)'}}>{label}</div>}
      </div>
    </AbsoluteFill>
  );
};

// Tarjeta editorial de papel (titular + descripción) — el sello del estilo del video
export const RecipeCard: React.FC<{kicker?: string; headline: string; dek?: string; img?: string; durationInFrames: number}> = ({kicker = 'La receta', headline, dek, img, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 14, 12);
  const scale = interpolate(frame, [0, 20], [0.92, 1], {extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 20], [24, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <div style={{width: 980, background: COLORS.cream, padding: '38px 46px 42px', transform: `scale(${scale}) translateY(${y}px)`, boxShadow: '0 34px 90px rgba(0,0,0,0.7)', borderRadius: 6}}>
        <div style={{fontFamily: FONT_SANS, fontWeight: 800, fontSize: 26, letterSpacing: 6, color: COLORS.tomato, textTransform: 'uppercase', marginBottom: 14}}>{kicker}</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 66, lineHeight: 1.04, color: COLORS.ink}}>{headline}</div>
        <div style={{display: 'flex', gap: 24, marginTop: 20, alignItems: 'flex-start'}}>
          {img && <Img src={img} style={{width: 320, height: 210, objectFit: 'cover', borderRadius: 4, border: `3px solid ${COLORS.amber}`}} />}
          {dek && <div style={{flex: 1, fontFamily: FONT, fontSize: 36, lineHeight: 1.4, color: '#3a2c18'}}>{dek}</div>}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Consejo / dato de salud ("TIP" · texto)
export const TipCard: React.FC<{term: string; def: string; accent?: Accent; durationInFrames: number}> = ({term, def, accent = 'sage', durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const y = interpolate(frame, [0, 22], [24, 0], {extrapolateRight: 'clamp'});
  const w = interpolate(frame, [6, 30], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <Scrim o={0.5} />
      <div style={{transform: `translateY(${y}px)`, textAlign: 'left', maxWidth: '78%', position: 'relative'}}>
        <div style={{fontFamily: FONT_SANS, fontWeight: 800, color: accentColor(accent), fontSize: 34, letterSpacing: 8, textTransform: 'uppercase', marginBottom: 10}}>Consejo</div>
        <div style={{fontFamily: FONT, fontWeight: 800, color: COLORS.paper, fontSize: 84, lineHeight: 1.02, textShadow: '0 4px 18px rgba(0,0,0,0.95)'}}>{term}</div>
        <div style={{height: 4, width: `${w}%`, background: accentColor(accent), margin: '16px 0 18px', borderRadius: 2}} />
        <div style={{fontFamily: FONT_SANS, fontWeight: 500, color: COLORS.paper, fontSize: 44, lineHeight: 1.34, textShadow: '0 3px 14px rgba(0,0,0,0.95)'}}>{def}</div>
      </div>
    </AbsoluteFill>
  );
};

// Cita (testimonio / frase)
export const QuoteCard: React.FC<{quote: string; author?: string; durationInFrames: number}> = ({quote, author, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = fadeInOut(frame, durationInFrames, 16, 14);
  const y = interpolate(frame, [0, 22], [26, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 12%', opacity: o}}>
      <Scrim o={0.55} />
      <div style={{transform: `translateY(${y}px)`, textAlign: 'center', position: 'relative'}}>
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.amber, fontSize: 160, lineHeight: 0.3, height: 52}}>“</div>
        <div style={{fontFamily: FONT, fontStyle: 'italic', fontWeight: 500, color: COLORS.paper, fontSize: 80, lineHeight: 1.16, textShadow: '0 4px 22px rgba(0,0,0,0.98)'}}>{quote}</div>
        {author && <div style={{marginTop: 30, fontFamily: FONT_SANS, fontWeight: 700, color: COLORS.amber, fontSize: 34, textTransform: 'uppercase', letterSpacing: 5}}>— {author}</div>}
      </div>
    </AbsoluteFill>
  );
};

// Etiqueta inferior (ingrediente / beneficio): "CALCIO" · "vitamina D"
export const IngredientLabel: React.FC<{name: string; role?: string; accent?: Accent}> = ({name, role, accent = 'amber'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 20, stiffness: 130}});
  const x = interpolate(s, [0, 1], [-50, 0]);
  return (
    <div style={{position: 'absolute', left: 96, bottom: '13%', opacity: s, transform: `translateX(${x}px)`, display: 'flex', gap: 18, background: 'linear-gradient(90deg, rgba(10,7,3,0.82), rgba(10,7,3,0.4) 80%, rgba(10,7,3,0))', padding: '18px 76px 18px 20px', borderRadius: 6}}>
      <div style={{width: 5, background: accentColor(accent), borderRadius: 3}} />
      <div>
        <div style={{fontFamily: FONT, fontWeight: 800, color: COLORS.paper, fontSize: 60, letterSpacing: 0.5, lineHeight: 1, textShadow: '0 3px 16px rgba(0,0,0,0.98)'}}>{name}</div>
        {role && <div style={{fontFamily: FONT_SANS, fontWeight: 700, color: accentColor(accent), fontSize: 30, marginTop: 8, letterSpacing: 3, textTransform: 'uppercase'}}>{role}</div>}
      </div>
    </div>
  );
};

// ============ HUD permanente (marca del canal + alimento activo) ============
export const HUD: React.FC<{items: {from: number; num: number; title: string; kind: 'good' | 'bad'}[]; channel: string}> = ({items, channel}) => {
  const frame = useCurrentFrame();
  const active = [...items].filter((c) => c.from <= frame).pop();
  const col = active?.kind === 'bad' ? COLORS.tomato : COLORS.sage;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* marca del canal arriba-izquierda */}
      <div style={{position: 'absolute', top: '9%', left: 84, display: 'flex', alignItems: 'center', gap: 12, background: 'linear-gradient(90deg, rgba(10,7,3,0.72), rgba(10,7,3,0))', padding: '10px 60px 10px 16px', borderRadius: 6}}>
        <div style={{width: 24, height: 3, background: COLORS.amber, borderRadius: 2}} />
        <div style={{fontFamily: FONT_SANS, fontWeight: 800, color: COLORS.paper, fontSize: 24, letterSpacing: 5, textTransform: 'uppercase', textShadow: '0 2px 8px rgba(0,0,0,0.95)'}}>{channel}</div>
      </div>
      {/* alimento activo arriba-derecha (verde = sí, rojo = mejor no) */}
      {active && (
        <div style={{position: 'absolute', top: '9%', right: 84, display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(270deg, rgba(10,7,3,0.74), rgba(10,7,3,0.15) 85%, rgba(10,7,3,0))', padding: '12px 16px 12px 72px', borderRadius: 6}}>
          <div style={{textAlign: 'right'}}>
            <div style={{fontFamily: FONT_SANS, fontWeight: 800, color: col, fontSize: 20, letterSpacing: 4, textShadow: '0 2px 8px rgba(0,0,0,0.9)'}}>{active.kind === 'bad' ? '✕ MEJOR NO' : '✓ SÍ'} · {active.num}</div>
            <div style={{fontFamily: FONT, fontWeight: 800, color: COLORS.paper, fontSize: 34, letterSpacing: 0.5, textShadow: '0 2px 12px rgba(0,0,0,0.98)'}}>{active.title}</div>
          </div>
          <div style={{width: 4, height: 40, background: col, borderRadius: 2}} />
        </div>
      )}
    </AbsoluteFill>
  );
};

// Barra de progreso
export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'absolute', bottom: 0, left: 0, height: 5, width: `${progress * 100}%`, background: COLORS.amber, opacity: 0.9}} />
);
