import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile} from 'remotion';
import {ACTORS} from './richestActorsData';

const sorted = [...ACTORS];

const formatValue = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1).replace('.0', '')}B` : `$${v}M`;

const COLUMN_WIDTH = 160;
const PHOTO_SIZE = 130;
const GAP = 40;
const FLOOR_Y = 880;
const MAX_BAR_HEIGHT = 550;
const PEDESTAL_SIDE_WIDTH = 24;

export const ColumnChart3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const maxValue = Math.max(...sorted.map(a => a.netWorth));
  const totalColumns = sorted.length;
  const totalContentWidth = totalColumns * (COLUMN_WIDTH + GAP) - GAP;

  const scrollProgress = interpolate(frame, [90, durationInFrames - 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

  const viewportWidth = 1920;
  const maxScroll = Math.max(0, totalContentWidth - viewportWidth + 300);
  const scrollX = scrollProgress * maxScroll;

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0d1117',
      fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Gradient sky background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, #0a0e1a 0%, #141e30 40%, #1a2332 70%, #0d1117 100%)',
      }} />

      {/* Grid floor */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: FLOOR_Y,
        height: 200,
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: FLOOR_Y,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
      }} />

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 25,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 52,
        fontWeight: 900,
        color: '#fff',
        textShadow: '0 0 40px rgba(255,215,0,0.3), 0 2px 8px rgba(0,0,0,0.8)',
        letterSpacing: 3,
        zIndex: 10,
      }}>
        Richest Hollywood Actors
      </div>
      <div style={{
        position: 'absolute',
        top: 88,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 20,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 400,
        letterSpacing: 4,
        textTransform: 'uppercase',
        zIndex: 10,
      }}>
        Net Worth 2025
      </div>

      {/* Scrolling container */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        transform: `translateX(${150 - scrollX}px)`,
      }}>
        {sorted.map((actor, i) => {
          const targetHeight = (actor.netWorth / maxValue) * MAX_BAR_HEIGHT;
          const enterDelay = i * 12;

          const growProgress = interpolate(frame, [30 + enterDelay, 80 + enterDelay], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });

          const fadeIn = interpolate(frame, [20 + enterDelay, 40 + enterDelay], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          const currentHeight = growProgress * targetHeight;
          const x = i * (COLUMN_WIDTH + GAP);
          const columnTop = FLOOR_Y - currentHeight;

          const currentValue = Math.round(growProgress * actor.netWorth);

          return (
            <React.Fragment key={actor.name}>
              {/* Column front face - wood/leather texture effect */}
              <div style={{
                position: 'absolute',
                left: x,
                top: columnTop,
                width: COLUMN_WIDTH,
                height: currentHeight,
                background: `linear-gradient(180deg,
                  ${actor.color}ee 0%,
                  ${actor.color}cc 20%,
                  ${actor.color}aa 50%,
                  ${actor.color}88 80%,
                  ${actor.color}66 100%)`,
                borderRadius: '6px 6px 0 0',
                boxShadow: `inset -3px 0 8px rgba(0,0,0,0.3), inset 3px 0 8px rgba(255,255,255,0.05), 0 0 30px ${actor.color}33`,
                opacity: fadeIn,
              }}>
                {/* Vertical line details on column */}
                <div style={{
                  position: 'absolute',
                  left: 4,
                  top: 0,
                  width: 1,
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                }} />
                <div style={{
                  position: 'absolute',
                  right: 4,
                  top: 0,
                  width: 1,
                  height: '100%',
                  backgroundColor: 'rgba(0,0,0,0.15)',
                }} />
              </div>

              {/* 3D right side */}
              <div style={{
                position: 'absolute',
                left: x + COLUMN_WIDTH,
                top: columnTop + PEDESTAL_SIDE_WIDTH * 0.45,
                width: PEDESTAL_SIDE_WIDTH,
                height: currentHeight,
                background: `linear-gradient(180deg, ${actor.color}88, ${actor.color}44)`,
                transform: 'skewY(-35deg)',
                transformOrigin: 'top left',
                opacity: fadeIn,
              }} />

              {/* 3D top face */}
              <div style={{
                position: 'absolute',
                left: x,
                top: columnTop - PEDESTAL_SIDE_WIDTH * 0.45,
                width: COLUMN_WIDTH,
                height: PEDESTAL_SIDE_WIDTH,
                background: `linear-gradient(90deg, ${actor.color}dd, ${actor.color}99)`,
                transform: 'skewX(-35deg)',
                transformOrigin: 'bottom left',
                borderRadius: '6px 6px 0 0',
                opacity: fadeIn,
              }} />

              {/* Photo frame on column */}
              {fadeIn > 0 && (
                <div style={{
                  position: 'absolute',
                  left: x + (COLUMN_WIDTH - PHOTO_SIZE) / 2,
                  top: columnTop + 12,
                  width: PHOTO_SIZE,
                  height: PHOTO_SIZE,
                  borderRadius: 8,
                  border: '3px solid rgba(255,255,255,0.3)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                  opacity: fadeIn,
                  backgroundColor: '#222',
                }}>
                  <Img
                    src={staticFile(actor.photo)}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center 20%',
                    }}
                  />
                </div>
              )}

              {/* Name plate on column */}
              {fadeIn > 0 && (
                <div style={{
                  position: 'absolute',
                  left: x,
                  top: columnTop + PHOTO_SIZE + 20,
                  width: COLUMN_WIDTH,
                  textAlign: 'center',
                  opacity: fadeIn,
                }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: '#fff',
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                    lineHeight: 1.2,
                    padding: '0 4px',
                  }}>
                    {actor.name}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: 2,
                  }}>
                    {actor.country}
                  </div>
                </div>
              )}

              {/* Flag above column */}
              {fadeIn > 0 && (
                <div style={{
                  position: 'absolute',
                  left: x + COLUMN_WIDTH - 10,
                  top: columnTop - PEDESTAL_SIDE_WIDTH - 35,
                  fontSize: 32,
                  opacity: fadeIn,
                  transform: `translateY(${(1 - fadeIn) * 15}px)`,
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
                }}>
                  {actor.flag}
                </div>
              )}

              {/* Value label */}
              {fadeIn > 0 && (
                <div style={{
                  position: 'absolute',
                  left: x + COLUMN_WIDTH + 8,
                  top: columnTop - PEDESTAL_SIDE_WIDTH + 5,
                  fontSize: 22,
                  fontWeight: 900,
                  color: '#FFD700',
                  opacity: fadeIn,
                  textShadow: '0 0 10px rgba(255,215,0,0.4), 0 2px 4px rgba(0,0,0,0.8)',
                  whiteSpace: 'nowrap',
                }}>
                  {formatValue(currentValue)}
                </div>
              )}

              {/* Rank number at base */}
              {currentHeight > 40 && (
                <div style={{
                  position: 'absolute',
                  left: x,
                  top: FLOOR_Y - 28,
                  width: COLUMN_WIDTH,
                  textAlign: 'center',
                  fontSize: 15,
                  fontWeight: 800,
                  color: 'rgba(255,255,255,0.35)',
                  opacity: fadeIn,
                }}>
                  #{i + 1}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Oscar trophy emoji top right */}
      <div style={{
        position: 'absolute',
        top: 30,
        right: 60,
        fontSize: 60,
        opacity: interpolate(frame, [0, 60], [0, 0.8], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.5))',
        zIndex: 10,
      }}>
        🏆
      </div>

      {/* Source */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 13,
        color: 'rgba(255,255,255,0.2)',
        whiteSpace: 'nowrap',
        zIndex: 10,
      }}>
        Source: Forbes, Celebrity Net Worth (approximate figures, 2025)
      </div>
    </AbsoluteFill>
  );
};
