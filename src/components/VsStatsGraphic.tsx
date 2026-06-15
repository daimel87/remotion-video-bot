import {AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

const PlayerPanel: React.FC<{
  side: 'left' | 'right';
  name: string;
  badge: string;
  value: number;
  maxValue: number;
  color: string;
  unitLabel: string;
  growthLabel: string;
  growthValue: string;
  delay: number;
}> = ({side, name, badge, value, maxValue, color, unitLabel, growthLabel, growthValue, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 200, stiffness: 120}});
  const countFrame = Math.max(0, frame - delay - 10);
  const counted = Math.round(interpolate(countFrame, [0, 50], [0, value], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const barFill = interpolate(enter, [0, 1], [0, (value / maxValue) * 100]);

  const slideFrom = side === 'left' ? -60 : 60;

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [slideFrom, 0])}px)`,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 25, 55, 0.85)',
        border: `2px solid ${color}`,
        boxShadow: `0 0 30px ${color}66`,
        borderRadius: 18,
        padding: '36px 28px',
        margin: '0 16px',
      }}
    >
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 900,
          fontSize: 32,
          color: '#0a0f24',
          marginBottom: 18,
          boxShadow: `0 0 25px ${color}aa`,
        }}
      >
        {badge}
      </div>

      <div
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 800,
          fontSize: 30,
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 14,
          textAlign: 'center',
        }}
      >
        {name}
      </div>

      <div
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 900,
          fontSize: 64,
          color,
          textShadow: `0 0 20px ${color}aa`,
          lineHeight: 1,
        }}
      >
        {counted.toLocaleString('en-US')}
      </div>
      <div
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 700,
          fontSize: 18,
          color: '#9be1ff',
          textTransform: 'uppercase',
          letterSpacing: 2,
          marginTop: 4,
          marginBottom: 18,
        }}
      >
        {unitLabel}
      </div>

      <div
        style={{
          width: '100%',
          height: 14,
          borderRadius: 7,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${barFill}%`,
            height: '100%',
            background: color,
            borderRadius: 7,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 18,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
          fontSize: 17,
          color: '#cfe6ff',
          textAlign: 'center',
        }}
      >
        {growthLabel}
        <br />
        <span style={{color, fontWeight: 800}}>{growthValue}</span>
      </div>
    </div>
  );
};

export const VsStatsGraphic: React.FC<{
  category: string;
  dateLabel: string;
  leftName: string;
  leftBadge: string;
  leftValue: number;
  leftColor: string;
  leftGrowthLabel: string;
  leftGrowthValue: string;
  rightName: string;
  rightBadge: string;
  rightValue: number;
  rightColor: string;
  rightGrowthLabel: string;
  rightGrowthValue: string;
  unitLabel: string;
  gapLabel: string;
}> = ({
  category,
  dateLabel,
  leftName,
  leftBadge,
  leftValue,
  leftColor,
  leftGrowthLabel,
  leftGrowthValue,
  rightName,
  rightBadge,
  rightValue,
  rightColor,
  rightGrowthLabel,
  rightGrowthValue,
  unitLabel,
  gapLabel,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const titleEnter = spring({frame, fps, config: {damping: 200, stiffness: 150}});
  const gapEnter = spring({frame: Math.max(0, frame - 65), fps, config: {damping: 200, stiffness: 150}});
  const exit = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const maxValue = Math.max(leftValue, rightValue);
  const gap = Math.abs(leftValue - rightValue);
  const leaderColor = leftValue >= rightValue ? leftColor : rightColor;

  return (
    <AbsoluteFill style={{opacity: exit}}>
      <TechGrid />
      <AbsoluteFill style={{padding: '60px 90px', alignItems: 'center'}}>
        <div
          style={{
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
            textAlign: 'center',
            marginBottom: 36,
          }}
        >
          <div
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 900,
              fontSize: 46,
              color: '#fff',
              letterSpacing: 1,
            }}
          >
            {leftName.toUpperCase()} <span style={{color: '#9be1ff'}}>VS</span> {rightName.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 26,
              color: '#9be1ff',
              textTransform: 'uppercase',
              letterSpacing: 3,
              marginTop: 6,
            }}
          >
            {category}
          </div>
        </div>

        <div style={{display: 'flex', width: '100%', flex: 1, alignItems: 'stretch'}}>
          <PlayerPanel
            side="left"
            name={leftName}
            badge={leftBadge}
            value={leftValue}
            maxValue={maxValue}
            color={leftColor}
            unitLabel={unitLabel}
            growthLabel={leftGrowthLabel}
            growthValue={leftGrowthValue}
            delay={15}
          />
          <PlayerPanel
            side="right"
            name={rightName}
            badge={rightBadge}
            value={rightValue}
            maxValue={maxValue}
            color={rightColor}
            unitLabel={unitLabel}
            growthLabel={rightGrowthLabel}
            growthValue={rightGrowthValue}
            delay={25}
          />
        </div>

        <div
          style={{
            opacity: gapEnter,
            transform: `translateY(${interpolate(gapEnter, [0, 1], [20, 0])}px)`,
            marginTop: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            background: 'rgba(15, 25, 55, 0.9)',
            border: `2px solid ${leaderColor}`,
            boxShadow: `0 0 30px ${leaderColor}66`,
            borderRadius: 14,
            padding: '16px 40px',
          }}
        >
          <div
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 22,
              color: '#cfe6ff',
              textTransform: 'uppercase',
              letterSpacing: 2,
            }}
          >
            {gapLabel}
          </div>
          <div
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 900,
              fontSize: 38,
              color: leaderColor,
              textShadow: `0 0 20px ${leaderColor}aa`,
            }}
          >
            {gap.toLocaleString('en-US')}
          </div>
          <div
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              fontSize: 18,
              color: '#9be1ff',
            }}
          >
            {dateLabel}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
