import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import {AnimatedTopoBackground} from './AnimatedTopoBackground';
import {ChromaFox} from './ChromaFox';

const HEADLINE =
  "Sharks have been swimming in Earth's oceans for over **400 million years** — that's older than **trees**, older than **Saturn's rings**, and older than the **North Star**. They survived **four mass extinctions** that wiped out almost all life on the planet, including the one that **killed the dinosaurs**. While humans have existed for about **300,000 years**, sharks were already ancient when the very **first tree took root**. They are, quite literally, **living fossils older than the ground beneath them**.";

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

export const AnimalFactShark: React.FC<{showFox?: boolean}> = ({showFox = true}) => {
  const frame = useCurrentFrame();

  const profileOpacity = interpolate(frame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const headlineOpacity = interpolate(frame, [4, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const ctaOpacity = interpolate(frame, [14, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ctaPulse = 1 + Math.sin(frame * 0.22) * 0.045;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo animado (líneas topográficas en movimiento) */}
      <AnimatedTopoBackground />

      {/* Tarjeta estilo post de X: perfil arriba -> headline -> video (sin respuesta) */}
      <div
        style={{
          position: 'absolute',
          top: 44,
          left: 20,
          right: 20,
          borderRadius: 24,
          overflow: 'hidden',
          background: '#000',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '18px 24px 12px',
            opacity: profileOpacity,
          }}
        >
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

        <div style={{padding: '4px 24px 16px', opacity: headlineOpacity, textAlign: 'left'}}>
          <span
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: 26,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              color: '#fff',
            }}
          >
            {renderBold(HEADLINE, 700, 900)}
          </span>
        </div>

        <OffthreadVideo
          src={staticFile('shark-fact.mp4')}
          style={{width: '100%', height: 300, objectFit: 'cover', display: 'block'}}
        />
      </div>

      {/* Reactor (zorro) flotando sobre el fondo, chroma key real (secuencia PNG con alfa) */}
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
          justifyContent: 'center',
          gap: 6,
          padding: '10px 16px',
          borderRadius: 32,
          background: '#FF0000',
          border: '3px solid #fff',
          boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 18,
            color: '#fff',
          }}
        >
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
          justifyContent: 'center',
          gap: 6,
          padding: '10px 16px',
          borderRadius: 32,
          background: '#1a1a1a',
          border: '3px solid #fff',
          boxShadow: '0 6px 16px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 18,
            color: '#fff',
          }}
        >
          💬 COMMENT
        </span>
      </div>
    </AbsoluteFill>
  );
};
