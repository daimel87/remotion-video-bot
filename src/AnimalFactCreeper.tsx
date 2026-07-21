import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import {AnimatedTopoBackground} from './AnimatedTopoBackground';
import {ChromaFox} from './ChromaFox';

const HEADLINE =
  "In Minecraft, the Creeper is the mob **everyone fears** — it sneaks up in total silence and **explodes**, destroying everything you've built. But it has one secret weakness: it is **absolutely terrified of cats**. A single house cat makes a Creeper **turn and run**, and if you keep cats near your base, **Creepers will never come close**. The most feared monster in the game… scared of a **kitten**. 🐱";

const renderBold = (text: string, baseWeight = 400, boldWeight = 800) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    const isBold = part.startsWith('**') && part.endsWith('**');
    const content = isBold ? part.slice(2, -2) : part;
    return (
      <span key={i} style={{fontWeight: isBold ? boldWeight : baseWeight}}>
        {content}
      </span>
    );
  });
};

const VerifiedBadge: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      fill="#4a9eff"
      d="M12 1.5l2.4 2.1 3.1-.6 1 3 2.9 1.3-.6 3.1 2.1 2.4-2.1 2.4.6 3.1-2.9 1.3-1 3-3.1-.6L12 22.5l-2.4-2.1-3.1.6-1-3-2.9-1.3.6-3.1L1.1 12l2.1-2.4-.6-3.1 2.9-1.3 1-3 3.1.6L12 1.5z"
    />
    <path fill="#fff" d="M9.8 15.3l-3-3 1.2-1.2 1.8 1.8 4.2-4.2 1.2 1.2z" />
  </svg>
);

// Flecha roja apuntando hacia abajo al creeper (el protagonista del video).
const RedArrow: React.FC = () => (
  <svg width="52" height="70" viewBox="0 0 52 70" style={{display: 'block', filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.6))'}}>
    <path d="M26 4 L26 44 M8 34 L26 60 L44 34" fill="none" stroke="#fff" strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M26 4 L26 44 M8 34 L26 60 L44 34" fill="none" stroke="#FF1E1E" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AnimalFactCreeper: React.FC<{showFox?: boolean}> = ({showFox = false}) => {
  const frame = useCurrentFrame();

  // Texto fijo desde el frame 0 (sin fade): el clip ya se sube con el texto puesto.
  const profileOpacity = 1;
  const headlineOpacity = 1;
  const ctaOpacity = 1;
  const ctaPulse = 1 + Math.sin(frame * 0.22) * 0.045;

  // Seguimiento del creeper (fracción del recuadro del video, 5s @ 24fps = 120f).
  // Retrocede/huye hacia el fondo mientras los gatos avanzan.
  const cx = interpolate(frame, [0, 36, 72, 108, 120], [50, 47, 58, 48, 48], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cy = interpolate(frame, [0, 36, 72, 108, 120], [40, 46, 38, 40, 40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bob = Math.sin(frame * 0.35) * 5;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <AnimatedTopoBackground />

      {/* Tarjeta estilo post de X: perfil arriba -> headline -> video */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 20,
          right: 20,
          borderRadius: 24,
          overflow: 'hidden',
          background: '#000',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '18px 24px 12px', opacity: profileOpacity}}>
          <Img
            src={staticFile('assets/fox-avatar.png')}
            style={{width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.7)'}}
          />
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span style={{color: '#fff', fontWeight: 800, fontSize: 17, fontFamily: 'Helvetica, Arial, sans-serif'}}>
                Animal Facts Reactions
              </span>
              <VerifiedBadge />
            </div>
            <div style={{color: 'rgba(255,255,255,0.55)', fontSize: 14, fontFamily: 'Helvetica, Arial, sans-serif'}}>
              @AnimalFactsReax
            </div>
          </div>
        </div>

        <div style={{padding: '4px 24px 14px', opacity: headlineOpacity, textAlign: 'left'}}>
          <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 24, lineHeight: 1.28, letterSpacing: '-0.01em', color: '#fff'}}>
            {renderBold(HEADLINE, 700, 900)}
          </span>
        </div>

        {/* Clip 16:9 estilo Minecraft (con su sonido) + flecha roja siguiendo al creeper */}
        <div style={{position: 'relative', width: '100%'}}>
          <OffthreadVideo
            src={staticFile('creeper-fact.mp4')}
            style={{width: '100%', height: 383, objectFit: 'cover', display: 'block'}}
          />
          <div
            style={{
              position: 'absolute',
              left: `${cx}%`,
              top: `${cy}%`,
              transform: `translate(-50%, calc(-100% - 10px)) translateY(${bob}px)`,
              pointerEvents: 'none',
            }}
          >
            <RedArrow />
          </div>
        </div>
      </div>

      {/* Reactor (zorro) opcional — la plantilla se exporta sin él para CapCut */}
      <div
        style={{
          position: 'absolute',
          bottom: -30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 620,
          height: 620,
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
        }}
      >
        {showFox ? <ChromaFox /> : null}
      </div>

      {/* Botón SUBSCRIBE (izquierda) */}
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          left: 14,
          opacity: ctaOpacity,
          transform: `scale(${ctaPulse})`,
          transformOrigin: 'left center',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          borderRadius: 32,
          background: '#FF0000',
          border: '3px solid #fff',
          boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{fontFamily: '"Arial Black", Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff'}}>
          🔔 SUBSCRIBE
        </span>
      </div>

      {/* Botón COMMENT (derecha) */}
      <div
        style={{
          position: 'absolute',
          bottom: 150,
          right: 14,
          opacity: ctaOpacity,
          transform: `scale(${ctaPulse})`,
          transformOrigin: 'right center',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '10px 16px',
          borderRadius: 32,
          background: '#1a1a1a',
          border: '3px solid #fff',
          boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{fontFamily: '"Arial Black", Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff'}}>
          💬 COMMENT
        </span>
      </div>
    </AbsoluteFill>
  );
};
