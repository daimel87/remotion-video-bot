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

// Comp full-screen 720x1280, 24fps. VO (sin silencios) ~24.2s -> 582 frames.
const FPS = 24;
const CLIP_DUR = 194; // frames por clip (192 / 0.99 ~ 194)
const PLAYBACK = 0.99;

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

// Transcripción anclada a los INICIOS REALES de cada frase (detectados en el
// audio con silencedetect). Dentro de cada frase, cada palabra dura en
// proporción a su longitud -> cae mucho más cerca del habla real.
const SEGMENTS: {start: number; end: number; text: string}[] = [
  {start: 0.278, end: 5.042, text: 'A single bite from this king cobra can drop an elephant but this mongoose?'},
  {start: 5.516, end: 10.591, text: 'Immune Its body literally blocks the venom It barely feels it'},
  {start: 10.991, end: 13.612, text: 'So the cobra strikes and misses'},
  {start: 13.959, end: 19.008, text: 'The mongoose dodges lunges and takes down a snake ten times deadlier than itself'},
  {start: 19.226, end: 24.215, text: 'Pound for pound the most fearless killer alive Would you mess with it?'},
];

// Adelanto pequeño para que la palabra "golpee" justo antes/con el sonido.
const LEAD = 1; // frames

// Una palabra a la vez, con su frame de inicio/fin (ponderado por longitud).
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
  // Pop INSTANTÁNEO (bam): entra en 3 frames con un pequeño overshoot.
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
  const display = active.word.replace(/[^A-Za-z?]/g, '');

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
  const PEAK = 315;
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
      <Audio src={staticFile('mongoose-vo.mp3')} />
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
