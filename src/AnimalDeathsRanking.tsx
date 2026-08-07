import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

// Estilo "Comparison / ranking horizontal" (igual que el video de goleadores del Barça):
// tarjetas que se deslizan de derecha a izquierda, en orden ascendente hasta el #1.
// Ahora con FOTOS REALES (subidas a public/), no emojis.

type Entry = {
  name: string;
  img: string; // foto real en public/
  objPos?: string; // encuadre de la foto dentro del recuadro
  deaths: string; // stat principal (muertes/año)
  cause: string; // stat secundaria (causa/región)
  accent: string; // color de respaldo mientras carga la foto
};

// Orden ascendente por muertes/año (el más letal al final = gran final).
const ENTRIES: Entry[] = [
  {name: 'SHARKS', img: 'pexels-alohaphotostudio-18659794.jpg', objPos: '50% 50%', deaths: '10', cause: 'ATTACKS', accent: '#2f5a6e'},
  {name: 'WOLVES', img: 'pexels-claudia-cdk-454816888-34273912.jpg', objPos: '50% 45%', deaths: '10', cause: 'ATTACKS', accent: '#5a4a3a'},
  {name: 'LIONS', img: 'pexels-luke-seago-20457134-11838539.jpg', objPos: '50% 45%', deaths: '200', cause: 'AFRICA', accent: '#c9962b'},
  {name: 'ELEPHANTS', img: 'pexels-nikolaos-d-nomikos-2151019299-32027837.jpg', objPos: '50% 50%', deaths: '500', cause: 'TRAMPLING', accent: '#7d8a94'},
  {name: 'HIPPOS', img: 'pexels-mate-lakatos-1207338198-24525148.jpg', objPos: '50% 50%', deaths: '500', cause: 'AFRICA', accent: '#8a6d9c'},
  {name: 'CROCODILES', img: 'pexels-ty-nguy-n-1597509210-32725467.jpg', objPos: '55% 60%', deaths: '1,000', cause: 'RIVERS & LAKES', accent: '#4f7a3a'},
  {name: 'SCORPIONS', img: 'pexels-saleh-bakhshiyev-387368045-32642186.jpg', objPos: '45% 45%', deaths: '3,300', cause: 'VENOM', accent: '#b5642b'},
  {name: 'KISSING BUGS', img: 'kissingbug3.jpg', objPos: '50% 50%', deaths: '10,000', cause: 'CHAGAS DISEASE', accent: '#7a4a4a'},
  {name: 'FRESHWATER SNAILS', img: 'pexels-nguy-n-ti-n-th-nh-2150376175-32730629.jpg', objPos: '50% 50%', deaths: '20,000', cause: 'PARASITES', accent: '#7a6a4f'},
  {name: 'DOGS', img: 'pexels-rodrigohanna-7191522.jpg', objPos: '50% 45%', deaths: '59,000', cause: 'RABIES', accent: '#a06a3a'},
  {name: 'SNAKES', img: 'pexels-brandon-benedict-111617359-9736282.jpg', objPos: '50% 50%', deaths: '100,000', cause: 'VENOM', accent: '#4a8a5a'},
  {name: 'HUMANS', img: 'pexels-cottonbro-6559905.jpg', objPos: '50% 40%', deaths: '400,000', cause: 'HOMICIDE', accent: '#8a4a4a'},
  {name: 'MOSQUITOES', img: 'pexels-saeed-saeed-84328029-32946369.jpg', objPos: '50% 40%', deaths: '1,000,000', cause: 'MALARIA & DISEASE', accent: '#5a7a4a'},
];

const CARD_W = 420;
const GAP = 40;
const PITCH = CARD_W + GAP;
const FRAMES_PER_CARD = 52; // ritmo del scroll

