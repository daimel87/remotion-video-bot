import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {ARCHIVO_BLACK_DATA_URI} from './archivoBlackFont';

// "Arial Black" no existe en el servidor de render (Linux headless): sin ella instalada,
// el navegador cae a una fuente de reemplazo distinta en cada proceso, dando tarjetas con
// tipografías inconsistentes entre sí. Se usa Archivo Black embebida como data URI (no vía
// staticFile) porque en renders largos, cada pestaña nueva del navegador vuelve a cargar el
// bundle y a pedir la fuente al servidor estático local, lo que causaba timeouts intermitentes
// de delayRender a mitad del render.
const fontFamily = 'ArchivoBlackLocal';
loadFont({
  family: fontFamily,
  url: ARCHIVO_BLACK_DATA_URI,
  weight: '400',
  format: 'woff2',
});

// Mismo formato "Comparison / ranking horizontal" que AnimalDeathsRanking,
// adaptado a "Cat Breeds Ranked by IQ": icono de cerebro en vez de calavera,
// barra de IQ SCORE en vez de DEATHS/YEAR, trait en vez de cause.

type Entry = {
  name: string;
  img: string; // foto real en public/
  objPos?: string;
  iq: string; // stat principal (IQ score)
  trait: string; // stat secundaria (rasgo de inteligencia)
  accent: string;
};

// Orden ascendente por IQ (la raza más lista al final = gran final).
const ENTRIES: Entry[] = [
  {name: 'PERSIAN', img: 'persian-cat.jpg', objPos: '50% 40%', iq: '62', trait: 'CALM & CHILL', accent: '#8a6d9c'},
  {name: 'RAGDOLL', img: 'ragdoll-cat.jpg', objPos: '50% 40%', iq: '68', trait: 'PEOPLE PLEASER', accent: '#5a7a9c'},
  {name: 'MAINE COON', img: 'mainecoon-cat.jpg', objPos: '50% 40%', iq: '74', trait: 'DOG-LIKE MIND', accent: '#7d8a94'},
  {name: 'BRITISH SHORTHAIR', img: 'britishshorthair-cat.jpg', objPos: '50% 40%', iq: '78', trait: 'INDEPENDENT', accent: '#5a6a7a'},
  {name: 'AMERICAN SHORTHAIR', img: 'americanshorthair-cat.jpg', objPos: '50% 40%', iq: '81', trait: 'QUICK LEARNER', accent: '#a06a3a'},
  {name: 'RUSSIAN BLUE', img: 'russianblue-cat.jpg', objPos: '50% 40%', iq: '84', trait: 'OBSERVANT', accent: '#4f6a7a'},
  {name: 'DEVON REX', img: 'devonrex-cat.jpg', objPos: '50% 40%', iq: '87', trait: 'ESCAPE ARTIST', accent: '#7a4a4a'},
  {name: 'BURMESE', img: 'burmese-cat.jpg', objPos: '50% 40%', iq: '89', trait: 'SOCIAL GENIUS', accent: '#5a4a3a'},
  {name: 'CORNISH REX', img: 'cornishrex-cat.jpg', objPos: '50% 40%', iq: '91', trait: 'TRICK MASTER', accent: '#b5642b'},
  {name: 'BENGAL', img: 'bengal-cat.jpg', objPos: '50% 40%', iq: '94', trait: 'PROBLEM SOLVER', accent: '#c9962b'},
  {name: 'SIAMESE', img: 'siamese-cat.jpg', objPos: '50% 40%', iq: '97', trait: 'TALKS BACK', accent: '#2f5a6e'},
  {name: 'ABYSSINIAN', img: 'abyssinian-cat.jpg', objPos: '50% 40%', iq: '100', trait: 'PUZZLE MASTER', accent: '#4f7a3a'},
];

const CARD_W = 420;
const GAP = 40;
const PITCH = CARD_W + GAP;

const Card: React.FC<{entry: Entry; cardHeight: number}> = ({entry, cardHeight}) => (
  <div
    style={{
      width: CARD_W,
      height: cardHeight,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      fontFamily,
    }}
  >
    {/* Foto real + ícono de cerebro en la esquina */}
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
        🧠
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
        fontSize: entry.name.length > 14 ? 30 : entry.name.length > 10 ? 38 : 48,
        fontWeight: 900,
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap',
      }}
    >
      {entry.name}
    </div>

    {/* Stat principal (IQ score) en barra morada */}
    <div
      style={{
        marginTop: 14,
        background: '#7a2fd0',
        borderRadius: 8,
        padding: '16px 10px 12px',
        textAlign: 'center',
        color: '#fff',
        boxShadow: '0 6px 16px rgba(122,47,208,0.5)',
      }}
    >
      <div style={{fontSize: 68, fontWeight: 900, lineHeight: 1}}>{entry.iq}</div>
      <div style={{fontSize: 24, fontWeight: 700, opacity: 0.9, marginTop: 6, letterSpacing: '1.5px'}}>IQ SCORE</div>
    </div>

    {/* Ícono + rasgo — pegado al borde inferior de la tarjeta */}
    <div style={{marginTop: 'auto', paddingTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{fontSize: 64}}>🧠</div>
      <div style={{marginTop: 4, color: '#cdd6e0', fontSize: 30, fontWeight: 800, letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>
        {entry.trait}
      </div>
    </div>
  </div>
);

const LEFT_START = 90;
const REVEAL_COUNT = 4;
const REVEAL_STAGGER = 20;
const REVEAL_DUR = 20;
const REVEAL_PAUSE = 14;
const SCROLL_START = (REVEAL_COUNT - 1) * REVEAL_STAGGER + REVEAL_DUR + REVEAL_PAUSE;
const FINALE_HOLD = 150;

export const CatBreedsIQRanking: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  const rowTop = 16;
  const cardHeight = height - rowTop * 2;

  const scrollEnd = durationInFrames - FINALE_HOLD;
  const centerX = width / 2 - CARD_W / 2;
  const scrollFinal = LEFT_START + (ENTRIES.length - 1) * PITCH - centerX;
  const scroll =
    frame < SCROLL_START
      ? 0
      : interpolate(frame, [SCROLL_START, scrollEnd], [0, scrollFinal], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const fade = interpolate(frame, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #24354a 0%, #0c131d 70%)', opacity: fade}}>
      {ENTRIES.map((entry, i) => {
        const x = LEFT_START + i * PITCH - scroll;
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
