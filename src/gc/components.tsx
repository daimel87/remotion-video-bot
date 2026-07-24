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
