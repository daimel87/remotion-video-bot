import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {PAIRS} from './celebrityParentsData';

const INTRO_FRAMES = 90;
const OUTRO_FRAMES = 120;
const PAIR_FRAMES = 300; // 10 seconds per pair

const BG_GRADIENTS = [
  ['#dc2626', '#991b1b'], ['#2563eb', '#1e40af'], ['#7c3aed', '#5b21b6'],
  ['#db2777', '#9d174d'], ['#ea580c', '#c2410c'], ['#059669', '#047857'],
  ['#0891b2', '#0e7490'], ['#e11d48', '#be123c'], ['#4f46e5', '#4338ca'],
  ['#d97706', '#b45309'], ['#dc2626', '#991b1b'], ['#7c3aed', '#5b21b6'],
  ['#2563eb', '#1e40af'], ['#db2777', '#9d174d'], ['#059669', '#047857'],
  ['#ea580c', '#c2410c'], ['#0891b2', '#0e7490'], ['#e11d48', '#be123c'],
  ['#4f46e5', '#4338ca'], ['#d97706', '#b45309'], ['#dc2626', '#991b1b'],
  ['#7c3aed', '#5b21b6'], ['#2563eb', '#1e40af'], ['#db2777', '#9d174d'],
  ['#059669', '#047857'],
];

export const CelebrityParents: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const totalPairs = PAIRS.length;
  const outroStart = INTRO_FRAMES + totalPairs * PAIR_FRAMES;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Arial, sans-serif'}}>
      {/* Intro audio */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile('audio/pop.wav')} volume={0.6} />
      </Sequence>

      {/* Per-pair pop sound */}
      {PAIRS.map((_, i) => {
        const pStart = INTRO_FRAMES + i * PAIR_FRAMES;
        return (
          <Sequence key={i} from={pStart} layout="none">
            <Audio src={staticFile('audio/pop.wav')} volume={0.5} />
          </Sequence>
        );
      })}

      <Visuals frame={frame} fps={fps} totalPairs={totalPairs} outroStart={outroStart} />
    </AbsoluteFill>
  );
};

