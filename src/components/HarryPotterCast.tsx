import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {HP_CAST} from './harryPotterData';

const INTRO_FRAMES = 90;
const OUTRO_FRAMES = 120;
const CAST_FRAMES = 300; // 10 seconds per actor

const BG_GRADIENTS = [
  ['#1a1a2e', '#16213e'], ['#533483', '#2b1055'], ['#0f3460', '#1a1a2e'],
  ['#2b1055', '#533483'], ['#16213e', '#0f3460'], ['#1a1a2e', '#533483'],
  ['#533483', '#16213e'], ['#0f3460', '#2b1055'], ['#2b1055', '#1a1a2e'],
  ['#16213e', '#533483'], ['#1a1a2e', '#0f3460'], ['#533483', '#2b1055'],
  ['#0f3460', '#533483'], ['#2b1055', '#16213e'], ['#1a1a2e', '#2b1055'],
];

export const HarryPotterCast: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const totalCast = HP_CAST.length;
  const outroStart = INTRO_FRAMES + totalCast * CAST_FRAMES;

  // INTRO
  if (frame < INTRO_FRAMES) {
    const titleScale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 20});
    const titleOpacity = interpolate(frame, [3, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const bgRot = frame * 0.5;

    return (
      <AbsoluteFill>
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${bgRot}deg, #1a1a2e, #533483, #0f3460)`}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15}}>
          <div style={{fontSize: 130, transform: `scale(${titleScale})`, opacity: titleOpacity, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))'}}>⚡</div>
          <div style={{
            fontSize: 120, fontWeight: 900, color: '#FFD700', textAlign: 'center',
            transform: `scale(${titleScale})`, letterSpacing: 5, opacity: titleOpacity,
            textShadow: '0 8px 40px rgba(255,215,0,0.4)', lineHeight: 1.1,
          }}>
            HARRY POTTER
          </div>
          <div style={{
            fontSize: 80, fontWeight: 900, color: '#fff', textAlign: 'center',
            opacity: subtitleOpacity, lineHeight: 1.1,
            textShadow: '0 6px 30px rgba(0,0,0,0.6)',
          }}>
            CAST
            <br />
            <span style={{color: '#FFD700'}}>THEN & NOW</span>
          </div>
          <div style={{
            fontSize: 48, color: '#aaa', fontWeight: 800, opacity: subtitleOpacity,
            marginTop: 15, background: 'rgba(0,0,0,0.3)', padding: '12px 36px', borderRadius: 20,
          }}>
            🎬 Where are they now?
          </div>
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
        <div style={{position: 'absolute', inset: 0, background: `linear-gradient(${bgRot}deg, #1a1a2e, #533483, #0f3460)`}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 25}}>
          <div style={{fontSize: 120, transform: `scale(${scale})`}}>⚡</div>
          <div style={{
            fontSize: 80, fontWeight: 900, color: '#fff', textAlign: 'center',
            transform: `scale(${scale})`, textShadow: '0 6px 30px rgba(0,0,0,0.5)', lineHeight: 1.15,
          }}>
            WHICH<br/>TRANSFORMATION<br/>SURPRISED YOU<br/>THE MOST?
          </div>
          <div style={{
            fontSize: 48, color: '#FFD700', fontWeight: 800,
            transform: `scale(${subScale})`, background: 'rgba(0,0,0,0.3)', padding: '15px 40px', borderRadius: 20,
          }}>
            Comment below! 👇
          </div>
          <div style={{fontSize: 36, color: '#fff', fontWeight: 700, transform: `scale(${subScale})`}}>
            LIKE & SUBSCRIBE ⚡
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // CAST PHASE
  const castFrame = frame - INTRO_FRAMES;
  const castIndex = Math.min(Math.floor(castFrame / CAST_FRAMES), totalCast - 1);
  const localFrame = castFrame - castIndex * CAST_FRAMES;
  const cast = HP_CAST[castIndex];
  const bgColors = BG_GRADIENTS[castIndex % BG_GRADIENTS.length];

  const APPEAR_FRAMES = 150;

  const slideInLeft = interpolate(localFrame, [0, APPEAR_FRAMES], [-800, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const slideInRight = interpolate(localFrame, [0, APPEAR_FRAMES], [800, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const leftOpacity = interpolate(localFrame, [0, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rightOpacity = interpolate(localFrame, [0, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const labelOpacity = interpolate(localFrame, [APPEAR_FRAMES - 30, APPEAR_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const labelScale = spring({frame: Math.max(0, localFrame - (APPEAR_FRAMES - 30)), fps, from: 0.5, to: 1, durationInFrames: 20});

  const badgeScale = spring({frame: Math.max(0, localFrame - APPEAR_FRAMES), fps, from: 0, to: 1, durationInFrames: 15});
  const diedScale = cast.died ? spring({frame: Math.max(0, localFrame - APPEAR_FRAMES - 15), fps, from: 0, to: 1, durationInFrames: 12}) : 0;

  const fadeOut = interpolate(localFrame, [CAST_FRAMES - 20, CAST_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: fadeOut}}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${bgColors[0]} 0%, ${bgColors[1]} 100%)`}} />

      {/* Two photos side by side */}
      <div style={{
        position: 'absolute', top: 40, left: 0, right: 0, bottom: 40,
        display: 'flex', gap: 20, padding: '0 30px',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* THEN */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          transform: `translateX(${slideInLeft}px)`, opacity: leftOpacity, maxWidth: '48%',
        }}>
          <div style={{
            background: bgColors[0], padding: '12px 50px',
            borderRadius: '15px 15px 0 0', opacity: labelOpacity,
            transform: `scale(${labelScale})`,
            border: '3px solid rgba(255,255,255,0.3)', borderBottom: 'none',
          }}>
            <span style={{fontSize: 40, fontWeight: 900, color: '#FFD700', letterSpacing: 4, textShadow: '0 3px 10px rgba(0,0,0,0.5)'}}>
              THEN
            </span>
          </div>

          <div style={{
            width: '100%', aspectRatio: '3/4', borderRadius: 20,
            overflow: 'hidden', border: '5px solid rgba(255,255,255,0.3)', position: 'relative',
          }}>
            <Img src={staticFile(cast.movieImage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{
              position: 'absolute', bottom: 150, left: '50%',
              transform: `translateX(-50%) scale(${badgeScale})`,
              background: '#FFD700', padding: '14px 30px', borderRadius: 15,
              border: '3px solid rgba(0,0,0,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{fontSize: 36, fontWeight: 900, color: '#000', lineHeight: 1.2}}>
                {cast.character.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: 6, height: '70%',
          background: 'linear-gradient(180deg, transparent, rgba(255,215,0,0.4), transparent)',
          borderRadius: 3,
        }} />

        {/* NOW */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          transform: `translateX(${slideInRight}px)`, opacity: rightOpacity, maxWidth: '48%',
        }}>
          <div style={{
            background: bgColors[1], padding: '12px 50px',
            borderRadius: '15px 15px 0 0', opacity: labelOpacity,
            transform: `scale(${labelScale})`,
            border: '3px solid rgba(255,255,255,0.3)', borderBottom: 'none',
          }}>
            <span style={{fontSize: 40, fontWeight: 900, color: '#FFD700', letterSpacing: 4, textShadow: '0 3px 10px rgba(0,0,0,0.5)'}}>
              NOW
            </span>
          </div>

          <div style={{
            width: '100%', aspectRatio: '3/4', borderRadius: 20,
            overflow: 'hidden', border: '5px solid rgba(255,255,255,0.3)', position: 'relative',
          }}>
            <Img src={staticFile(cast.nowImage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{
              position: 'absolute', bottom: 150, left: '50%',
              transform: `translateX(-50%) scale(${badgeScale})`,
              background: '#FFD700', padding: '14px 30px', borderRadius: 15,
              border: '3px solid rgba(0,0,0,0.2)', boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{fontSize: 36, fontWeight: 900, color: '#000', lineHeight: 1.2}}>
                {cast.actor.toUpperCase()}
              </span>
              <span style={{fontSize: 30, fontWeight: 800, color: '#333', lineHeight: 1.2}}>
                {cast.died ? `Died ${cast.died} • Age ${cast.age}` : `Age: ${cast.age}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DIED badge */}
      {cast.died && (
        <div style={{
          position: 'absolute', bottom: 60, left: '50%',
          transform: `translateX(-50%) scale(${diedScale})`,
          background: '#dc2626', padding: '10px 40px', borderRadius: 15,
          border: '3px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 20px rgba(220,38,38,0.5)',
        }}>
          <span style={{fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: 3}}>
            REST IN PEACE 🕊️
          </span>
        </div>
      )}

      {/* Corner frames */}
      <div style={{position: 'absolute', top: 0, left: 0, width: 80, height: 80, borderTop: '4px solid rgba(255,215,0,0.15)', borderLeft: '4px solid rgba(255,215,0,0.15)', borderTopLeftRadius: 20, margin: 12}} />
      <div style={{position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderTop: '4px solid rgba(255,215,0,0.15)', borderRight: '4px solid rgba(255,215,0,0.15)', borderTopRightRadius: 20, margin: 12}} />
      <div style={{position: 'absolute', bottom: 0, left: 0, width: 80, height: 80, borderBottom: '4px solid rgba(255,215,0,0.15)', borderLeft: '4px solid rgba(255,215,0,0.15)', borderBottomLeftRadius: 20, margin: 12}} />
      <div style={{position: 'absolute', bottom: 0, right: 0, width: 80, height: 80, borderBottom: '4px solid rgba(255,215,0,0.15)', borderRight: '4px solid rgba(255,215,0,0.15)', borderBottomRightRadius: 20, margin: 12}} />
    </AbsoluteFill>
  );
};
