import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, interpolate, Easing, staticFile} from 'remotion';
import {TALL_ACTORS_SORTED, formatHeight} from './tallActorsData';

const BG_COLORS = [
  '#1a237e', '#0d47a1', '#006064', '#1b5e20', '#e65100',
  '#4a148c', '#880e4f', '#bf360c', '#01579b', '#33691e', '#311b92',
];

const CARD_WIDTH = 384;
const PHOTO_HEIGHT = 680;
const DIVIDER_WIDTH = 3;

export const HeightCards: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const sorted = TALL_ACTORS_SORTED;
  const totalCards = sorted.length;
  const totalWidth = totalCards * CARD_WIDTH;

  const scrollProgress = interpolate(frame, [30, durationInFrames - 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.linear,
  });

  const maxScroll = Math.max(0, totalWidth - 1920);
  const scrollX = scrollProgress * maxScroll;

  return (
    <AbsoluteFill style={{
      backgroundColor: '#111',
      fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        left: -scrollX,
        top: 0,
        width: totalWidth,
        height: 1080,
      }}>
        {sorted.map((actor, i) => {
          const x = i * CARD_WIDTH;
          const feet = Math.floor(actor.heightInches / 12);
          const inches = actor.heightInches % 12;
          const bgColor = BG_COLORS[i % BG_COLORS.length];

          return (
            <div key={actor.name} style={{
              position: 'absolute',
              left: x,
              top: 0,
              width: CARD_WIDTH,
              height: 1080,
              backgroundColor: bgColor,
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
                    objectPosition: 'center 10%',
                  }}
                />
                {/* Gradient fade to background color */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 120,
                  background: `linear-gradient(transparent, ${bgColor})`,
                }} />
              </div>

              {/* Name */}
              <div style={{
                position: 'absolute',
                top: PHOTO_HEIGHT - 10,
                left: 0,
                width: CARD_WIDTH,
                textAlign: 'center',
                padding: '0 8px',
              }}>
                <div style={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: '#fff',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  lineHeight: 1.1,
                }}>
                  {actor.name}
                </div>
              </div>

              {/* Height value area */}
              <div style={{
                position: 'absolute',
                top: PHOTO_HEIGHT + 40,
                left: 0,
                width: CARD_WIDTH,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}>
                {/* Height label */}
                <div style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                }}>
                  Height
                </div>

                {/* Height value */}
                <div style={{
                  fontSize: 100,
                  fontWeight: 900,
                  color: '#FFD700',
                  lineHeight: 1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}>
                  {feet}'{inches}"
                </div>

                {/* CM conversion */}
                <div style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.6)',
                  marginTop: -4,
                }}>
                  ({Math.round(actor.heightInches * 2.54)} cm)
                </div>

                {/* Country with flag */}
                <div style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.5)',
                  marginTop: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  <span style={{ fontSize: 20 }}>{actor.flag}</span>
                  <span>{actor.country}</span>
                </div>
              </div>

              {/* Divider */}
              {i < totalCards - 1 && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: DIVIDER_WIDTH,
                  height: 1080,
                  backgroundColor: 'rgba(0,0,0,0.3)',
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
