import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {HP_CAST} from './harryPotterData';

const INTRO_FRAMES = 90;
const OUTRO_FRAMES = 120;
const CAST_FRAMES = 300;
const APPEAR_FRAMES = 150;

export const HarryPotterCast: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const totalCast = HP_CAST.length;
  const outroStart = INTRO_FRAMES + totalCast * CAST_FRAMES;

  // INTRO
  if (frame < INTRO_FRAMES) {
    const titleScale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 20});
    const titleOpacity = interpolate(frame, [3, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    const subtitleOpacity = interpolate(frame, [25, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

    return (
      <AbsoluteFill>
        <MagicBackground frame={frame} />
        <StarField frame={frame} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15}}>
          <div style={{fontSize: 130, transform: `scale(${titleScale})`, opacity: titleOpacity}}>⚡</div>
          <div style={{
            fontSize: 110, fontWeight: 900, textAlign: 'center',
            transform: `scale(${titleScale})`, letterSpacing: 5, opacity: titleOpacity,
            lineHeight: 1.1,
            background: 'linear-gradient(180deg, #f5e6a3, #c9a84c, #8b6914)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))',
          }}>
            HARRY POTTER
          </div>
          <div style={{
            fontSize: 70, fontWeight: 900, color: '#e8d5a3', textAlign: 'center',
            opacity: subtitleOpacity, lineHeight: 1.2,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            letterSpacing: 8,
          }}>
            CAST
          </div>
          <div style={{
            fontSize: 60, fontWeight: 900, color: '#fff', textAlign: 'center',
            opacity: subtitleOpacity, lineHeight: 1.2,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}>
            THEN & NOW
          </div>
          <div style={{
            fontSize: 40, color: '#8b9dc3', fontWeight: 700, opacity: subtitleOpacity,
            marginTop: 15, fontStyle: 'italic',
          }}>
            25 years later...
          </div>
        </div>
      </AbsoluteFill>
    );
  }

  // OUTRO
  if (frame >= outroStart) {
    const of = frame - outroStart;
    const scale = spring({frame: of, fps, from: 0.3, to: 1, durationInFrames: 20});
    const subScale = spring({frame: Math.max(0, of - 15), fps, from: 0, to: 1, durationInFrames: 20});

    return (
      <AbsoluteFill>
        <MagicBackground frame={of} />
        <StarField frame={of} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 25}}>
          <div style={{fontSize: 120, transform: `scale(${scale})`}}>⚡</div>
          <div style={{
            fontSize: 70, fontWeight: 900, color: '#e8d5a3', textAlign: 'center',
            transform: `scale(${scale})`, textShadow: '0 6px 30px rgba(0,0,0,0.8)', lineHeight: 1.15,
          }}>
            WHICH<br/>TRANSFORMATION<br/>SURPRISED YOU<br/>THE MOST?
          </div>
          <div style={{
            fontSize: 45, color: '#fff', fontWeight: 800,
            transform: `scale(${subScale})`,
            background: 'rgba(139,109,20,0.4)', padding: '12px 35px', borderRadius: 10,
            border: '2px solid rgba(232,213,163,0.3)',
          }}>
            Comment below! 👇
          </div>
          <div style={{fontSize: 36, color: '#8b9dc3', fontWeight: 700, transform: `scale(${subScale})`}}>
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

  const slideInLeft = interpolate(localFrame, [0, APPEAR_FRAMES], [-800, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const slideInRight = interpolate(localFrame, [0, APPEAR_FRAMES], [800, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const photoOpacity = interpolate(localFrame, [0, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const labelOpacity = interpolate(localFrame, [APPEAR_FRAMES - 30, APPEAR_FRAMES], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const labelScale = spring({frame: Math.max(0, localFrame - (APPEAR_FRAMES - 30)), fps, from: 0.5, to: 1, durationInFrames: 20});
  const badgeScale = spring({frame: Math.max(0, localFrame - APPEAR_FRAMES), fps, from: 0, to: 1, durationInFrames: 15});
  const diedScale = cast.died ? spring({frame: Math.max(0, localFrame - APPEAR_FRAMES - 15), fps, from: 0, to: 1, durationInFrames: 12}) : 0;
  const fadeOut = interpolate(localFrame, [CAST_FRAMES - 20, CAST_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: fadeOut}}>
      <MagicBackground frame={frame} />
      <StarField frame={localFrame} />

      {/* Counter top right */}
      <div style={{
        position: 'absolute', top: 25, right: 30,
        background: 'rgba(0,0,0,0.5)', padding: '6px 20px', borderRadius: 8,
        border: '1px solid rgba(232,213,163,0.3)',
      }}>
        <span style={{fontSize: 28, fontWeight: 700, color: '#e8d5a3'}}>
          {castIndex + 1} / {totalCast}
        </span>
      </div>

      {/* Two photos side by side */}
      <div style={{
        position: 'absolute', top: 30, left: 0, right: 0, bottom: 30,
        display: 'flex', gap: 15, padding: '0 30px',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* THEN */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          transform: `translateX(${slideInLeft}px)`, opacity: photoOpacity, maxWidth: '46%',
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #5c3a1e, #8b6914)',
            padding: '10px 45px', borderRadius: '12px 12px 0 0',
            opacity: labelOpacity, transform: `scale(${labelScale})`,
            border: '2px solid rgba(232,213,163,0.4)', borderBottom: 'none',
          }}>
            <span style={{fontSize: 36, fontWeight: 900, color: '#f5e6a3', letterSpacing: 5}}>
              THEN
            </span>
          </div>

          <div style={{
            width: '100%', aspectRatio: '3/4', borderRadius: 15,
            overflow: 'hidden', position: 'relative',
            border: '4px solid rgba(232,213,163,0.3)',
            boxShadow: '0 0 30px rgba(139,109,20,0.2)',
          }}>
            <Img src={staticFile(cast.movieImage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            {/* Parchment badge */}
            <div style={{
              position: 'absolute', bottom: 130, left: '50%',
              transform: `translateX(-50%) scale(${badgeScale})`,
              background: 'linear-gradient(135deg, #f5e6c8, #e8d5a3, #d4c08a)',
              padding: '12px 25px', borderRadius: 8,
              border: '2px solid #8b6914',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{fontSize: 32, fontWeight: 900, color: '#3d2b1f', lineHeight: 1.2}}>
                {cast.character.toUpperCase()}
              </span>
              <span style={{fontSize: 26, fontWeight: 700, color: '#5c3a1e', lineHeight: 1.2}}>
                Age: {cast.movieAge}
              </span>
            </div>
          </div>
        </div>

        {/* Lightning bolt divider */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 8, opacity: labelOpacity,
        }}>
          <div style={{width: 2, height: '25%', background: 'linear-gradient(180deg, transparent, #e8d5a3)'}} />
          <span style={{fontSize: 50, filter: 'drop-shadow(0 0 10px rgba(232,213,163,0.6))'}}>⚡</span>
          <div style={{width: 2, height: '25%', background: 'linear-gradient(180deg, #e8d5a3, transparent)'}} />
        </div>

        {/* NOW */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          transform: `translateX(${slideInRight}px)`, opacity: photoOpacity, maxWidth: '46%',
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #1a3a5c, #2a5a8c)',
            padding: '10px 45px', borderRadius: '12px 12px 0 0',
            opacity: labelOpacity, transform: `scale(${labelScale})`,
            border: '2px solid rgba(138,180,220,0.4)', borderBottom: 'none',
          }}>
            <span style={{fontSize: 36, fontWeight: 900, color: '#c5ddf5', letterSpacing: 5}}>
              NOW
            </span>
          </div>

          <div style={{
            width: '100%', aspectRatio: '3/4', borderRadius: 15,
            overflow: 'hidden', position: 'relative',
            border: '4px solid rgba(138,180,220,0.3)',
            boxShadow: '0 0 30px rgba(42,90,140,0.2)',
          }}>
            <Img src={staticFile(cast.nowImage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            {/* Blue badge */}
            <div style={{
              position: 'absolute', bottom: 130, left: '50%',
              transform: `translateX(-50%) scale(${badgeScale})`,
              background: 'linear-gradient(135deg, #1a3a5c, #2a5a8c, #3a6a9c)',
              padding: '12px 25px', borderRadius: 8,
              border: '2px solid rgba(138,180,220,0.5)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            }}>
              <span style={{fontSize: 32, fontWeight: 900, color: '#fff', lineHeight: 1.2}}>
                {cast.actor.toUpperCase()}
              </span>
              <span style={{fontSize: 26, fontWeight: 700, color: '#c5ddf5', lineHeight: 1.2}}>
                {cast.died ? `Died ${cast.died} · Age ${cast.currentAge}` : `Age: ${cast.currentAge}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DIED badge */}
      {cast.died && (
        <div style={{
          position: 'absolute', bottom: 50, left: '50%',
          transform: `translateX(-50%) scale(${diedScale})`,
          background: 'linear-gradient(90deg, #1a1a1a, #333, #1a1a1a)',
          padding: '10px 40px', borderRadius: 10,
          border: '2px solid rgba(232,213,163,0.4)',
          boxShadow: '0 0 20px rgba(0,0,0,0.6)',
        }}>
          <span style={{fontSize: 34, fontWeight: 900, color: '#e8d5a3', letterSpacing: 3}}>
            REST IN PEACE 🕊️
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const MagicBackground: React.FC<{frame: number}> = ({frame}) => {
  const shift = frame * 0.05;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        radial-gradient(ellipse at 50% 0%, rgba(25,25,60,1) 0%, rgba(5,5,20,1) 70%),
        linear-gradient(180deg, #0a0a1a 0%, #151530 50%, #0a0a1a 100%)
      `,
    }}>
      {/* Fog/mist effect */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at ${50 + Math.sin(shift) * 10}% 80%, rgba(100,100,150,0.08) 0%, transparent 60%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at ${50 + Math.cos(shift * 0.7) * 15}% 20%, rgba(139,109,20,0.04) 0%, transparent 50%)`,
      }} />
    </div>
  );
};

const StarField: React.FC<{frame: number}> = ({frame}) => {
  const stars = [
    {x: 10, y: 8, s: 3}, {x: 25, y: 15, s: 2}, {x: 45, y: 5, s: 4},
    {x: 65, y: 12, s: 2}, {x: 80, y: 7, s: 3}, {x: 90, y: 18, s: 2},
    {x: 15, y: 85, s: 3}, {x: 35, y: 90, s: 2}, {x: 55, y: 88, s: 3},
    {x: 75, y: 92, s: 2}, {x: 88, y: 82, s: 4}, {x: 5, y: 50, s: 2},
    {x: 95, y: 45, s: 3}, {x: 50, y: 95, s: 2}, {x: 30, y: 3, s: 3},
  ];

  return (
    <div style={{position: 'absolute', inset: 0}}>
      {stars.map((star, i) => {
        const twinkle = 0.3 + 0.7 * Math.abs(Math.sin((frame + i * 20) * 0.05));
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${star.x}%`, top: `${star.y}%`,
            width: star.s, height: star.s,
            borderRadius: '50%',
            background: '#e8d5a3',
            opacity: twinkle * 0.6,
            boxShadow: `0 0 ${star.s * 2}px rgba(232,213,163,${twinkle * 0.4})`,
          }} />
        );
      })}
    </div>
  );
};
