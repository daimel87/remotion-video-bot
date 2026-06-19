import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {ACTORS} from './richestActorsData';

const sorted = [...ACTORS].sort((a, b) => a.netWorth - b.netWorth);

const formatValue = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(1).replace('.0', '')}B` : `$${v}M`;

export const ColumnChart3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const totalColumns = sorted.length;
  const columnWidth = 100;
  const gap = 14;
  const totalWidth = totalColumns * (columnWidth + gap) - gap;
  const startX = (1920 - totalWidth) / 2;
  const floorY = 920;
  const maxBarHeight = 650;
  const maxValue = Math.max(...sorted.map(a => a.netWorth));

  const staggerDelay = 8;

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0a0a1a',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
    }}>
      {/* Dollar bill texture overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 100%, rgba(0,40,0,0.15) 0%, transparent 70%)',
      }} />

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 18,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 48,
        fontWeight: 900,
        color: '#fff',
        textShadow: '0 0 30px rgba(255,215,0,0.4)',
        letterSpacing: 2,
      }}>
        💰 Richest Hollywood Actors 💰
      </div>
      <div style={{
        position: 'absolute',
        top: 75,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 22,
        color: '#aaa',
        fontWeight: 400,
      }}>
        Estimated Net Worth (2025)
      </div>

      {/* Floor line */}
      <div style={{
        position: 'absolute',
        left: startX - 30,
        top: floorY,
        width: totalWidth + 60,
        height: 2,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      }} />

      {/* Columns */}
      {sorted.map((actor, i) => {
        const targetHeight = (actor.netWorth / maxValue) * maxBarHeight;
        const delay = i * staggerDelay;

        const growProgress = interpolate(frame, [60 + delay, 120 + delay + (targetHeight / maxBarHeight) * 60], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });

        const currentHeight = growProgress * targetHeight;
        const x = startX + i * (columnWidth + gap);

        const labelReveal = interpolate(frame, [100 + delay, 130 + delay], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const currentValue = Math.round(growProgress * actor.netWorth);

        const skewWidth = 18;

        return (
          <React.Fragment key={actor.name}>
            {/* Column front face */}
            <div style={{
              position: 'absolute',
              left: x,
              top: floorY - currentHeight,
              width: columnWidth,
              height: currentHeight,
              background: `linear-gradient(180deg, ${actor.color}ee, ${actor.color}88)`,
              borderRadius: '4px 4px 0 0',
              boxShadow: `0 0 20px ${actor.color}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
            }} />

            {/* 3D right side */}
            <div style={{
              position: 'absolute',
              left: x + columnWidth,
              top: floorY - currentHeight + skewWidth / 2,
              width: skewWidth,
              height: currentHeight,
              background: `linear-gradient(180deg, ${actor.color}88, ${actor.color}44)`,
              transform: 'skewY(-35deg)',
              transformOrigin: 'top left',
            }} />

            {/* 3D top face */}
            <div style={{
              position: 'absolute',
              left: x,
              top: floorY - currentHeight - skewWidth / 2,
              width: columnWidth,
              height: skewWidth,
              background: `linear-gradient(90deg, ${actor.color}cc, ${actor.color}99)`,
              transform: 'skewX(-35deg)',
              transformOrigin: 'bottom left',
              borderRadius: '4px 4px 0 0',
            }} />

            {/* Flag */}
            {labelReveal > 0 && (
              <div style={{
                position: 'absolute',
                left: x,
                top: floorY - currentHeight - skewWidth / 2 - 70,
                width: columnWidth,
                textAlign: 'center',
                fontSize: 28,
                opacity: labelReveal,
                transform: `translateY(${(1 - labelReveal) * 10}px)`,
              }}>
                {actor.flag}
              </div>
            )}

            {/* Value */}
            {labelReveal > 0 && (
              <div style={{
                position: 'absolute',
                left: x,
                top: floorY - currentHeight - skewWidth / 2 - 48,
                width: columnWidth,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 800,
                color: '#fff',
                opacity: labelReveal,
                textShadow: `0 0 10px ${actor.color}`,
                transform: `translateY(${(1 - labelReveal) * 10}px)`,
              }}>
                {formatValue(currentValue)}
              </div>
            )}

            {/* Name (rotated at base) */}
            {labelReveal > 0 && (
              <div style={{
                position: 'absolute',
                left: x + columnWidth / 2,
                top: floorY + 12,
                fontSize: 13,
                fontWeight: 700,
                color: '#ccc',
                opacity: labelReveal,
                transform: 'rotate(-45deg)',
                transformOrigin: 'top left',
                whiteSpace: 'nowrap',
              }}>
                {actor.name}
              </div>
            )}

            {/* Rank number on column */}
            {currentHeight > 30 && (
              <div style={{
                position: 'absolute',
                left: x,
                top: floorY - 28,
                width: columnWidth,
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
              }}>
                #{i + 1}
              </div>
            )}
          </React.Fragment>
        );
      })}

      {/* Highlight pulse on #1 */}
      {frame > 180 && (() => {
        const topActor = sorted[sorted.length - 1];
        const topX = startX + (totalColumns - 1) * (columnWidth + gap);
        const topHeight = (topActor.netWorth / maxValue) * maxBarHeight;
        const pulse = interpolate(frame % 60, [0, 30, 60], [0.3, 0.6, 0.3]);
        return (
          <div style={{
            position: 'absolute',
            left: topX - 10,
            top: floorY - topHeight - 30,
            width: columnWidth + 20,
            height: topHeight + 40,
            border: `2px solid rgba(255,215,0,${pulse})`,
            borderRadius: 8,
            boxShadow: `0 0 30px rgba(255,215,0,${pulse * 0.5})`,
            pointerEvents: 'none',
          }} />
        );
      })()}

      {/* Source */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 14,
        color: '#444',
        whiteSpace: 'nowrap',
      }}>
        Source: Forbes, Celebrity Net Worth (approximate figures, 2025)
      </div>
    </AbsoluteFill>
  );
};
