import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';

// Comp full-screen 720x1280, 24fps. VO ~26.2s -> 632 frames.
// Los 3 clips (8s c/u) se estiran a ~26.3s con playbackRate 0.91.

const FPS = 24;
const CLIP_DUR = 211; // frames por clip (192 / 0.91 ~ 211)
const PLAYBACK = 0.91;

// Palabras que van resaltadas en amarillo (el "golpe").
const HIGHLIGHT = new Set([
  'ELEPHANT',
  'IMMUNE',
  'BLOCKS',
  'MISSES',
  'DEADLIER',
  'FEARLESS',
  'KILLER',
]);

// Transcripción (SRT) con timing por frase. Se reparte palabra por palabra.
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

// Construye la lista de palabras con su frame de inicio/fin (reparto uniforme
// dentro de cada frase). Se muestran en grupos de 2 (estilo MrBeast).
type WordChunk = {startF: number; endF: number; words: string[]};
const buildChunks = (): WordChunk[] => {
  const chunks: WordChunk[] = [];
  for (const seg of SEGMENTS) {
    const words = seg.text.split(' ');
    const segFrames = (seg.end - seg.start) * FPS;
    const perWord = segFrames / words.length;
    const groupSize = 2;
    for (let i = 0; i < words.length; i += groupSize) {
      const group = words.slice(i, i + groupSize);
      const startF = seg.start * FPS + i * perWord;
      const endF = seg.start * FPS + Math.min(i + groupSize, words.length) * perWord;
      chunks.push({startF, endF, words: group});
    }
  }
  return chunks;
};
const CHUNKS = buildChunks();

const DynamicCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const active = CHUNKS.find((c) => frame >= c.startF && frame < c.endF);
  if (!active) return null;

  const local = frame - active.startF;
  // Pop con overshoot al entrar.
  const scale = interpolate(local, [0, 3, 7], [0.6, 1.12, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(local, [0, 3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: '62%',
        left: 24,
        right: 24,
        textAlign: 'center',
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          gap: 16,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {active.words.map((w, i) => {
          const clean = w.replace(/[^A-Za-z]/g, '').toUpperCase();
          const isHot = HIGHLIGHT.has(clean);
          return (
            <span
              key={i}
              style={{
                fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
                fontWeight: 900,
                fontSize: 78,
                lineHeight: 1,
                color: isHot ? '#FFE01A' : '#fff',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                WebkitTextStroke: '3px #000',
                textShadow: '0 6px 12px rgba(0,0,0,0.9), 0 0 4px #000',
              }}
            >
              {w.replace(/[^A-Za-z?]/g, '')}
            </span>
          );
        })}
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
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Transiciones de luz entre escenas */}
      <LightFlash at={CLIP_DUR} />
      <LightFlash at={CLIP_DUR * 2} />

      {/* Subtítulos dinámicos estilo MrBeast */}
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
