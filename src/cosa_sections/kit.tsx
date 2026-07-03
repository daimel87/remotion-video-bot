import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate, Easing} from 'remotion';

export const theme = {
  font: 'Helvetica, Arial, sans-serif',
  bg: '#0a0a12',
  accent: '#ff3c3c',
  accentGlow: 'rgba(255,60,60,0.7)',
  text: '#ffffff',
  textDim: '#cccccc',
  panel: 'rgba(10,12,25,0.86)',
  panelBorder: 'rgba(255,60,60,0.45)',
};

export const easeOut = Easing.out(Easing.cubic);
export const easeIn = Easing.in(Easing.cubic);

export const lifecycle = (frame: number, inAt: number, inDur: number, outAt: number, outDur: number): number => {
  if (frame < inAt) return 0;
  if (frame < inAt + inDur) return easeOut(Math.min(1, Math.max(0, (frame - inAt) / inDur)));
  if (frame < outAt) return 1;
  if (frame < outAt + outDur) return 1 - easeIn(Math.min(1, Math.max(0, (frame - outAt) / outDur)));
  return 0;
};

// Zoom del video de fondo con origen en la línea de los ojos (50% 29%).
export const ZoomVideo: React.FC<{src: string; frames: number[]; scales: number[]}> = ({src, frames, scales}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, frames, scales, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile(src)}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`, transformOrigin: '50% 29%'}}
      />
    </AbsoluteFill>
  );
};

export const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      background: theme.panel,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      border: `1px solid ${theme.panelBorder}`,
      boxShadow: '0 12px 40px rgba(0,0,0,0.55)',
      borderRadius: 18,
      padding: '26px 44px',
      ...style,
    }}
  >
    {children}
  </div>
);

type Pos = 'bottom' | 'top' | 'left' | 'right' | 'center';

const posStyle = (pos: Pos): React.CSSProperties => {
  switch (pos) {
    case 'bottom': return {justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90};
    case 'top': return {justifyContent: 'flex-start', alignItems: 'center', paddingTop: 90};
    case 'left': return {justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 80};
    case 'right': return {justifyContent: 'center', alignItems: 'flex-end', paddingRight: 80};
    case 'center': return {justifyContent: 'center', alignItems: 'center'};
  }
};

const slideFor = (pos: Pos, op: number): string => {
  const d = interpolate(op, [0, 1], [1, 0]);
  switch (pos) {
    case 'bottom': return `translateY(${40 * d}px)`;
    case 'top': return `translateY(${-40 * d}px)`;
    case 'left': return `translateX(${-50 * d}px)`;
    case 'right': return `translateX(${50 * d}px)`;
    case 'center': return `scale(${interpolate(op, [0, 1], [0.85, 1])})`;
  }
};

// Escena posicionada con ciclo de vida. `in/out` en frames absolutos.
export const Scene: React.FC<{
  frameIn: number;
  frameOut: number;
  pos: Pos;
  children: React.ReactNode;
  maxWidth?: number;
}> = ({frameIn, frameOut, pos, children, maxWidth}) => {
  const frame = useCurrentFrame();
  const op = lifecycle(frame, frameIn, 14, frameOut, 12);
  if (op <= 0) return null;
  return (
    <AbsoluteFill style={posStyle(pos)}>
      <div style={{opacity: op, transform: slideFor(pos, op), textAlign: pos === 'left' ? 'left' : 'center', maxWidth}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const T: React.FC<{children: React.ReactNode; size?: number; color?: string; weight?: number}> = ({
  children,
  size = 54,
  color = theme.text,
  weight = 800,
}) => (
  <span style={{fontFamily: theme.font, fontWeight: weight, fontSize: size, color, letterSpacing: 1, lineHeight: 1.15}}>
    {children}
  </span>
);

export const AccentLine: React.FC<{width?: number}> = ({width = 360}) => (
  <div style={{width, height: 4, background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`, marginTop: 14, marginLeft: 'auto', marginRight: 'auto'}} />
);

// Overlay a PANTALLA COMPLETA (estilo "8 frases..."). Oculta a la persona.
export const FullScreen: React.FC<{
  frameIn: number;
  frameOut: number;
  big: string;
  small?: string;
  kicker?: string;
}> = ({frameIn, frameOut, big, small, kicker}) => {
  const frame = useCurrentFrame();
  const op = lifecycle(frame, frameIn, 12, frameOut, 12);
  if (op <= 0) return null;
  const t = Math.min(1, Math.max(0, (frame - frameIn) / 14));
  const enter = easeOut(t);
  const bigScale = interpolate(enter, [0, 1], [0.6, 1]);
  const lineW = interpolate(enter, [0, 1], [0, 1100]);
  return (
    <>
      <AbsoluteFill
        style={{
          opacity: op,
          backgroundColor: '#080610',
          backgroundImage:
            'radial-gradient(circle at 50% 42%, rgba(255,60,60,0.25) 0%, rgba(8,6,16,0) 60%), linear-gradient(rgba(255,60,60,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,60,60,0.08) 1px, transparent 1px)',
          backgroundSize: 'auto, 60px 60px, 60px 60px',
        }}
      />
      <AbsoluteFill style={{opacity: op, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        {kicker ? (
          <div style={{fontFamily: theme.font, fontWeight: 700, fontSize: 40, color: theme.textDim, textTransform: 'uppercase', letterSpacing: 6, marginBottom: 14}}>
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            transform: `scale(${bigScale})`,
            fontFamily: theme.font,
            fontWeight: 900,
            fontSize: 150,
            color: theme.accent,
            textShadow: `0 0 70px ${theme.accentGlow}`,
            textTransform: 'uppercase',
            textAlign: 'center',
            lineHeight: 1,
            maxWidth: 1600,
          }}
        >
          {big}
        </div>
        <div style={{width: lineW, height: 5, background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`, margin: '26px 0'}} />
        {small ? (
          <div style={{fontFamily: theme.font, fontWeight: 700, fontSize: 46, color: theme.text, textTransform: 'uppercase', letterSpacing: 4, textAlign: 'center', maxWidth: 1500}}>
            {small}
          </div>
        ) : null}
      </AbsoluteFill>
    </>
  );
};
