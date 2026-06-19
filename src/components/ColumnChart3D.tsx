import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile} from 'remotion';
import {ACTORS} from './richestActorsData';

const sorted = [...ACTORS];
const formatValue = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1).replace('.0', '')}` : `$${v}`;
const formatUnit = (v: number) => v >= 1000 ? 'Billion' : 'Million';

const CARD_WIDTH = 640;
const CARD_HEIGHT = 1080;
const PHOTO_HEIGHT = 580;
const INFO_TOP = PHOTO_HEIGHT;
const VISIBLE_CARDS = 3;
const DIVIDER_WIDTH = 4;

export const ColumnChart3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const totalCards = sorted.length;
  const totalWidth = totalCards * CARD_WIDTH;

  const scrollProgress = interpolate(frame, [30, durationInFrames - 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  const maxScroll = totalWidth - 1920;
  const scrollX = scrollProgress * maxScroll;

  return (
    <AbsoluteFill style={{
      backgroundColor: '#fff',
      fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Scrolling container */}
      <div style={{
        position: 'absolute',
        left: -scrollX,
        top: 0,
        width: totalWidth,
        height: 1080,
      }}>
        {sorted.map((actor, i) => {
          const x = i * CARD_WIDTH;

          return (
            <div key={actor.name} style={{
              position: 'absolute',
              left: x,
              top: 0,
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              backgroundColor: '#fff',
            }}>
              {/* Photo */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: CARD_WIDTH,
                height: PHOTO_HEIGHT,
                overflow: 'hidden',
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

                {/* Age badge */}
                <div style={{
                  position: 'absolute',
                  bottom: 16,
                  left: CARD_WIDTH / 2 - 60,
                  width: 120,
                  height: 36,
                  backgroundColor: '#D32F2F',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}>
                  AGE : {actor.age}
                </div>
              </div>

              {/* Name area - white background */}
              <div style={{
                position: 'absolute',
                top: INFO_TOP,
                left: 0,
                width: CARD_WIDTH,
                height: 80,
                backgroundColor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: '#111',
                  textAlign: 'center',
                }}>
                  {actor.name}
                </span>
              </div>

              {/* Net Worth area - dark blue gradient */}
              <div style={{
                position: 'absolute',
                top: INFO_TOP + 80,
                left: 0,
                width: CARD_WIDTH,
                height: CARD_HEIGHT - INFO_TOP - 80,
                background: 'linear-gradient(180deg, #0D1B4A, #1A237E)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0,
              }}>
                {/* "Net Worth :" label */}
                <div style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: 1,
                }}>
                  Net Worth :
                </div>

                {/* Value */}
                <div style={{
                  fontSize: 90,
                  fontWeight: 900,
                  color: '#FFD700',
                  lineHeight: 1.1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}>
                  {formatValue(actor.netWorth)}
                </div>

                {/* Million/Billion */}
                <div style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: '#ddd',
                  marginTop: -4,
                }}>
                  {formatUnit(actor.netWorth)}
                </div>

                {/* Country with flag */}
                <div style={{
                  fontSize: 18,
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{ fontSize: 24 }}>{actor.flag}</span>
                  <span>{actor.country}</span>
                </div>
              </div>

              {/* Vertical divider on right edge */}
              {i < totalCards - 1 && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: DIVIDER_WIDTH,
                  height: CARD_HEIGHT,
                  backgroundColor: 'rgba(0,0,0,0.15)',
                  zIndex: 5,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