const Card: React.FC<{entry: Entry; cardHeight: number}> = ({entry, cardHeight}) => (
  <div
    style={{
      width: CARD_W,
      height: cardHeight,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
    }}
  >
    {/* Foto real + ícono de calavera en la esquina */}
    <div
      style={{
        position: 'relative',
        height: 660,
        borderRadius: 10,
        overflow: 'hidden',
        background: `linear-gradient(160deg, ${entry.accent}, #1b2735)`,
        boxShadow: '0 10px 26px rgba(0,0,0,0.5)',
      }}
    >
      <Img
        src={staticFile(entry.img)}
        style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: entry.objPos ?? '50% 50%'}}
      />
      {/* Sombra inferior para que el nombre respire */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          background: 'linear-gradient(to top, rgba(8,12,20,0.85), rgba(8,12,20,0))',
        }}
      />
      {/* Chip de calavera */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 64,
          height: 64,
          borderRadius: 10,
          background: 'rgba(8,12,20,0.72)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 36,
        }}
      >
        💀
      </div>
    </div>

    {/* Nombre */}
    <div
      style={{
        marginTop: 14,
        background: '#0e1622',
        borderRadius: 8,
        padding: '16px 10px',
        textAlign: 'center',
        color: '#fff',
        fontSize: entry.name.length > 12 ? 38 : 48,
        fontWeight: 900,
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
      }}
    >
      {entry.name}
    </div>

    {/* Stat principal (muertes/año) en barra azul */}
    <div
      style={{
        marginTop: 14,
        background: '#1a5fd0',
        borderRadius: 8,
        padding: '16px 10px 12px',
        textAlign: 'center',
        color: '#fff',
        boxShadow: '0 6px 16px rgba(26,95,208,0.5)',
      }}
    >
      <div style={{fontSize: 68, fontWeight: 900, lineHeight: 1}}>{entry.deaths}</div>
      <div style={{fontSize: 24, fontWeight: 700, opacity: 0.9, marginTop: 6, letterSpacing: '1.5px'}}>DEATHS / YEAR</div>
    </div>

    {/* Ícono + stat secundaria — pegado al borde inferior de la tarjeta */}
    <div style={{marginTop: 'auto', paddingTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{fontSize: 64}}>💀</div>
      <div style={{marginTop: 4, color: '#cdd6e0', fontSize: 30, fontWeight: 800, letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>
        {entry.cause}
      </div>
    </div>
  </div>
);

const LEFT_START = 90; // el tiburón (primera tarjeta) arranca ya colocado aquí, sin fondo vacío
const REVEAL_COUNT = 4; // cuántas tarjetas iniciales se revelan una por una antes del scroll
const REVEAL_STAGGER = 20; // frames entre la aparición de cada tarjeta revelada
const REVEAL_DUR = 20; // frames que tarda cada tarjeta en aparecer (fade + scale)
const REVEAL_PAUSE = 14; // pausa tras la última tarjeta revelada antes de arrancar el carrusel
const SCROLL_START = (REVEAL_COUNT - 1) * REVEAL_STAGGER + REVEAL_DUR + REVEAL_PAUSE;

export const AnimalDeathsRanking: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const rowTop = 16; // tarjetas ocupan casi toda la altura, de arriba a abajo
  const cardHeight = height - rowTop * 2; // el bloque inferior (calavera+causa) queda pegado al borde
  // Antes de SCROLL_START las tarjetas reveladas quedan quietas en su sitio; el scroll solo corre después.
  const scroll = frame < SCROLL_START ? 0 : (frame - SCROLL_START) * (PITCH / FRAMES_PER_CARD);
  const fade = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #24354a 0%, #0c131d 70%)', opacity: fade}}>
      {/* Tira de tarjetas (grandes, llenan la altura como el referente) */}
      {ENTRIES.map((entry, i) => {
        const x = LEFT_START + i * PITCH - scroll;
        // No renderizar las que están muy fuera de pantalla (optimización)
        if (x < -CARD_W - 60 || x > width + 60) return null;

        let cardOpacity = 1;
        let cardScale = 1;
        if (i < REVEAL_COUNT) {
          const revealStart = i * REVEAL_STAGGER;
          cardOpacity = interpolate(frame, [revealStart, revealStart + REVEAL_DUR], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          cardScale = interpolate(frame, [revealStart, revealStart + REVEAL_DUR], [0.85, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
        }

        return (
          <div
            key={entry.name}
            style={{
              position: 'absolute',
              left: x,
              top: rowTop,
              opacity: cardOpacity,
              transform: `scale(${cardScale})`,
              transformOrigin: 'center bottom',
            }}
          >
            <Card entry={entry} cardHeight={cardHeight} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
