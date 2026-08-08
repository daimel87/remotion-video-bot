import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import {ChromaFox} from './ChromaFox';

// Estilo "Spoody" real (captura de referencia): sin tarjeta con borde blanco,
// los elementos flotan directo sobre el fondo difuminado de pantalla completa:
// reacción arriba -> video con watermark de handle -> perfil del post citado
// -> frase corta -> zorro reaccionando enorme, cortado por el borde inferior.

const HEADLINE =
  "After the **20th Century Fox** logo fades to black at the start of **X-Men (2000)**, **the X** stays visible for **less than a second** before it disappears. It happens again in **X-Men 2 (2003)** and **X-Men: The Last Stand (2006)**.";

const QUOTE = "Bet you never noticed it. 👀🎬";

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
  <svg width="17" height="17" viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      fill="#F5A623"
      d="M12 1.5l2.4 2.1 3.1-.6 1 3 2.9 1.3-.6 3.1 2.1 2.4-2.1 2.4.6 3.1-2.9 1.3-1 3-3.1-.6L12 22.5l-2.4-2.1-3.1.6-1-3-2.9-1.3.6-3.1L1.1 12l2.1-2.4-.6-3.1 2.9-1.3 1-3 3.1.6L12 1.5z"
    />
    <path fill="#fff" d="M9.8 15.3l-3-3 1.2-1.2 1.8 1.8 4.2-4.2 1.2 1.2z" />
  </svg>
);

export const MovieFactXMenLogo: React.FC<{
  src?: string;
  brand?: string;
  handle?: string;
  showFox?: boolean;
}> = ({src = 'xmen-logo-fact.mp4', brand = 'Movie Easter Eggs', handle = '@MovieEasterEggs', showFox = true}) => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const profileOpacity = interpolate(frame, [8, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const quoteOpacity = interpolate(frame, [16, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // El clip original dura 12s; se reproduce a 2x para caber en 6s.
  // Aviso justo cuando la X fantasma queda visible tras el fundido a negro (~5.4-5.8s ya acelerado).
  const calloutOpacity = interpolate(frame, [127, 132, 144], [0, 1, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const calloutPulse = 1 + Math.sin(frame * 0.5) * 0.05;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo difuminado del mismo clip, de borde a borde detrás de todo */}
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
          filter: 'blur(55px) brightness(0.35)',
          transform: 'scale(1.2)',
        }}
      />

      {/* Reacción arriba, sin caja/borde, flotando sobre el fondo */}
      <div style={{position: 'absolute', top: 46, left: 24, right: 24, opacity: headlineOpacity, textAlign: 'center'}}>
        <span
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: 23,
            fontWeight: 800,
            lineHeight: 1.32,
            letterSpacing: '-0.01em',
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {renderBold(HEADLINE, 700, 900)}
        </span>
      </div>

      {/* Escena, de borde a borde, sin recortar la X del logo (centrada) */}
      <div style={{position: 'absolute', top: 372, left: 0, right: 0}}>
        <div style={{position: 'relative', width: '100%'}}>
          <OffthreadVideo
            src={staticFile(src)}
            muted
            playbackRate={2}
            style={{width: '100%', height: 460, objectFit: 'cover', objectPosition: '50% 48%', display: 'block'}}
          />

          {/* Watermark del handle, como @JustSpoody en la captura de referencia */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 12,
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 14,
              color: 'rgba(255,255,255,0.75)',
              textShadow: '0 1px 4px rgba(0,0,0,0.9)',
            }}
          >
            {handle}
          </div>

          <div
            style={{
              position: 'absolute',
              left: '50%',
              bottom: 14,
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

        {/* Perfil del post citado, sin caja, directo sobre el fondo */}
        <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '14px 24px 4px', opacity: profileOpacity}}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#1a1a1a',
              border: '2px solid rgba(255,255,255,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
            }}
          >
            🎬
          </div>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: 6}}>
              <span style={{color: '#fff', fontWeight: 800, fontSize: 16, fontFamily: 'Helvetica, Arial, sans-serif'}}>
                {brand}
              </span>
              <VerifiedBadge />
            </div>
            <div style={{color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: 'Helvetica, Arial, sans-serif'}}>
              {handle}
            </div>
          </div>
        </div>

        <div style={{padding: '2px 24px 0', opacity: quoteOpacity}}>
          <span style={{fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 18, lineHeight: 1.35, color: 'rgba(255,255,255,0.92)', textShadow: '0 1px 6px rgba(0,0,0,0.7)'}}>
            {renderBold(QUOTE)}
          </span>
        </div>
      </div>

      {/* Zorro reaccionando, enorme y cortado por el borde inferior, como Spoody */}
      <div
        style={{
          position: 'absolute',
          bottom: -60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 720,
          height: 720,
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))',
        }}
      >
        {showFox ? <ChromaFox /> : null}
      </div>
    </AbsoluteFill>
  );
};
