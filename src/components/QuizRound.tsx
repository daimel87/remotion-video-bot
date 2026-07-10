import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import type {Puzzle} from '../quizData';
import {SHOW_SECS, COUNTDOWN_SECS} from '../quizData';

// Paleta quiz (rojo cinta + azul profundo + dorado)
const RED = '#e23b3b';
const NAVY = '#12203a';
const GOLD = '#ffd24a';
const WHITE = '#ffffff';

export const QuizRound: React.FC<Puzzle & {index: number}> = ({
  emojis,
  answer,
  index,
}) => {
  const frame = useCurrentFrame();
  const {fps, width} = useVideoConfig();
  const s = width / 1920;

  const showF = Math.round(SHOW_SECS * fps);
  const countF = Math.round(COUNTDOWN_SECS * fps);
  const revealStart = showF + countF;

  // Segundos restantes de la cuenta atrás (5→1)
  const elapsedCount = Math.min(Math.max(frame - showF, 0), countF);
  const secsLeft = Math.max(1, Math.ceil((countF - elapsedCount) / fps));
  const inCountdown = frame >= showF && frame < revealStart;
  const revealed = frame >= revealStart;

  // Entrada de los emojis (pop)
  const emojiPop = spring({frame, fps, config: {damping: 12, mass: 0.6}});

  // Anillo de progreso de la cuenta atrás
  const ringP = interpolate(elapsedCount, [0, countF], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const R = 70 * s;
  const C = 2 * Math.PI * R;

  // Pop de la revelación
  const revealPop = spring({
    frame: frame - revealStart,
    fps,
    config: {damping: 11, mass: 0.7},
  });

  // Tic del número que late cada segundo
  const tickPhase = (elapsedCount % fps) / fps;
  const tickScale = inCountdown ? 1 + 0.25 * (1 - tickPhase) : 1;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: NAVY,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      {/* Cabecera cinta roja */}
      <div
        style={{
          marginTop: 60 * s,
          background: RED,
          color: WHITE,
          fontWeight: 900,
          fontSize: 58 * s,
          letterSpacing: 2 * s,
          padding: `${16 * s}px ${54 * s}px`,
          borderRadius: 14 * s,
          boxShadow: `0 ${8 * s}px ${24 * s}px rgba(0,0,0,0.35)`,
          textTransform: 'uppercase',
        }}
      >
        Guess The Word
      </div>

      <div style={{fontSize: 34 * s, color: GOLD, fontWeight: 800, marginTop: 26 * s}}>
        #{index + 1}
      </div>

      {/* Emojis + signo + */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 50 * s,
          transform: `scale(${0.6 + 0.4 * emojiPop})`,
        }}
      >
        {emojis.map((e, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 50 * s}}>
            {i > 0 ? (
              <span style={{fontSize: 120 * s, color: GOLD, fontWeight: 900}}>+</span>
            ) : null}
            <div
              style={{
                width: 260 * s,
                height: 260 * s,
                borderRadius: 32 * s,
                background: 'rgba(255,255,255,0.06)',
                border: `${3 * s}px solid rgba(255,255,255,0.12)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 150 * s,
              }}
            >
              {e}
            </div>
          </div>
        ))}
      </div>

      {/* Zona inferior: cuenta atrás o respuesta */}
      <div style={{height: 320 * s, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {!revealed ? (
          <div style={{position: 'relative', width: 200 * s, height: 200 * s}}>
            <svg width={200 * s} height={200 * s} style={{transform: 'rotate(-90deg)'}}>
              <circle cx={100 * s} cy={100 * s} r={R} stroke="rgba(255,255,255,0.15)" strokeWidth={14 * s} fill="none" />
              <circle
                cx={100 * s}
                cy={100 * s}
                r={R}
                stroke={GOLD}
                strokeWidth={14 * s}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * ringP}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 96 * s,
                fontWeight: 900,
                color: WHITE,
                transform: `scale(${tickScale})`,
              }}
            >
              {inCountdown ? secsLeft : '?'}
            </div>
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${0.5 + 0.5 * revealPop})`,
              background: GOLD,
              color: NAVY,
              fontWeight: 900,
              fontSize: 92 * s,
              letterSpacing: 2 * s,
              padding: `${20 * s}px ${60 * s}px`,
              borderRadius: 18 * s,
              boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,0.4)`,
              textTransform: 'uppercase',
            }}
          >
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};
