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

// Comp full-screen 720x1280, 24fps. Audio VO ~26.3s -> 632 frames.
// Los 3 clips (8s c/u = 24s) se estiran a ~26.3s con playbackRate 0.91.

const CLIP_DUR = 211; // frames por clip (192 / 0.91 ~ 211)
const PLAYBACK = 0.91;

// Texto grande estilo caption viral: blanco con contorno negro grueso.
const BigCaption: React.FC<{
  from: number;
  durationInFrames: number;
  text: string;
  top?: string;
}> = ({from, durationInFrames, text, top = '14%'}) => {
  const frame = useCurrentFrame();
  const local = frame - from;
  const opacity = interpolate(
    local,
    [0, 6, durationInFrames - 6, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const pop = interpolate(local, [0, 8], [0.82, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: 24,
        right: 24,
        textAlign: 'center',
        opacity,
        transform: `scale(${pop})`,
      }}
    >
      <span
        style={{
          fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
          fontWeight: 900,
          fontSize: 62,
          lineHeight: 1.05,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          whiteSpace: 'pre-line',
          textShadow:
            '0 0 2px #000, 0 4px 8px rgba(0,0,0,0.9), -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000, 0 3px 0 #000, -3px -3px 0 #000, 3px 3px 0 #000, -3px 3px 0 #000, 3px -3px 0 #000',
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const MongooseFight: React.FC = () => {
  const frame = useCurrentFrame();

  // El "pico" del video: el momento del giro ("...and MISSES" / mangosta ataca)
  // ~clip 2. Ahí el botón de like salta.
  const PEAK = 300;
  const likeBase = interpolate(frame, [8, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Salto en el pico: un pop fuerte que decae.
  const jump =
    frame > PEAK && frame < PEAK + 40
      ? Math.sin((frame - PEAK) * 0.35) * Math.max(0, 1 - (frame - PEAK) / 40)
      : 0;
  const likeScale = 1 + jump * 0.35;

  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {/* Voz en off */}
      <Audio src={staticFile('mongoose-vo.wav')} />

      {/* Clips a pantalla completa, en secuencia */}
      <Sequence from={0} durationInFrames={CLIP_DUR}>
        <OffthreadVideo
          src={staticFile('mongoose-1.mp4')}
          playbackRate={PLAYBACK}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </Sequence>
      <Sequence from={CLIP_DUR} durationInFrames={CLIP_DUR}>
        <OffthreadVideo
          src={staticFile('mongoose-2.mp4')}
          playbackRate={PLAYBACK}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </Sequence>
      <Sequence from={CLIP_DUR * 2} durationInFrames={CLIP_DUR}>
        <OffthreadVideo
          src={staticFile('mongoose-3.mp4')}
          playbackRate={PLAYBACK}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </Sequence>

      {/* Viñeta oscura arriba y abajo para que el texto lea bien */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 68%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Textos grandes sincronizados con la voz */}
      <BigCaption from={12} durationInFrames={160} text={'Immune to\nvenom 🐍'} />
      <BigCaption from={180} durationInFrames={150} text={'The bite does\nNOTHING'} />
      <BigCaption from={340} durationInFrames={150} text={'Kills snakes\n10x deadlier'} />
      <BigCaption from={500} durationInFrames={132} text={'Who wins? 👇'} top={'12%'} />

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
