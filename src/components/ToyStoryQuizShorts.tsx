import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {CHARACTERS} from './toyStoryData';

const INTRO_FRAMES = 90;
const OUTRO_FRAMES = 120;
const SILHOUETTE_FRAMES = 300;
const REVEAL_FRAMES = 150;
const TOTAL_PER_Q = SILHOUETTE_FRAMES + REVEAL_FRAMES;

const BG_GRADIENTS = [
  ['#ff6b35', '#ff2e63'],
  ['#08d9d6', '#0652dd'],
  ['#a855f7', '#6366f1'],
  ['#f59e0b', '#ef4444'],
  ['#10b981', '#059669'],
  ['#ec4899', '#8b5cf6'],
  ['#3b82f6', '#1d4ed8'],
  ['#f97316', '#dc2626'],
];

const QUESTION_AUDIOS = [
  'audio/toystory/question1.mp3',
  'audio/toystory/question2.mp3',
  'audio/toystory/question3.mp3',
];

export const ToyStoryQuizShorts: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const totalQuestions = CHARACTERS.length;
  const outroStart = INTRO_FRAMES + totalQuestions * TOTAL_PER_Q;

  return (
    <AbsoluteFill style={{backgroundColor: '#0a0a1a', fontFamily: 'Arial, sans-serif'}}>
      <Sequence from={0} layout="none">
        <Audio src={staticFile('audio/toystory/intro.mp3')} volume={0.9} />
      </Sequence>
      <Sequence from={outroStart} layout="none">
        <Audio src={staticFile('audio/toystory/outro.mp3')} volume={0.9} />
      </Sequence>

      {CHARACTERS.map((ch, i) => {
        const qStart = INTRO_FRAMES + i * TOTAL_PER_Q;
        const revealStart = qStart + SILHOUETTE_FRAMES;
        const tickStart = revealStart - 90;
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

      <ShortsVisuals frame={frame} fps={fps} totalQuestions={totalQuestions} outroStart={outroStart} />
    </AbsoluteFill>
  );
};

const ProgressDots: React.FC<{current: number; total: number}> = ({current, total}) => (
  <div style={{
    position: 'absolute', top: 100, left: 0, right: 0,
    display: 'flex', justifyContent: 'center', gap: 10,
  }}>
    {Array.from({length: total}).map((_, i) => (
      <div key={i} style={{
        width: i === current ? 40 : 22,
        height: 12,
        borderRadius: 6,
        backgroundColor: i < current ? '#4ade80' : i === current ? '#FFD700' : 'rgba(255,255,255,0.25)',
        boxShadow: i === current ? '0 0 12px rgba(255,215,0,0.6)' : 'none',
      }} />
    ))}
  </div>
);

const AnimatedBg: React.FC<{frame: number; colors: string[]}> = ({frame, colors}) => {
  const rotation = frame * 0.3;
  return (
    <>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(160deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: -300,
        background: `conic-gradient(from ${rotation}deg at 70% 30%, transparent 0%, ${colors[0]}44 15%, transparent 30%)`,
      }} />
      <div style={{
        position: 'absolute', inset: -300,
        background: `conic-gradient(from ${rotation + 180}deg at 30% 70%, transparent 0%, ${colors[1]}44 15%, transparent 30%)`,
      }} />
      {[0, 1, 2, 3].map((i) => {
        const x = 10 + i * 25;
        const y = 20 + Math.sin((frame + i * 40) * 0.04) * 15;
        const size = 200 + i * 50;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: size, height: size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors[i % 2]}33 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }} />
        );
      })}
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
    const subtitleSlide = spring({frame: Math.max(0, frame - 15), fps, from: 60, to: 0, durationInFrames: 20});
    const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const countdownText = frame < 60 ? '' : `${3 - Math.floor((frame - 60) / 10)}`;
    const bgRotation = frame * 0.5;

    return (
      <AbsoluteFill>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(${bgRotation}deg, #ff6b35, #ff2e63, #a855f7, #3b82f6)`,
          backgroundSize: '400% 400%',
        }} />
        <div style={{
          position: 'absolute', inset: -300,
          background: `conic-gradient(from ${bgRotation}deg at 50% 50%, #ff6b3544 0%, transparent 25%, #a855f744 50%, transparent 75%)`,
        }} />

        {[0, 1, 2, 3, 4].map((i) => {
          const x = 5 + i * 22;
          const y = 15 + Math.sin((frame + i * 30) * 0.06) * 20;
          const rot = Math.sin((frame + i * 20) * 0.04) * 20;
          const s = spring({frame: Math.max(0, frame - i * 3), fps, from: 0, to: 1, durationInFrames: 15});
          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              fontSize: 140, fontWeight: 900, color: 'rgba(255,255,255,0.08)',
              transform: `rotate(${rot}deg) scale(${s})`,
            }}>?</div>
          );
        })}

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 15,
          padding: '0 40px',
        }}>
          <div style={{
            fontSize: 140, transform: `scale(${titleScale})`, opacity: titleOpacity,
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))',
          }}>🎬</div>
          <div style={{
            fontSize: 100, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${titleScale})`, letterSpacing: 4,
            opacity: titleOpacity,
            textShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 80px rgba(255,255,255,0.2)',
            lineHeight: 1.1,
            WebkitTextStroke: '2px rgba(0,0,0,0.2)',
          }}>
            GUESS
            <br />THE
            <br />
            <span style={{
              color: '#FFD700', fontSize: 110,
              textShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(255,215,0,0.5)',
            }}>CHARACTER</span>
          </div>
          <div style={{
            fontSize: 42, color: '#fff', fontWeight: 800, opacity: subtitleOpacity,
            marginTop: 20,
            textShadow: '0 4px 15px rgba(0,0,0,0.5)',
            transform: `translateY(${subtitleSlide}px)`,
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 30px',
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}>
            🧸 TOY STORY 🧸
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
    const bgRot = outroFrame * 0.4;
    const scoreScale = spring({frame: Math.max(0, outroFrame - 10), fps, from: 0, to: 1, durationInFrames: 20});
    const subScale = spring({frame: Math.max(0, outroFrame - 25), fps, from: 0, to: 1, durationInFrames: 20});

    return (
      <AbsoluteFill>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(${bgRot}deg, #f59e0b, #ef4444, #ec4899, #a855f7)`,
          backgroundSize: '400% 400%',
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
            textShadow: '0 4px 20px rgba(0,0,0,0.4)',
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
            textShadow: '0 3px 15px rgba(0,0,0,0.4)',
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
  const isReveal = localFrame >= SILHOUETTE_FRAMES;
  const ch = CHARACTERS[questionIndex];
  const bgColors = BG_GRADIENTS[questionIndex % BG_GRADIENTS.length];

  const silhouetteScale = spring({frame: localFrame, fps, from: 0.2, to: 1, durationInFrames: 20});
  const countdownSeconds = Math.min(10, Math.max(0, Math.ceil((SILHOUETTE_FRAMES - localFrame) / fps)));

  const timerWidth = isReveal ? 0 : interpolate(localFrame, [0, SILHOUETTE_FRAMES], [100, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const revealLocalFrame = localFrame - SILHOUETTE_FRAMES;
  const nameScale = isReveal ? spring({frame: revealLocalFrame, fps, from: 0, to: 1, durationInFrames: 12}) : 0;
  const flashOpacity = isReveal ? interpolate(revealLocalFrame, [0, 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  const isUrgent = countdownSeconds <= 3 && !isReveal;
  const pulseIntensity = isUrgent ? 1 + Math.sin(localFrame * 0.5) * 0.05 : 1;
  const silhouetteBob = Math.sin(localFrame * 0.06) * 10;
  const urgentShake = isUrgent ? Math.sin(localFrame * 1.2) * 5 : 0;
  const numberColor = countdownSeconds <= 3 ? '#ff4444' : '#FFD700';
  const glowIntensity = isUrgent ? 60 : 30;
  const glowColor = isReveal ? '#ffd700' : (isUrgent ? '#ff4444' : '#60a5fa');

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AnimatedBg frame={localFrame} colors={isReveal ? ['#059669', '#10b981'] : bgColors} />

      <ProgressDots current={questionIndex} total={totalQuestions} />

      {/* Question number badge */}
      <div style={{
        position: 'absolute', top: 135, left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: 30, padding: '8px 28px',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(255,255,255,0.15)',
      }}>
        <span style={{fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: 2}}>
          {questionIndex + 1} / {totalQuestions}
        </span>
      </div>

      {/* WHO IS THIS */}
      {!isReveal && (
        <div style={{
          position: 'absolute', top: 210, left: 0, right: 0,
          textAlign: 'center', padding: '0 30px',
        }}>
          <span style={{
            fontSize: 58, fontWeight: 900, color: '#fff',
            textShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.1)',
            letterSpacing: 3,
            transform: `translateX(${urgentShake}px)`,
            display: 'inline-block',
          }}>
            WHO IS THIS? 🤔
          </span>
        </div>
      )}

      {/* Silhouette */}
      <div style={{
        position: 'absolute', top: 320, left: 0, right: 0, bottom: 650,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute',
          width: '70%', height: '70%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${glowColor}40 0%, transparent 70%)`,
          filter: `blur(${glowIntensity}px)`,
        }} />
        <Img src={staticFile(ch.image)} style={{
          maxHeight: '100%', maxWidth: '85%', objectFit: 'contain',
          transform: `scale(${silhouetteScale * pulseIntensity}) translateY(${silhouetteBob}px) translateX(${urgentShake}px)`,
          filter: isReveal
            ? `drop-shadow(0 0 40px ${glowColor})`
            : `brightness(0) drop-shadow(0 0 ${glowIntensity}px ${glowColor})`,
        }} />
      </div>

      {/* Flash */}
      {isReveal && flashOpacity > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundColor: '#fff',
          opacity: flashOpacity,
        }} />
      )}

      {/* Bottom section */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 650,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 40px',
      }}>
        {!isReveal ? (
          <>
            {/* Big countdown */}
            <div style={{
              fontSize: 200, fontWeight: 900,
              color: numberColor,
              textShadow: `0 0 80px ${numberColor}88, 0 8px 30px rgba(0,0,0,0.5)`,
              transform: `scale(${spring({
                frame: localFrame % fps === 0 ? 0 : Math.max(0, localFrame % fps),
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

            {/* Guess now */}
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
              transform: `scale(${nameScale})`,
              filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))',
            }}>
              ✅
            </div>
            <div style={{
              fontSize: 90, fontWeight: 900, color: '#fff',
              textShadow: '0 6px 30px rgba(0,0,0,0.5), 0 0 80px rgba(255,215,0,0.3)',
              letterSpacing: 4,
              transform: `scale(${nameScale})`,
              textAlign: 'center',
              lineHeight: 1.15,
              marginTop: 15,
              WebkitTextStroke: '2px rgba(0,0,0,0.15)',
            }}>
              {ch.name.toUpperCase()}
            </div>
            <div style={{
              fontSize: 38, fontWeight: 700,
              color: '#FFD700',
              marginTop: 20,
              opacity: nameScale,
              textShadow: '0 3px 15px rgba(0,0,0,0.4)',
              letterSpacing: 4,
            }}>
              TOY STORY
            </div>
          </>
        )}
      </div>

      {/* Corner frames */}
      {[
        {top: 0, left: 0, bt: '4px', bl: '4px', btlr: 20},
        {top: 0, right: 0, bt: '4px', br: '4px', btrr: 20},
        {bottom: 0, left: 0, bb: '4px', bl: '4px', bblr: 20},
        {bottom: 0, right: 0, bb: '4px', br: '4px', bbrr: 20},
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...(s.top !== undefined ? {top: s.top} : {}),
          ...(s.bottom !== undefined ? {bottom: s.bottom} : {}),
          ...(s.left !== undefined ? {left: s.left} : {}),
          ...(s.right !== undefined ? {right: s.right} : {}),
          width: 80, height: 80,
          borderTop: s.bt ? `${s.bt} solid rgba(255,255,255,0.15)` : 'none',
          borderBottom: s.bb ? `${s.bb} solid rgba(255,255,255,0.15)` : 'none',
          borderLeft: s.bl ? `${s.bl} solid rgba(255,255,255,0.15)` : 'none',
          borderRight: s.br ? `${s.br} solid rgba(255,255,255,0.15)` : 'none',
          borderTopLeftRadius: s.btlr || 0,
          borderTopRightRadius: s.btrr || 0,
          borderBottomLeftRadius: s.bblr || 0,
          borderBottomRightRadius: s.bbrr || 0,
          margin: 12,
        }} />
      ))}
    </AbsoluteFill>
  );
};
