import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import type {DeathEntry} from '../deathsData';

// Paleta NUEVA (distinta al azul/teal del original): carbón + oro + carmesí.
const BG = '#17131f';
const GOLD = '#e0b64c';
const CRIMSON = '#b23a48';
const TEXT = '#f4efe6';

export const DeathCard: React.FC<DeathEntry> = ({name, knownFor, date, age, cause, photo}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const scale = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 120}});
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(enter, [0, 1], [40, 0]) * scale;
  const opacity = enter * exit;

  return (
    <AbsoluteFill style={{backgroundColor: BG, justifyContent: 'center', alignItems: 'center', fontFamily: 'Georgia, serif'}}>
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, rgba(224,182,76,0.08) 0%, rgba(0,0,0,0) 60%)',
        }}
      />
      <div style={{opacity, transform: `translateY(${y}px)`, textAlign: 'center', maxWidth: 1200 * scale}}>
        {/* Conocido por */}
        <div style={{fontSize: 30 * scale, letterSpacing: 4 * scale, color: GOLD, textTransform: 'uppercase', marginBottom: 24 * scale}}>
          {knownFor}
        </div>

        {/* Foto */}
        <div
          style={{
            width: 420 * scale,
            height: 420 * scale,
            margin: '0 auto',
            borderRadius: 18 * scale,
            overflow: 'hidden',
            border: `${4 * scale}px solid ${GOLD}`,
            boxShadow: `0 0 40px rgba(224,182,76,0.35)`,
            background: '#2a2436',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{position: 'absolute', fontSize: 200 * scale, fontWeight: 900, color: '#5a5168'}}>{name[0]}</span>
          {photo ? (
            // <img> normal (no Remotion Img) para que una foto faltante no rompa el render
            <img
              src={staticFile(photo)}
              style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
            />
          ) : null}
        </div>

        {/* Nombre */}
        <div style={{fontSize: 78 * scale, fontWeight: 700, color: TEXT, marginTop: 28 * scale, letterSpacing: 1 * scale}}>
          {name}
        </div>

        {/* Fecha */}
        <div style={{fontSize: 34 * scale, color: '#b9b2a4', marginTop: 6 * scale}}>🕊️ {date}</div>

        {/* Fila: edad + causa */}
        <div style={{display: 'flex', gap: 20 * scale, justifyContent: 'center', alignItems: 'center', marginTop: 28 * scale}}>
          <div
            style={{
              fontSize: 30 * scale,
              fontWeight: 700,
              color: BG,
              background: GOLD,
              padding: `${8 * scale}px ${22 * scale}px`,
              borderRadius: 8 * scale,
              letterSpacing: 1 * scale,
            }}
          >
            AGED {age}
          </div>
          <div
            style={{
              fontSize: 30 * scale,
              fontWeight: 700,
              color: TEXT,
              background: CRIMSON,
              padding: `${8 * scale}px ${22 * scale}px`,
              borderRadius: 8 * scale,
              letterSpacing: 1 * scale,
            }}
          >
            {cause}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
