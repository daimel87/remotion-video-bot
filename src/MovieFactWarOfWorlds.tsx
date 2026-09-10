import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';

// Mismo formato que MovieFactXMenLogo, con video (no imagen).
// startFrom se mide en frames de la composición (24fps); usamos 3.5s de offset
// para saltar los primeros segundos (tapados por gente pasando en primer plano)
// y quedarnos con el tramo limpio de la persecución, 6s en total.
const COMP_FPS = 24;
const START_FROM = Math.round(3.5 * COMP_FPS);

const HEADLINE =
  "In **War of the Worlds (2005)**, before the first **Tripod** emerges, **the ground is seen rotating** above where it's about to emerge. This is a reference to the original novel, where the **Martians** first emerge by **unscrewing the lid** of their cylinder.";

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

export const MovieFactWarOfWorlds: React.FC<{src?: string}> = ({
  src = 'm2-res_1080p.mp4',
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo difuminado del mismo clip, de borde a borde */}
      <OffthreadVideo
        src={staticFile(src)}
        muted
        startFrom={START_FROM}
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

      {/* Fact arriba, visible desde el frame 0, en su caja oscura redondeada */}
      <div style={{position: 'absolute', top: 34, left: 18, right: 18}}>
        <div
          style={{
            background: 'rgba(0,0,0,0.5)',
            borderRadius: 20,
            padding: '18px 20px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontSize: 34,
              fontWeight: 900,
              lineHeight: 1.24,
              letterSpacing: '-0.01em',
              color: '#fff',
            }}
          >
            {renderBold(HEADLINE, 900, 900)}
          </span>
        </div>
      </div>

      {/* Escena, en el mismo hueco que los otros, espacio libre abajo para agregar el reactor en CapCut */}
      <div style={{position: 'absolute', top: 392, left: 0, right: 0}}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          startFrom={START_FROM}
          style={{width: '100%', height: 452, objectFit: 'cover', objectPosition: '50% 40%', display: 'block'}}
        />
      </div>
    </AbsoluteFill>
  );
};
