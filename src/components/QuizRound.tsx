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
  const R = 95 * s;
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
        padding: `${28 * s}px 0`,
      }}
    >
      {/* Cabecera cinta roja (grande, ancha) */}
      <div
        style={{
          position: 'relative',
          background: RED,
          color: WHITE,
          fontWeight: 900,
          fontSize: 96 * s,
          letterSpacing: 3 * s,
          padding: `${22 * s}px ${90 * s}px`,
          borderRadius: 20 * s,
          boxShadow: `0 ${10 * s}px ${30 * s}px rgba(0,0,0,0.4)`,
          textTransform: 'uppercase',
        }}
      >
        Guess The Word
        <span
          style={{
            position: 'absolute',
            top: -22 * s,
            right: -22 * s,
            background: GOLD,
            color: NAVY,
            fontSize: 40 * s,
            fontWeight: 900,
            width: 76 * s,
            height: 76 * s,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `${4 * s}px solid ${NAVY}`,
          }}
        >
          {index + 1}
        </span>
      </div>

      {/* Emojis + signo + (ocupan el grueso de la pantalla) */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 60 * s,
          transform: `scale(${0.7 + 0.3 * emojiPop})`,
        }}
      >
        {emojis.map((e, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 60 * s}}>
            {i > 0 ? (
              <span style={{fontSize: 200 * s, color: GOLD, fontWeight: 900, lineHeight: 1}}>+</span>
            ) : null}
            <div
              style={{
                width: 480 * s,
                height: 480 * s,
                borderRadius: 44 * s,
                background: 'rgba(255,255,255,0.07)',
                border: `${4 * s}px solid rgba(255,255,255,0.14)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 300 * s,
                lineHeight: 1,
              }}
            >
              {e}
            </div>
          </div>
        ))}
      </div>

      {/* Zona inferior: cuenta atrás o respuesta (grande) */}
      <div style={{height: 300 * s, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {!revealed ? (
          <div style={{position: 'relative', width: 260 * s, height: 260 * s}}>
            <svg width={260 * s} height={260 * s} style={{transform: 'rotate(-90deg)'}}>
              <circle cx={130 * s} cy={130 * s} r={R} stroke="rgba(255,255,255,0.15)" strokeWidth={18 * s} fill="none" />
              <circle
                cx={130 * s}
                cy={130 * s}
                r={R}
                stroke={GOLD}
                strokeWidth={18 * s}
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
                fontSize: 130 * s,
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
              fontSize: 120 * s,
              letterSpacing: 3 * s,
              padding: `${26 * s}px ${80 * s}px`,
              borderRadius: 22 * s,
              boxShadow: `0 ${12 * s}px ${36 * s}px rgba(0,0,0,0.45)`,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};
