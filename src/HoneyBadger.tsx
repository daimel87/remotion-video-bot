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

// Comp 720x1280, 24fps. VO (sin silencios) ~25.16s -> 604 frames.
const SRC_FPS = 24;

// Tomas ordenadas para el LOOP y alineadas a los beats del guion.
// hb-1 carga | hb-2 cobra | hb-3 pelea | hb-4 desmayo(final)/camina(inicio)
const SHOTS: {from: number; dur: number; src: string; off: number}[] = [
  {from: 0, dur: 84, src: 'hb-1', off: 0.5}, // "picked a fight with a cobra" (carga = hook)
  {from: 84, dur: 60, src: 'hb-2', off: 1}, // "one bite from this snake"
  {from: 144, dur: 50, src: 'hb-2', off: 4}, // "venom to drop a buffalo"
  {from: 194, dur: 42, src: 'hb-1', off: 4}, // "the badger? doesn't care"
  {from: 236, dur: 69, src: 'hb-3', off: 0.5}, // "attacks, kills the cobra"
  {from: 305, dur: 60, src: 'hb-3', off: 3.5}, // "eats it alive / venom kicks in"
  {from: 365, dur: 62, src: 'hb-4', off: 5}, // "collapses"
  {from: 427, dur: 60, src: 'hb-4', off: 6.5}, // "dead still / wakes up"
  {from: 487, dur: 117, src: 'hb-4', off: 0.3}, // "goes looking for another cobra" (camina = cierra loop)
];

const HIGHLIGHT = new Set([
  'COBRA',
  'VENOM',
  'BUFFALO',
  'COLLAPSES',
  'DEAD',
  'WAKES',
  'FIGHT',
]);

// Guion partido en frases, anclado a los cortes detectados en el audio.
const SEGMENTS: {start: number; end: number; text: string}[] = [
  {start: 0.2, end: 3.53, text: 'The honey badger just picked a fight with a cobra'},
  {start: 4.01, end: 8.06, text: 'One bite from this snake has enough venom to drop a full-grown buffalo'},
  {start: 8.23, end: 9.55, text: 'The badger? Doesn’t care'},
  {start: 9.84, end: 12.75, text: 'It attacks kills the cobra and eats it alive'},
  {start: 12.93, end: 16.03, text: 'Then the venom kicks in and it collapses'},
  {start: 16.19, end: 17.56, text: 'Dead still'},
  {start: 17.78, end: 19.13, text: 'But hours later it wakes up'},
  {start: 19.28, end: 20.07, text: 'finishes its meal'},
  {start: 20.37, end: 24.6, text: 'and goes looking for another cobra to fight'},
];

const FPS = 24;
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
          fontSize: 104,
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

const Shot: React.FC<{src: string; off: number; dur: number}> = ({src, off, dur}) => {
  const frame = useCurrentFrame();
  const startFrom = Math.round(off * SRC_FPS);
  const zoom = interpolate(frame, [0, dur], [1.0, 1.06], {extrapolateRight: 'clamp'});
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
          transform: `scale(${zoom})`,
        }}
      />
    </AbsoluteFill>
  );
};

export const HoneyBadger: React.FC = () => {
  const frame = useCurrentFrame();
  useKomikaFont();

  // Pico (like salta): la pelea "eats it alive" ~seg 11.
  const PEAK = 264;
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
      <Audio src={staticFile('honeybadger-vo.wav')} />
      <Audio src={staticFile('mongoose-music.mp3')} volume={0.16} />

      {SHOTS.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur}>
          <Shot src={s.src} off={s.off} dur={s.dur} />
        </Sequence>
      ))}

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {SHOTS.slice(1).map((s, i) => (
        <LightFlash key={i} at={s.from} />
      ))}

      <DynamicCaptions />

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
