import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';
import {TechGrid} from './TechGrid';

const PlayerPanel: React.FC<{
  side: 'left' | 'right';
  name: string;
  badge: string;
  photoSrc?: string;
  photoPosition?: string;
  currentValue: number;
  maxValue: number;
  color: string;
  unitLabel: string;
  growthLabel: string;
  growthValue: string;
  delay: number;
}> = ({side, name, badge, photoSrc, photoPosition, currentValue, maxValue, color, unitLabel, growthLabel, growthValue, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame: Math.max(0, frame - delay), fps, config: {damping: 200, stiffness: 120}});
  const barFill = interpolate(currentValue, [0, maxValue], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

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
      {photoSrc ? (
        <Img
          src={staticFile(photoSrc)}
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: photoPosition ?? 'center',
            border: `5px solid ${color}`,
            boxShadow: `0 0 35px ${color}aa`,
            marginBottom: 24,
          }}
        />
      ) : (
        <div
          style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 900,
            fontSize: 64,
            color: '#0a0f24',
            marginBottom: 24,
            boxShadow: `0 0 25px ${color}aa`,
          }}
        >
          {badge}
        </div>
      )}

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
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {currentValue.toLocaleString('en-US')}
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

const YearTicker: React.FC<{minYear: number; maxYear: number; progress: number; color: string}> = ({
  minYear,
  maxYear,
  progress,
  color,
}) => {
  const currentYear = Math.round(interpolate(progress, [0, 1], [minYear, maxYear]));
  const markerTop = interpolate(progress, [0, 1], [100, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        flex: '0 0 170px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 25, 55, 0.85)',
        border: '2px solid rgba(91, 140, 255, 0.6)',
        boxShadow: '0 0 30px rgba(91, 140, 255, 0.35)',
        borderRadius: 18,
        padding: '28px 16px',
        margin: '0 0 0 8px',
      }}
    >
      <div
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 700,
          fontSize: 16,
          color: '#9be1ff',
          textTransform: 'uppercase',
          letterSpacing: 2,
          marginBottom: 12,
        }}
      >
        Year
      </div>
      <div
        style={{
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 900,
          fontSize: 42,
          color: '#fff',
          textShadow: `0 0 20px ${color}aa`,
          marginBottom: 20,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {currentYear}
      </div>

      <div style={{position: 'relative', width: 10, height: 220, borderRadius: 5, background: 'rgba(255,255,255,0.12)'}}>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${100 - markerTop}%`,
            borderRadius: 5,
            background: color,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: `${markerTop}%`,
            left: '50%',
            width: 22,
            height: 22,
            marginLeft: -11,
            marginTop: -11,
            borderRadius: '50%',
            background: '#fff',
            border: `3px solid ${color}`,
            boxShadow: `0 0 14px ${color}aa`,
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 14,
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 600,
          fontSize: 14,
          color: '#cfe6ff',
        }}
      >
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
};

export const VsStatsGraphic: React.FC<{
  category: string;
  dateLabel: string;
  leftName: string;
  leftBadge: string;
  leftPhoto?: string;
  leftPhotoPosition?: string;
  leftValue: number;
  leftColor: string;
  leftStartYear: number;
  leftGrowthLabel: string;
  leftGrowthValue: string;
  rightName: string;
  rightBadge: string;
  rightPhoto?: string;
  rightPhotoPosition?: string;
  rightValue: number;
  rightColor: string;
  rightStartYear: number;
  rightGrowthLabel: string;
  rightGrowthValue: string;
  endYear: number;
  unitLabel: string;
  gapLabel: string;
}> = ({
  category,
  dateLabel,
  leftName,
  leftBadge,
  leftPhoto,
  leftPhotoPosition,
  leftValue,
  leftColor,
  leftStartYear,
  leftGrowthLabel,
  leftGrowthValue,
  rightName,
  rightBadge,
  rightPhoto,
  rightPhotoPosition,
  rightValue,
  rightColor,
  rightStartYear,
  rightGrowthLabel,
  rightGrowthValue,
  endYear,
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

  const minStartYear = Math.min(leftStartYear, rightStartYear);
  const yearProgress = interpolate(frame, [40, durationInFrames - 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const currentYearContinuous = interpolate(yearProgress, [0, 1], [minStartYear, endYear]);

  const leftFrac = interpolate(currentYearContinuous, [leftStartYear, endYear], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rightFrac = interpolate(currentYearContinuous, [rightStartYear, endYear], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leftCurrentValue = Math.round(leftFrac * leftValue);
  const rightCurrentValue = Math.round(rightFrac * rightValue);

  const maxValue = Math.max(leftValue, rightValue);
  const gap = Math.abs(leftCurrentValue - rightCurrentValue);
  const leaderColor = leftCurrentValue >= rightCurrentValue ? leftColor : rightColor;

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
            photoSrc={leftPhoto}
            photoPosition={leftPhotoPosition}
            currentValue={leftCurrentValue}
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
            photoSrc={rightPhoto}
            photoPosition={rightPhotoPosition}
            currentValue={rightCurrentValue}
            maxValue={maxValue}
            color={rightColor}
            unitLabel={unitLabel}
            growthLabel={rightGrowthLabel}
            growthValue={rightGrowthValue}
            delay={25}
          />
          <YearTicker minYear={minStartYear} maxYear={endYear} progress={yearProgress} color={leaderColor} />
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
              fontVariantNumeric: 'tabular-nums',
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
