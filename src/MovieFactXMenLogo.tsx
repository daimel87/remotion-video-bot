import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import {ChromaFox} from './ChromaFox';

// Loop de 6s: fact arriba, escena (sin llegar al fundido a negro final para
// que corte limpio en loop), y el zorro reaccionando abajo. Sin post de X
// (sin usuario/handle/perfil).

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

export const MovieFactXMenLogo: React.FC<{src?: string; showFox?: boolean}> = ({
  src = 'xmen-logo-fact.mp4',
  showFox = false,
}) => {
  const frame = useCurrentFrame();

  const headlineOpacity = interpolate(frame, [0, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo difuminado del mismo clip, de borde a borde detrás de todo.
          Se reproduce a 1x y la composición dura 6s, así nunca llega al
          fundido a negro final del clip original (~10.8s) y corta limpio para loopear. */}
      <OffthreadVideo
        src={staticFile(src)}
        muted
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

      {/* Fact arriba, en su caja oscura redondeada (sin post de X, sin usuario) */}
      <div style={{position: 'absolute', top: 40, left: 22, right: 22, opacity: headlineOpacity}}>
        <div
          style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            padding: '20px 22px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: 29,
              fontWeight: 800,
              lineHeight: 1.28,
              letterSpacing: '-0.01em',
              color: '#fff',
            }}
          >
            {renderBold(HEADLINE, 800, 900)}
          </span>
        </div>
      </div>

      {/* Escena, de borde a borde, sin recortar el logo (centrado) */}
      <div style={{position: 'absolute', top: 400, left: 0, right: 0}}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{width: '100%', height: 460, objectFit: 'cover', objectPosition: '50% 48%', display: 'block'}}
        />
      </div>

      {/* Zorro reaccionando, enorme y cortado por el borde inferior */}
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
