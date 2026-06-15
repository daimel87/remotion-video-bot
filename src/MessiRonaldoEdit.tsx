import {AbsoluteFill, Sequence} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {VsStatsGraphic} from './components/VsStatsGraphic';

const MESSI_COLOR = '#4FC3F7';
const RONALDO_COLOR = '#E53935';
const DATE_LABEL = 'As of June 2026';
const MESSI_START_YEAR = 2004;
const RONALDO_START_YEAR = 2002;
const END_YEAR = 2025;
const MESSI_PHOTO = 'messi.webp';
const MESSI_PHOTO_POSITION = '70% 35%';
const RONALDO_PHOTO = 'ronaldo.webp';

// Timeline (30fps, 5400 frames total = 180s / 3 minutes)
// 0-150       Intro title (5s)
// 150-5250    Single main scene: Total Career Goals counting slowly 0→final (168s)
// 5250-5400   Outro / CTA (5s)

export const MessiRonaldoEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#050b1f'}}>
      <Sequence from={0} durationInFrames={150}>
        <BigTextGraphic text="MESSI vs RONALDO: GOAL WARS" highlight="GOAL WARS" />
      </Sequence>

      <Sequence from={150} durationInFrames={5100}>
        <VsStatsGraphic
          category="Total Career Goals (Club & Country)"
          dateLabel={DATE_LABEL}
          leftName="Messi"
          leftBadge="10"
          leftPhoto={MESSI_PHOTO}
          leftPhotoPosition={MESSI_PHOTO_POSITION}
          leftValue={850}
          leftColor={MESSI_COLOR}
          leftStartYear={MESSI_START_YEAR}
          leftGrowthLabel="2024/25 Season Goals"
          leftGrowthValue="+28"
          rightName="Ronaldo"
          rightBadge="CR7"
          rightPhoto={RONALDO_PHOTO}
          rightValue={938}
          rightColor={RONALDO_COLOR}
          rightStartYear={RONALDO_START_YEAR}
          endYear={END_YEAR}
          rightGrowthLabel="2024/25 Season Goals"
          rightGrowthValue="+35"
          unitLabel="Goals"
          gapLabel="Goal Gap"
        />
      </Sequence>

      <Sequence from={5250} durationInFrames={150}>
        <BigTextGraphic text="WHO IS THE REAL GOAT? DROP YOUR PICK BELOW!" highlight="GOAT" />
      </Sequence>
    </AbsoluteFill>
  );
};
