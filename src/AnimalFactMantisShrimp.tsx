import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, interpolate} from 'remotion';

// Estilo "documental" (igual que Blue Whale): fondo negro, texto arriba con palabras
// clave resaltadas en colores, y el clip abajo llenando la mitad inferior.

const BLUE = '#3aa0ff';
const YELLOW = '#FFD23F';
const RED = '#FF3B6B';
const WHITE = '#ffffff';

type Seg = {t: string; c: string};
const SEGMENTS: Seg[] = [
  {t: 'The ', c: WHITE},
  {t: 'mantis shrimp', c: BLUE},
  {t: ' throws the ', c: WHITE},
  {t: 'fastest punch on Earth', c: YELLOW},
  {t: ' — accelerating like a bullet from a gun. It hits so fast it boils the water, creating a flash as hot as the ', c: WHITE},
  {t: 'surface of the sun', c: RED},
  {t: '. It can smash crab shells and even break aquarium glass. And its eyes see ', c: WHITE},
  {t: '16 colors', c: YELLOW},
  {t: ' — we only see 3.', c: WHITE},
];

const VerifiedBadge: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{flexShrink: 0}}>
    <path
      fill="#3aa0ff"
      d="M12 1.5l2.4 2.1 3.1-.6 1 3 2.9 1.3-.6 3.1 2.1 2.4-2.1 2.4.6 3.1-2.9 1.3-1 3-3.1-.6L12 22.5l-2.4-2.1-3.1.6-1-3-2.9-1.3.6-3.1L1.1 12l2.1-2.4-.6-3.1 2.9-1.3 1-3 3.1.6L12 1.5z"
    />
    <path fill="#fff" d="M9.8 15.3l-3-3 1.2-1.2 1.8 1.8 4.2-4.2 1.2 1.2z" />
  </svg>
);

export const AnimalFactMantisShrimp: React.FC<{src?: string; brand?: string; handle?: string}> = ({
  src = 'mantis-shrimp-fact.mp4',
  brand = 'Animal Facts',
  handle = '@AnimalFactsReax',
}) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 120], [1.02, 1.1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Header de marca (sin zorro) */}
      <div
        style={{
          position: 'absolute',
          top: 34,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
            background: '#fff',
            color: '#000',
            fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            letterSpacing: '-1px',
          }}
        >
          AF
        </div>
        <span style={{color: '#fff', fontWeight: 800, fontSize: 20, fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.5px'}}>
          {brand}
        </span>
        <VerifiedBadge />
        <span style={{color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Helvetica, Arial, sans-serif'}}>{handle}</span>
      </div>

      {/* Texto con palabras resaltadas (fijo desde el frame 0) */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 28,
          right: 28,
          textAlign: 'left',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 32,
          lineHeight: 1.24,
          letterSpacing: '-0.01em',
        }}
      >
        {SEGMENTS.map((s, i) => (
          <span key={i} style={{color: s.c}}>
            {s.t}
          </span>
        ))}
      </div>

      {/* Clip abajo llenando la mitad inferior */}
      <div style={{position: 'absolute', top: 388, left: 0, width: 720, height: 814, overflow: 'hidden', backgroundColor: '#000'}}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '46% 66%', transform: `scale(${zoom})`}}
        />
      </div>
    </AbsoluteFill>
  );
};
