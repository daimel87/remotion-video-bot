import React from 'react';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {FLAGS_SHORT as FLAGS} from './flagQuizDataShort';

const ALL_FLAGS = [
  '🇧🇷','🇯🇵','🇨🇦','🇦🇺','🇲🇽','🇩🇪','🇮🇹','🇰🇷','🇦🇷','🇹🇷',
  '🇪🇬','🇸🇪','🇳🇴','🇵🇱','🇹🇭','🇨🇴','🇳🇬','🇵🇭','🇨🇱','🇵🇰',
  '🇮🇪','🇨🇭','🇵🇪','🇬🇷','🇵🇹','🇮🇳','🇨🇺','🇿🇦','🇫🇮','🇮🇸',
  '🇯🇲','🇻🇳','🇲🇦','🇭🇷','🇳🇿','🇷🇸','🇪🇨','🇳🇵','🇰🇪','🇧🇩',
  '🇺🇦','🇨🇿','🇩🇰','🇵🇦','🇸🇦','🇮🇩','🇧🇪','🇷🇴','🇭🇺','🇧🇴',
  '🇺🇸','🇬🇧','🇫🇷','🇪🇸','🇷🇺','🇨🇳','🇳🇱','🇦🇹','🇵🇾','🇺🇾',
  '🇨🇷','🇶🇦','🇱🇧','🇹🇳','🇬🇭','🇪🇹','🇸🇬','🇲🇾','🇦🇪','🇮🇶',
];

const INTRO_FRAMES = 90;
const QUESTION_FRAMES = 60;
const ANSWER_FRAMES = 45;
const TOTAL_PER_Q = QUESTION_FRAMES + ANSWER_FRAMES;

const BG_GRADIENTS = [
  ['#1a237e', '#283593'], ['#b71c1c', '#d32f2f'], ['#004d40', '#00796b'],
  ['#e65100', '#f57c00'], ['#4a148c', '#7b1fa2'], ['#01579b', '#0288d1'],
  ['#33691e', '#558b2f'], ['#880e4f', '#c2185b'], ['#006064', '#00838f'],
  ['#bf360c', '#e64a19'],
];

const QUESTION_AUDIOS = [
  'audio/question1.mp3',
  'audio/question2.mp3',
  'audio/question3.mp3',
];

export const FlagQuizShorts: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const totalQuestions = FLAGS.length;
  const outroStart = INTRO_FRAMES + totalQuestions * TOTAL_PER_Q;

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0a1a', fontFamily: 'Arial, sans-serif'}}>
      <Sequence from={0} layout="none">
        <Audio src={staticFile('audio/intro.mp3')} volume={0.9} />
      </Sequence>
      <Sequence from={outroStart} layout="none">
        <Audio src={staticFile('audio/outro.mp3')} volume={0.9} />
      </Sequence>

      {FLAGS.map((q, i) => {
        const qStart = INTRO_FRAMES + i * TOTAL_PER_Q;
        const aStart = qStart + QUESTION_FRAMES;
        const questionAudio = QUESTION_AUDIOS[i % QUESTION_AUDIOS.length];
        const tickStart = qStart + QUESTION_FRAMES - 40;
        return (
          <React.Fragment key={i}>
            <Sequence from={qStart} layout="none">
              <Audio src={staticFile('audio/pop.wav')} volume={0.6} />
            </Sequence>
            <Sequence from={qStart + 5} layout="none">
              <Audio src={staticFile(questionAudio)} volume={0.85} />
            </Sequence>
            {[0, 10, 20, 30].map((offset) => (
              <Sequence key={offset} from={tickStart + offset} layout="none">
                <Audio src={staticFile('audio/tick.wav')} volume={offset >= 20 ? 0.8 : 0.5} />
              </Sequence>
            ))}
            <Sequence from={aStart + 3} layout="none">
              <Audio src={staticFile(q.audioFile)} volume={0.95} />
            </Sequence>
          </React.Fragment>
        );
      })}

      <ShortsVisuals frame={frame} fps={fps} totalQuestions={totalQuestions} outroStart={outroStart} />
    </AbsoluteFill>
  );
};

const AnimatedBg: React.FC<{frame: number; colors: string[]}> = ({frame, colors}) => {
  const rotation = frame * 0.4;
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: -300,
        background: `conic-gradient(from ${rotation}deg at 70% 30%, transparent 0%, ${colors[0]}55 15%, transparent 30%)`,
      }} />
      <div style={{
        position: 'absolute', inset: -300,
        background: `conic-gradient(from ${rotation + 180}deg at 30% 70%, transparent 0%, ${colors[1]}55 15%, transparent 30%)`,
      }} />
    </>
  );
};

