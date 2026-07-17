import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {buildPlan} from './cd/plan';
import {
  KenBurns, VideoBG, Grade, Atmosphere, Letterbox, TitleCard, ChapterTitle, DateStamp,
  FullScreenText, StatBox, BarChart, NewspaperCard, QuoteCard, DefinitionCard, LowerThird, ProgressBar,
  ShrinkBar, NetworkDiagram, Timeline, HUD,
} from './cd/components';
import {COLORS} from './cd/theme';

const XFADE = 24; // duración del crossfade entre tomas (frames)

export const CDDocumentaryEdit: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const {shots, overlays, chapters} = React.useMemo(() => buildPlan(fps, durationInFrames), [fps, durationInFrames]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Audio src={staticFile('audio/cd-narration.mp3')} />

      {/* B-roll con crossfades oficiales (@remotion/transitions) — disolvencia real A↔B */}
      <TransitionSeries>
        {shots.flatMap((s, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`seq${i}`} durationInFrames={s.dur + XFADE}>
              {s.video ? <VideoBG src={s.src} /> : <KenBurns src={s.src} motion={s.motion} durationInFrames={s.dur + XFADE} />}
            </TransitionSeries.Sequence>
          );
          if (i === 0) return [seq];
          return [
            <TransitionSeries.Transition key={`tr${i}`} presentation={fade()} timing={linearTiming({durationInFrames: XFADE})} />,
            seq,
          ];
        })}
      </TransitionSeries>

      {/* Grade cine + atmósfera */}
      <Grade />
      <Atmosphere />

      {/* Overlays */}
      {overlays.map((o, i) => (
        <Sequence key={`o${i}`} from={o.from} durationInFrames={o.dur}>
          {o.kind === 'title' && <TitleCard pre={o.pre} text={o.text ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'chapter' && <ChapterTitle num={o.num ?? 1} title={o.text ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'date' && <DateStamp year={o.text ?? ''} durationInFrames={o.dur} />}
          {(o.kind === 'fulltext' || o.kind === 'slam' || o.kind === 'question') && <FullScreenText text={o.text ?? ''} accent={o.accent} durationInFrames={o.dur} />}
          {o.kind === 'stat' && o.stat && (
            <StatBox
              value={o.stat.value} display={o.stat.display} prefix={o.stat.prefix} suffix={o.stat.suffix}
              label={o.stat.label} decimals={o.stat.decimals} format={o.stat.format} accent={o.stat.accent}
            />
          )}
          {o.kind === 'chart' && o.chart && <BarChart mode={o.chart} />}
          {o.kind === 'newspaper' && <NewspaperCard headline={o.headline ?? ''} dek={o.dek} img={o.img} durationInFrames={o.dur} />}
          {o.kind === 'quote' && <QuoteCard quote={o.quote ?? ''} author={o.author} durationInFrames={o.dur} />}
          {o.kind === 'definition' && <DefinitionCard term={o.term ?? ''} pos={o.pos} def={o.def ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'name' && <LowerThird name={o.name ?? ''} role={o.role} />}
          {o.kind === 'shrink' && <ShrinkBar durationInFrames={o.dur} />}
          {o.kind === 'network' && <NetworkDiagram durationInFrames={o.dur} />}
          {o.kind === 'timeline' && <Timeline active={o.text ?? ''} durationInFrames={o.dur} />}
        </Sequence>
      ))}

      {/* HUD permanente + barras de cine + progreso */}
      <HUD chapters={chapters} title="La historia real del CD" />
      <Letterbox />
      <ProgressBar progress={frame / durationInFrames} />
    </AbsoluteFill>
  );
};
