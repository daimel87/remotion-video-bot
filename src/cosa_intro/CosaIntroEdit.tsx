import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate, spring, useVideoConfig} from 'remotion';
import {theme, easeOut, easeIn, lifecycle} from './theme';

// ---- Fondo de video con zoom motivado (origen en la línea de los ojos) ----
const ZoomVideo: React.FC = () => {
  const frame = useCurrentFrame();
  // Zoom continuo motivado por los énfasis. Escala siempre >= 1.0 (sin bordes negros).
  const scale = interpolate(
    frame,
    [0, 212, 330, 342, 478, 488, 560, 647],
    [1.0, 1.0, 1.08, 1.08, 1.0, 1.0, 1.1, 1.1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut}
  );
  return (
    <AbsoluteFill>
      <OffthreadVideo
        src={staticFile('cosa_intro.mp4')}
        style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})`, transformOrigin: '50% 29%'}}
      />
    </AbsoluteFill>
  );
};

// ---- Panel legible reutilizable (fondo oscuro + blur + borde/sombra) ----
const Panel: React.FC<{op: number; children: React.ReactNode; style?: React.CSSProperties}> = ({op, children, style}) => (
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

const Label: React.FC<{children: React.ReactNode; size?: number; color?: string; weight?: number}> = ({
  children,
  size = 58,
  color = theme.text,
  weight = 800,
}) => (
  <span style={{fontFamily: theme.font, fontWeight: weight, fontSize: size, color, letterSpacing: 1, lineHeight: 1.15}}>
    {children}
  </span>
);

// ---- Barra roja de acento animada ----
const AccentLine: React.FC<{op: number; width: number}> = ({op, width}) => (
  <div style={{width: width * op, height: 4, background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`, marginTop: 14}} />
);

