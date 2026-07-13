import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';

const HEADLINE =
  "This tiny shrimp throws the **fastest punch on Earth** — it strikes so fast the water around its claw **boils and flashes with light**. The blow lands with the force of a **.22 caliber bullet**, enough to **shatter aquarium glass** and kill prey **twice its size**. Pound for pound, the **mantis shrimp** hits harder than **any animal alive**. 🥊";

const QUOTE = "Not this little guy being an **underwater heavyweight** 🦐🥊";

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

// Flecha roja apuntando a la izquierda (hacia el camarón).
const RedArrow: React.FC = () => (
  <svg width="130" height="64" viewBox="0 0 130 64">
    <polygon
      points="6,32 44,6 44,20 124,20 124,44 44,44 44,58"
      fill="#FF1A1A"
      stroke="#000"
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

export const AnimalFactMantis: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const profileOpacity = interpolate(frame, [8, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const quoteOpacity = interpolate(frame, [16, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Flecha roja: visible desde el frame 0 (potente desde el inicio), entra desde
  // la derecha y luego oscila señalando el golpe del camarón.
  const ARROW_START = 0;
  const arrowOpacity = interpolate(frame, [ARROW_START, ARROW_START + 4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideIn = interpolate(frame, [ARROW_START, ARROW_START + 10], [110, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wiggle = frame > ARROW_START + 10 ? Math.sin((frame - ARROW_START - 10) * 0.5) * 14 : 0;
  const arrowX = slideIn + wiggle;

  // Botón de suscripción en la franja de separación (visible todo el video).
  const ctaOpacity = interpolate(frame, [18, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ctaPulse = 1 + Math.sin(frame * 0.22) * 0.035;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo difuminado del mismo clip */}
      <OffthreadVideo
        src={staticFile('mantis-fact-test.mp4')}
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(50px) brightness(0.4)',
          transform: 'scale(1.2)',
        }}
      />

      {/* Tarjeta estilo "post viral" arriba */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 16,
          right: 16,
          borderRadius: 24,
          overflow: 'hidden',
          background: '#000',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{padding: '22px 22px 14px', opacity: headlineOpacity, textAlign: 'center'}}>
          <span
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: 26,
              lineHeight: 1.28,
              letterSpacing: '-0.01em',
              color: '#fff',
            }}
          >
            {renderBold(HEADLINE, 700, 900)}
          </span>
        </div>

        {/* Video principal + flecha roja señalando al camarón */}
        <div style={{position: 'relative', width: '100%', height: 270}}>
          <OffthreadVideo
            src={staticFile('mantis-fact-test.mp4')}
            style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
          />
          <div
            style={{
              position: 'absolute',
              top: '58%',
              right: '10%',
              transform: `translateY(-50%) translateX(${arrowX}px)`,
              opacity: arrowOpacity,
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.7))',
            }}
          >
            <RedArrow />
          </div>
        </div>

        <div style={{height: 1, background: 'rgba(255,255,255,0.15)', margin: '0 22px'}} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 22px 6px',
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

        <div style={{padding: '2px 22px 18px', opacity: quoteOpacity}}>
          <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 19, lineHeight: 1.35, color: 'rgba(255,255,255,0.9)'}}>
            {renderBold(QUOTE)}
          </span>
        </div>
      </div>

      {/* Reactor (zorro) a todo lo ancho, estilo Spoody. */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 720,
          height: 500,
          overflow: 'hidden',
          borderTop: '3px solid rgba(255,255,255,0.85)',
        }}
      >
        <OffthreadVideo
          src={staticFile('fox-reactor-16x9.mp4')}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </div>

      {/* Botón de suscripción en la franja de separación (arriba del zorro) */}
      <div
        style={{
          position: 'absolute',
          top: 690,
          left: '50%',
          transform: `translateX(-50%) scale(${ctaPulse})`,
          opacity: ctaOpacity,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 28px',
          borderRadius: 40,
          background: '#FF0000',
          border: '3px solid #fff',
          boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 26,
            color: '#fff',
            letterSpacing: '0.02em',
          }}
        >
          🔔 SUBSCRIBE 🦊
        </span>
      </div>

      <Img
        src={staticFile('assets/pngtree-like-button-for-youtube-vector-png-image_16285919.png')}
        style={{
          position: 'absolute',
          bottom: -50,
          right: -10,
          width: 190,
        }}
      />
    </AbsoluteFill>
  );
};
