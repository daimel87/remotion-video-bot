import {useEffect, useState} from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
  delayRender,
  continueRender,
} from 'remotion';

// ---- Fuente Komika Axis (estilo caption viral) ----
const FONT = 'KomikaAxis';
const useKomikaFont = () => {
  const [handle] = useState(() => delayRender('komika-axis'));
  useEffect(() => {
    const f = new FontFace(
      FONT,
      `url(${staticFile('fonts/KomikaAxis.ttf')}) format('truetype')`
    );
    f.load()
      .then((loaded) => {
        document.fonts.add(loaded);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [handle]);
};

// Comp full-screen 720x1280, 24fps. VO (sin silencios) ~27.9s -> 670 frames.
const FPS = 24;
const SRC_FPS = 30; // los clips se re-encodearon a 30fps
const CUT = 67; // frames por toma (~2.8s) -> 10 tomas = 670

// 10 tomas: 5 clips usados 2 veces con offset distinto (para variar).
// objX = posición horizontal de la CABEZA (%) para el recorte 9:16.
const SHOTS: {src: string; off: number; objX: number}[] = [
  {src: 'komodo-5', off: 3, objX: 50}, // cara/boca (arranque fuerte)
  {src: 'komodo-1', off: 2, objX: 72},
  {src: 'komodo-3', off: 4, objX: 68},
  {src: 'komodo-2', off: 6, objX: 68},
  {src: 'komodo-4', off: 3, objX: 52},
  {src: 'komodo-5', off: 7, objX: 50},
  {src: 'komodo-1', off: 7, objX: 80},
  {src: 'komodo-3', off: 9, objX: 32},
  {src: 'komodo-2', off: 11, objX: 60},
  {src: 'komodo-4', off: 8, objX: 45},
];

// Palabras resaltadas en amarillo (el "golpe").
const HIGHLIGHT = new Set([
  'DRAGON',
  'VENOM',
  'BLOOD',
  'BLEEDS',
  'BUFFALO',
  'WEEKS',
  'EIGHTY',
  'PERCENT',
  'EAT',
  'EATEN',
]);

// Guion partido en frases, ancladas a los timestamps de TurboScribe mapeados
// al audio sin silencios (validados contra los cortes detectados). Así el
// error no se acumula y el final ya no se corre.
const SEGMENTS: {start: number; end: number; text: string}[] = [
  {start: 0.2, end: 3.54, text: 'This is the closest thing to a real dragon'},
  {start: 3.84, end: 8.01, text: "The Komodo's bite is full of venom that stops blood from clotting"},
  {start: 8.16, end: 10.44, text: 'its prey just bleeds out'},
  {start: 10.75, end: 17.14, text: 'It takes down buffalo ten times its size then follows them for weeks until they drop'},
  {start: 17.446, end: 21.33, text: 'It eats eighty percent of its body weight in one meal'},
  {start: 21.619, end: 25.51, text: 'Even its babies hide in trees so their own parents don’t eat them'},
  {start: 25.812, end: 27.9, text: 'Would you get close to one?'},
];

const LEAD = 1; // frames de adelanto para que golpee con el sonido

type Word = {startF: number; endF: number; word: string};
const buildWords = (): Word[] => {
  const out: Word[] = [];
  for (const seg of SEGMENTS) {
    const words = seg.text.split(' ');
    const segFrames = (seg.end - seg.start) * FPS;
    const weights = words.map((w) => Math.max(2, w.replace(/[^A-Za-z]/g, '').length));
    const total = weights.reduce((a, b) => a + b, 0);
    let cursor = seg.start * FPS;
    words.forEach((word, i) => {
      const dur = (segFrames * weights[i]) / total;
      out.push({startF: cursor - LEAD, endF: cursor + dur - LEAD, word});
      cursor += dur;
    });
  }
  return out;
};
const WORDS = buildWords();

const DynamicCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const active = WORDS.find((w) => frame >= w.startF && frame < w.endF);
  if (!active) return null;

  const local = frame - active.startF;
  const scale = interpolate(local, [0, 2, 3], [0.72, 1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(local, [0, 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const clean = active.word.replace(/[^A-Za-z]/g, '').toUpperCase();
  const isHot = HIGHLIGHT.has(clean);
  const display = active.word.replace(/[^A-Za-z?’']/g, '');

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `translateY(-50%) scale(${scale})`,
      }}
    >
      <span
        style={{
          fontFamily: `${FONT}, "Arial Black", sans-serif`,
          fontSize: 100,
          lineHeight: 1,
          color: isHot ? '#FFE01A' : '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
          WebkitTextStroke: '10px #000',
          paintOrder: 'stroke fill',
          textShadow: '0 8px 18px rgba(0,0,0,0.65)',
        }}
      >
        {display}
      </span>
    </div>
  );
};

// Flash blanco de transición entre tomas.
const LightFlash: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 4, at, at + 6], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (o <= 0) return null;
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 50% 45%, #ffffff 0%, #fff 40%, rgba(255,255,255,0.4) 100%)',
        opacity: o,
        mixBlendMode: 'screen',
      }}
    />
  );
};

// Toma: recorte 9:16 (cover) enfocando la cabeza (objX) + zoom lento.
const Shot: React.FC<{src: string; off: number; objX: number}> = ({src, off, objX}) => {
  const frame = useCurrentFrame();
  const startFrom = Math.round(off * SRC_FPS);
  const zoom = interpolate(frame, [0, CUT], [1.0, 1.07], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{backgroundColor: '#000', overflow: 'hidden'}}>
      <OffthreadVideo
        src={staticFile(`${src}.mp4`)}
        startFrom={startFrom}
        muted
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${objX}% 50%`,
          transform: `scale(${zoom})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const KomodoDragon: React.FC = () => {
  const frame = useCurrentFrame();
  useKomikaFont();

  // Pico (like salta): momento "bleeds out" ~seg 8.5.
  const PEAK = 200;
  const likeBase = interpolate(frame, [8, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const jump =
    frame > PEAK && frame < PEAK + 40
      ? Math.sin((frame - PEAK) * 0.35) * Math.max(0, 1 - (frame - PEAK) / 40)
      : 0;
  const likeScale = 1 + jump * 0.35;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Voz + música de fondo */}
      <Audio src={staticFile('komodo-vo.wav')} />
      <Audio src={staticFile('mongoose-music.mp3')} volume={0.16} />

      {/* 10 tomas en secuencia */}
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={i * CUT} durationInFrames={CUT}>
          <Shot src={s.src} off={s.off} objX={s.objX} />
        </Sequence>
      ))}

      {/* Viñeta para que lea el texto */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Flash entre tomas */}
      {SHOTS.slice(1).map((_, i) => (
        <LightFlash key={i} at={(i + 1) * CUT} />
      ))}

      {/* Subtítulos dinámicos */}
      <DynamicCaptions />

      {/* Botón de like saltando en el pico */}
      <Img
        src={staticFile('assets/pngtree-like-button-for-youtube-vector-png-image_16285919.png')}
        style={{
          position: 'absolute',
          bottom: 40,
          right: -6,
          width: 200,
          opacity: likeBase,
          transform: `scale(${likeScale})`,
          transformOrigin: 'bottom right',
          filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.6))',
        }}
      />
    </AbsoluteFill>
  );
};
