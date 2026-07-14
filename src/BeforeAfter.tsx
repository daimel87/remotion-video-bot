import {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
} from 'remotion';

// ---- Fuente Komika Axis ----
const FONT = 'KomikaAxis';
const useKomikaFont = () => {
  const [handle] = useState(() => delayRender('komika-axis'));
  useEffect(() => {
    const f = new FontFace(FONT, `url(${staticFile('fonts/KomikaAxis.ttf')}) format('truetype')`);
    f.load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
};

// Comp 720x1280, 30fps. 5 animales x 4s = 600 frames = 20s.
// SIN audio: el usuario le pone el sonido trending en la app de YouTube.
const SEG = 120; // frames por animal
const BABY = 50; // frames del bebé
const ADULT = SEG - BABY; // 70 frames del adulto

type Animal = {
  name: string;
  emoji: string;
  baby: string;
  adult: string;
  babyX: number;
  adultX: number;
};

const ANIMALS: Animal[] = [
  {name: 'LION', emoji: '🦁', baby: 'ba-lion-baby', adult: 'ba-lion-adult', babyX: 50, adultX: 50},
  {name: 'TIGER', emoji: '🐯', baby: 'ba-tiger-baby', adult: 'ba-tiger-adult', babyX: 50, adultX: 45},
  {name: 'CROCODILE', emoji: '🐊', baby: 'ba-croc-baby', adult: 'ba-croc-adult', babyX: 50, adultX: 45},
  {name: 'ELEPHANT', emoji: '🐘', baby: 'ba-elephant-baby', adult: 'ba-elephant-adult', babyX: 40, adultX: 50},
  {name: 'WILD BOAR', emoji: '🐗', baby: 'ba-boar-baby', adult: 'ba-boar-adult', babyX: 50, adultX: 50},
];

// Una toma (bebé o adulto), recorte 9:16 enfocando la cabeza + punch de zoom.
const Shot: React.FC<{src: string; objX: number; off: number; dur: number; punch: boolean}> = ({
  src,
  objX,
  off,
  dur,
  punch,
}) => {
  const frame = useCurrentFrame();
  const startFrom = Math.round(off * 30);
  // El adulto entra con un "punch" (de grande a normal); el bebé un zoom lento.
  const scale = punch
    ? interpolate(frame, [0, 6], [1.18, 1.04], {extrapolateRight: 'clamp'})
    : interpolate(frame, [0, dur], [1.0, 1.06], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(`${src}.mp4`)}
        startFrom={startFrom}
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${objX}% 50%`,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

// Etiqueta (nombre del animal + tag BABY/ADULT).
const Label: React.FC<{name: string; emoji: string; tag: string; hot?: boolean}> = ({
  name,
  emoji,
  tag,
  hot,
}) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 4], [0.7, 1], {extrapolateRight: 'clamp', extrapolateLeft: 'clamp'});
  return (
    <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', transform: `scale(${pop})`}}>
      <div
        style={{
          fontFamily: `${FONT}, sans-serif`,
          fontSize: 68,
          color: '#fff',
          WebkitTextStroke: '9px #000',
          paintOrder: 'stroke fill',
          textShadow: '0 6px 14px rgba(0,0,0,0.7)',
          lineHeight: 1,
        }}
      >
        {emoji} {name}
      </div>
      <div
        style={{
          marginTop: 10,
          display: 'inline-block',
          fontFamily: `${FONT}, sans-serif`,
          fontSize: 40,
          color: hot ? '#fff' : '#111',
          background: hot ? '#E01111' : '#FFE01A',
          padding: '6px 22px',
          borderRadius: 40,
          border: '4px solid #000',
          transform: 'rotate(-3deg)',
        }}
      >
        {tag}
      </div>
    </div>
  );
};

const Flash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 4, at, at + 7], [0, 0.9, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (o <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        background: 'radial-gradient(circle at 50% 45%, #fff 0%, #fff 45%, rgba(255,255,255,0.4) 100%)',
        opacity: o,
        mixBlendMode: 'screen',
      }}
    />
  );
};

// Hook grande al inicio.
const IntroHook: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, 48, 56], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (opacity <= 0) return null;
  return (
    <div style={{position: 'absolute', top: '38%', left: 20, right: 20, textAlign: 'center', opacity}}>
      <span
        style={{
          fontFamily: `${FONT}, sans-serif`,
          fontSize: 90,
          color: '#FFE01A',
          textTransform: 'uppercase',
          WebkitTextStroke: '11px #000',
          paintOrder: 'stroke fill',
          textShadow: '0 8px 18px rgba(0,0,0,0.8)',
          lineHeight: 1.05,
        }}
      >
        {'Cute now…\nMONSTER later 😱'}
      </span>
    </div>
  );
};

export const BeforeAfter: React.FC = () => {
  useKomikaFont();

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {ANIMALS.map((a, i) => {
        const base = i * SEG;
        return (
          <React.Fragment key={a.name}>
            {/* Bebé */}
            <Sequence from={base} durationInFrames={BABY}>
              <Shot src={a.baby} objX={a.babyX} off={1} dur={BABY} punch={false} />
              <Label name={a.name} emoji={a.emoji} tag="BABY 🥺" />
            </Sequence>
            {/* Adulto */}
            <Sequence from={base + BABY} durationInFrames={ADULT}>
              <Shot src={a.adult} objX={a.adultX} off={1} dur={ADULT} punch />
              <Label name={a.name} emoji={a.emoji} tag="ADULT 😱" hot />
            </Sequence>
          </React.Fragment>
        );
      })}

      {/* Viñeta para que el texto lea */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Flash en cada revelación (bebé->adulto) y cada cambio de animal */}
      {ANIMALS.map((_, i) => (
        <React.Fragment key={i}>
          <Flash at={i * SEG + BABY} />
          {i > 0 && <Flash at={i * SEG} />}
        </React.Fragment>
      ))}

      {/* Hook de apertura sobre el primer bebé */}
      <Sequence from={0} durationInFrames={56}>
        <IntroHook />
      </Sequence>

      {/* Marca de agua sutil del canal */}
      <Img
        src={staticFile('assets/fox-avatar.png')}
        style={{position: 'absolute', bottom: 26, right: 22, width: 66, height: 66, borderRadius: '50%', opacity: 0.85, border: '2px solid rgba(255,255,255,0.6)'}}
      />
    </AbsoluteFill>
  );
};
