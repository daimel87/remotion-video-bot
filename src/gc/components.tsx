import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {COLORS, FONT, FONT_SANS} from '../cd/theme';

// ============================================================
// Componentes NUEVOS para "González Camarena", extraídos del análisis del
// video del tigre diente de sable (más dinamismo) pero atados al TEMA del
// documental: la televisión. Se suman a cd/components.tsx, no lo reemplazan.
// ============================================================

// ---- Ruido TV (SVG feTurbulence, semilla por frame -> se anima de verdad
// en el render de Remotion, no depende de CSS animation en tiempo real) ----
const TVNoise: React.FC<{seed: number; opacity: number}> = ({seed, opacity}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
    <filter id={`gc-noise-${seed}`}>
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0" />
    </filter>
    <rect width="100%" height="100%" opacity={opacity} filter={`url(#gc-noise-${seed})`} />
  </svg>
);

// ---- Encendido de CRT: la pantalla "prende" desde una línea horizontal
// (el clásico apagado/encendido de tubo de rayos catódicos). Tema perfecto
// para abrir un documental sobre la historia de la televisión. ----
export const CRTPowerOn: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lineH = interpolate(p, [0, 0.35], [0, 3], {extrapolateRight: 'clamp'});
  const expand = interpolate(p, [0.3, 1], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flash = interpolate(p, [0.28, 0.4, 0.7], [0, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const noiseOp = interpolate(p, [0, 0.3, 0.55], [0.9, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (p >= 1) return null;
  return (
    <AbsoluteFill style={{zIndex: 50, pointerEvents: 'none'}}>
      <AbsoluteFill style={{backgroundColor: '#000', clipPath: `inset(${50 - expand / 2}% 0 ${50 - expand / 2}% 0)`}}>
        <AbsoluteFill style={{backgroundColor: '#fff', opacity: flash}} />
        <TVNoise seed={Math.floor(frame * 7) % 997} opacity={noiseOp} />
      </AbsoluteFill>
      {expand < 100 && (
        <div style={{position: 'absolute', top: `${50 - lineH / 2}%`, left: 0, right: 0, height: `${lineH}%`, background: '#fff', boxShadow: '0 0 60px 20px rgba(255,255,255,0.8)'}} />
      )}
    </AbsoluteFill>
  );
};

// ---- Transición "corte de señal": estática de TV breve entre dos escenas,
// como si se cambiara de canal. Se usa en los cortes de capítulo en vez del
// fade plano, para que la narrativa "se sienta" como una señal de televisión. ----
type SignalCutProps = Record<string, never>;
const SignalCutPresentation: React.FC<TransitionPresentationComponentProps<SignalCutProps>> = ({children, presentationProgress, presentationDirection}) => {
  const frame = useCurrentFrame();
  const isEntering = presentationDirection === 'entering';
  const opacity = isEntering ? presentationProgress : 1;
  // ráfaga de estática: máxima a mitad de la transición, se disuelve en los extremos
  const burst = Math.max(0, 1 - Math.abs(presentationProgress - 0.5) * 2.6);
  return (
    <AbsoluteFill style={{opacity}}>
      {children}
      <AbsoluteFill style={{opacity: burst * 0.85}}>
        <TVNoise seed={Math.floor(frame * 11 + presentationProgress * 233) % 997} opacity={1} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
export const signalCut = (): TransitionPresentation<SignalCutProps> => ({component: SignalCutPresentation, props: {}});

// ---- Tarjeta de fuente: cita breve bajo el material de archivo real, para
// que se sienta "documental premium" (igual que los docus de History Channel
// citan su fuente). Barrido de brillo, no una caja estática. ----
export const SourceCard: React.FC<{label: string; sub?: string; durationInFrames: number}> = ({label, sub, durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = Math.min(
    interpolate(frame, [0, 14], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  const sweep = interpolate(frame, [0, 30], [-40, 130], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', right: 96, bottom: '17%', opacity: o, maxWidth: 620}}>
      <div style={{
        position: 'relative', overflow: 'hidden', background: 'linear-gradient(90deg, rgba(5,7,10,0.15), rgba(5,7,10,0.78) 22%)',
        padding: '14px 18px 14px 70px', borderRadius: 3, textAlign: 'right',
      }}>
        <div style={{position: 'absolute', top: 0, bottom: 0, width: '35%', left: `${sweep}%`, background: 'linear-gradient(100deg, transparent, rgba(224,162,74,0.14), transparent)'}} />
        <div style={{fontFamily: FONT_SANS, fontWeight: 700, color: COLORS.amber, fontSize: 17, letterSpacing: 3, textTransform: 'uppercase'}}>Fuente</div>
        <div style={{fontFamily: FONT, fontWeight: 600, color: COLORS.paper, fontSize: 26, lineHeight: 1.2, marginTop: 4, textShadow: '0 2px 10px rgba(0,0,0,0.9)'}}>{label}</div>
        {sub && <div style={{fontFamily: FONT_SANS, color: COLORS.dim, fontSize: 18, marginTop: 4}}>{sub}</div>}
      </div>
    </div>
  );
};

// ---- DIAGRAMA del disco tricromático (motion graphic). Un disco con sectores
// Rojo/Verde/Azul que gira a velocidad, frente a un "haz" — explica el sistema
// de González Camarena. Fondo cinematográfico oscuro. ----
export const ColorWheelDiagram: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const o = Math.min(
    interpolate(frame, [0, 18], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'}),
  );
  const spin = frame * 7; // grados/frame -> gira rápido
  const cx = 960, cy = 500, R = 240;
  const sectors = [
    {c: '#d64535', a0: -90, a1: 30, label: 'R'},
    {c: '#3fae57', a0: 30, a1: 150, label: 'V'},
    {c: '#3f7fd6', a0: 150, a1: 270, label: 'A'},
  ];
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [cx + R * Math.cos((a * Math.PI) / 180), cy + R * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1} Z`;
  };
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', opacity: o}}>
      <AbsoluteFill style={{background: 'radial-gradient(55% 55% at 50% 46%, rgba(224,162,74,0.08), rgba(0,0,0,0) 60%)'}} />
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        <g transform={`rotate(${spin} ${cx} ${cy})`}>
          {sectors.map((s, i) => (
            <path key={i} d={arc(s.a0, s.a1)} fill={s.c} fillOpacity={0.9} stroke="#0a0d10" strokeWidth={4} />
          ))}
        </g>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(236,231,220,0.35)" strokeWidth={3} />
        <circle cx={cx} cy={cy} r={30} fill="#0a0d10" stroke="rgba(236,231,220,0.4)" strokeWidth={3} />
      </svg>
      <div style={{position: 'absolute', bottom: '16%', textAlign: 'center'}}>
        <div style={{fontFamily: FONT, fontWeight: 700, color: COLORS.paper, fontSize: 60, letterSpacing: 2, textShadow: '0 3px 18px rgba(0,0,0,0.9)'}}>Rojo · Verde · Azul</div>
        <div style={{marginTop: 10, fontFamily: FONT_SANS, fontWeight: 600, color: COLORS.amber, fontSize: 26, letterSpacing: 6, textTransform: 'uppercase'}}>Sistema tricromático secuencial</div>
      </div>
    </AbsoluteFill>
  );
};

// ---- APAGÓN de señal (cue "se apagó de golpe como una pantalla a la que le
// cortan la señal"). La imagen colapsa a una línea y a un punto, con estática. ----
export const ScreenOff: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const vClose = interpolate(p, [0, 0.35], [100, 3], {extrapolateRight: 'clamp'});   // colapsa en vertical a una línea
  const hClose = interpolate(p, [0.35, 0.6], [100, 0.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); // la línea a un punto
  const dot = interpolate(p, [0.55, 0.7, 1], [1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const noiseOp = interpolate(p, [0, 0.3], [0.5, 0], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', zIndex: 40}}>
      <div style={{width: `${hClose}%`, height: `${vClose}%`, background: 'rgba(236,231,220,0.9)', boxShadow: '0 0 80px 30px rgba(236,231,220,0.5)', position: 'relative', overflow: 'hidden'}}>
        <TVNoise seed={Math.floor(frame * 9) % 997} opacity={noiseOp} />
      </div>
      {p >= 0.55 && <div style={{position: 'absolute', width: 8, height: 8, borderRadius: '50%', background: '#fff', opacity: dot, boxShadow: '0 0 40px 12px rgba(255,255,255,0.7)'}} />}
    </AbsoluteFill>
  );
};

// ---- TEASER de la PATENTE (fondo de pantalla completa). Documento de patente
// de época que ASOMA del archivo, con el número PARCIALMENTE VELADO (bloques
// ▮) para intrigar sin spoilear: la narración aún no llegó a 1940/la patente.
// Sirve de gancho visual en "quédate hasta el final... lo que le pasó a este
// hombre". Papel sepia envejecido, sello circular, líneas de escáner de archivo. ----
export const PatentTeaser: React.FC<{durationInFrames: number; revealed?: boolean}> = ({durationInFrames, revealed}) => {
  const frame = useCurrentFrame();
  const inO = interpolate(frame, [0, 22], [0, 1], {extrapolateRight: 'clamp'});
  const scale = interpolate(frame, [0, durationInFrames], [1.06, 1.14]);
  const rot = interpolate(frame, [0, durationInFrames], [-3.2, -1.8]);
  // teaser: barrido de "lupa" que revela y vuelve a velar. revealed: número fijo y nítido.
  const reveal = revealed ? 1 : interpolate(frame, [10, 40, 70], [0, 1, 0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const digits = revealed ? ['2', ',', '2', '9', '6', ',', '0', '1', '9'] : ['2', ',', '2', '9', '▮', ',', '0', '▮', '9'];
  const stampS = interpolate(frame, [14, 34], [0.4, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const stampO = interpolate(frame, [14, 30], [0, 0.9], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#080a0d', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'}}>
      {/* halo cálido de foco */}
      <AbsoluteFill style={{background: 'radial-gradient(60% 60% at 52% 48%, rgba(224,162,74,0.10), rgba(0,0,0,0) 62%)'}} />
      {/* documento */}
      <div style={{
        position: 'relative', width: 1080, height: 720, transform: `rotate(${rot}deg) scale(${scale})`, opacity: inO,
        background: 'linear-gradient(160deg, #e7ddc4 0%, #d8cca9 55%, #c8b98f 100%)',
        boxShadow: '0 40px 120px rgba(0,0,0,0.85)', padding: '54px 66px', filter: 'sepia(0.25) contrast(1.02)',
      }}>
        <div style={{fontFamily: FONT_SANS, fontWeight: 700, color: '#3a3222', fontSize: 26, letterSpacing: 8, textAlign: 'center'}}>UNITED STATES PATENT OFFICE</div>
        <div style={{height: 2, background: '#5c5030', margin: '18px 0 30px'}} />
        <div style={{display: 'flex', gap: 40}}>
          <div style={{flex: 1}}>
            <div style={{fontFamily: FONT, fontStyle: 'italic', color: '#443a26', fontSize: 30, lineHeight: 1.35}}>
              Adaptador cromoscópico<br/>para equipo de televisión
            </div>
            <div style={{marginTop: 34, fontFamily: FONT_SANS, fontWeight: 700, color: '#2e2716', fontSize: 22, letterSpacing: 3}}>PATENT No.</div>
            {/* número parcialmente redactado (teaser) */}
            <div style={{marginTop: 6, fontFamily: FONT, fontWeight: 700, color: '#1e190e', fontSize: 76, letterSpacing: 4, display: 'flex', gap: 6}}>
              {digits.map((ch, i) => {
                const isBlock = ch === '▮';
                return <span key={i} style={{
                  color: isBlock ? '#1e190e' : `rgba(30,25,14,${0.35 + reveal * 0.65})`,
                  background: isBlock ? '#1e190e' : 'transparent',
                  filter: isBlock ? 'none' : `blur(${(1 - reveal) * 2.2}px)`,
                }}>{isBlock ? ' ' : ch}</span>;
              })}
            </div>
            <div style={{marginTop: 30, fontFamily: FONT, fontSize: 16, lineHeight: 1.5, color: '#4a4028', textAlign: 'justify'}}>
              {'▮▮▮ ▮▮▮▮▮ ▮▮ ▮▮▮▮▮▮ ▮▮▮ ▮▮ ▮▮▮▮ ▮▮▮▮▮ ▮▮▮ ▮▮▮▮ ▮▮ ▮▮▮▮▮ ▮▮▮▮ ▮▮ ▮▮▮ ▮▮▮▮▮ ▮▮'.repeat(4)}
            </div>
          </div>
          {/* sello circular */}
          <div style={{width: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20}}>
            <div style={{
              width: 176, height: 176, borderRadius: '50%', border: '5px double #8a3b2e', opacity: stampO,
              transform: `scale(${stampS}) rotate(-14deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              color: '#8a3b2e', fontFamily: FONT, fontWeight: 700,
            }}>
              <div style={{fontSize: 20, letterSpacing: 2}}>PATENTADO</div>
              <div style={{fontSize: 52, lineHeight: 1, margin: '4px 0'}}>1940</div>
              <div style={{fontSize: 14, letterSpacing: 3}}>MÉXICO · E.U.</div>
            </div>
          </div>
        </div>
      </div>
      {/* líneas de escáner de archivo */}
      <AbsoluteFill style={{opacity: 0.12, background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, rgba(0,0,0,0) 1px 4px)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