const Visuals: React.FC<{
  frame: number;
  fps: number;
  totalPairs: number;
  outroStart: number;
}> = ({frame, fps, totalPairs, outroStart}) => {
  // INTRO
  if (frame < INTRO_FRAMES) {
    const titleScale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 20});
    const titleOpacity = interpolate(frame, [3, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const countdownText = frame < 60 ? '' : `${3 - Math.floor((frame - 60) / 10)}`;
    const bgRot = frame * 0.5;

    return (
      <AbsoluteFill>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(${bgRot}deg, #dc2626, #ea580c, #d97706)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 15,
        }}>
          <div style={{
            fontSize: 130, transform: `scale(${titleScale})`, opacity: titleOpacity,
            filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))',
          }}>👨‍👧‍👦</div>
          <div style={{
            fontSize: 120, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${titleScale})`, letterSpacing: 5,
            opacity: titleOpacity,
            textShadow: '0 8px 40px rgba(0,0,0,0.6)',
            lineHeight: 1.1,
          }}>
            CELEBRITY
            <br />
            <span style={{color: '#FFD700', fontSize: 130}}>PARENTS</span>
          </div>
          <div style={{
            fontSize: 48, color: '#fff', fontWeight: 800, opacity: subtitleOpacity,
            marginTop: 15,
            background: 'rgba(0,0,0,0.3)',
            padding: '12px 36px',
            borderRadius: 20,
          }}>
            🌟 & THEIR CHILDREN 🌟
          </div>
          {frame >= 60 && (
            <div style={{
              fontSize: 100, fontWeight: 900, color: '#FFD700',
              marginTop: 25,
              textShadow: '0 0 60px rgba(255,215,0,0.7)',
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
    const subScale = spring({frame: Math.max(0, outroFrame - 15), fps, from: 0, to: 1, durationInFrames: 20});
    const bgRot = outroFrame * 0.4;

    return (
      <AbsoluteFill>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(${bgRot}deg, #dc2626, #7c3aed, #2563eb)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 25,
        }}>
          <div style={{fontSize: 120, transform: `scale(${scale})`}}>🌟</div>
          <div style={{
            fontSize: 80, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${scale})`,
            textShadow: '0 6px 30px rgba(0,0,0,0.5)',
            lineHeight: 1.15,
          }}>
            WHICH PAIR<br/>SURPRISED YOU<br/>THE MOST?
          </div>
          <div style={{
            fontSize: 48, color: '#FFD700', fontWeight: 800,
            transform: `scale(${subScale})`,
            background: 'rgba(0,0,0,0.3)',
            padding: '15px 40px', borderRadius: 20,
          }}>
            Comment below! 👇
          </div>
          <div style={{
            fontSize: 36, color: '#fff', fontWeight: 700,
            transform: `scale(${subScale})`,
          }}>
            LIKE & SUBSCRIBE 🔔
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // PAIR PHASE
  const pairFrame = frame - INTRO_FRAMES;
  const pairIndex = Math.min(Math.floor(pairFrame / PAIR_FRAMES), totalPairs - 1);
  const localFrame = pairFrame - pairIndex * PAIR_FRAMES;
  const pair = PAIRS[pairIndex];
  const bgColors = BG_GRADIENTS[pairIndex % BG_GRADIENTS.length];

  // Animations
  const slideInLeft = spring({frame: localFrame, fps, from: -600, to: 0, durationInFrames: 15});
  const slideInRight = spring({frame: Math.max(0, localFrame - 5), fps, from: 600, to: 0, durationInFrames: 15});
  const nameOpacity = interpolate(localFrame, [15, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const badgeScale = spring({frame: Math.max(0, localFrame - 20), fps, from: 0, to: 1, durationInFrames: 12});
  const labelScale = spring({frame: Math.max(0, localFrame - 8), fps, from: 0, to: 1, durationInFrames: 12});

  // Fade out at end
  const fadeOut = interpolate(localFrame, [PAIR_FRAMES - 15, PAIR_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Counter badge
  const counterScale = spring({frame: localFrame, fps, from: 0, to: 1, durationInFrames: 10});

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: fadeOut}}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${bgColors[0]} 0%, ${bgColors[1]} 100%)`,
      }} />

      {/* Counter */}
      <div style={{
        position: 'absolute', top: 35, left: '50%',
        transform: `translateX(-50%) scale(${counterScale})`,
        background: 'rgba(0,0,0,0.5)',
        borderRadius: 30, padding: '8px 28px',
        border: '2px solid rgba(255,255,255,0.2)',
        zIndex: 10,
      }}>
        <span style={{fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: 2}}>
          {pairIndex + 1} / {totalPairs}
        </span>
      </div>

      {/* Two photos side by side */}
      <div style={{
        position: 'absolute', top: 100, left: 0, right: 0, bottom: 100,
        display: 'flex', gap: 20,
        padding: '0 30px',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Parent */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          transform: `translateX(${slideInLeft}px)`,
        }}>
          {/* FATHER/MOTHER label */}
          <div style={{
            background: bgColors[0],
            padding: '10px 40px',
            borderRadius: '15px 15px 0 0',
            transform: `scale(${labelScale})`,
            border: '3px solid rgba(255,255,255,0.3)',
            borderBottom: 'none',
          }}>
            <span style={{
              fontSize: 36, fontWeight: 900, color: '#fff',
              letterSpacing: 4,
              textShadow: '0 3px 10px rgba(0,0,0,0.5)',
            }}>
              {pair.parent.includes('Jada') || pair.parent.includes('Angelina') || pair.parent.includes('Cindy') || pair.parent.includes('Demi') || pair.parent.includes('Goldie') || pair.parent.includes('Heidi') || pair.parent.includes('Reese') || pair.parent.includes('Kris') ? 'MOTHER' : 'FATHER'}
            </span>
          </div>

          {/* Photo */}
          <div style={{
            width: '100%', aspectRatio: '3/4',
            borderRadius: 20,
            overflow: 'hidden',
            border: '5px solid rgba(255,255,255,0.3)',
            position: 'relative',
          }}>
            <Img src={staticFile(pair.parentImage)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
            {/* Age badge */}
            <div style={{
              position: 'absolute', bottom: 20, left: '50%',
              transform: `translateX(-50%) scale(${badgeScale})`,
              background: '#FFD700',
              padding: '10px 30px',
              borderRadius: 15,
              border: '3px solid rgba(0,0,0,0.2)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}>
              <span style={{
                fontSize: 36, fontWeight: 900, color: '#000',
              }}>
                Age: ({pair.parentAge})
              </span>
            </div>
          </div>

          {/* Name */}
          <div style={{
            marginTop: 15, opacity: nameOpacity,
            textAlign: 'center',
          }}>
            <span style={{
              fontSize: 38, fontWeight: 900, color: '#fff',
              textShadow: '0 4px 15px rgba(0,0,0,0.5)',
              letterSpacing: 2,
            }}>
              {pair.parent.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: 6, height: '70%',
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.4), transparent)',
          borderRadius: 3,
        }} />

        {/* Child */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          transform: `translateX(${slideInRight}px)`,
        }}>
          {/* SON/DAUGHTER label */}
          <div style={{
            background: bgColors[1],
            padding: '10px 40px',
            borderRadius: '15px 15px 0 0',
            transform: `scale(${labelScale})`,
            border: '3px solid rgba(255,255,255,0.3)',
            borderBottom: 'none',
          }}>
            <span style={{
              fontSize: 36, fontWeight: 900, color: '#fff',
              letterSpacing: 4,
              textShadow: '0 3px 10px rgba(0,0,0,0.5)',
            }}>
              {pair.child.includes('Sistine') || pair.child.includes('Lily') || pair.child.includes('Willow') || pair.child.includes('Kaia') || pair.child.includes('Rumer') || pair.child.includes('Kate') || pair.child.includes('Angelina') || pair.child.includes('Zoë') || pair.child.includes('Suri') || pair.child.includes('Ireland') || pair.child.includes('Daniella') || pair.child.includes('Leni') || pair.child.includes('Ava') || pair.child.includes('Georgia') || pair.child.includes('Liv') || pair.child.includes('Kendall') || pair.child.includes('Shiloh') || pair.child.includes('Dylan Penn') ? 'DAUGHTER' : 'SON'}
            </span>
          </div>

          {/* Photo */}
          <div style={{
            width: '100%', aspectRatio: '3/4',
            borderRadius: 20,
            overflow: 'hidden',
            border: '5px solid rgba(255,255,255,0.3)',
            position: 'relative',
          }}>
            <Img src={staticFile(pair.childImage)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
            {/* Age badge */}
            <div style={{
              position: 'absolute', bottom: 20, left: '50%',
              transform: `translateX(-50%) scale(${badgeScale})`,
              background: '#FFD700',
              padding: '10px 30px',
              borderRadius: 15,
              border: '3px solid rgba(0,0,0,0.2)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}>
              <span style={{
                fontSize: 36, fontWeight: 900, color: '#000',
              }}>
                Age: ({pair.childAge})
              </span>
            </div>
          </div>

          {/* Name */}
          <div style={{
            marginTop: 15, opacity: nameOpacity,
            textAlign: 'center',
          }}>
            <span style={{
              fontSize: 38, fontWeight: 900, color: '#fff',
              textShadow: '0 4px 15px rgba(0,0,0,0.5)',
              letterSpacing: 2,
            }}>
              {pair.child.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Corner frames */}
      <div style={{position: 'absolute', top: 0, left: 0, width: 80, height: 80, borderTop: '4px solid rgba(255,255,255,0.15)', borderLeft: '4px solid rgba(255,255,255,0.15)', borderTopLeftRadius: 20, margin: 12}} />
      <div style={{position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderTop: '4px solid rgba(255,255,255,0.15)', borderRight: '4px solid rgba(255,255,255,0.15)', borderTopRightRadius: 20, margin: 12}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, width: 80, height: 80, borderBottom: '4px solid rgba(255,255,255,0.15)', borderLeft: '4px solid rgba(255,255,255,0.15)', borderBottomLeftRadius: 20, margin: 12}} />
      <div style={{position: 'absolute', bottom: 0, right: 0, width: 80, height: 80, borderBottom: '4px solid rgba(255,255,255,0.15)', borderRight: '4px solid rgba(255,255,255,0.15)', borderBottomRightRadius: 20, margin: 12}} />
    </AbsoluteFill>
  );
};
