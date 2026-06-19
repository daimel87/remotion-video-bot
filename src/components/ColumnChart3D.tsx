import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile} from 'remotion';
import {ACTORS} from './richestActorsData';

const sorted = [...ACTORS];

const formatValue = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1).replace('.0', '')}B` : `$${v}M`;

const CARD_WIDTH = 320;
const CARD_HEIGHT = 520;
const PHOTO_HEIGHT = 340;
const GAP = 24;
const CARDS_VISIBLE = 4.5;

export const ColumnChart3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const totalCards = sorted.length;
  const totalContentWidth = totalCards * (CARD_WIDTH + GAP) - GAP;

  const scrollProgress = interpolate(frame, [60, durationInFrames - 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const viewportWidth = 1920;
  const maxScroll = Math.max(0, totalContentWidth - viewportWidth + 200);
  const scrollX = scrollProgress * maxScroll;

  const rankCounter = interpolate(frame, [0, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0a0a0a',
      fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
      }} />

      {/* Title bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 80,
        background: 'linear-gradient(90deg, #FFD700, #FFA000)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}>
        <span style={{
          fontSize: 36,
          fontWeight: 900,
          color: '#000',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          💰 Richest Hollywood Actors — Net Worth 2025
        </span>
      </div>

      {/* Scrolling cards container */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        transform: `translateX(${100 - scrollX}px)`,
      }}>
        {sorted.map((actor, i) => {
          const x = i * (CARD_WIDTH + GAP);
          const enterDelay = i * 10;

          const cardReveal = interpolate(frame, [20 + enterDelay, 50 + enterDelay], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });

          const rank = i + 1;
          const centerX = x + CARD_WIDTH / 2 - scrollX + 100;
          const isInView = centerX > -200 && centerX < 2120;

          if (!isInView && cardReveal >= 1) {
            return (
              <div key={actor.name} style={{
                position: 'absolute',
                left: x,
                top: 130,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
              }} />
            );
          }

          return (
            <div key={actor.name} style={{
              position: 'absolute',
              left: x,
              top: 130 + (1 - cardReveal) * 40,
              width: CARD_WIDTH,
              opacity: cardReveal,
            }}>
              {/* Card container */}
              <div style={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: '#1a1a2e',
                boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)`,
                position: 'relative',
              }}>
                {/* Rank badge */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  border: '2px solid #FFD700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  fontWeight: 900,
                  color: '#FFD700',
                  zIndex: 3,
                }}>
                  {rank}
                </div>

                {/* Flag badge top right */}
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  fontSize: 28,
                  zIndex: 3,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                }}>
                  {actor.flag}
                </div>

                {/* Photo area */}
                <div style={{
                  width: CARD_WIDTH,
                  height: PHOTO_HEIGHT,
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <Img
                    src={staticFile(actor.photo)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 15%',
                    }}
                  />
                  {/* Gradient overlay at bottom of photo */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                    background: 'linear-gradient(transparent, #1a1a2e)',
                  }} />
                </div>

                {/* Info area */}
                <div style={{
                  padding: '12px 16px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  {/* Name */}
                  <div style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#fff',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}>
                    {actor.name}
                  </div>

                  {/* Value */}
                  <div style={{
                    fontSize: 38,
                    fontWeight: 900,
                    color: '#FFD700',
                    textShadow: '0 0 20px rgba(255,215,0,0.3)',
                    lineHeight: 1,
                    marginTop: 4,
                  }}>
                    {formatValue(Math.round(cardReveal * actor.netWorth))}
                  </div>

                  {/* Country */}
                  <div style={{
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                    marginTop: 2,
                  }}>
                    {actor.country}
                  </div>
                </div>

                {/* Color accent bar at bottom */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: actor.color,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom bar with ranking counter */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        zIndex: 10,
      }}>
        <span style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.4)',
        }}>
          Source: Forbes, Celebrity Net Worth (2025)
        </span>
      </div>

      {/* Current visible rank indicator */}
      <div style={{
        position: 'absolute',
        bottom: 70,
        right: 40,
        fontSize: 18,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.3)',
        zIndex: 10,
      }}>
        {Math.min(totalCards, Math.round(scrollProgress * (totalCards - CARDS_VISIBLE) + CARDS_VISIBLE))}/{totalCards}
      </div>
    </AbsoluteFill>
  );
};
