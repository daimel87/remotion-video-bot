import React from 'react';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {FLAGS} from './flagQuizData';

const INTRO_FRAMES = 90;
const OUTRO_FRAMES = 120;
const QUESTION_FRAMES = 60;
const ANSWER_FRAMES = 45;
const TOTAL_PER_Q = QUESTION_FRAMES + ANSWER_FRAMES;

const BG_COLORS = [
  '#1a237e', '#b71c1c', '#004d40', '#e65100', '#4a148c',
  '#01579b', '#33691e', '#880e4f', '#006064', '#bf360c',
];

const QUESTION_AUDIOS = [
  'audio/question1.mp3',
  'audio/question2.mp3',
  'audio/question3.mp3',
];

export const FlagQuiz: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const totalQuestions = FLAGS.length;
  const outroStart = INTRO_FRAMES + totalQuestions * TOTAL_PER_Q;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e', fontFamily: 'Arial, sans-serif' }}>
      {/* === GLOBAL AUDIO SEQUENCES === */}

      {/* Intro voice */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile('audio/intro.mp3')} volume={0.9} />
      </Sequence>

      {/* Outro voice */}
      <Sequence from={outroStart} layout="none">
        <Audio src={staticFile('audio/outro.mp3')} volume={0.9} />
      </Sequence>

      {/* Per-question audio */}
      {FLAGS.map((q, i) => {
        const qStart = INTRO_FRAMES + i * TOTAL_PER_Q;
        const aStart = qStart + QUESTION_FRAMES;
        const questionAudio = QUESTION_AUDIOS[i % QUESTION_AUDIOS.length];
        const tickStart = qStart + QUESTION_FRAMES - 40;

        return (
          <React.Fragment key={i}>
            {/* Pop when flag appears */}
            <Sequence from={qStart} layout="none">
              <Audio src={staticFile('audio/pop.wav')} volume={0.6} />
            </Sequence>

            {/* Question voice */}
            <Sequence from={qStart + 5} layout="none">
              <Audio src={staticFile(questionAudio)} volume={0.85} />
            </Sequence>

            {/* Tick sounds during last ~1.3 seconds */}
            {[0, 10, 20, 30].map((offset) => (
              <Sequence key={offset} from={tickStart + offset} layout="none">
                <Audio src={staticFile('audio/tick.wav')} volume={offset >= 20 ? 0.8 : 0.5} />
              </Sequence>
            ))}

            {/* Country answer voice */}
            <Sequence from={aStart + 3} layout="none">
              <Audio src={staticFile(q.audioFile)} volume={0.95} />
            </Sequence>
          </React.Fragment>
        );
      })}

      {/* === VISUAL CONTENT === */}
      <QuizVisuals frame={frame} fps={fps} totalQuestions={totalQuestions} outroStart={outroStart} />
    </AbsoluteFill>
  );
};