const ShortsVisuals: React.FC<{
  frame: number;
  fps: number;
  totalQuestions: number;
  outroStart: number;
}> = ({frame, fps, totalQuestions, outroStart}) => {
  // INTRO
  if (frame < INTRO_FRAMES) {
    const titleScale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 20});
    const titleOpacity = interpolate(frame, [3, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const countdownText = frame < 60 ? '' : `${3 - Math.floor((frame - 60) / 10)}`;
    const bgPanX = interpolate(frame, [0, INTRO_FRAMES], [0, -100], {extrapolateRight: 'clamp'});
    const bgPanY = interpolate(frame, [0, INTRO_FRAMES], [0, -60], {extrapolateRight: 'clamp'});
    const bgBlur = interpolate(frame, [0, 15], [0, 8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

    return (
      <AbsoluteFill>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, #ff6b35, #ff2e63, #a855f7)',
        }} />

        <div style={{
          position: 'absolute', inset: -200,
          display: 'flex', flexWrap: 'wrap', alignContent: 'flex-start',
          transform: `translate(${bgPanX}px, ${bgPanY}px)`,
          filter: `blur(${bgBlur}px)`,
          opacity: 0.3,
        }}>
          {Array.from({length: 80}).map((_, idx) => (
            <div key={idx} style={{
              width: '12.5%', height: '10%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 60,
            }}>
              {ALL_FLAGS[idx % ALL_FLAGS.length]}
            </div>
          ))}
        </div>

        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(10,10,30,0.4) 0%, rgba(10,10,30,0.8) 100%)',
        }} />

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 15,
          padding: '0 40px',
        }}>
          <div style={{
            fontSize: 150, transform: `scale(${titleScale})`, opacity: titleOpacity,
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))',
          }}>🌍</div>
          <div style={{
            fontSize: 110, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${titleScale})`, letterSpacing: 5,
            opacity: titleOpacity,
            textShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 80px rgba(255,255,255,0.2)',
            lineHeight: 1.1,
            WebkitTextStroke: '2px rgba(0,0,0,0.2)',
          }}>
            GUESS
            <br />THE
            <br />
            <span style={{
              color: '#FFD700', fontSize: 120,
              textShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(255,215,0,0.5)',
            }}>FLAG</span>
          </div>
          <div style={{
            fontSize: 42, color: '#fff', fontWeight: 800, opacity: subtitleOpacity,
            marginTop: 20,
            textShadow: '0 4px 15px rgba(0,0,0,0.5)',
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 30px',
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            🌎 50 COUNTRIES 🌎
          </div>
          {frame >= 60 && (
            <div style={{
              fontSize: 120, fontWeight: 900, color: '#FFD700',
              marginTop: 30,
              textShadow: '0 0 60px rgba(255,215,0,0.7), 0 8px 30px rgba(0,0,0,0.5)',
              transform: `scale(${spring({frame: frame - 60, fps, from: 1.5, to: 1, durationInFrames: 8})})`,
            }}>
              {countdownText}
            </div>
          )}
        </div>
      </AbsoluteFill>
    );
  }

  // OUTRO
  if (frame >= outroStart) {
    const outroFrame = frame - outroStart;
    const scale = spring({frame: outroFrame, fps, from: 0.3, to: 1, durationInFrames: 20});
    const scoreScale = spring({frame: Math.max(0, outroFrame - 10), fps, from: 0, to: 1, durationInFrames: 20});
    const subScale = spring({frame: Math.max(0, outroFrame - 25), fps, from: 0, to: 1, durationInFrames: 20});
    const bgRot = outroFrame * 0.4;

    return (
      <AbsoluteFill>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(${bgRot}deg, #f59e0b, #ef4444, #ec4899, #a855f7)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 30,
          padding: '0 50px',
        }}>
          <div style={{
            fontSize: 150, transform: `scale(${scale})`,
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))',
          }}>🏆</div>
          <div style={{
            fontSize: 80, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${scoreScale})`,
            textShadow: '0 6px 30px rgba(0,0,0,0.5)',
            lineHeight: 1.15,
          }}>
            HOW MANY<br/>DID YOU<br/>GET?
          </div>
          <div style={{
            fontSize: 44, color: '#FFD700', fontWeight: 800,
            transform: `scale(${subScale})`,
            background: 'rgba(0,0,0,0.3)',
            padding: '15px 35px',
            borderRadius: 20,
            textAlign: 'center',
          }}>
            Comment your score! 👇
          </div>
          <div style={{
            fontSize: 38, color: '#fff', fontWeight: 700,
            marginTop: 10,
            transform: `scale(${subScale})`,
          }}>
            FOLLOW FOR MORE 🔔
          </div>
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
  const bgColors = BG_GRADIENTS[questionIndex % BG_GRADIENTS.length];

  const flagScale = spring({frame: localFrame, fps, from: 0.2, to: 1, durationInFrames: 15});
  const countdownSeconds = Math.min(3, Math.max(0, Math.ceil((QUESTION_FRAMES - localFrame) / 20)));

  const timerWidth = isAnswer ? 0 : interpolate(localFrame, [0, QUESTION_FRAMES], [100, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const answerScale = isAnswer ? spring({frame: localFrame - QUESTION_FRAMES, fps, from: 0, to: 1, durationInFrames: 12}) : 0;
  const flashOpacity = isAnswer ? interpolate(localFrame - QUESTION_FRAMES, [0, 8], [0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  const isUrgent = countdownSeconds <= 1 && !isAnswer;
  const urgentShake = isUrgent ? Math.sin(localFrame * 1.2) * 5 : 0;
  const flagBob = Math.sin(localFrame * 0.08) * 8;

  const numberColor = countdownSeconds <= 1 ? '#ff4444' : '#FFD700';

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AnimatedBg frame={localFrame} colors={isAnswer ? ['#059669', '#10b981'] : bgColors} />

      {/* Question counter */}
      <div style={{
        position: 'absolute', top: 80, left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: 30, padding: '10px 30px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.15)',
      }}>
        <span style={{fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: 2}}>
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* Which country? */}
      {!isAnswer && (
        <div style={{
          position: 'absolute', top: 160, left: 0, right: 0,
          textAlign: 'center', padding: '0 30px',
        }}>
          <span style={{
            fontSize: 56, fontWeight: 900, color: '#fff',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            letterSpacing: 3,
            display: 'inline-block',
            transform: `translateX(${urgentShake}px)`,
          }}>
            WHICH COUNTRY? 🤔
          </span>
        </div>
      )}

      {/* Main flag */}
      <div style={{
        position: 'absolute', top: 280, left: 0, right: 0, bottom: 700,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 350,
          transform: `scale(${flagScale}) translateY(${flagBob}px) translateX(${urgentShake}px)`,
          lineHeight: 1,
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.4))',
        }}>
          {q.flag}
        </div>
      </div>

      {/* Flash on answer */}
      {isAnswer && flashOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: '#fff',
          opacity: flashOpacity,
        }} />
      )}

      {/* Bottom section */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 700,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 40px',
      }}>
        {!isAnswer ? (
          <>
            {/* Giant question mark */}
            <div style={{
              fontSize: 250, fontWeight: 900,
              color: 'rgba(255,255,255,0.08)',
              lineHeight: 1, position: 'absolute', top: 20,
            }}>?</div>

            {/* Countdown */}
            <div style={{
              fontSize: 200, fontWeight: 900,
              color: numberColor,
              textShadow: `0 0 80px ${numberColor}88, 0 8px 30px rgba(0,0,0,0.5)`,
              transform: `scale(${spring({
                frame: localFrame % 20 === 0 ? 0 : Math.max(0, localFrame % 20),
                fps, from: 1.3, to: 1, durationInFrames: 8,
              })})`,
              lineHeight: 1,
            }}>
              {countdownSeconds}
            </div>

            {/* Timer bar */}
            <div style={{
              width: '80%', height: 18,
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: 9, overflow: 'hidden',
              marginTop: 25,
              border: '2px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{
                width: `${timerWidth}%`, height: '100%',
                background: timerWidth < 30
                  ? 'linear-gradient(90deg, #ff4444, #ff6b6b)'
                  : 'linear-gradient(90deg, #FFD700, #fbbf24)',
                borderRadius: 9,
                boxShadow: timerWidth < 30
                  ? '0 0 20px rgba(255,68,68,0.5)'
                  : '0 0 20px rgba(255,215,0,0.3)',
              }} />
            </div>

            <div style={{
              fontSize: 40, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
              marginTop: 30, letterSpacing: 5,
            }}>
              ⏱️ GUESS NOW! ⏱️
            </div>
          </>
        ) : (
          <>
            <div style={{
              fontSize: 90,
              transform: `scale(${answerScale})`,
              filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))',
            }}>
              ✅
            </div>
            <div style={{
              fontSize: 90, fontWeight: 900, color: '#fff',
              textShadow: '0 6px 30px rgba(0,0,0,0.5), 0 0 80px rgba(255,215,0,0.3)',
              letterSpacing: 4,
              transform: `scale(${answerScale})`,
              textAlign: 'center',
              lineHeight: 1.15,
              marginTop: 15,
              WebkitTextStroke: '2px rgba(0,0,0,0.15)',
            }}>
              {q.country.toUpperCase()}
            </div>
            <div style={{
              fontSize: 36, fontWeight: 700,
              color: '#FFD700',
              marginTop: 20,
              opacity: answerScale,
              letterSpacing: 4,
            }}>
              {q.continent}
            </div>
          </>
        )}
      </div>

      {/* Corner frames */}
      {[
        {top: 0, left: 0, bds: ['Top', 'Left']},
        {top: 0, right: 0, bds: ['Top', 'Right']},
        {bottom: 0, left: 0, bds: ['Bottom', 'Left']},
        {bottom: 0, right: 0, bds: ['Bottom', 'Right']},
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...(s.top !== undefined ? {top: s.top} : {}),
          ...(s.bottom !== undefined ? {bottom: s.bottom} : {}),
          ...(s.left !== undefined ? {left: s.left} : {}),
          ...(s.right !== undefined ? {right: s.right} : {}),
          width: 80, height: 80,
          [`border${s.bds[0]}`]: '4px solid rgba(255,255,255,0.15)',
          [`border${s.bds[1]}`]: '4px solid rgba(255,255,255,0.15)',
          [`border${s.bds[0]}${s.bds[1]}Radius`]: 20,
          margin: 12,
        } as React.CSSProperties} />
      ))}
    </AbsoluteFill>
  );
};
