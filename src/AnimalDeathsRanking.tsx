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

const CARD_W = 420;
const GAP = 40;
const PITCH = CARD_W + GAP;
const FRAMES_PER_CARD = 52; // ritmo del scroll

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
    {/* Foto (placeholder emoji) + ícono */}
    <div
      style={{
        position: 'relative',
        height: 560,
        borderRadius: 10,
        overflow: 'hidden',
        background: `linear-gradient(160deg, ${entry.accent}, #1b2735)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 26px rgba(0,0,0,0.5)',
      }}
    >
      <span style={{fontSize: 340, lineHeight: 1}}>{entry.emoji}</span>
      <div style={{position: 'absolute', top: 14, right: 16, fontSize: 52}}>💀</div>
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
        fontSize: entry.name.length > 12 ? 32 : 40,
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
      <div style={{fontSize: 60, fontWeight: 900, lineHeight: 1}}>{entry.deaths}</div>
      <div style={{fontSize: 20, fontWeight: 700, opacity: 0.9, marginTop: 6, letterSpacing: '1.5px'}}>DEATHS / YEAR</div>
    </div>

    {/* Ícono + stat secundaria */}
    <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{fontSize: 64}}>💀</div>
      <div style={{marginTop: 6, color: '#cdd6e0', fontSize: 26, fontWeight: 800, letterSpacing: '0.5px', whiteSpace: 'nowrap'}}>
        {entry.cause}
      </div>
    </div>
  </div>
);

export const AnimalDeathsRanking: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const scroll = frame * (PITCH / FRAMES_PER_CARD);
  const rowTop = height / 2 - 440; // tarjetas grandes, casi de arriba a abajo
  const startX = width - CARD_W - 90; // primera tarjeta entra por la derecha

  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #24354a 0%, #0c131d 70%)'}}>
      {/* Tira de tarjetas (grandes, llenan la altura como el referente) */}
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
    </AbsoluteFill>
  );
};
