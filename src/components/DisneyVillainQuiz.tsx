import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {VILLAINS, DisneyVillain} from './disneyVillainData';

const INTRO_FRAMES = 75;
const QUESTION_FRAMES = 240;
const OUTRO_FRAMES = 90;

const REVEAL_FRAME = 165;
const FADE_START = 220;

export const DisneyVillainQuiz: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalQ = VILLAINS.length;
  const outroStart = INTRO_FRAMES + totalQ * QUESTION_FRAMES;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Arial, sans-serif'}}>
      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <Intro fps={fps} />
      </Sequence>

      {VILLAINS.map((v, i) => (
        <Sequence key={i} from={INTRO_FRAMES + i * QUESTION_FRAMES} durationInFrames={QUESTION_FRAMES}>
          <Question villain={v} index={i} total={totalQ} fps={fps} />
        </Sequence>
      ))}

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
  const skullScale = spring({frame: Math.max(0, frame - 10), fps, from: 0, to: 1, durationInFrames: 15});

  return (
    <AbsoluteFill>
      <VillainBackground frame={frame} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        <div style={{fontSize: 180, transform: `scale(${skullScale})`, filter: 'drop-shadow(0 0 30px rgba(128,0,255,0.6))'}}>😈</div>
        <div style={{
          fontSize: 110, fontWeight: 900, color: '#fff', textAlign: 'center',
          transform: `scale(${scale})`, lineHeight: 1.1,
          textShadow: '0 0 40px rgba(128,0,255,0.5), 0 8px 40px rgba(0,0,0,0.8)',
        }}>
          GUESS THE<br/>
          <span style={{
            fontSize: 120,
            background: 'linear-gradient(180deg, #a855f7, #7c3aed, #581c87)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))',
          }}>DISNEY MOVIE</span>
        </div>
        <div style={{
          fontSize: 60, color: '#fff', fontWeight: 800, opacity: subOp,
          background: 'rgba(128,0,255,0.3)', padding: '15px 50px', borderRadius: 25,
          border: '2px solid rgba(168,85,247,0.4)',
        }}>
          BY THE VILLAIN! 🦹
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{fps: number}> = ({fps}) => {
  const frame = useCurrentFrame();
  const scale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 15});
  const subScale = spring({frame: Math.max(0, frame - 15), fps, from: 0, to: 1, durationInFrames: 15});

  return (
    <AbsoluteFill>
      <VillainBackground frame={frame} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 25}}>
        <div style={{fontSize: 170, transform: `scale(${scale})`}}>🏆</div>
        <div style={{
          fontSize: 95, fontWeight: 900, color: '#fff', textAlign: 'center',
          transform: `scale(${scale})`, textShadow: '0 0 30px rgba(128,0,255,0.5)', lineHeight: 1.15,
        }}>
          HOW MANY<br/>DID YOU<br/>GET RIGHT?
        </div>
        <div style={{
          fontSize: 60, fontWeight: 800, transform: `scale(${subScale})`,
          background: 'linear-gradient(90deg, #a855f7, #7c3aed)',
          padding: '18px 50px', borderRadius: 25,
          border: '2px solid rgba(168,85,247,0.5)',
          color: '#fff',
        }}>
          Comment below! 👇
        </div>
        <div style={{fontSize: 50, color: '#c4b5fd', fontWeight: 700, transform: `scale(${subScale})`}}>
          FOLLOW FOR MORE 🔔
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Question: React.FC<{
  villain: DisneyVillain;
  index: number;
  total: number;
  fps: number;
}> = ({villain, index, total, fps}) => {
  const frame = useCurrentFrame();
  const isRevealed = frame >= REVEAL_FRAME;

  const silhouetteProgress = interpolate(frame, [REVEAL_FRAME, REVEAL_FRAME + 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const saturation = interpolate(silhouetteProgress, [0, 1], [0, 1]);
  const baseBrightness = villain.silhouetteBrightness ?? 0.4;
  const imgBrightness = interpolate(silhouetteProgress, [0, 1], [baseBrightness, 1]);
  const imgContrast = interpolate(silhouetteProgress, [0, 1], [1.8, 1]);
  const imgScale = spring({frame: Math.max(0, frame - 5), fps, from: 0.8, to: 1, durationInFrames: 20});
  const numScale = spring({frame, fps, from: 2, to: 1, durationInFrames: 12});

  const thinkSeconds = Math.max(0, Math.ceil((REVEAL_FRAME - frame) / fps));
  const showTimer = frame > 30 && !isRevealed;
  const isTicking = frame >= 90 && frame < REVEAL_FRAME;
  const tickPulse = isTicking ? spring({frame: frame % 15, fps, from: 1.1, to: 1, durationInFrames: 8}) : 1;

  const answerScale = isRevealed ? spring({frame: frame - REVEAL_FRAME, fps, from: 0, to: 1, durationInFrames: 12}) : 0;
  const answerGlow = isRevealed ? interpolate(frame - REVEAL_FRAME, [0, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
  const qMarkOp = interpolate(frame, [0, 20, REVEAL_FRAME - 5, REVEAL_FRAME], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeOut = interpolate(frame, [FADE_START, QUESTION_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const glowIntensity = isRevealed ? interpolate(frame - REVEAL_FRAME, [0, 15], [0, 40], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;

  return (
    <AbsoluteFill style={{opacity: fadeOut}}>
      <VillainBackground frame={frame + index * 100} />

      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15, padding: '30px 25px'}}>
        {/* Counter */}
        <div style={{
          background: 'rgba(128,0,255,0.3)',
          padding: '12px 50px', borderRadius: 50,
          transform: `scale(${numScale})`,
          border: '3px solid rgba(168,85,247,0.4)',
        }}>
          <span style={{fontSize: 52, fontWeight: 900, color: '#c4b5fd'}}>
            #{index + 1} / {total}
          </span>
        </div>

        {/* Villain image */}
        <div style={{
          width: '90%', aspectRatio: '3/4', borderRadius: 30,
          overflow: 'hidden', position: 'relative',
          transform: `scale(${imgScale})`,
          border: `5px solid ${isRevealed ? 'rgba(168,85,247,0.8)' : 'rgba(255,255,255,0.15)'}`,
          boxShadow: isRevealed
            ? `0 0 ${glowIntensity}px rgba(168,85,247,0.6), 0 0 ${glowIntensity * 2}px rgba(128,0,255,0.3)`
            : '0 10px 40px rgba(0,0,0,0.6)',
        }}>
          <Img
            src={staticFile(villain.image)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: `brightness(${imgBrightness}) saturate(${saturation}) contrast(${imgContrast})`,
            }}
          />
          {/* "?" overlay on silhouette */}
          {!isRevealed && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: qMarkOp,
            }}>
              <span style={{
                fontSize: 280, fontWeight: 900, color: '#a855f7',
                textShadow: '0 0 50px rgba(168,85,247,0.8), 0 0 100px rgba(128,0,255,0.4)',
              }}>?</span>
            </div>
          )}
        </div>

        {/* Timer */}
        {showTimer && (
          <div style={{
            background: thinkSeconds <= 2 ? 'rgba(220,38,38,0.8)' : 'rgba(128,0,255,0.4)',
            padding: '15px 60px', borderRadius: 25,
            transform: `scale(${tickPulse})`,
            border: '3px solid rgba(255,255,255,0.2)',
          }}>
            <span style={{fontSize: 70, fontWeight: 900, color: '#fff'}}>
              ⏱️ {thinkSeconds}s
            </span>
          </div>
        )}

        {/* Answer reveal */}
        {isRevealed && (
          <div style={{
            transform: `scale(${answerScale})`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
              padding: '22px 55px', borderRadius: 25,
              boxShadow: `0 0 ${answerGlow * 50}px rgba(168,85,247,0.6)`,
              border: '3px solid rgba(255,255,255,0.2)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            }}>
              <span style={{fontSize: 52, fontWeight: 900, color: '#fff', letterSpacing: 2}}>
                {villain.villain.toUpperCase()}
              </span>
              <span style={{fontSize: 42, fontWeight: 700, color: '#e9d5ff'}}>
                {villain.movie}
              </span>
            </div>
          </div>
        )}
      </div>

    </AbsoluteFill>
  );
};

const VillainBackground: React.FC<{frame: number}> = ({frame}) => {
  const shift = frame * 0.3;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(${shift}deg, #0a0015 0%, #1a0030 30%, #0d001a 60%, #150025 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at ${50 + Math.sin(frame * 0.02) * 20}% ${50 + Math.cos(frame * 0.015) * 20}%, rgba(128,0,255,0.12) 0%, transparent 50%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at ${50 + Math.cos(frame * 0.025) * 15}% ${30 + Math.sin(frame * 0.02) * 10}%, rgba(88,28,135,0.08) 0%, transparent 40%)`,
      }} />
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => {
        const x = (15 + i * 12 + Math.sin((frame + i * 50) * 0.02) * 8);
        const y = (10 + ((frame * 0.3 + i * 120) % 100));
        const opacity = 0.15 + 0.15 * Math.sin((frame + i * 30) * 0.04);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`, top: `${y}%`,
            width: 4, height: 4, borderRadius: '50%',
            background: '#a855f7',
            opacity,
            boxShadow: `0 0 8px rgba(168,85,247,${opacity})`,
          }} />
        );
      })}
    </div>
  );
};