export const CosaIntroEdit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // -------- Escena A: "frases que parecen NORMALES" (panel inferior-centro) --------
  const aOp = lifecycle(frame, 12, 14, 116, 12);
  const aRise = interpolate(aOp, [0, 1], [40, 0]);

  // -------- Escena B: "esconden algo OSCURO" (chip superior) --------
  const bOp = lifecycle(frame, 150, 12, 196, 12);
  const bSlide = interpolate(bOp, [0, 1], [-50, 0]);

  // -------- Escena C: "ni siquiera SE DAN CUENTA" (panel lateral izq) --------
  const cOp = lifecycle(frame, 220, 14, 322, 12);
  const cSlide = interpolate(cOp, [0, 1], [-60, 0]);

  // -------- Riser/transición a full-screen --------
  // -------- Escena D: TÍTULO FULL-SCREEN (clímax) --------
  const dBgOp = lifecycle(frame, 338, 10, 470, 12);
  const dTitleEnter = spring({frame: Math.max(0, frame - 346), fps, config: {damping: 200, stiffness: 170}});
  const dSubEnter = spring({frame: Math.max(0, frame - 366), fps, config: {damping: 200, stiffness: 150}});
  const dExit = interpolate(frame, [468, 480], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const dNumScale = interpolate(dTitleEnter, [0, 1], [0.5, 1]);
  const dSubLine = interpolate(dSubEnter, [0, 1], [0, 1100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // -------- Escena E: badge #7 (disruptivo, lateral derecha) --------
  const eOp = lifecycle(frame, 490, 14, 560, 14);
  const eBadge = spring({frame: Math.max(0, frame - 490), fps, config: {damping: 12, stiffness: 180}});
  const eBadgeScale = interpolate(eBadge, [0, 1], [0.3, 1]);
  const ePulse = 1 + Math.sin(Math.max(0, frame - 505) * 0.18) * 0.05;

  // -------- Escena F: "DEMASIADO TARDE" (banda inferior) --------
  const fOp = lifecycle(frame, 578, 14, 900, 12);
  const fRise = interpolate(fOp, [0, 1], [50, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ZoomVideo />

      {/* ESCENA A - panel inferior-centro */}
      {aOp > 0 && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 90}}>
          <div style={{opacity: aOp, transform: `translateY(${aRise}px)`, textAlign: 'center'}}>
            <Panel op={aOp}>
              <Label size={54} color={theme.textDim}>Frases que parecen </Label>
              <Label size={54} color={theme.accent} weight={900}>NORMALES</Label>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <AccentLine op={aOp} width={360} />
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA B - chip superior */}
      {bOp > 0 && (
        <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 90}}>
          <div style={{opacity: bOp, transform: `translateY(${bSlide}px)`}}>
            <Panel op={bOp} style={{padding: '20px 40px'}}>
              <Label size={48} color={theme.textDim}>…esconden algo </Label>
              <Label size={48} color={theme.accent} weight={900}>MUCHO MÁS OSCURO</Label>
            </Panel>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA C - panel lateral izquierda */}
      {cOp > 0 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 80}}>
          <div style={{opacity: cOp, transform: `translateX(${cSlide}px)`, maxWidth: 620}}>
            <Panel op={cOp}>
              <div style={{fontSize: 64, marginBottom: 8}}>🎭</div>
              <Label size={44} color={theme.text}>Y ni siquiera</Label>
              <br />
              <Label size={60} color={theme.accent} weight={900}>SE DAN CUENTA</Label>
              <AccentLine op={cOp} width={420} />
            </Panel>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA D - TÍTULO FULL-SCREEN */}
      {dBgOp > 0 && (
        <>
          <AbsoluteFill
            style={{
              opacity: dBgOp * dExit,
              backgroundColor: '#080610',
              backgroundImage:
                'radial-gradient(circle at 50% 42%, rgba(255,60,60,0.25) 0%, rgba(8,6,16,0) 60%), linear-gradient(rgba(255,60,60,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,60,60,0.08) 1px, transparent 1px)',
              backgroundSize: 'auto, 60px 60px, 60px 60px',
            }}
          />
          <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', opacity: dExit}}>
            <div
              style={{
                opacity: dTitleEnter,
                transform: `scale(${dNumScale})`,
                fontFamily: theme.font,
                fontWeight: 900,
                fontSize: 300,
                color: theme.accent,
                textShadow: `0 0 70px ${theme.accentGlow}`,
                lineHeight: 0.9,
              }}
            >
              8
            </div>
            <div
              style={{
                opacity: dTitleEnter,
                fontFamily: theme.font,
                fontWeight: 900,
                fontSize: 96,
                color: theme.text,
                textTransform: 'uppercase',
                letterSpacing: 2,
                marginTop: -10,
              }}
            >
              FRASES
            </div>
            <div style={{width: dSubLine, height: 5, background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`, margin: '22px 0'}} />
            <div
              style={{
                opacity: dSubEnter,
                fontFamily: theme.font,
                fontWeight: 700,
                fontSize: 46,
                color: theme.textDim,
                textTransform: 'uppercase',
                letterSpacing: 6,
                textAlign: 'center',
              }}
            >
              que una mujer infiel dice sin querer
            </div>
          </AbsoluteFill>
        </>
      )}

      {/* ESCENA E - badge #7 disruptivo */}
      {eOp > 0 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-end', paddingRight: 90}}>
          <div style={{opacity: eOp, transform: `scale(${eBadgeScale * ePulse})`, textAlign: 'center'}}>
            <Panel op={eOp} style={{padding: '34px 54px'}}>
              <div style={{fontFamily: theme.font, fontWeight: 900, fontSize: 200, color: theme.accent, textShadow: `0 0 60px ${theme.accentGlow}`, lineHeight: 0.9}}>
                #7
              </div>
              <div style={{fontFamily: theme.font, fontWeight: 800, fontSize: 40, color: theme.text, textTransform: 'uppercase', letterSpacing: 2, marginTop: 6}}>
                la que más ignoran
              </div>
            </Panel>
          </div>
        </AbsoluteFill>
      )}

      {/* ESCENA F - banda inferior "DEMASIADO TARDE" */}
      {fOp > 0 && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80}}>
          <div style={{opacity: fOp, transform: `translateY(${fRise}px)`, textAlign: 'center'}}>
            <Panel op={fOp}>
              <Label size={44} color={theme.text}>…hasta que ya es </Label>
              <Label size={64} color={theme.accent} weight={900}>DEMASIADO TARDE</Label>
            </Panel>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
