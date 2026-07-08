import {Img, staticFile} from 'remotion';
import type {DeathEntry} from '../deathsData';

// Paleta nueva (carbón + oro + carmesí)
const PANEL = '#221b2e';
const GOLD = '#e0b64c';
const CRIMSON = '#b23a48';
const TEXT = '#f4efe6';
const DARK = '#17131f';

/** Tarjeta compacta (para una fila que se desplaza). cardW = ancho en px. */
export const DeathCard: React.FC<DeathEntry & {cardW: number}> = ({
  name,
  knownFor,
  date,
  age,
  cause,
  photo,
  cardW,
}) => {
  const s = cardW / 440;
  return (
    <div
      style={{
        width: cardW,
        flexShrink: 0,
        background: PANEL,
        borderRadius: 20 * s,
        borderTop: `${5 * s}px solid ${GOLD}`,
        border: `1px solid rgba(224,182,76,0.2)`,
        overflow: 'hidden',
        boxShadow: '0 14px 44px rgba(0,0,0,0.55)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Foto */}
      <div style={{width: '100%', height: 300 * s, position: 'relative', background: '#2a2436'}}>
        <span
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 150 * s,
            fontWeight: 900,
            color: '#5a5168',
          }}
        >
          {name[0]}
        </span>
        {photo ? (
          <Img
            src={staticFile(photo)}
            style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
          />
        ) : null}
      </div>

      {/* Datos */}
      <div style={{padding: `${20 * s}px ${20 * s}px ${24 * s}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <div style={{fontSize: 19 * s, color: GOLD, letterSpacing: 1.5 * s, textTransform: 'uppercase', fontWeight: 700}}>
          {knownFor}
        </div>
        <div style={{fontSize: 36 * s, fontWeight: 800, color: TEXT, marginTop: 8 * s, lineHeight: 1.1}}>{name}</div>
        <div style={{fontSize: 22 * s, color: '#b9b2a4', marginTop: 8 * s}}>🕊️ {date}</div>
        <div style={{display: 'flex', gap: 12 * s, marginTop: 18 * s, alignItems: 'center'}}>
          <div style={{fontSize: 22 * s, fontWeight: 800, color: DARK, background: GOLD, padding: `${7 * s}px ${16 * s}px`, borderRadius: 7 * s}}>
            AGED {age}
          </div>
          <div style={{fontSize: 22 * s, fontWeight: 800, color: TEXT, background: CRIMSON, padding: `${7 * s}px ${16 * s}px`, borderRadius: 7 * s}}>
            🪦 {cause}
          </div>
        </div>
      </div>
    </div>
  );
};
