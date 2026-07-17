import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, useCurrentFrame} from 'remotion';
import {buildScenes} from './cd/scenes';
import {
  KenBurns, VideoBG, Grade, YearTag, Headline, TextCard, StatBig, BarChart, KeywordPop, ProgressBar,
} from './cd/components';
import {COLORS} from './cd/theme';

export const CDDocumentaryEdit: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const scenes = React.useMemo(() => buildScenes(fps), [fps]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Audio src={staticFile('audio/cd-narration.mp3')} />

      {scenes.map((sc, idx) => {
        const nextFrom = idx < scenes.length - 1 ? scenes[idx + 1].from : durationInFrames;
        const dur = Math.max(1, nextFrom - sc.from);
        return (
          <Sequence key={sc.i} from={sc.from} durationInFrames={dur}>
            {sc.card ? (
              <TextCard text={sc.headline ?? ''} sub={sc.sub} accent={sc.accent} durationInFrames={dur} />
            ) : (
              <AbsoluteFill>
                {sc.video ? <VideoBG src={sc.bg} /> : <KenBurns src={sc.bg} motion={sc.motion} durationInFrames={dur} />}
                <Grade />
                {sc.tag && <YearTag label={sc.tag} />}
                {sc.chart && <BarChart mode={sc.chart} />}
                {sc.stat && (
                  <StatBig
                    value={sc.stat.value} prefix={sc.stat.prefix} suffix={sc.stat.suffix}
                    label={sc.stat.label} decimals={sc.stat.decimals} format={sc.stat.format}
                    accent={sc.accent}
                  />
                )}
                {sc.headline && !sc.stat && !sc.chart && (
                  <Headline text={sc.headline} sub={sc.sub} accent={sc.accent} holdFrames={Math.min(dur, Math.round(fps * 2.2))} />
                )}
                {!sc.headline && !sc.stat && !sc.chart && sc.emphasis && sc.emphasis.length > 0 && (
                  <KeywordPop words={sc.emphasis} accent={sc.accent ?? 'gold'} />
                )}
              </AbsoluteFill>
            )}
          </Sequence>
        );
      })}

      {/* Capas globales */}
      <AbsoluteFill style={{
        pointerEvents: 'none',
        boxShadow: 'inset 0 0 320px rgba(0,0,0,0.65)',
      }} />
      <ProgressBar progress={frame / durationInFrames} />
    </AbsoluteFill>
  );
};
