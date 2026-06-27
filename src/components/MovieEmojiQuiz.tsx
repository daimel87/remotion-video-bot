import React from 'react';
import {AbsoluteFill, Audio, Img, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {MOVIES} from './movieEmojiData';

const INTRO_FRAMES = 60; // 2s
const QUESTION_FRAMES = 240; // 8s per question
const OUTRO_FRAMES = 90; // 3s

// Per question timing (within 240 frames = 8 seconds)
const EMOJI_APPEAR = 0;
const THINK_TIME = 120; // 4s to think
const TICK_START = 90; // ticks start at 3s
const REVEAL_FRAME = 180; // answer at 6s
const FADE_START = 220; // fade at 7.3s

const BG_COLORS = [
  ['#7c3aed', '#4c1d95'], ['#dc2626', '#991b1b'], ['#2563eb', '#1e40af'],
  ['#db2777', '#9d174d'], ['#059669', '#047857'], ['#ea580c', '#c2410c'],
  ['#0891b2', '#0e7490'], ['#e11d48', '#be123c'], ['#4f46e5', '#4338ca'],
  ['#d97706', '#b45309'],
];

export const MovieEmojiQuiz: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalQuestions = MOVIES.length;
  const outroStart = INTRO_FRAMES + totalQuestions * QUESTION_FRAMES;

  // INTRO
  if (frame < INTRO_FRAMES) {
    const scale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 15});
    const subOp = interpolate(frame, [20, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const bgRot = frame * 1.5;

    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${bgRot}deg, #7c3aed, #dc2626, #ea580c)`}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
          <div style={{fontSize: 160, transform: `scale(${scale})`}}>🎬</div>
          <div style={{
            fontSize: 100, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${scale})`, lineHeight: 1.1,
            textShadow: '0 8px 40px rgba(0,0,0,0.6)',
          }}>
            GUESS THE
            <br />
            <span style={{color: '#FFD700', fontSize: 110}}>MOVIE!</span>
          </div>
          <div style={{
            fontSize: 50, color: '#fff', fontWeight: 800, opacity: subOp,
            background: 'rgba(0,0,0,0.4)', padding: '12px 40px', borderRadius: 20,
          }}>
            BY THE EMOJIS 🎭
          </div>
        </div>
        <Audio src={staticFile('audio/pop.wav')} startFrom={0} volume={0.6} />
      </AbsoluteFill>
    );
  }

  // OUTRO
  if (frame >= outroStart) {
    const of = frame - outroStart;
    const scale = spring({frame: of, fps, from: 0.3, to: 1, durationInFrames: 15});
    const subScale = spring({frame: Math.max(0, of - 15), fps, from: 0, to: 1, durationInFrames: 15});

    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${of * 1.2}deg, #dc2626, #7c3aed, #2563eb)`}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 25}}>
          <div style={{fontSize: 140, transform: `scale(${scale})`}}>🏆</div>
          <div style={{
            fontSize: 80, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${scale})`, textShadow: '0 6px 30px rgba(0,0,0,0.5)', lineHeight: 1.15,
          }}>
            HOW MANY<br/>DID YOU<br/>GET RIGHT?
          </div>
          <div style={{
            fontSize: 50, color: '#FFD700', fontWeight: 800,
            transform: `scale(${subScale})`,
            background: 'rgba(0,0,0,0.4)', padding: '15px 40px', borderRadius: 20,
          }}>
            Comment below! 👇
          </div>
          <div style={{
            fontSize: 40, color: '#fff', fontWeight: 700,
            transform: `scale(${subScale})`,
          }}>
            FOLLOW FOR MORE 🔔
          </div>
        </div>
        <Audio src={staticFile('audio/reveal.wav')} startFrom={0} volume={0.7} />
      </AbsoluteFill>
    );
  }

  // QUESTION PHASE
  const qFrame = frame - INTRO_FRAMES;
  const qIndex = Math.min(Math.floor(qFrame / QUESTION_FRAMES), totalQuestions - 1);
  const localFrame = qFrame - qIndex * QUESTION_FRAMES;
  const movie = MOVIES[qIndex];
  const bg = BG_COLORS[qIndex % BG_COLORS.length];
  const isRevealed = localFrame >= REVEAL_FRAME;

  // Emoji pop-in animations (staggered)
  const emojis = [...movie.emojis].filter(c => c.trim() && !c.match(/[️‍]/));
  const emojiScales = emojis.map((_, i) =>
    spring({frame: Math.max(0, localFrame - i * 8), fps, from: 0, to: 1, durationInFrames: 10})
  );

  // Question number
  const numScale = spring({frame: localFrame, fps, from: 2, to: 1, durationInFrames: 12});

  // Countdown timer (visual)
  const thinkSeconds = Math.max(0, Math.ceil((REVEAL_FRAME - localFrame) / fps));
  const timerOpacity = localFrame > 30 && !isRevealed ? 1 : 0;

  // Tick pulse (near end of thinking)
  const isTicking = localFrame >= TICK_START && localFrame < REVEAL_FRAME;
  const tickPulse = isTicking ? spring({frame: localFrame % 15, fps, from: 1.1, to: 1, durationInFrames: 8}) : 1;

  // Answer reveal
  const answerScale = isRevealed ? spring({frame: localFrame - REVEAL_FRAME, fps, from: 0, to: 1, durationInFrames: 12}) : 0;
  const answerGlow = isRevealed ? interpolate(localFrame - REVEAL_FRAME, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  // Question mark bounce
  const qMarkScale = !isRevealed ? spring({frame: Math.max(0, localFrame - 40), fps, from: 0, to: 1, durationInFrames: 15}) : 0;

  // Fade out
  const fadeOut = interpolate(localFrame, [FADE_START, QUESTION_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Background animation
  const bgRot = localFrame * 0.3;

  return (
    <AbsoluteFill style={{opacity: fadeOut}}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${bgRot + 135}deg, ${bg[0]} 0%, ${bg[1]} 100%)`}} />

      {/* Decorative circles */}
      <div style={{position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}} />
      <div style={{position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}} />

      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, padding: '0 40px'}}>

        {/* Question number */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          padding: '10px 40px', borderRadius: 50,
          transform: `scale(${numScale})`,
          border: '3px solid rgba(255,255,255,0.2)',
        }}>
          <span style={{fontSize: 42, fontWeight: 900, color: '#FFD700'}}>
            #{qIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Emojis */}
        <div style={{
          display: 'flex', gap: 15, alignItems: 'center', justifyContent: 'center',
          flexWrap: 'wrap',
          background: 'rgba(0,0,0,0.3)',
          padding: '30px 50px', borderRadius: 30,
          border: '4px solid rgba(255,255,255,0.15)',
          minHeight: 180,
        }}>
          {emojis.map((emoji, i) => (
            <span key={i} style={{
              fontSize: 120,
              transform: `scale(${emojiScales[i]})`,
              display: 'inline-block',
            }}>
              {emoji}
            </span>
          ))}
        </div>

        {/* Question mark or Timer */}
        {!isRevealed && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15}}>
            <div style={{
              fontSize: 130, transform: `scale(${qMarkScale})`,
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))',
            }}>
              🤔
            </div>
            {timerOpacity > 0 && (
              <div style={{
                background: thinkSeconds <= 2 ? '#dc2626' : 'rgba(0,0,0,0.5)',
                padding: '12px 50px', borderRadius: 20,
                transform: `scale(${tickPulse})`,
                border: '3px solid rgba(255,255,255,0.2)',
              }}>
                <span style={{fontSize: 60, fontWeight: 900, color: '#fff'}}>
                  ⏱️ {thinkSeconds}s
                </span>
              </div>
            )}
          </div>
        )}

        {/* Answer reveal */}
        {isRevealed && (
          <div style={{
            transform: `scale(${answerScale})`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15,
          }}>
            <div style={{fontSize: 100}}>✅</div>
            <div style={{
              background: '#FFD700',
              padding: '20px 50px', borderRadius: 25,
              boxShadow: `0 0 ${answerGlow * 60}px rgba(255,215,0,0.6)`,
              border: '4px solid rgba(0,0,0,0.15)',
            }}>
              <span style={{
                fontSize: 56, fontWeight: 900, color: '#000',
                textAlign: 'center', letterSpacing: 2,
              }}>
                {movie.answer}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sound effects */}
      {localFrame === 0 && (
        <Audio src={staticFile('audio/pop.wav')} startFrom={0} volume={0.5} />
      )}
      {isTicking && localFrame % 30 === 0 && (
        <Audio src={staticFile('audio/tick.wav')} startFrom={0} volume={0.4} />
      )}
      {localFrame === REVEAL_FRAME && (
        <Audio src={staticFile('audio/reveal.wav')} startFrom={0} volume={0.7} />
      )}
    </AbsoluteFill>
  );
};
