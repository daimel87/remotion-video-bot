import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {BRAZIL98, Brazil98Player} from './brazil98Data';

const INTRO_FRAMES = 90;
const PLAYER_FRAMES = 300;
const OUTRO_FRAMES = 120;

export const Brazil98ThenNow: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = BRAZIL98.length;
  const outroStart = INTRO_FRAMES + total * PLAYER_FRAMES;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Arial, sans-serif'}}>
      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <Intro fps={fps} />
      </Sequence>

      {BRAZIL98.map((player, i) => (
        <Sequence key={i} from={INTRO_FRAMES + i * PLAYER_FRAMES} durationInFrames={PLAYER_FRAMES}>
          <PlayerCard player={player} index={i} total={total} fps={fps} />
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
  const flagScale = spring({frame, fps, from: 0.3, to: 1, durationInFrames: 18});
  const titleScale = spring({frame: Math.max(0, frame - 8), fps, from: 0.3, to: 1, durationInFrames: 15});
  const subOp = interpolate(frame, [25, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const yearScale = spring({frame: Math.max(0, frame - 35), fps, from: 0, to: 1, durationInFrames: 15});

  return (
    <AbsoluteFill>
      <PitchBackground frame={frame} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 15}}>
        <div style={{fontSize: 130, transform: `scale(${flagScale})`, filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))'}}>🇧🇷</div>
        <div style={{
          fontSize: 110, fontWeight: 900, textAlign: 'center',
          transform: `scale(${titleScale})`, lineHeight: 1.1,
          background: 'linear-gradient(180deg, #FFD700, #FFA500, #FF8C00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.8))',
        }}>
          BRAZIL 98
        </div>
        <div style={{
          fontSize: 60, fontWeight: 900, color: '#fff', textAlign: 'center',
          opacity: subOp, lineHeight: 1.2,
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          letterSpacing: 8,
        }}>
          WORLD CUP SQUAD
        </div>
        <div style={{
          fontSize: 75, fontWeight: 900, textAlign: 'center',
          transform: `scale(${yearScale})`,
          background: 'linear-gradient(90deg, #009739, #FFD700)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.6))',
        }}>
          THEN & NOW ⚽
        </div>
        <div style={{
          fontSize: 40, color: '#aaa', fontWeight: 700, opacity: subOp,
          marginTop: 5, fontStyle: 'italic',
        }}>
          28 years later...
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
      <PitchBackground frame={frame} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 25}}>
        <div style={{fontSize: 120, transform: `scale(${scale})`}}>🏆</div>
        <div style={{
          fontSize: 80, fontWeight: 900, color: '#fff', textAlign: 'center',
          transform: `scale(${scale})`, textShadow: '0 4px 20px rgba(0,0,0,0.6)', lineHeight: 1.15,
        }}>
          WHICH PLAYER<br/>CHANGED THE MOST?
        </div>
        <div style={{
          fontSize: 50, fontWeight: 800, transform: `scale(${subScale})`,
          background: 'linear-gradient(90deg, #009739, #FFD700)',
          padding: '15px 50px', borderRadius: 15,
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          Comment below! ⚽👇
        </div>
        <div style={{fontSize: 40, color: '#FFD700', fontWeight: 700, transform: `scale(${subScale})`}}>
          LIKE & SUBSCRIBE 🔔
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PlayerCard: React.FC<{
  player: Brazil98Player;
  index: number;
  total: number;
  fps: number;
}> = ({player, index, total, fps}) => {
  const frame = useCurrentFrame();
  const APPEAR = 150;

  const slideInLeft = interpolate(frame, [0, APPEAR], [-900, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const slideInRight = interpolate(frame, [0, APPEAR], [900, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const photoOpacity = interpolate(frame, [0, 60], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const labelOpacity = interpolate(frame, [APPEAR - 30, APPEAR], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const labelScale = spring({frame: Math.max(0, frame - (APPEAR - 30)), fps, from: 0.5, to: 1, durationInFrames: 20});
  const badgeScale = spring({frame: Math.max(0, frame - APPEAR), fps, from: 0, to: 1, durationInFrames: 15});
  const numberScale = spring({frame: Math.max(0, frame - APPEAR - 10), fps, from: 0, to: 1, durationInFrames: 12});
  const fadeOut = interpolate(frame, [PLAYER_FRAMES - 20, PLAYER_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: fadeOut}}>
      <PitchBackground frame={frame + index * 80} />

      <div style={{
        position: 'absolute', top: 25, left: 0, right: 0, bottom: 25,
        display: 'flex', gap: 20, padding: '0 40px',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {/* THEN - Left */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          transform: `translateX(${slideInLeft}px)`, opacity: photoOpacity, maxWidth: '44%',
        }}>
          <div style={{
            width: '100%', aspectRatio: '3/4', borderRadius: 15,
            overflow: 'hidden', position: 'relative',
            border: '4px solid rgba(255,215,0,0.4)',
            boxShadow: '0 0 30px rgba(0,150,57,0.25)',
          }}>
            <Img src={staticFile(player.thenImage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{
              position: 'absolute', bottom: 100, left: '50%',
              transform: `translateX(-50%) scale(${badgeScale})`,
              background: 'linear-gradient(135deg, #009739, #006B2B)',
              padding: '12px 28px', borderRadius: 10,
              border: '3px solid #FFD700',
              boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{fontSize: 30, fontWeight: 900, color: '#FFD700', lineHeight: 1.2}}>
                {player.position.toUpperCase()}
              </span>
              <span style={{fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1.2}}>
                Age: {player.age98}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 8, opacity: labelOpacity,
        }}>
          <div style={{width: 3, height: '25%', background: 'linear-gradient(180deg, transparent, #FFD700)'}} />
          <span style={{fontSize: 55, filter: 'drop-shadow(0 0 12px rgba(255,215,0,0.6))'}}>⚽</span>
          <div style={{width: 3, height: '25%', background: 'linear-gradient(180deg, #FFD700, transparent)'}} />
        </div>

        {/* NOW - Right */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 0,
          transform: `translateX(${slideInRight}px)`, opacity: photoOpacity, maxWidth: '44%',
        }}>
          <div style={{
            width: '100%', aspectRatio: '3/4', borderRadius: 15,
            overflow: 'hidden', position: 'relative',
            border: '4px solid rgba(255,215,0,0.4)',
            boxShadow: '0 0 30px rgba(255,165,0,0.25)',
          }}>
            <Img src={staticFile(player.nowImage)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            <div style={{
              position: 'absolute', bottom: 100, left: '50%',
              transform: `translateX(-50%) scale(${badgeScale})`,
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              padding: '12px 28px', borderRadius: 10,
              border: '3px solid rgba(255,255,255,0.4)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
              whiteSpace: 'nowrap', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            }}>
              <span style={{fontSize: 30, fontWeight: 900, color: '#003', lineHeight: 1.2}}>
                {player.name.toUpperCase()}
              </span>
              <span style={{fontSize: 26, fontWeight: 700, color: '#333', lineHeight: 1.2}}>
                Age: {player.ageNow}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Player number floating badge */}
      <div style={{
        position: 'absolute', top: 30, left: '50%',
        transform: `translateX(-50%) scale(${numberScale})`,
        background: 'linear-gradient(135deg, #009739, #006B2B)',
        width: 80, height: 80, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '4px solid #FFD700',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      }}>
        <span style={{fontSize: 40, fontWeight: 900, color: '#FFD700'}}>#{player.number}</span>
      </div>
    </AbsoluteFill>
  );
};

const PitchBackground: React.FC<{frame: number}> = ({frame}) => {
  const shift = frame * 0.02;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(160deg, #0a1a0a 0%, #0d2810 30%, #081408 60%, #0a1f0a 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 100px, rgba(255,255,255,0.1) 100px, rgba(255,255,255,0.1) 102px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at ${50 + Math.sin(shift) * 15}% ${40 + Math.cos(shift * 0.8) * 10}%, rgba(255,215,0,0.06) 0%, transparent 50%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at ${50 + Math.cos(shift * 1.2) * 12}% ${60 + Math.sin(shift) * 8}%, rgba(0,150,57,0.08) 0%, transparent 40%)`,
      }} />
      <div style={{
        position: 'absolute', top: -200, right: -200, width: 400, height: 400,
        borderRadius: '50%', border: '2px solid rgba(255,255,255,0.04)',
      }} />
      <div style={{
        position: 'absolute', bottom: -200, left: -200, width: 400, height: 400,
        borderRadius: '50%', border: '2px solid rgba(255,255,255,0.04)',
      }} />
    </div>
  );
};
