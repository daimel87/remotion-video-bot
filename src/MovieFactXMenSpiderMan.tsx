import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';

// Loop de 6s: fact arriba, escena abajo (clip ya recortado a los 6s del "prank"
// de Spider-Man en el rodaje de X-Men, sin el header/caption de la cuenta original).

const HEADLINE =
  "In **X-Men (2000)**, during the filming of the final battle scene when X-Men fought **Magneto**, **Spider-Man's** stunt actor **accidentally ran into the wrong movie filming hangar**.";

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

export const MovieFactXMenSpiderMan: React.FC<{src?: string}> = ({src = 'xmen-spiderman-mistake.mp4'}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo difuminado del mismo clip, de borde a borde detrás de todo */}
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

      {/* Escena, de borde a borde, mismo hueco que el resto de la serie */}
      <div style={{position: 'absolute', top: 392, left: 0, right: 0}}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{width: '100%', height: 452, objectFit: 'cover', objectPosition: '50% 40%', display: 'block'}}
        />
      </div>
    </AbsoluteFill>
  );
};
