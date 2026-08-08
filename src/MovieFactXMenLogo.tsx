import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';

// Estilo "Spoody": fondo difuminado del mismo clip llenando toda la pantalla,
// tarjeta tipo post de X encima, escena nítida ocupando el máximo espacio
// posible dentro de la tarjeta. Sin zorro reactor (canal/proyecto distinto).

const HEADLINE =
  "After the **20th Century Fox** logo fades to black at the start of **X-Men (2000)**, **the X** stays visible for **less than a second** before it disappears. It happens again in **X-Men 2 (2003)** and **X-Men: The Last Stand (2006)**.";

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

export const MovieFactXMenLogo: React.FC<{
  src?: string;
  brand?: string;
  handle?: string;
}> = ({src = 'xmen-logo-fact.mp4', brand = 'Movie Easter Eggs', handle = '@MovieEasterEggs'}) => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const profileOpacity = interpolate(frame, [6, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // El clip original dura 12s; se reproduce a 2x para caber en 6s.
  // Aviso que aparece justo cuando la X fantasma queda visible tras el fundido a negro (~5.4-5.8s ya acelerado).
  const calloutOpacity = interpolate(frame, [127, 132, 144], [0, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const calloutPulse = 1 + Math.sin(frame * 0.5) * 0.05;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo difuminado del mismo clip, como el cuarto borroso de Spoody detrás del post */}
      <OffthreadVideo
        src={staticFile(src)}
        muted
        playbackRate={2}
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

      {/* Tarjeta estilo post de X: perfil -> headline -> escena (lo más grande posible) */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 16,
          right: 16,
          borderRadius: 24,
          overflow: 'hidden',
          background: '#000',
          border: '2px solid rgba(255,255,255,0.85)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '16px 22px 10px', opacity: profileOpacity}}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '2px solid rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🎬
          </div>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span style={{color: '#fff', fontWeight: 800, fontSize: 17, fontFamily: 'Helvetica, Arial, sans-serif'}}>
                {brand}
              </span>
              <VerifiedBadge />
            </div>
            <div style={{color: 'rgba(255,255,255,0.55)', fontSize: 14, fontFamily: 'Helvetica, Arial, sans-serif'}}>
              {handle}
            </div>
          </div>
        </div>

        <div style={{padding: '2px 22px 14px', opacity: headlineOpacity, textAlign: 'left'}}>
          <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 20, lineHeight: 1.3, letterSpacing: '-0.01em', color: '#fff'}}>
            {renderBold(HEADLINE, 700, 900)}
          </span>
        </div>

        {/* Escena nítida, de borde a borde dentro de la tarjeta y con la mayor altura posible
            sin recortar la X del logo (que queda centrada). */}
        <div style={{position: 'relative', width: '100%'}}>
          <OffthreadVideo
            src={staticFile(src)}
            muted
            playbackRate={2}
            style={{width: '100%', height: 480, objectFit: 'cover', objectPosition: '50% 48%', display: 'block'}}
          />

          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 18,
              transform: `translateX(-50%) scale(${calloutPulse})`,
              opacity: calloutOpacity,
              background: 'rgba(0,0,0,0.75)',
              border: '2px solid #FF3B3B',
              borderRadius: 999,
              padding: '8px 18px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{fontFamily: '"Arial Black", Helvetica, Arial, sans-serif', fontWeight: 900, fontSize: 20, color: '#fff'}}>
              👀 THE X STAYS UP
            </span>
          </div>
        </div>
      </div>

      {/* Botón SUBSCRIBE (izquierda) */}
      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: 14,
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
          bottom: 90,
          right: 14,
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
