import React from 'react';
import {AbsoluteFill, Img, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile} from 'remotion';
import {LEGENDS, Legend} from './hallOfLegendsData';

const INTRO_FRAMES = 120;
const LEGEND_FRAMES = 450;
const OUTRO_FRAMES = 150;

export const HallOfLegends: React.FC = () => {
  const {fps} = useVideoConfig();
  const total = LEGENDS.length;
  const outroStart = INTRO_FRAMES + total * LEGEND_FRAMES;

  return (
    <AbsoluteFill style={{backgroundColor: '#000', fontFamily: 'Georgia, serif'}}>
      <Sequence from={0} durationInFrames={INTRO_FRAMES}>
        <Intro fps={fps} />
      </Sequence>

      {LEGENDS.map((legend, i) => (
        <Sequence key={i} from={INTRO_FRAMES + i * LEGEND_FRAMES} durationInFrames={LEGEND_FRAMES}>
          <LegendCard legend={legend} fps={fps} />
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
  const candleFlicker = 0.7 + 0.3 * Math.sin(frame * 0.15);
  const titleOp = interpolate(frame, [20, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const titleScale = spring({frame: Math.max(0, frame - 20), fps, from: 0.8, to: 1, durationInFrames: 25});
  const subOp = interpolate(frame, [55, 80], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lineWidth = interpolate(frame, [40, 90], [0, 400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <HallBackground frame={frame} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        <div style={{fontSize: 60, opacity: candleFlicker, filter: `drop-shadow(0 0 20px rgba(255,180,50,${candleFlicker * 0.6}))`}}>🕯️</div>
        <div style={{
          fontSize: 90, fontWeight: 700, textAlign: 'center',
          opacity: titleOp, transform: `scale(${titleScale})`, lineHeight: 1.1,
          background: 'linear-gradient(180deg, #e8d5a3, #c9a84c, #8b6914)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.8))',
          letterSpacing: 6,
        }}>
          HALL OF LEGENDS
        </div>
        <div style={{width: lineWidth, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)'}} />
        <div style={{
          fontSize: 36, color: '#8b9dc3', fontWeight: 400, opacity: subOp,
          fontStyle: 'italic', letterSpacing: 3,
        }}>
          Gone but never forgotten
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC<{fps: number}> = ({fps}) => {
  const frame = useCurrentFrame();
  const candleFlicker = 0.7 + 0.3 * Math.sin(frame * 0.12);
  const scale = spring({frame, fps, from: 0.5, to: 1, durationInFrames: 20});
  const subOp = interpolate(frame, [30, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <HallBackground frame={frame} />
      <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 25}}>
        <div style={{fontSize: 70, opacity: candleFlicker, filter: `drop-shadow(0 0 25px rgba(255,180,50,${candleFlicker * 0.5}))`}}>🕯️</div>
        <div style={{
          fontSize: 70, fontWeight: 700, color: '#e8d5a3', textAlign: 'center',
          transform: `scale(${scale})`, lineHeight: 1.2,
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          letterSpacing: 4,
        }}>
          FOREVER<br/>IN OUR HEARTS
        </div>
        <div style={{width: 300, height: 2, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)', opacity: subOp}} />
        <div style={{
          fontSize: 35, color: '#8b9dc3', fontWeight: 400, opacity: subOp,
          fontStyle: 'italic',
        }}>
          Like & Subscribe 🕊️
        </div>
      </div>
    </AbsoluteFill>
  );
};

const LegendCard: React.FC<{legend: Legend; fps: number}> = ({legend, fps}) => {
  const frame = useCurrentFrame();

  // Phase 1: Movie scene fades in (0-60)
  const sceneOpacity = interpolate(frame, [0, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sceneScale = interpolate(frame, [0, 300], [1, 1.08], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Phase 2: Movie title appears (40-80)
  const movieTitleOp = interpolate(frame, [40, 70], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const movieTitleScale = spring({frame: Math.max(0, frame - 40), fps, from: 0.5, to: 1, durationInFrames: 18});

  // Phase 3: Scene darkens, portrait frame lights up (100-160)
  const sceneDarken = interpolate(frame, [100, 150], [0, 0.7], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const frameGlow = interpolate(frame, [120, 170], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const portraitScale = spring({frame: Math.max(0, frame - 130), fps, from: 0.3, to: 1, durationInFrames: 25});
  const portraitOp = interpolate(frame, [130, 170], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Phase 4: Name and dates (180-220)
  const nameOp = interpolate(frame, [180, 210], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const nameScale = spring({frame: Math.max(0, frame - 180), fps, from: 0.5, to: 1, durationInFrames: 18});

  // Phase 5: Quote (240-300)
  const quoteOp = interpolate(frame, [240, 280], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // Phase 6: Candles light up (200+)
  const candleOp = interpolate(frame, [200, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const candleFlicker1 = 0.6 + 0.4 * Math.sin(frame * 0.13);
  const candleFlicker2 = 0.6 + 0.4 * Math.sin(frame * 0.17 + 2);

  // Particles rising (180+)
  const showParticles = frame > 180;

  // Fade out
  const fadeOut = interpolate(frame, [LEGEND_FRAMES - 30, LEGEND_FRAMES], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{opacity: fadeOut}}>
      <HallBackground frame={frame} />

      {/* Movie scene background */}
      <div style={{
        position: 'absolute', inset: 0, opacity: sceneOpacity,
        transform: `scale(${sceneScale})`,
      }}>
        <Img src={staticFile(legend.movieScene)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>

      {/* Darken overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `rgba(0,0,0,${sceneDarken})`,
      }} />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
      }} />

      {/* Movie title overlay */}
      <div style={{
        position: 'absolute', top: 50, left: '50%',
        transform: `translateX(-50%) scale(${movieTitleScale})`,
        opacity: movieTitleOp,
        background: 'rgba(0,0,0,0.6)',
        padding: '10px 40px', borderRadius: 8,
        border: '1px solid rgba(201,168,76,0.3)',
      }}>
        <span style={{fontSize: 32, fontWeight: 400, color: '#c9a84c', fontStyle: 'italic', letterSpacing: 3}}>
          {legend.movie}
        </span>
      </div>

      {/* Portrait in golden frame */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: `translate(-50%, -50%) scale(${portraitScale})`,
        opacity: portraitOp,
      }}>
        {/* Golden frame */}
        <div style={{
          padding: 12,
          background: 'linear-gradient(135deg, #c9a84c, #e8d5a3, #8b6914, #c9a84c)',
          borderRadius: 8,
          boxShadow: `0 0 ${frameGlow * 60}px rgba(201,168,76,${frameGlow * 0.4}), 0 0 ${frameGlow * 120}px rgba(201,168,76,${frameGlow * 0.15})`,
        }}>
          <div style={{
            width: 380, height: 480, borderRadius: 4,
            overflow: 'hidden',
            border: '3px solid #1a1a1a',
          }}>
            <Img src={staticFile(legend.portrait)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        </div>
      </div>

      {/* Candles */}
      <div style={{
        position: 'absolute', bottom: 120, left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: 350, opacity: candleOp,
      }}>
        <div style={{fontSize: 50, opacity: candleFlicker1, filter: `drop-shadow(0 0 15px rgba(255,180,50,${candleFlicker1 * 0.6}))`}}>🕯️</div>
        <div style={{fontSize: 50, opacity: candleFlicker2, filter: `drop-shadow(0 0 15px rgba(255,180,50,${candleFlicker2 * 0.6}))`}}>🕯️</div>
      </div>

      {/* Name and dates */}
      <div style={{
        position: 'absolute', bottom: 140, left: '50%',
        transform: `translateX(-50%) scale(${nameScale})`,
        opacity: nameOp,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: '#e8d5a3',
          textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          letterSpacing: 5,
        }}>
          {legend.name.toUpperCase()}
        </div>
        <div style={{width: 200, height: 1, background: 'linear-gradient(90deg, transparent, #c9a84c, transparent)'}} />
        <div style={{
          fontSize: 34, color: '#999',
          letterSpacing: 8,
        }}>
          {legend.born} — {legend.died}
        </div>
      </div>

      {/* Quote */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%',
        transform: 'translateX(-50%)',
        opacity: quoteOp,
        maxWidth: '70%',
      }}>
        <div style={{
          fontSize: 24, color: '#8b9dc3', fontStyle: 'italic',
          textAlign: 'center', lineHeight: 1.5,
          textShadow: '0 2px 10px rgba(0,0,0,0.8)',
        }}>
          {legend.quote}
        </div>
      </div>

      {/* Rising light particles */}
      {showParticles && (
        <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
          {[...Array(12)].map((_, i) => {
            const startX = 20 + (i * 5.5);
            const speed = 0.4 + (i % 3) * 0.15;
            const y = 100 - ((frame - 180) * speed + i * 8) % 110;
            const x = startX + Math.sin((frame * 0.03) + i * 1.5) * 3;
            const particleOp = y > 5 && y < 95 ? 0.3 + 0.2 * Math.sin(frame * 0.08 + i) : 0;
            const size = 3 + (i % 3);
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `${x}%`, top: `${y}%`,
                width: size, height: size, borderRadius: '50%',
                background: '#e8d5a3',
                opacity: particleOp,
                boxShadow: `0 0 ${size * 3}px rgba(232,213,163,${particleOp})`,
              }} />
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};

const HallBackground: React.FC<{frame: number}> = ({frame}) => {
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, #0a0a0f 0%, #12101a 40%, #0d0b14 100%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at 50% 30%, rgba(201,168,76,0.03) 0%, transparent 60%)`,
      }} />
    </div>
  );
};
