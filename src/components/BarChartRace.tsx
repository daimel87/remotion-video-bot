import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing} from 'remotion';
import {getEarningsAtYear, ATHLETES} from './barChartData';

const athleteMap = new Map(ATHLETES.map(a => [a.name, a]));

export const BarChartRace: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const yearProgress = interpolate(frame, [60, durationInFrames - 60], [0, 1], {
    clamp: true,
    easing: Easing.linear,
  });
  const yearFloat = interpolate(yearProgress, [0, 1], [1990, 2025]);
  const currentYear = Math.floor(yearFloat);

  const earnings = getEarningsAtYear(yearFloat);

  const ranked = Object.entries(earnings)
    .filter(([, v]) => v > 0.5)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const maxEarnings = ranked.length > 0 ? ranked[0][1] : 1;

  const topPadding = 120;
  const bottomPadding = 100;
  const availableHeight = 1080 - topPadding - bottomPadding;
  const slotHeight = availableHeight / 10;
  const barHeight = 62;
  const labelAreaLeft = 380;
  const valueAreaWidth = 160;
  const barAreaWidth = 1920 - labelAreaLeft - valueAreaWidth;

  const guideLines = [0.25, 0.5, 0.75, 1.0].map(pct => ({
    x: labelAreaLeft + pct * barAreaWidth,
    label: `$${Math.round(maxEarnings * pct)}M`,
  }));

  return (
    <AbsoluteFill style={{backgroundColor: '#0d0d0d', fontFamily: 'Arial, sans-serif', overflow: 'hidden'}}>
      {/* Guide lines */}
      {guideLines.map(({x, label}) => (
        <React.Fragment key={x}>
          <div style={{
            position: 'absolute',
            left: x,
            top: topPadding,
            width: 1,
            height: availableHeight,
            backgroundColor: 'rgba(255,255,255,0.06)',
          }} />
          <div style={{
            position: 'absolute',
            left: x + 4,
            top: topPadding - 20,
            fontSize: 13,
            color: 'rgba(255,255,255,0.25)',
          }}>{label}</div>
        </React.Fragment>
      ))}

      {/* Bars */}
      {ranked.slice(0, 12).map(([name, value], index) => {
        const athlete = athleteMap.get(name);
        if (!athlete) return null;

        const isVisible = index < 10;
        const opacity = index < 9 ? 1 : index === 9 ? 0.85 : 0.5;
        if (!isVisible && index >= 12) return null;

        const yPos = topPadding + index * slotHeight + (slotHeight - barHeight) / 2;
        const barWidth = Math.max(2, (value / maxEarnings) * barAreaWidth);
        const {color, flag, emoji} = athlete;
        const rank = index + 1;

        const valueLabel = `$${Math.round(value)}M`;
        const valueLabelX = labelAreaLeft + barWidth + 12;
        const valueFits = barWidth > 200;

        return (
          <React.Fragment key={name}>
            {/* Bar */}
            <div style={{
              position: 'absolute',
              left: labelAreaLeft,
              top: yPos,
              width: barWidth,
              height: barHeight,
              background: `linear-gradient(90deg, ${color}dd, ${color})`,
              borderRadius: '0 12px 12px 0',
              boxShadow: `0 0 20px ${color}55`,
              opacity,
            }} />

            {/* Rank badge */}
            <div style={{
              position: 'absolute',
              left: labelAreaLeft + 8,
              top: yPos + (barHeight - 26) / 2,
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity,
              zIndex: 2,
            }}>{rank}</div>

            {/* Athlete label (left panel) */}
            <div style={{
              position: 'absolute',
              right: 1920 - labelAreaLeft + 5,
              top: yPos,
              height: barHeight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 6,
              opacity,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}>
              <span style={{fontSize: 22}}>{flag}</span>
              <span style={{fontSize: 20}}>{emoji}</span>
              <span style={{fontSize: 18, fontWeight: 700, color: '#fff'}}>{name}</span>
            </div>

            {/* Value label */}
            {valueFits ? (
              <div style={{
                position: 'absolute',
                right: 1920 - labelAreaLeft - barWidth + 12,
                top: yPos + (barHeight - 22) / 2,
                fontSize: 18,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                opacity,
              }}>{valueLabel}</div>
            ) : (
              <div style={{
                position: 'absolute',
                left: valueLabelX,
                top: yPos + (barHeight - 22) / 2,
                fontSize: 18,
                fontWeight: 700,
                color: color,
                opacity,
              }}>{valueLabel}</div>
            )}
          </React.Fragment>
        );
      })}

      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'Arial',
        fontWeight: 900,
        fontSize: 42,
        color: '#fff',
      }}>
        World's Richest Athletes — Annual Earnings 1990–2025
      </div>
      <div style={{
        position: 'absolute',
        top: 72,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'Arial',
        fontSize: 22,
        color: '#aaa',
      }}>
        Estimated annual earnings (salary + endorsements) in millions USD
      </div>

      {/* Large year watermark */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        right: 60,
        fontFamily: 'Arial',
        fontWeight: 900,
        fontSize: 110,
        color: 'rgba(255,255,255,0.12)',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {currentYear}
      </div>

      {/* Visible year bottom left */}
      <div style={{
        position: 'absolute',
        bottom: 25,
        left: 60,
        fontFamily: 'Arial',
        fontWeight: 800,
        fontSize: 48,
        color: '#fff',
      }}>
        {currentYear}
      </div>

      {/* Source */}
      <div style={{
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#555',
        whiteSpace: 'nowrap',
      }}>
        Source: Forbes, Sports Illustrated, various media reports (approximate figures)
      </div>
    </AbsoluteFill>
  );
};
