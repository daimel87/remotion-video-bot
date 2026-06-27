import React from 'react';
import {AbsoluteFill, Audio, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {MOVIES} from './movieEmojiData';

const INTRO_FRAMES = 60;
const QUESTION_FRAMES = 240;
const OUTRO_FRAMES = 90;

const TICK_START = 90;
const REVEAL_FRAME = 180;
const FADE_START = 220;

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

  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Arial, sans-serif'}}>
      {/* INTRO */}
      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <Intro fps={fps} />
      </Sequence>

      {/* QUESTIONS */}
      {MOVIES.map((movie, i) => {
        const qStart = INTRO_FRAMES + i * QUESTION_FRAMES;
        return (
          <Sequence key={i} from={qStart} durationInFrames={QUESTION_FRAMES}>
            <Question movie={movie} index={i} total={totalQuestions} fps={fps} bg={BG_COLORS[i % BG_COLORS.length]} />
          </Sequence>
        );
      })}

      {/* OUTRO */}
      <Sequence from={outroStart} durationInFrames={OUTRO_FRAMES}>
        <Outro fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Intro: React.FC<{fps: number}> = ({fps}) => {
  const frame = useCurrentFrame();
  const scale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 15});
  const subOp = interpolate(frame, [20, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${frame * 1.5}deg, #7c3aed, #dc2626, #ea580c)`}} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        <div style={{fontSize: 160, transform: `scale(${scale})`}}>🎬</div>
        <div style={{
          fontSize: 100, fontWeight: 900, color: '#fff', textAlign: 'center',
          transform: `scale(${scale})`, lineHeight: 1.1,
          textShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}>
          GUESS THE<br />
          <span style={{color: '#FFD700', fontSize: 110}}>MOVIE!</span>
        </div>
        <div style={{
          fontSize: 50, color: '#fff', fontWeight: 800, opacity: subOp,
          background: 'rgba(0,0,0,0.4)', padding: '12px 40px', borderRadius: 20,
        }}>
          BY THE EMOJIS 🎭
        </div>
      </div>
      <Audio src={staticFile('audio/pop.wav')} volume={0.6} />
    </AbsoluteFill>
  );
};

const Outro: React.FC<{fps: number}> = ({fps}) => {
  const frame = useCurrentFrame();
  const scale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 15});
  const subScale = spring({frame: Math.max(0, frame - 15), fps, from: 0, to: 1, durationInFrames: 15});

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${frame * 1.2}deg, #dc2626, #7c3aed, #2563eb)`}} />
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
      <Audio src={staticFile('audio/reveal.wav')} volume={0.7} />
    </AbsoluteFill>
  );
};

const Question: React.FC<{
  movie: {emojis: string; answer: string};
  index: number;
  total: number;
  fps: number;
  bg: string[];
}> = ({movie, index, total, fps, bg}) => {
  const frame = useCurrentFrame();
  const isRevealed = frame >= REVEAL_FRAME;

  const emojis = [...movie.emojis].filter(c => c.trim() && !c.match(/[️‍]/));
  const emojiScales = emojis.map((_, i) =>
    spring({frame: Math.max(0, frame - i * 8), fps, from: 0, to: 1, durationInFrames: 10})
  );

  const numScale = spring({frame, fps, from: 2, to: 1, durationInFrames: 12});
  const thinkSeconds = Math.max(0, Math.ceil((REVEAL_FRAME - frame) / fps));
  const showTimer = frame > 30 && !isRevealed;

  const isTicking = frame >= TICK_START && frame < REVEAL_FRAME;
  const tickPulse = isTicking ? spring({frame: frame % 15, fps, from: 1.1, to: 1, durationInFrames: 8}) : 1;

  const answerScale = isRevealed ? spring({frame: frame - REVEAL_FRAME, fps, from: 0, to: 1, durationInFrames: 12}) : 0;
  const answerGlow = isRevealed ? interpolate(frame - REVEAL_FRAME, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const qMarkScale = !isRevealed ? spring({frame: Math.max(0, frame - 40), fps, from: 0, to: 1, durationInFrames: 15}) : 0;
  const fadeOut = interpolate(frame, [FADE_START, QUESTION_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: fadeOut}}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${frame * 0.3 + 135}deg, ${bg[0]} 0%, ${bg[1]} 100%)`}} />

      <div style={{position: 'absolute', top: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}} />
      <div style={{position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)'}} />

      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, padding: '0 40px'}}>
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          padding: '10px 40px', borderRadius: 50,
          transform: `scale(${numScale})`,
          border: '3px solid rgba(255,255,255,0.2)',
        }}>
          <span style={{fontSize: 42, fontWeight: 900, color: '#FFD700'}}>
            #{index + 1} / {total}
          </span>
        </div>

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

        {!isRevealed && (
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15}}>
            <div style={{
              fontSize: 130, transform: `scale(${qMarkScale})`,
              filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.4))',
            }}>
              🤔
            </div>
            {showTimer && (
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

      {/* Pop sound at start */}
      <Audio src={staticFile('audio/pop.wav')} volume={0.5} />

      {/* Tick sounds during countdown */}
      {[90, 120, 150].map(f => (
        <Sequence key={f} from={f} durationInFrames={15}>
          <Audio src={staticFile('audio/tick.wav')} volume={0.4} />
        </Sequence>
      ))}

      {/* Reveal sound */}
      <Sequence from={REVEAL_FRAME} durationInFrames={30}>
        <Audio src={staticFile('audio/reveal.wav')} volume={0.7} />
      </Sequence>
    </AbsoluteFill>
  );
};
