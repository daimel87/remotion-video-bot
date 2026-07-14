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

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);

type Animal = {
  name: string;
  emoji: string;
  baby: string;
  adult: string;
  babyX: number;
  adultX: number;
};

const ANIMALS: Animal[] = [
  {name: 'SPIDER', emoji: '🕷️', baby: 'ba-spider-baby', adult: 'ba-spider-adult', babyX: 50, adultX: 50},
  {name: 'LION', emoji: '🦁', baby: 'ba-lion-baby', adult: 'ba-lion-adult', babyX: 50, adultX: 50},
  {name: 'TIGER', emoji: '🐯', baby: 'ba-tiger-baby', adult: 'ba-tiger-adult', babyX: 50, adultX: 45},
  {name: 'CROCODILE', emoji: '🐊', baby: 'ba-croc-baby', adult: 'ba-croc-adult', babyX: 50, adultX: 45},
  {name: 'ELEPHANT', emoji: '🐘', baby: 'ba-elephant-baby', adult: 'ba-elephant-adult', babyX: 40, adultX: 50},
  {name: 'WILD BOAR', emoji: '🐗', baby: 'ba-boar-baby', adult: 'ba-boar-adult', babyX: 50, adultX: 50},
];

// Timeline anclada al SRT de Buzz (audio "evolve_animals", sin silencios).
// Segmento 1 (0-6.0s) se parte en recap-bebés + recap-adultos.
const RECAP_BABY_END = sec(1.63); // "These adorable babies"
const RECAP_ADULT_END = sec(6.0); // "...grow into...Earth"

// Uno-a-uno: inicios de cada animal = inicios reales de frase en el SRT.
const ONE_STARTS = [sec(6.0), sec(8.5), sec(13.0), sec(16.0), sec(20.5), sec(24.0)];
const CLOSE_START = sec(27.5); // "They all start tiny"
const TAIL_START = sec(29.0); // último segmento del SRT ("What?")
const TOTAL = sec(29.6);

// ---- Subtítulos palabra por palabra, anclados a los tiempos EXACTOS de Buzz ----
const HIGHLIGHT = new Set([
  'DEADLIEST',
  'VENOMOUS',
  'LION',
  'TIGER',
  'CROCODILE',
  'ELEPHANT',
  'BOARS',
  'TINY',
]);

const SEGMENTS: {start: number; end: number; text: string}[] = [
  {start: 0.0, end: 6.0, text: 'These adorable babies grow into some of the deadliest animals on earth'},
  {start: 6.0, end: 8.5, text: 'Little spider a venomous hunter'},
  {start: 8.5, end: 13.0, text: 'This fuzzy cub becomes a 200 kilo lion'},
  {start: 13.0, end: 16.0, text: 'This kitten grows into a deadly tiger'},
  {start: 16.0, end: 20.5, text: 'This tiny hatchling a one ton crocodile'},
  {start: 20.5, end: 24.0, text: 'This calf turns into a six ton elephant'},
  {start: 24.0, end: 27.5, text: 'And these piglets razor tossed boars'},
  {start: 27.5, end: 29.0, text: 'They all start tiny'},
  {start: 29.0, end: 29.5, text: 'but'},
];

const LEAD = 1;
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
  const opacity = interpolate(local, [0, 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const clean = active.word.replace(/[^A-Za-z]/g, '').toUpperCase();
  const isHot = HIGHLIGHT.has(clean);
  const display = active.word.replace(/[^A-Za-z?]/g, '');
  if (!display) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '74%',
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
          fontSize: 66,
          lineHeight: 1,
          color: isHot ? '#FFE01A' : '#fff',
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
          WebkitTextStroke: '7px #000',
          paintOrder: 'stroke fill',
          textShadow: '0 6px 14px rgba(0,0,0,0.65)',
        }}
      >
        {display}
      </span>
    </div>
  );
};

// Toma con recorte 9:16 enfocando la cabeza + punch de zoom rápido.
const Shot: React.FC<{src: string; objX: number; off: number; punch?: boolean}> = ({
  src,
  objX,
  off,
  punch,
}) => {
  const frame = useCurrentFrame();
  const startFrom = Math.round(off * 30);
  const scale = punch
    ? interpolate(frame, [0, 5], [1.16, 1.04], {extrapolateRight: 'clamp'})
    : interpolate(frame, [0, 20], [1.0, 1.05], {extrapolateRight: 'clamp'});
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

const Flash: React.FC<{at: number; strength?: number}> = ({at, strength = 0.85}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 3, at, at + 5], [0, strength, 0], {
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

// Tag "TRANSFORMATION" que aparece al revelar al adulto.
const TransformTag: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 5], [0.6, 1], {extrapolateRight: 'clamp'});
  const opacity = interpolate(frame, [0, 4, 26, 30], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 64,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          fontFamily: `${FONT}, sans-serif`,
          fontSize: 34,
          color: '#fff',
          background: '#E01111',
          padding: '8px 20px',
          borderRadius: 30,
          border: '4px solid #000',
          transform: 'rotate(-2deg)',
          display: 'inline-block',
        }}
      >
        TRANSFORMATION REIGNS 👑
      </span>
    </div>
  );
};

