import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import {QuizRound} from './components/QuizRound';
import {PUZZLES, introFrames, roundFrames} from './quizData';

const RED = '#e23b3b';
const NAVY = '#12203a';
const GOLD = '#ffd24a';
const WHITE = '#ffffff';

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, durationInFrames} = useVideoConfig();
  const s = width / 1920;

  const pop = spring({frame, fps, config: {damping: 12, mass: 0.7}});
  const sub = spring({frame: frame - 12, fps, config: {damping: 14}});
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: NAVY,
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, Helvetica, sans-serif',
        opacity: out,
      }}
    >
      <div style={{fontSize: 200 * s, marginBottom: 30 * s, transform: `scale(${0.6 + 0.4 * pop})`}}>🤔</div>
      <div
        style={{
          transform: `scale(${0.7 + 0.3 * pop})`,
          background: RED,
          color: WHITE,
          fontWeight: 900,
          fontSize: 180 * s,
          letterSpacing: 5 * s,
          padding: `${34 * s}px ${100 * s}px`,
          borderRadius: 28 * s,
          boxShadow: `0 ${16 * s}px ${44 * s}px rgba(0,0,0,0.45)`,
          textTransform: 'uppercase',
          lineHeight: 1,
        }}
      >
        Guess The Word
      </div>
      <div
        style={{
          marginTop: 60 * s,
          fontSize: 72 * s,
          fontWeight: 800,
          color: GOLD,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 24}px)`,
        }}
      >
        By Emojis — Can you guess them all?
      </div>
    </AbsoluteFill>
  );
};

export const QuizVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: NAVY}}>
      <Series>
        <Series.Sequence durationInFrames={introFrames}>
          <Intro />
        </Series.Sequence>
        {PUZZLES.map((p, i) => (
          <Series.Sequence key={i} durationInFrames={roundFrames}>
            <QuizRound {...p} index={i} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
