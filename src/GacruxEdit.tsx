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

// ─── Timeline (25fps, 698 frames = 27.92s) ───────────────────────────────────
// 0-30    "Hay hombres"
// 30-65   "que las mujeres recuerdan"
// 65-110  "años después de que todo terminó."
// 110-160 "No porque fueran los más guapos."  + pill ❌
// 160-220 "No porque tuvieran más dinero."     + pill ❌
// 220-300 "Sino porque hicieron algo distinto."
// 300-420 "Algo que se queda grabado aquí..."
// 420-490 "en el sistema nervioso de una mujer."
// 490-560 "Y hoy te voy a contar exactamente qué es."
// 560-640 "Pero te advierto algo desde ahora:"
// 640-698 "Esto va contra todo lo que crees."

// ─── Subtitle — large clean white text, no box ───────────────────────────────

const Sub: React.FC<{text: string; size?: number}> = ({text, size}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const sc = width / 1920;
  const fontSize = (size ?? 62) * sc;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 300}});
  const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 80 * sc}}>
      <div
        style={{
          opacity: enter * exit,
          transform: `translateY(${interpolate(enter, [0, 1], [16, 0]) * sc}px)`,
          fontFamily: '"Arial Black", "Helvetica Neue", Arial, sans-serif',
          fontWeight: 900,
          fontSize,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          textShadow: `0 2px 12px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.7)`,
          maxWidth: 1400 * sc,
          padding: `0 ${60 * sc}px`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ─── Pill tag — left side label (style from reference) ───────────────────────

const PillTag: React.FC<{icon: string; text: string; color?: string}> = ({icon, text, color = '#e8334a'}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width} = useVideoConfig();
  const sc = width / 1920;

  const enter = spring({frame, fps, config: {damping: 200, stiffness: 220}});
  const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 60 * sc}}>
      <div
        style={{
          opacity: enter * exit,
          transform: `translateX(${interpolate(enter, [0, 1], [-80, 0]) * sc}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 12 * sc,
          background: 'rgba(10, 20, 50, 0.82)',
          border: `2px solid ${color}`,
          borderRadius: 100,
          padding: `${14 * sc}px ${28 * sc}px`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <span style={{fontSize: 28 * sc, lineHeight: 1}}>{icon}</span>
        <span
          style={{
            fontFamily: '"Arial Black", Helvetica, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 26 * sc,
            color: '#ffffff',
          }}
        >
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── Slow Ken Burns — subtle, not distracting ────────────────────────────────

const CleanVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Very subtle zoom — 1.0 to 1.04, almost imperceptible but adds life
  const scale = interpolate(frame, [0, 698], [1.0, 1.04], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Slight reveal zoom on "exactamente qué es" moment
  const zoomOnReveal = interpolate(
    frame,
    [480, 510, 560, 590],
    [0, 0.06, 0.06, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale + zoomOnReveal})`,
        transformOrigin: '50% 35%',
      }}
    >
      <OffthreadVideo src={staticFile('gacrux_1.mp4')} />
    </AbsoluteFill>
  );
};

// ─── Gradient scrim at bottom for subtitle legibility ────────────────────────

const BottomScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 22%, transparent 40%)',
      pointerEvents: 'none',
    }}
  />
);

// ─── Main composition ─────────────────────────────────────────────────────────

export const GacruxEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <CleanVideo />
      <BottomScrim />

      {/* — Segment 1: "Hay hombres que las mujeres recuerdan..." — */}
      <Sequence from={0} durationInFrames={32}>
        <Sub text="Hay hombres" />
      </Sequence>
      <Sequence from={32} durationInFrames={38}>
        <Sub text="que las mujeres recuerdan" />
      </Sequence>
      <Sequence from={70} durationInFrames={42}>
        <Sub text="años después de que todo terminó." />
      </Sequence>

      {/* — Segment 2: "No porque guapos / No porque dinero" — */}
      <Sequence from={112} durationInFrames={55}>
        <Sub text="No porque fueran los más guapos." />
        <PillTag icon="❌" text="Los más guapos" color="#e8334a" />
      </Sequence>
      <Sequence from={167} durationInFrames={58}>
        <Sub text="No porque tuvieran más dinero." />
        <PillTag icon="❌" text="Más dinero" color="#e8334a" />
      </Sequence>

      {/* — Segment 3: "Sino porque algo DISTINTO" — */}
      <Sequence from={225} durationInFrames={48}>
        <Sub text="Sino porque hicieron algo distinto." />
      </Sequence>

      {/* — Segment 4: "Grabado en el sistema nervioso" — */}
      <Sequence from={273} durationInFrames={65}>
        <Sub text="Algo que se queda grabado aquí..." />
      </Sequence>
      <Sequence from={338} durationInFrames={75}>
        <Sub text="en el sistema nervioso de una mujer." />
        <PillTag icon="🧠" text="Sistema nervioso" color="#5b8cff" />
      </Sequence>

      {/* — Segment 5: "Y hoy te voy a contar exactamente qué es" — */}
      <Sequence from={413} durationInFrames={80}>
        <Sub text="Y hoy te voy a contar" size={58} />
      </Sequence>
      <Sequence from={493} durationInFrames={68}>
        <Sub text="exactamente qué es." size={72} />
      </Sequence>

      {/* — Segment 6: "Pero te advierto algo..." — */}
      <Sequence from={561} durationInFrames={68}>
        <Sub text="Pero te advierto algo desde ahora:" size={56} />
        <PillTag icon="⚠️" text="Advertencia" color="#f5a623" />
      </Sequence>
      <Sequence from={629} durationInFrames={69}>
        <Sub text="Esto va contra todo lo que crees que funciona." size={52} />
      </Sequence>
    </AbsoluteFill>
  );
};
