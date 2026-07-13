import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';

const HEADLINE =
  "When a hamster melts into a **flat little pancake** like this, it's not being lazy — it's the ultimate sign of **trust**. Hamsters only splay out completely flat when they feel **100% safe**. In the wild, letting your guard down like this could get you eaten. So a **pancake hamster** is really saying one thing: **I feel totally safe with you.** 🐹";

const QUOTE = "Not him turning into a **furry pancake** 🐹🫠";

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

// Flecha roja que apunta hacia la izquierda (hacia el hámster aplanado).
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

export const AnimalFactHamster: React.FC = () => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const profileOpacity = interpolate(frame, [8, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const quoteOpacity = interpolate(frame, [16, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Flecha roja: aparece en el segundo 1 (frame 24), entra desde la derecha y
  // luego oscila (se mueve) señalando la posición aplanada del hámster.
  const ARROW_START = 24; // segundo 1 a 24fps
  const arrowOpacity = interpolate(frame, [ARROW_START, ARROW_START + 5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const slideIn = interpolate(frame, [ARROW_START, ARROW_START + 10], [110, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const wiggle = frame > ARROW_START + 10 ? Math.sin((frame - ARROW_START - 10) * 0.5) * 14 : 0;
  const arrowX = slideIn + wiggle;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo difuminado del mismo clip */}
      <OffthreadVideo
        src={staticFile('hamster-fact-test.mp4')}
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

      {/* Tarjeta estilo "post viral" */}
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
        <div style={{padding: '24px 24px 16px', opacity: headlineOpacity, textAlign: 'center'}}>
          <span
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: 28,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              color: '#fff',
            }}
          >
            {renderBold(HEADLINE, 700, 900)}
          </span>
        </div>

        {/* Video principal + flecha roja señalando el hámster aplanado */}
        <div style={{position: 'relative', width: '100%', height: 300}}>
          <OffthreadVideo
            src={staticFile('hamster-fact-test.mp4')}
            style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
          />
          <div
            style={{
              position: 'absolute',
              top: '52%',
              right: '10%',
              transform: `translateY(-50%) translateX(${arrowX}px)`,
              opacity: arrowOpacity,
              filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.7))',
            }}
          >
            <RedArrow />
          </div>
        </div>

        <div style={{height: 1, background: 'rgba(255,255,255,0.15)', margin: '0 24px'}} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '14px 24px 6px',
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

        <div style={{padding: '2px 24px 20px', opacity: quoteOpacity}}>
          <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 19, lineHeight: 1.35, color: 'rgba(255,255,255,0.9)'}}>
            {renderBold(QUOTE)}
          </span>
        </div>
      </div>

      {/* Reactor (zorro), debajo del post */}
      <div
        style={{
          position: 'absolute',
          bottom: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 380,
          height: 380,
          borderRadius: 20,
          overflow: 'hidden',
          border: '3px solid rgba(255,255,255,0.85)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        }}
      >
        <OffthreadVideo
          src={staticFile('fox-reaction-test.mp4')}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
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
