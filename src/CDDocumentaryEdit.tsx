import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, useCurrentFrame} from 'remotion';
import {buildPlan} from './cd/plan';
import {
  KenBurns, VideoBG, Grade, Grain, TitleCard, ChapterRibbon, StatBox, BarChart, ProgressBar,
} from './cd/components';
import {COLORS} from './cd/theme';

export const CDDocumentaryEdit: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const {shots, overlays} = React.useMemo(() => buildPlan(fps, durationInFrames), [fps, durationInFrames]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Audio src={staticFile('audio/cd-narration.mp3')} />

      {/* Pista de b-roll con cortes rápidos */}
      {shots.map((s, i) => (
        <Sequence key={`s${i}`} from={s.from} durationInFrames={s.dur}>
          {s.video ? <VideoBG src={s.src} /> : <KenBurns src={s.src} motion={s.motion} durationInFrames={s.dur} />}
        </Sequence>
      ))}

      {/* Grade + grano global sobre el b-roll */}
      <Grade />
      <Grain />

      {/* Overlays: título, capítulos, cifras, gráficas */}
      {overlays.map((o, i) => (
        <Sequence key={`o${i}`} from={o.from} durationInFrames={o.dur}>
          {o.kind === 'title' && <TitleCard pre={o.pre} text={o.text ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'chapter' && <ChapterRibbon num={o.num ?? 1} title={o.text ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'stat' && o.stat && (
            <StatBox
              value={o.stat.value} display={o.stat.display} prefix={o.stat.prefix} suffix={o.stat.suffix}
              label={o.stat.label} decimals={o.stat.decimals} format={o.stat.format} accent={o.stat.accent}
            />
          )}
          {o.kind === 'chart' && o.chart && <BarChart mode={o.chart} />}
        </Sequence>
      ))}

      {/* Viñeta dura + barra de progreso */}
      <AbsoluteFill style={{pointerEvents: 'none', boxShadow: 'inset 0 0 340px rgba(0,0,0,0.7)'}} />
      <ProgressBar progress={frame / durationInFrames} />
    </AbsoluteFill>
  );
};
