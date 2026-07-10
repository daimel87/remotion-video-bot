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
      <div
        style={{
          transform: `scale(${0.7 + 0.3 * pop})`,
          background: RED,
          color: WHITE,
          fontWeight: 900,
          fontSize: 130 * s,
          letterSpacing: 4 * s,
          padding: `${28 * s}px ${80 * s}px`,
          borderRadius: 22 * s,
          boxShadow: `0 ${14 * s}px ${40 * s}px rgba(0,0,0,0.4)`,
          textTransform: 'uppercase',
        }}
      >
        Guess The Word
      </div>
      <div
        style={{
          marginTop: 46 * s,
          fontSize: 54 * s,
          fontWeight: 800,
          color: GOLD,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
        }}
      >
        By Emojis 🤔  Can you guess them all?
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