export const BeforeAfter: React.FC = () => {
  useKomikaFont();

  // --- recap rápido de bebés (flash cuts, muy corto y rítmico) ---
  const babyChunk = RECAP_BABY_END / ANIMALS.length;
  // --- recap rápido de adultos ---
  const adultSpan = RECAP_ADULT_END - RECAP_BABY_END;
  const adultChunk = adultSpan / ANIMALS.length;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('evolve-vo.mp3')} />

      {/* RECAP FLASH: bebés ("These adorable babies") */}
      {ANIMALS.map((a, i) => (
        <Sequence key={`rb-${a.name}`} from={Math.round(i * babyChunk)} durationInFrames={Math.round(babyChunk)}>
          <Shot src={a.baby} objX={a.babyX} off={1.5} punch />
        </Sequence>
      ))}

      {/* RECAP FLASH: adultos ("...deadliest animals on Earth") */}
      {ANIMALS.map((a, i) => (
        <Sequence
          key={`ra-${a.name}`}
          from={RECAP_BABY_END + Math.round(i * adultChunk)}
          durationInFrames={Math.round(adultChunk)}
        >
          <Shot src={a.adult} objX={a.adultX} off={2} punch />
        </Sequence>
      ))}

      {/* Flashes rítmicos dentro de los dos recaps (fast pace) */}
      {ANIMALS.map((_, i) => (
        <Flash key={`fb-${i}`} at={Math.round(i * babyChunk)} strength={0.5} />
      ))}
      {ANIMALS.map((_, i) => (
        <Flash key={`fa-${i}`} at={RECAP_BABY_END + Math.round(i * adultChunk)} strength={0.6} />
      ))}

      {/* UNO POR UNO: baby -> flash -> adult (con tag de transformación) */}
      {ANIMALS.map((a, i) => {
        const start = ONE_STARTS[i];
        const end = i < ANIMALS.length - 1 ? ONE_STARTS[i + 1] : CLOSE_START;
        const dur = end - start;
        const babyDur = Math.round(dur * 0.4);
        const adultDur = dur - babyDur;
        return (
          <React.Fragment key={a.name}>
            <Sequence from={start} durationInFrames={babyDur}>
              <Shot src={a.baby} objX={a.babyX} off={1} />
            </Sequence>
            <Sequence from={start + babyDur} durationInFrames={adultDur}>
              <Shot src={a.adult} objX={a.adultX} off={1.5} punch />
              <TransformTag />
            </Sequence>
            <Flash at={start + babyDur} />
            {i > 0 && <Flash at={start} strength={0.7} />}
          </React.Fragment>
        );
      })}

      {/* CIERRE: "They all start tiny" -> recap flash de bebés para cerrar el loop */}
      <Sequence from={CLOSE_START} durationInFrames={TAIL_START - CLOSE_START}>
        {ANIMALS.map((a, i) => {
          const chunk = (TAIL_START - CLOSE_START) / ANIMALS.length;
          return (
            <Sequence key={`cb-${a.name}`} from={Math.round(i * chunk)} durationInFrames={Math.round(chunk)}>
              <Shot src={a.baby} objX={a.babyX} off={2.5} punch />
            </Sequence>
          );
        })}
      </Sequence>
      <Flash at={CLOSE_START} />

      {/* Tramo final ("What?"/"but"): sostiene la araña bebé para cerrar visualmente el loop */}
      <Sequence from={TAIL_START} durationInFrames={TOTAL - TAIL_START}>
        <Shot src="ba-spider-baby" objX={50} off={0.4} />
      </Sequence>
      <Flash at={TAIL_START} />

      {/* Viñeta para legibilidad del texto */}
      <AbsoluteFill
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <DynamicCaptions />

      <Img
        src={staticFile('assets/fox-avatar.png')}
        style={{
          position: 'absolute',
          bottom: 26,
          right: 22,
          width: 60,
          height: 60,
          borderRadius: '50%',
          opacity: 0.85,
          border: '2px solid rgba(255,255,255,0.6)',
        }}
      />
    </AbsoluteFill>
  );
};
