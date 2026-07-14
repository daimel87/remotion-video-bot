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
  spring,
  useVideoConfig,
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

// Comp full-screen 720x1280, 24fps. VO ~26.2s -> 632 frames.
const FPS = 24;
const CLIP_DUR = 211; // frames por clip (192 / 0.91 ~ 211)
const PLAYBACK = 0.91;

// Palabras resaltadas en amarillo (el "golpe").
const HIGHLIGHT = new Set([
  'ELEPHANT',
  'IMMUNE',
  'BLOCKS',
  'MISSES',
  'DEADLIER',
  'FEARLESS',
  'KILLER',
]);

// Transcripción con timing por frase; se reparte palabra por palabra.
const SEGMENTS: {start: number; end: number; text: string}[] = [
  {start: 0.0, end: 4.4, text: 'A single bite from this King Cobra can drop an elephant'},
  {start: 4.4, end: 7.0, text: 'But this mongoose? Immune'},
  {start: 7.0, end: 9.7, text: 'Its body literally blocks the venom'},
  {start: 9.7, end: 11.2, text: 'It barely feels it'},
  {start: 11.2, end: 14.7, text: 'So the cobra strikes and misses'},
  {start: 14.7, end: 20.3, text: 'The mongoose dodges lunges and takes down a snake ten times deadlier than itself'},
  {start: 20.3, end: 24.7, text: 'Pound for pound the most fearless killer alive'},
  {start: 24.7, end: 26.2, text: 'Would you mess with it?'},
];

// Una palabra a la vez, con su frame de inicio/fin.
type Word = {startF: number; endF: number; word: string};
const buildWords = (): Word[] => {
  const out: Word[] = [];
  for (const seg of SEGMENTS) {
    const words = seg.text.split(' ');
    const segFrames = (seg.end - seg.start) * FPS;
    const perWord = segFrames / words.length;
    words.forEach((word, i) => {
      out.push({
        startF: seg.start * FPS + i * perWord,
        endF: seg.start * FPS + (i + 1) * perWord,
        word,
      });
    });
  }
  return out;
};
const WORDS = buildWords();

const DynamicCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = WORDS.find((w) => frame >= w.startF && frame < w.endF);
  if (!active) return null;

  const local = frame - active.startF;
  // Pop con rebote elástico (spring) al entrar -> se sienten "vivos".
  const pop = spring({
    frame: local,
    fps,
    config: {damping: 9, mass: 0.5, stiffness: 140},
    durationInFrames: 12,
  });
  const scale = interpolate(pop, [0, 1], [0.5, 1]);
  const clean = active.word.replace(/[^A-Za-z]/g, '').toUpperCase();
  const isHot = HIGHLIGHT.has(clean);
  const display = active.word.replace(/[^A-Za-z?]/g, '');

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `translateY(-50%) scale(${scale})`,
      }}
    >
      <span
        style={{
          fontFamily: `${FONT}, "Arial Black", sans-serif`,
          fontSize: 108,
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

// Flash blanco de transición entre escenas (destello de luz).
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

// Clip con zoom lento (Ken Burns) para dar energía.
const ZoomClip: React.FC<{src: string}> = ({src}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, CLIP_DUR], [1.02, 1.12], {
    extrapolateRight: 'clamp',
  });
  return (
    <OffthreadVideo
      src={staticFile(src)}
      playbackRate={PLAYBACK}
      muted
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform: `scale(${scale})`,
      }}
    />
  );
};

export const MongooseFight: React.FC = () => {
  const frame = useCurrentFrame();
  useKomikaFont();

  // El pico del video (giro "...and misses" / mangosta contraataca) ~seg 13.
  const PEAK = 312;
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
      {/* Voz en off (principal) + música de fondo (baja) */}
      <Audio src={staticFile('mongoose-vo.wav')} />
      <Audio src={staticFile('mongoose-music.mp3')} volume={0.18} />

      {/* Clips a pantalla completa, en secuencia, con zoom */}
      <Sequence from={0} durationInFrames={CLIP_DUR}>
        <ZoomClip src="mongoose-1.mp4" />
      </Sequence>
      <Sequence from={CLIP_DUR} durationInFrames={CLIP_DUR}>
        <ZoomClip src="mongoose-2.mp4" />
      </Sequence>
      <Sequence from={CLIP_DUR * 2} durationInFrames={CLIP_DUR}>
        <ZoomClip src="mongoose-3.mp4" />
      </Sequence>

      {/* Viñeta para que el texto lea bien */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Transiciones de luz entre escenas */}
      <LightFlash at={CLIP_DUR} />
      <LightFlash at={CLIP_DUR * 2} />

      {/* Subtítulos dinámicos (una palabra, estilo viral) */}
      <DynamicCaptions />

      {/* Botón de like (el que usamos), saltando en el pico */}
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
