import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {CHARACTERS} from './toyStoryData';

const INTRO_FRAMES = 90;
const OUTRO_FRAMES = 120;
const SILHOUETTE_FRAMES = 300; // 10 seconds at 30fps
const REVEAL_FRAMES = 150; // 5 seconds
const TOTAL_PER_Q = SILHOUETTE_FRAMES + REVEAL_FRAMES;

const BG_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#1a0a2e', '#2d1b69',
  '#1b2838', '#0a1628', '#1e0533',
];

const QUESTION_AUDIOS = [
  'audio/question1.mp3',
  'audio/question2.mp3',
  'audio/question3.mp3',
];

export const ToyStoryQuiz: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const totalQuestions = CHARACTERS.length;
  const outroStart = INTRO_FRAMES + totalQuestions * TOTAL_PER_Q;

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0a1a', fontFamily: 'Arial, sans-serif'}}>
      {/* Intro audio */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile('audio/toystory/intro.mp3')} volume={0.9} />
      </Sequence>

      {/* Outro audio */}
      <Sequence from={outroStart} layout="none">
        <Audio src={staticFile('audio/toystory/outro.mp3')} volume={0.9} />
      </Sequence>

      {/* Per-character audio */}
      {CHARACTERS.map((ch, i) => {
        const qStart = INTRO_FRAMES + i * TOTAL_PER_Q;
        const revealStart = qStart + SILHOUETTE_FRAMES;
        const tickStart = revealStart - 90; // ticks in last 3 seconds
        const questionAudio = QUESTION_AUDIOS[i % QUESTION_AUDIOS.length];

        return (
          <React.Fragment key={ch.id}>
            <Sequence from={qStart} layout="none">
              <Audio src={staticFile('audio/pop.wav')} volume={0.6} />
            </Sequence>

            <Sequence from={qStart + 5} layout="none">
              <Audio src={staticFile(questionAudio)} volume={0.85} />
            </Sequence>

            {[0, 15, 30, 45, 60, 70, 78, 84].map((offset) => (
              <Sequence key={offset} from={tickStart + offset} layout="none">
                <Audio src={staticFile('audio/tick.wav')} volume={offset >= 60 ? 0.8 : 0.5} />
              </Sequence>
            ))}

            <Sequence from={revealStart + 3} layout="none">
              <Audio src={staticFile(`audio/toystory/${ch.id}.mp3`)} volume={0.95} />
            </Sequence>
          </React.Fragment>
        );
      })}

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
    const titleScale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 25});
    const titleOpacity = interpolate(frame, [5, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const subtitleOpacity = interpolate(frame, [25, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const countdownText = frame < 60 ? '' : `${3 - Math.floor((frame - 60) / 10)}`;

    return (
      <AbsoluteFill>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, #1a1a4e 0%, #0a0a1a 100%)',
        }} />

        {/* Floating silhouettes in background */}
        <div style={{position: 'absolute', inset: 0, opacity: 0.08, overflow: 'hidden'}}>
          {CHARACTERS.map((ch, i) => {
            const x = (i % 4) * 25 + 5;
            const y = Math.floor(i / 4) * 45 + 10;
            const bobY = Math.sin((frame + i * 20) * 0.05) * 15;
            return (
              <Img key={ch.id} src={staticFile(ch.image)} style={{
                position: 'absolute',
                left: `${x}%`, top: `${y}%`,
                height: 200,
                transform: `translateY(${bobY}px)`,
                filter: 'brightness(0) invert(1)',
              }} />
            );
          })}
        </div>

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <div style={{
            fontSize: 120, transform: `scale(${titleScale})`, opacity: titleOpacity,
          }}>🎬</div>
          <div style={{
            fontSize: 100, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${titleScale})`, letterSpacing: 4,
            opacity: titleOpacity,
            textShadow: '0 6px 30px rgba(0,0,0,0.8), 0 0 60px rgba(100,200,255,0.3)',
            lineHeight: 1.1,
          }}>
            GUESS THE
            <br />
            <span style={{color: '#FFD700', fontSize: 110}}>CHARACTER</span>
          </div>
          <div style={{
            fontSize: 40, color: '#82b1ff', fontWeight: 700, opacity: subtitleOpacity,
            marginTop: 15, textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}>
            Toy Story Edition — Can You Guess All 8?
          </div>
          {frame >= 60 && (
            <div style={{
              fontSize: 80, fontWeight: 900, color: '#FFD700',
              marginTop: 20, textShadow: '0 0 40px rgba(255,215,0,0.5)',
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
    const scale = spring({frame: outroFrame, fps, from: 0.5, to: 1, durationInFrames: 20});
    return (
      <AbsoluteFill style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 24,
        background: 'radial-gradient(ellipse at center, #1a1a4e 0%, #0a0a1a 100%)',
      }}>
        <div style={{fontSize: 100, transform: `scale(${scale})`}}>🏆</div>
        <div style={{fontSize: 56, fontWeight: 900, color: '#fff', transform: `scale(${scale})`}}>
          HOW MANY DID YOU GET?
        </div>
        <div style={{fontSize: 32, color: '#FFD700', fontWeight: 700}}>
          Comment your score below! 👇
        </div>
        <div style={{fontSize: 28, color: 'rgba(255,255,255,0.6)', marginTop: 10}}>
          LIKE & SUBSCRIBE for more quizzes! 🔔
        </div>
      </AbsoluteFill>
    );
  }

  // QUESTION PHASE
  const questionFrame = frame - INTRO_FRAMES;
  const questionIndex = Math.min(Math.floor(questionFrame / TOTAL_PER_Q), totalQuestions - 1);
  const localFrame = questionFrame - questionIndex * TOTAL_PER_Q;
  const isReveal = localFrame >= SILHOUETTE_FRAMES;
  const ch = CHARACTERS[questionIndex];
  const bgColor = BG_COLORS[questionIndex % BG_COLORS.length];

  const silhouetteScale = spring({frame: localFrame, fps, from: 0.3, to: 1, durationInFrames: 20});
  const countdownSeconds = Math.min(10, Math.max(0, Math.ceil((SILHOUETTE_FRAMES - localFrame) / fps)));

  const timerWidth = isReveal ? 0 : interpolate(localFrame, [0, SILHOUETTE_FRAMES], [100, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const revealLocalFrame = localFrame - SILHOUETTE_FRAMES;
  const nameScale = isReveal ? spring({frame: revealLocalFrame, fps, from: 0, to: 1, durationInFrames: 15}) : 0;
  const flashOpacity = isReveal ? interpolate(revealLocalFrame, [0, 8], [0.8, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  // Silhouette pulse effect near end
  const pulseIntensity = localFrame > SILHOUETTE_FRAMES - 90
    ? Math.sin(localFrame * 0.3) * 0.03 + 1
    : 1;

  // Glow color for silhouette
  const glowColor = isReveal ? 'rgba(255,215,0,0.6)' : 'rgba(100,150,255,0.3)';

  return (
    <AbsoluteFill style={{backgroundColor: bgColor, overflow: 'hidden'}}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 50% 40%, ${bgColor} 0%, rgba(0,0,0,0.6) 100%)`,
      }} />

      {/* Question counter */}
      <div style={{position: 'absolute', top: 30, left: 40, display: 'flex', alignItems: 'center', gap: 12}}>
        <div style={{
          backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 30,
          padding: '10px 24px', fontSize: 22, fontWeight: 800, color: '#fff',
        }}>
          {questionIndex + 1} / {totalQuestions}
        </div>
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 30, right: 40,
        fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
        letterSpacing: 3, textTransform: 'uppercase',
      }}>
        🎬 Guess The Character
      </div>

      {/* Question mark background */}
      {!isReveal && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 500, fontWeight: 900, color: 'rgba(255,255,255,0.03)',
          lineHeight: 1, userSelect: 'none',
        }}>
          ?
        </div>
      )}

      {/* Silhouette / Character image */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0, bottom: 250,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Img src={staticFile(ch.image)} style={{
          maxHeight: '100%', maxWidth: '80%', objectFit: 'contain',
          transform: `scale(${silhouetteScale * pulseIntensity})`,
          filter: isReveal ? 'none' : `brightness(0) drop-shadow(0 0 30px ${glowColor})`,
          transition: isReveal ? 'filter 0.3s ease' : 'none',
        }} />
      </div>

      {/* Flash on reveal */}
      {isReveal && flashOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: `rgba(255,255,255,${flashOpacity})`,
        }} />
      )}

      {!isReveal ? (
        <>
          {/* Who is this? */}
          <div style={{
            position: 'absolute', bottom: 200, left: 0, right: 0,
            textAlign: 'center', fontSize: 42, fontWeight: 800, color: '#fff',
            textShadow: '0 4px 16px rgba(0,0,0,0.5)',
          }}>
            Who is this character?
          </div>

          {/* Countdown */}
          <div style={{
            position: 'absolute', bottom: 130, left: 0, right: 0,
            textAlign: 'center', fontSize: 72, fontWeight: 900,
            color: countdownSeconds <= 3 ? '#ff4444' : '#FFD700',
            textShadow: '0 0 30px rgba(0,0,0,0.5)',
          }}>
            {countdownSeconds}
          </div>

          {/* Timer bar */}
          <div style={{
            position: 'absolute', bottom: 100, left: 200, right: 200,
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
          {/* Character name reveal */}
          <div style={{
            position: 'absolute', bottom: 130, left: 0, right: 0,
            textAlign: 'center', transform: `scale(${nameScale})`,
          }}>
            <div style={{
              fontSize: 80, fontWeight: 900, color: '#FFD700',
              textShadow: '0 4px 20px rgba(255,215,0,0.4), 0 0 60px rgba(255,215,0,0.2)',
              letterSpacing: 4,
            }}>
              {ch.name}
            </div>
          </div>

          {/* Checkmark */}
          <div style={{
            position: 'absolute', bottom: 230, left: 0, right: 0,
            textAlign: 'center', fontSize: 60,
            transform: `scale(${nameScale})`,
          }}>
            ✅
          </div>
        </>
      )}

      {/* Footer */}
      <div style={{
        position: 'absolute', bottom: 20, left: 0, right: 0,
        textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.2)',
      }}>
        Like & Subscribe for more quizzes!
      </div>
    </AbsoluteFill>
  );
};
