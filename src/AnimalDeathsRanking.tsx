import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

// Estilo "Comparison / ranking horizontal" (igual que el video de goleadores del Barça):
// tarjetas que se deslizan de derecha a izquierda, en orden ascendente hasta el #1.
// NOTA: los emojis son PLACEHOLDER de la foto real (el entorno no deja bajar imágenes).

type Entry = {
  name: string;
  emoji: string;
  deaths: string; // stat principal (muertes/año)
  cause: string; // stat secundaria (causa/región)
  accent: string; // color del recuadro de la foto
};

// Orden ascendente por muertes (el más letal al final = gran final).
const ENTRIES: Entry[] = [
  {name: 'LIONS', emoji: '🦁', deaths: '200', cause: 'AFRICA', accent: '#c9962b'},
  {name: 'ELEPHANTS', emoji: '🐘', deaths: '500', cause: 'ASIA & AFRICA', accent: '#7d8a94'},
  {name: 'HIPPOS', emoji: '🦛', deaths: '500', cause: 'AFRICA', accent: '#8a6d9c'},
  {name: 'CROCODILES', emoji: '🐊', deaths: '1,000', cause: 'RIVERS & LAKES', accent: '#4f7a3a'},
  {name: 'SCORPIONS', emoji: '🦂', deaths: '3,300', cause: 'VENOM', accent: '#b5642b'},
  {name: 'FRESHWATER SNAILS', emoji: '🐌', deaths: '20,000', cause: 'PARASITES', accent: '#7a6a4f'},
  {name: 'DOGS', emoji: '🐕', deaths: '59,000', cause: 'RABIES', accent: '#a06a3a'},
  {name: 'SNAKES', emoji: '🐍', deaths: '100,000', cause: 'VENOM', accent: '#4a8a5a'},
  {name: 'HUMANS', emoji: '👤', deaths: '400,000', cause: 'HOMICIDE', accent: '#8a4a4a'},
  {name: 'MOSQUITOES', emoji: '🦟', deaths: '1,000,000', cause: 'MALARIA & DISEASE', accent: '#5a7a4a'},
];

const CARD_W = 360;
const GAP = 44;
const PITCH = CARD_W + GAP;
const FRAMES_PER_CARD = 46; // ritmo del scroll

const Card: React.FC<{entry: Entry}> = ({entry}) => (
  <div
    style={{
      width: CARD_W,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
    }}
  >
    {/* Foto (placeholder emoji) + banderita/ícono */}
    <div
      style={{
        position: 'relative',
        height: 300,
        borderRadius: 8,
        overflow: 'hidden',
        background: `linear-gradient(160deg, ${entry.accent}, #1b2735)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 22px rgba(0,0,0,0.45)',
      }}
    >
      <span style={{fontSize: 190, lineHeight: 1}}>{entry.emoji}</span>
      <div style={{position: 'absolute', top: 10, right: 10, fontSize: 34}}>💀</div>
    </div>

    {/* Nombre */}
    <div
      style={{
        marginTop: 10,
        background: '#0e1622',
        borderRadius: 6,
        padding: '10px 8px',
        textAlign: 'center',
        color: '#fff',
        fontSize: entry.name.length > 12 ? 24 : 30,
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
        marginTop: 10,
        background: '#1a5fd0',
        borderRadius: 6,
        padding: '10px 8px 8px',
        textAlign: 'center',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(26,95,208,0.45)',
      }}
    >
      <div style={{fontSize: 40, fontWeight: 900, lineHeight: 1}}>{entry.deaths}</div>
      <div style={{fontSize: 15, fontWeight: 700, opacity: 0.9, marginTop: 4, letterSpacing: '1px'}}>DEATHS / YEAR</div>
    </div>

    {/* Ícono + stat secundaria */}
    <div style={{marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{fontSize: 46}}>💀</div>
      <div style={{marginTop: 4, color: '#cdd6e0', fontSize: 20, fontWeight: 800, letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>
        {entry.cause}
      </div>
    </div>
  </div>
);

export const AnimalDeathsRanking: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const scroll = frame * (PITCH / FRAMES_PER_CARD);
  const rowTop = height / 2 - 330; // centra verticalmente el bloque de tarjetas
  const startX = width - CARD_W - 120; // primera tarjeta entra por la derecha

  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #24354a 0%, #0c131d 70%)'}}>
      {/* Título superior persistente */}
      <div
        style={{
          position: 'absolute',
          top: 34,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
          fontWeight: 900,
          fontSize: 40,
          color: '#fff',
          letterSpacing: '1px',
          textShadow: '0 3px 10px rgba(0,0,0,0.6)',
        }}
      >
        MOST DEADLY ANIMALS <span style={{color: '#ff4d4d'}}>— DEATHS PER YEAR</span>
      </div>

      {/* Tira de tarjetas */}
      {ENTRIES.map((entry, i) => {
        const x = startX + i * PITCH - scroll;
        // No renderizar las que están muy fuera de pantalla (optimización)
        if (x < -CARD_W - 60 || x > width + 60) return null;
        return (
          <div key={entry.name} style={{position: 'absolute', left: x, top: rowTop}}>
            <Card entry={entry} />
          </div>
        );
      })}

      {/* Contador de posición abajo (opcional, estilo del género) */}
      <div
        style={{
          position: 'absolute',
          bottom: 26,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontSize: 18,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '2px',
        }}
      >
        WATCH UNTIL THE END 💀
      </div>
    </AbsoluteFill>
  );
};
