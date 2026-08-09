import {AbsoluteFill, Img, staticFile} from 'remotion';

// Mismo formato que MovieFactSpiderMan/MovieFactXMenLogo, con imagen estática.

const HEADLINE =
  "In **Cars (2006)**, the reason for the yellow stripe on the back of **McQueen** is to indicate that he is a **rookie car** — a rule from **NASCAR**. Even in **Cars 3**, that's the reason why **Jackson Storm** has a yellow stripe behind him as well.";

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

export const MovieFactCars: React.FC<{img?: string}> = ({img = 'cars-scene.png'}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Fondo difuminado de la misma imagen, de borde a borde */}
      <Img
        src={staticFile(img)}
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

      {/* Escena (imagen), en el mismo hueco que el X-Men para que el zorro quepa */}
      <div style={{position: 'absolute', top: 392, left: 0, right: 0}}>
        <Img
          src={staticFile(img)}
          style={{width: '100%', height: 452, objectFit: 'cover', objectPosition: '50% 40%', display: 'block'}}
        />
      </div>
    </AbsoluteFill>
  );
};
