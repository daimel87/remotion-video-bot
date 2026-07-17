import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, useCurrentFrame} from 'remotion';
import {buildPlan} from './cd/plan';
import {
  KenBurns, VideoBG, Grade, Atmosphere, Letterbox, TitleCard, ChapterTitle, DateStamp,
  FullScreenText, StatBox, BarChart, NewspaperCard, QuoteCard, DefinitionCard, LowerThird, ProgressBar,
} from './cd/components';
import {COLORS} from './cd/theme';

export const CDDocumentaryEdit: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const {shots, overlays} = React.useMemo(() => buildPlan(fps, durationInFrames), [fps, durationInFrames]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Audio src={staticFile('audio/cd-narration.mp3')} />

      {/* B-roll con cortes duros limpios (sin fade, sin parpadeo) */}
      {shots.map((s, i) => (
        <Sequence key={`s${i}`} from={s.from} durationInFrames={s.dur}>
          {s.video ? <VideoBG src={s.src} /> : <KenBurns src={s.src} motion={s.motion} durationInFrames={s.dur} />}
        </Sequence>
      ))}

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
        </Sequence>
      ))}

      {/* Barras de cine + progreso */}
      <Letterbox />
      <ProgressBar progress={frame / durationInFrames} />
    </AbsoluteFill>
  );
};
