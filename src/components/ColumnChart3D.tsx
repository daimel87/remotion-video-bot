import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile} from 'remotion';
import {ACTORS} from './richestActorsData';

const sorted = [...ACTORS];
const formatValue = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1).replace('.0', '')}B` : `$${v}M`;

export const ColumnChart3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const totalCards = sorted.length;
  const framesPerCard = Math.floor((durationInFrames - 120) / totalCards);
  const cardProgress = interpolate(frame, [60, durationInFrames - 60], [0, totalCards - 0.01], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentIndex = Math.floor(cardProgress);
  const transitionProgress = cardProgress - currentIndex;

  const actor = sorted[currentIndex];
  const nextActor = currentIndex < totalCards - 1 ? sorted[currentIndex + 1] : null;
  const rank = currentIndex + 1;

  const slideOut = interpolate(transitionProgress, [0.7, 1], [0, -1920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const slideIn = interpolate(transitionProgress, [0.7, 1], [1920, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const valueReveal = interpolate(transitionProgress, [0, 0.15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const renderCard = (a: typeof actor, r: number, offsetX: number, valProgress: number) => (
    <div style={{
      position: 'absolute',
      left: offsetX,
      top: 0,
      width: 1920,
      height: 1080,
    }}>
      {/* Full screen photo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1920,
        height: 920,
        overflow: 'hidden',
      }}>
        <Img
          src={staticFile(a.photo)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 20%',
          }}
        />
        {/* Dark gradient overlay bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 350,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
        }} />
        {/* Subtle dark overlay top for readability */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 150,
          background: 'linear-gradient(rgba(0,0,0,0.5), transparent)',
        }} />
      </div>

      {/* Rank badge top left */}
      <div style={{
        position: 'absolute',
        top: 30,
        left: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'rgba(0,0,0,0.6)',
          border: '3px solid #FFD700',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
          fontWeight: 900,
          color: '#FFD700',
        }}>
          {r}
        </div>
        <span style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.7)',
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          of {totalCards}
        </span>
      </div>

      {/* Flag top right */}
      <div style={{
        position: 'absolute',
        top: 30,
        right: 40,
        fontSize: 52,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
      }}>
        {a.flag}
      </div>

      {/* Info overlay at bottom of photo area */}
      <div style={{
        position: 'absolute',
        bottom: 180,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}>
        {/* Name */}
        <div style={{
          fontSize: 52,
          fontWeight: 900,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: 4,
          textShadow: '0 4px 16px rgba(0,0,0,0.8)',
          textAlign: 'center',
        }}>
          {a.name}
        </div>

        {/* Value */}
        <div style={{
          fontSize: 80,
          fontWeight: 900,
          color: '#FFD700',
          textShadow: '0 0 40px rgba(255,215,0,0.4), 0 4px 16px rgba(0,0,0,0.8)',
          lineHeight: 1,
          marginTop: 4,
        }}>
          {formatValue(Math.round(valProgress * a.netWorth))}
        </div>

        {/* Country */}
        <div style={{
          fontSize: 20,
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase',
          letterSpacing: 6,
          marginTop: 4,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          {a.country}
        </div>
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{
      backgroundColor: '#000',
      fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Current card */}
      {renderCard(actor, rank, slideOut, valueReveal)}

      {/* Next card sliding in */}
      {nextActor && transitionProgress > 0.7 && renderCard(nextActor, rank + 1, slideIn, 0)}

      {/* Title bar top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        background: 'linear-gradient(90deg, #FFD700, #FFA000, #FFD700)',
        zIndex: 20,
      }} />

      {/* Bottom bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 160,
        backgroundColor: '#000',
        zIndex: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#FFD700',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}>
            💰 Richest Hollywood Actors 💰
          </span>
          <span style={{
            fontSize: 15,
            color: 'rgba(255,255,255,0.3)',
          }}>
            Source: Forbes, Celebrity Net Worth — Estimated Net Worth 2025
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
