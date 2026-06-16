import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import {CaptionBox} from './components/CaptionBox';

// Timeline (25fps, 698 frames total = 27.92s):
// 0-120    "Hay hombres que las mujeres recuerdan años después..."  → CaptionBox + slow zoom in
// 120-240  "No porque fueran los más guapos. No porque tuvieran más dinero." → ContrastCard
// 240-350  "Sino porque hicieron algo distinto." → HighlightCaption + zoom peak
// 350-490  "Algo que se queda grabado aquí... sistema nervioso de una mujer." → NeuralCard
// 490-570  "Y hoy te voy a contar exactamente qué es." → RevealCard + zoom out
// 570-698  "Pero te advierto algo..." → WarningCard + CaptionBox

// ─── Ken Burns zoom ──────────────────────────────────────────────────────────

const ZoomingVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, 120, 240, 350, 490, 570, 698],
    [1.0, 1.07, 1.07, 1.14, 1.14, 1.0, 1.04],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  // Subtle horizontal drift for cinematic feel
  const translateX = interpolate(
    frame,
    [0, 350, 698],
    [0, -8, 4],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale}) translateX(${translateX}px)`,
        transformOrigin: '50% 32%',
      }}
    >
      <OffthreadVideo src={staticFile('gacrux_lipsync.mp4')} />
    </AbsoluteFill>
  );
};

// ─── Contrast Card: "No por guapos / No por dinero" ─────────────────────────

const ContrastCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const sc = width / 1920;

  const enter = spring({frame, fps, config: {damping: 180, stiffness: 160}});
  const enter2 = spring({frame: Math.max(0, frame - 22), fps, config: {damping: 180, stiffness: 160}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const row = (icon: string, text: string, delay: number) => {
    const e = delay === 0 ? enter : enter2;
    return (
      <div
        style={{
          opacity: e * exit,
          transform: `translateX(${interpolate(e, [0, 1], [-40, 0]) * sc}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 16 * sc,
          background: 'rgba(220, 30, 60, 0.12)',
          border: '1px solid rgba(220,30,60,0.5)',
          borderLeft: `5px solid #e8334a`,
          borderRadius: 10 * sc,
          padding: `${14 * sc}px ${24 * sc}px`,
          marginBottom: 14 * sc,
        }}
      >
        <span style={{fontSize: 32 * sc, lineHeight: 1}}>{icon}</span>
        <span
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 28 * sc,
            color: '#fff',
            textDecoration: 'line-through',
            textDecorationColor: '#e8334a',
            textDecorationThickness: 3,
          }}
        >
          {text}
        </span>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start', paddingLeft: 60 * sc, paddingBottom: 140 * sc}}>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {row('❌', 'Los más guapos', 0)}
        {row('❌', 'Más dinero', 22)}
      </div>
    </AbsoluteFill>
  );
};

// ─── Highlight Caption: word em-dash style ───────────────────────────────────

const HighlightCaption: React.FC<{pre: string; word: string; post?: string}> = ({pre, word, post}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const sc = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 200}});
  const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const pulseScale = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.03, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60 * sc}}>
      <div
        style={{
          opacity: enter * exit,
          transform: `translateY(${interpolate(enter, [0, 1], [24, 0]) * sc}px)`,
          maxWidth: 1100 * sc,
          background: 'rgba(8, 16, 40, 0.85)',
          border: '1px solid rgba(91, 140, 255, 0.6)',
          boxShadow: '0 0 32px rgba(70,110,255,0.45)',
          borderRadius: 10 * sc,
          padding: `${18 * sc}px ${30 * sc}px`,
          display: 'flex',
          alignItems: 'center',
          gap: 18 * sc,
        }}
      >
        <div style={{width: 6 * sc, alignSelf: 'stretch', background: '#5b8cff', borderRadius: 4 * sc, boxShadow: '0 0 12px #5b8cff'}} />
        <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 30 * sc, color: '#fff', lineHeight: 1.3}}>
          {pre}
          <span
            style={{
              display: 'inline-block',
              color: '#ffe44d',
              textShadow: '0 0 18px rgba(255,220,50,0.7)',
              transform: `scale(${pulseScale})`,
              transformOrigin: 'center',
              marginLeft: 8 * sc,
              marginRight: 8 * sc,
              fontWeight: 900,
              letterSpacing: 2,
            }}
          >
            {word}
          </span>
          {post}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Neural / Sistema Nervioso card ─────────────────────────────────────────

const NeuralCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const sc = width / 1920;

  const enter = spring({frame, fps, config: {damping: 160, stiffness: 120}});
  const captionEnter = spring({frame: Math.max(0, frame - 30), fps, config: {damping: 200, stiffness: 160}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Pulsing glow on card
  const glow = interpolate(frame % 50, [0, 25, 50], [0.45, 0.75, 0.45]);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-end', paddingRight: 60 * sc}}>
      <div
        style={{
          opacity: enter * exit,
          transform: `translateX(${interpolate(enter, [0, 1], [60, 0]) * sc}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
          background: 'rgba(8, 16, 40, 0.92)',
          border: `1px solid rgba(155, 225, 255, ${glow})`,
          boxShadow: `0 0 40px rgba(91,140,255,${glow * 0.7})`,
          borderRadius: 14 * sc,
          padding: `${28 * sc}px ${36 * sc}px`,
          maxWidth: 480 * sc,
          textAlign: 'center',
        }}
      >
        {/* Brain/neural icon made from CSS */}
        <div style={{fontSize: 52 * sc, lineHeight: 1, marginBottom: 14 * sc}}>🧠</div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 13 * sc,
            color: '#9be1ff',
            textTransform: 'uppercase',
            letterSpacing: 2,
            marginBottom: 10 * sc,
          }}
        >
          Sistema nervioso femenino
        </div>
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            fontSize: 22 * sc,
            color: '#fff',
            lineHeight: 1.4,
          }}
        >
          Se queda grabado en la memoria emocional... para siempre.
        </div>
      </div>

      {/* Bottom caption */}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 60 * sc}}>
        <div
          style={{
            opacity: captionEnter * exit,
            transform: `translateY(${interpolate(captionEnter, [0, 1], [20, 0]) * sc}px)`,
            maxWidth: 1000 * sc,
            background: 'rgba(8, 16, 40, 0.85)',
            border: '1px solid rgba(91, 140, 255, 0.6)',
            boxShadow: '0 0 24px rgba(70,110,255,0.45)',
            borderRadius: 10 * sc,
            padding: `${16 * sc}px ${28 * sc}px`,
            display: 'flex',
            alignItems: 'center',
            gap: 16 * sc,
          }}
        >
          <div style={{width: 6 * sc, alignSelf: 'stretch', background: '#9be1ff', borderRadius: 4 * sc, boxShadow: '0 0 12px #9be1ff'}} />
          <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 28 * sc, color: '#fff', lineHeight: 1.3}}>
            Se queda grabado{' '}
            <span style={{color: '#9be1ff', fontWeight: 900}}>en el sistema nervioso</span>
            {' '}de una mujer
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── Reveal card ─────────────────────────────────────────────────────────────

const RevealCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const sc = width / 1920;

  const enter = spring({frame, fps, config: {damping: 140, stiffness: 100}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Chevron bounce
  const bounce = interpolate(Math.sin((frame / 12) * Math.PI), [-1, 1], [-6, 6]) * sc;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          opacity: enter * exit,
          transform: `scale(${interpolate(enter, [0, 1], [0.7, 1])})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20 * sc,
          background: 'rgba(8, 16, 40, 0.88)',
          border: '2px solid rgba(255, 210, 60, 0.7)',
          boxShadow: '0 0 60px rgba(255,200,50,0.3), 0 0 120px rgba(91,140,255,0.2)',
          borderRadius: 18 * sc,
          padding: `${36 * sc}px ${60 * sc}px`,
        }}
      >
        <div style={{fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 800, fontSize: 15 * sc, color: '#ffe44d', textTransform: 'uppercase', letterSpacing: 3}}>
          Y hoy te voy a contar
        </div>
        <div
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 52 * sc,
            color: '#fff',
            textAlign: 'center',
            lineHeight: 1.1,
            textShadow: '0 0 30px rgba(255,255,255,0.3)',
          }}
        >
          exactamente<br />
          <span style={{color: '#ffe44d', textShadow: '0 0 20px rgba(255,220,50,0.6)'}}>qué es.</span>
        </div>
        <div style={{transform: `translateY(${bounce}px)`, fontSize: 28 * sc, marginTop: 4 * sc}}>👇</div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Warning card ─────────────────────────────────────────────────────────────

const WarningCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const sc = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 180}});
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Flash on entry
  const flash = interpolate(frame, [0, 4, 8, 12], [0, 0.35, 0.1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Red flash overlay */}
      <AbsoluteFill style={{background: `rgba(220,30,60,${flash})`, pointerEvents: 'none'}} />

      <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'flex-start', padding: 50 * sc}}>
        <div
          style={{
            opacity: enter * exit,
            transform: `translateY(${interpolate(enter, [0, 1], [-30, 0]) * sc}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 14 * sc,
            background: 'rgba(220, 30, 60, 0.15)',
            border: '2px solid rgba(220,30,60,0.7)',
            borderRadius: 10 * sc,
            padding: `${12 * sc}px ${22 * sc}px`,
          }}
        >
          <span style={{fontSize: 28 * sc}}>⚠️</span>
          <span
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 800,
              fontSize: 22 * sc,
              color: '#ff7a7a',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            Pero te advierto algo
          </span>
        </div>
      </AbsoluteFill>
    </>
  );
};

// ─── Subtle vignette overlay ──────────────────────────────────────────────────

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
      pointerEvents: 'none',
    }}
  />
);

// ─── Main composition ─────────────────────────────────────────────────────────

export const GacruxEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ZoomingVideo />
      <Vignette />

      {/* 0-120: "Hay hombres que las mujeres recuerdan años después..." */}
      <Sequence from={0} durationInFrames={120}>
        <CaptionBox text="Hay hombres que las mujeres recuerdan... años después de que todo terminó." />
      </Sequence>

      {/* 120-240: "No porque guapos. No porque dinero." */}
      <Sequence from={120} durationInFrames={120}>
        <ContrastCard />
        <CaptionBox text="No por guapos. No por dinero." />
      </Sequence>

      {/* 240-350: "Sino porque hicieron algo DISTINTO." */}
      <Sequence from={240} durationInFrames={110}>
        <HighlightCaption pre="Sino porque hicieron algo" word="DISTINTO." />
      </Sequence>

      {/* 350-490: "Algo que se queda grabado... sistema nervioso" */}
      <Sequence from={350} durationInFrames={140}>
        <NeuralCard />
      </Sequence>

      {/* 490-570: "Y hoy te voy a contar exactamente qué es." */}
      <Sequence from={490} durationInFrames={80}>
        <RevealCard />
      </Sequence>

      {/* 570-698: "Pero te advierto algo desde ahora..." */}
      <Sequence from={570} durationInFrames={128}>
        <WarningCard />
        <CaptionBox text="Esto va contra todo lo que crees que funciona con las mujeres." />
      </Sequence>
    </AbsoluteFill>
  );
};