const QuizVisuals: React.FC<{
  frame: number;
  fps: number;
  totalQuestions: number;
  outroStart: number;
}> = ({frame, fps, totalQuestions, outroStart}) => {
  // INTRO
  if (frame < INTRO_FRAMES) {
    const titleScale = spring({ frame, fps, from: 0.5, to: 1, durationInFrames: 30 });
    const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const countdownText = frame < 60 ? '' : `Starting in ${3 - Math.floor((frame - 60) / 10)}...`;

    return (
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 20,
      }}>
        <div style={{ fontSize: 120, transform: `scale(${titleScale})` }}>🌍</div>
        <div style={{
          fontSize: 64, fontWeight: 900, color: '#fff', textAlign: 'center',
          transform: `scale(${titleScale})`, letterSpacing: 3,
        }}>
          GUESS THE FLAG
        </div>
        <div style={{ fontSize: 32, color: '#FFD700', fontWeight: 700, opacity: subtitleOpacity }}>
          50 Countries — Can You Get Them All?
        </div>
        <div style={{ fontSize: 24, color: 'rgba(255,255,255,0.5)', marginTop: 20 }}>
          {countdownText}
        </div>
      </AbsoluteFill>
    );
  }

  // OUTRO
  if (frame >= outroStart) {
    const outroFrame = frame - outroStart;
    const scale = spring({ frame: outroFrame, fps, from: 0.5, to: 1, durationInFrames: 20 });
    return (
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
      }}>
        <div style={{ fontSize: 100, transform: `scale(${scale})` }}>🏆</div>
        <div style={{ fontSize: 56, fontWeight: 900, color: '#fff', transform: `scale(${scale})` }}>
          HOW MANY DID YOU GET?
        </div>
        <div style={{ fontSize: 32, color: '#FFD700', fontWeight: 700 }}>
          Comment your score below! 👇
        </div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.6)', marginTop: 10 }}>
          LIKE & SUBSCRIBE for more quizzes! 🔔
        </div>
      </AbsoluteFill>
    );
  }

  // QUESTION PHASE
  const questionFrame = frame - INTRO_FRAMES;
  const questionIndex = Math.min(Math.floor(questionFrame / TOTAL_PER_Q), totalQuestions - 1);
  const localFrame = questionFrame - questionIndex * TOTAL_PER_Q;
  const isAnswer = localFrame >= QUESTION_FRAMES;
  const q = FLAGS[questionIndex];
  const bgColor = BG_COLORS[questionIndex % BG_COLORS.length];

  const flagScale = spring({ frame: localFrame, fps, from: 0.3, to: 1, durationInFrames: 15 });
  const countdownSeconds = Math.min(3, Math.max(0, Math.ceil((QUESTION_FRAMES - localFrame) / 20)));

  const timerWidth = isAnswer ? 0 : interpolate(localFrame, [0, QUESTION_FRAMES], [100, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const answerScale = isAnswer ? spring({ frame: localFrame - QUESTION_FRAMES, fps, from: 0, to: 1, durationInFrames: 12 }) : 0;
  const checkScale = isAnswer ? spring({ frame: localFrame - QUESTION_FRAMES + 5, fps, from: 0, to: 1, durationInFrames: 15 }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 50%, ${bgColor} 0%, rgba(0,0,0,0.4) 100%)`,
      }} />

      {/* Question counter */}
      <div style={{ position: 'absolute', top: 30, left: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30,
          padding: '10px 24px', fontSize: 22, fontWeight: 800, color: '#fff',
        }}>
          {questionIndex + 1} / {totalQuestions}
        </div>
      </div>

      {/* Title top right */}
      <div style={{
        position: 'absolute', top: 30, right: 40,
        fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
        letterSpacing: 3, textTransform: 'uppercase',
      }}>
        🌍 Guess The Flag
      </div>

      {/* Main flag */}
      <div style={{
        position: 'absolute', top: 160, left: 0, right: 0,
        textAlign: 'center', fontSize: 280,
        transform: `scale(${flagScale})`, lineHeight: 1.1,
      }}>
        {q.flag}
      </div>

      {!isAnswer ? (
        <>
          <div style={{
            position: 'absolute', top: 520, left: 0, right: 0,
            textAlign: 'center', fontSize: 42, fontWeight: 800, color: '#fff',
            textShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}>
            Which country is this?
          </div>
          <div style={{
            position: 'absolute', top: 600, left: 0, right: 0,
            textAlign: 'center', fontSize: 180, fontWeight: 900,
            color: 'rgba(255,255,255,0.15)', lineHeight: 1,
          }}>
            ?
          </div>
          <div style={{
            position: 'absolute', bottom: 160, left: 0, right: 0,
            textAlign: 'center', fontSize: 72, fontWeight: 900,
            color: countdownSeconds <= 1 ? '#ff4444' : '#FFD700',
            textShadow: '0 0 30px rgba(0,0,0,0.5)',
          }}>
            {countdownSeconds}
          </div>
          <div style={{
            position: 'absolute', bottom: 120, left: 200, right: 200,
            height: 12, backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 6, overflow: 'hidden',
          }}>
            <div style={{
              width: `${timerWidth}%`, height: '100%',
              backgroundColor: timerWidth < 30 ? '#ff4444' : '#FFD700',
              borderRadius: 6,
            }} />
          </div>
        </>
      ) : (
        <>
          <div style={{
            position: 'absolute', top: 500, left: 0, right: 0,
            textAlign: 'center', fontSize: 80, transform: `scale(${checkScale})`,
          }}>
            ✅
          </div>
          <div style={{
            position: 'absolute', top: 620, left: 0, right: 0,
            textAlign: 'center', transform: `scale(${answerScale})`,
          }}>
            <div style={{
              fontSize: 72, fontWeight: 900, color: '#fff',
              textShadow: '0 4px 16px rgba(0,0,0,0.5)', letterSpacing: 3,
            }}>
              {q.country}
            </div>
            <div style={{
              fontSize: 28, color: 'rgba(255,255,255,0.6)', marginTop: 12, letterSpacing: 4,
            }}>
              {q.continent}
            </div>
          </div>
        </>
      )}

      <div style={{
        position: 'absolute', bottom: 20, left: 0, right: 0,
        textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.2)',
      }}>
        Like & Subscribe for more quizzes!
      </div>
    </AbsoluteFill>
  );
};
