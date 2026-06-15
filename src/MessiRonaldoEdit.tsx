import {AbsoluteFill, Sequence} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {VsStatsGraphic} from './components/VsStatsGraphic';

const MESSI_COLOR = '#4FC3F7';
const RONALDO_COLOR = '#E53935';
const DATE_LABEL = 'As of June 2026';

// Timeline (30fps, 1110 frames total = 37s)
// 0-90      Intro title
// 90-240    Total career goals (club + country)
// 240-390   Club career goals
// 390-540   International goals
// 540-690   UEFA Champions League goals
// 690-840   Career hat-tricks
// 840-990   Penalty goals
// 990-1110  Outro / CTA

export const MessiRonaldoEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#050b1f'}}>
      <Sequence from={0} durationInFrames={90}>
        <BigTextGraphic text="MESSI vs RONALDO: GOAL WARS" highlight="GOAL WARS" />
      </Sequence>

      <Sequence from={90} durationInFrames={150}>
        <VsStatsGraphic
          category="Total Career Goals (Club & Country)"
          dateLabel={DATE_LABEL}
          leftName="Messi"
          leftBadge="10"
          leftValue={850}
          leftColor={MESSI_COLOR}
          leftGrowthLabel="2024/25 Season Goals"
          leftGrowthValue="+28"
          rightName="Ronaldo"
          rightBadge="CR7"
          rightValue={938}
          rightColor={RONALDO_COLOR}
          rightGrowthLabel="2024/25 Season Goals"
          rightGrowthValue="+35"
          unitLabel="Goals"
          gapLabel="Goal Gap"
        />
      </Sequence>

      <Sequence from={240} durationInFrames={150}>
        <VsStatsGraphic
          category="Club Career Goals"
          dateLabel={DATE_LABEL}
          leftName="Messi"
          leftBadge="10"
          leftValue={720}
          leftColor={MESSI_COLOR}
          leftGrowthLabel="Clubs Played For"
          leftGrowthValue="Barcelona, PSG, Inter Miami"
          rightName="Ronaldo"
          rightBadge="CR7"
          rightValue={730}
          rightColor={RONALDO_COLOR}
          rightGrowthLabel="Clubs Played For"
          rightGrowthValue="Man Utd, Real Madrid, Juventus, Al Nassr"
          unitLabel="Goals"
          gapLabel="Goal Gap"
        />
      </Sequence>

      <Sequence from={390} durationInFrames={150}>
        <VsStatsGraphic
          category="International Goals (National Team)"
          dateLabel={DATE_LABEL}
          leftName="Messi"
          leftBadge="10"
          leftValue={112}
          leftColor={MESSI_COLOR}
          leftGrowthLabel="National Team"
          leftGrowthValue="Argentina"
          rightName="Ronaldo"
          rightBadge="CR7"
          rightValue={135}
          rightColor={RONALDO_COLOR}
          rightGrowthLabel="National Team"
          rightGrowthValue="Portugal"
          unitLabel="Goals"
          gapLabel="Goal Gap"
        />
      </Sequence>

      <Sequence from={540} durationInFrames={150}>
        <VsStatsGraphic
          category="UEFA Champions League Goals"
          dateLabel={DATE_LABEL}
          leftName="Messi"
          leftBadge="10"
          leftValue={129}
          leftColor={MESSI_COLOR}
          leftGrowthLabel="Competition"
          leftGrowthValue="UEFA Champions League"
          rightName="Ronaldo"
          rightBadge="CR7"
          rightValue={140}
          rightColor={RONALDO_COLOR}
          rightGrowthLabel="Competition"
          rightGrowthValue="UEFA Champions League"
          unitLabel="Goals"
          gapLabel="Goal Gap"
        />
      </Sequence>

      <Sequence from={690} durationInFrames={150}>
        <VsStatsGraphic
          category="Career Hat-Tricks"
          dateLabel={DATE_LABEL}
          leftName="Messi"
          leftBadge="10"
          leftValue={57}
          leftColor={MESSI_COLOR}
          leftGrowthLabel="Career Stat"
          leftGrowthValue="Hat-Tricks Scored"
          rightName="Ronaldo"
          rightBadge="CR7"
          rightValue={62}
          rightColor={RONALDO_COLOR}
          rightGrowthLabel="Career Stat"
          rightGrowthValue="Hat-Tricks Scored"
          unitLabel="Hat-Tricks"
          gapLabel="Hat-Trick Gap"
        />
      </Sequence>

      <Sequence from={840} durationInFrames={150}>
        <VsStatsGraphic
          category="Penalty Goals"
          dateLabel={DATE_LABEL}
          leftName="Messi"
          leftBadge="10"
          leftValue={104}
          leftColor={MESSI_COLOR}
          leftGrowthLabel="Career Stat"
          leftGrowthValue="Penalties Converted"
          rightName="Ronaldo"
          rightBadge="CR7"
          rightValue={145}
          rightColor={RONALDO_COLOR}
          rightGrowthLabel="Career Stat"
          rightGrowthValue="Penalties Converted"
          unitLabel="Penalty Goals"
          gapLabel="Penalty Gap"
        />
      </Sequence>

      <Sequence from={990} durationInFrames={120}>
        <BigTextGraphic text="WHO IS THE REAL GOAT? DROP YOUR PICK BELOW!" highlight="GOAT" />
      </Sequence>
    </AbsoluteFill>
  );
};
