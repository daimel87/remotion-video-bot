import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, useCurrentFrame, interpolate} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {buildPlan, hueFor} from './gc/plan';
import {CRTPowerOn, SourceCard, signalCut} from './gc/components';
import {
  KenBurns, VideoBG, Grade, Atmosphere, Letterbox, TitleCard, ChapterTitle, DateStamp,
  FullScreenText, StatBox, NewspaperCard, QuoteCard, DefinitionCard, LowerThird, ProgressBar, HUD,
} from './cd/components';
import {COLORS} from './cd/theme';

const XFADE = 20;

// ============================================================
// "Un MEXICANO de 23 Años le Dio COLOR a tu TV" — mismo estilo cinematográfico
// del CD/BlackBerry, + técnicas nuevas del análisis del video del tigre:
//   · CRTPowerOn: apertura tipo encendido de tubo de rayos catódicos.
//   · signalCut: transición de estática de TV en el corte al Capítulo I.
//   · SourceCard: cita de fuente bajo material de archivo real.
// ============================================================

const GCProceduralBG: React.FC<{base: string; seed: number; durationInFrames: number}> = ({base, seed, durationInFrames}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const hue = hueFor(base);
  const scale = interpolate(p, [0, 1], [1.05, 1.15]);
  const tx = interpolate(p, [0, 1], [1.5, -1.5]) + (seed % 2 ? 0.5 : -0.5);
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: COLORS.bg}}>
      <AbsoluteFill style={{
        transform: `scale(${scale}) translateX(${tx}%)`,
        background: `radial-gradient(120% 120% at ${38 + (seed % 3) * 8}% 30%, hsl(${hue} 24% 16%) 0%, hsl(${(hue + 12) % 360} 30% 8%) 55%, #04070a 100%)`,
      }} />
      <AbsoluteFill style={{opacity: 0.10, background: 'repeating-linear-gradient(120deg, rgba(255,255,255,0.04) 0 2px, rgba(0,0,0,0) 2px 10px)'}} />
    </AbsoluteFill>
  );
};

export const GonzalezCamarenaDocumentaryEdit: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const {shots, overlays, chapters} = React.useMemo(() => buildPlan(fps, durationInFrames), [fps, durationInFrames]);

  const renderBG = (s: (typeof shots)[number]) => {
    if (s.src) {
      return s.video
        ? <VideoBG src={s.src} startFrom={s.startFrom} archival={s.archival} />
        : <KenBurns src={s.src} motion={s.motion} durationInFrames={s.dur + XFADE} />;
    }
    return <GCProceduralBG base={s.base} seed={s.seed} durationInFrames={s.dur + XFADE} />;
  };

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      <Audio src={staticFile('audio/gc-narration.mp3')} />

      <TransitionSeries>
        {shots.flatMap((s, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`seq${i}`} durationInFrames={s.dur + XFADE}>
              {renderBG(s)}
            </TransitionSeries.Sequence>
          );
          if (i === 0) return [seq];
          const transition = s.signalCut
            ? <TransitionSeries.Transition key={`tr${i}`} presentation={signalCut()} timing={linearTiming({durationInFrames: XFADE})} />
            : <TransitionSeries.Transition key={`tr${i}`} presentation={fade()} timing={linearTiming({durationInFrames: XFADE})} />;
          return [transition, seq];
        })}
      </TransitionSeries>

      <Grade />
      <Atmosphere />

      {overlays.map((o, i) => (
        <Sequence key={`o${i}`} from={o.from} durationInFrames={o.dur}>
          {o.kind === 'title' && <TitleCard pre={o.pre} text={o.text ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'chapter' && <ChapterTitle num={o.num ?? 1} title={o.text ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'date' && <DateStamp year={o.text ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'fulltext' && <FullScreenText text={o.text ?? ''} accent={o.accent} durationInFrames={o.dur} />}
          {o.kind === 'stat' && o.stat && (
            <StatBox value={o.stat.value} display={o.stat.display} prefix={o.stat.prefix} suffix={o.stat.suffix}
              label={o.stat.label} decimals={o.stat.decimals} format={o.stat.format} accent={o.stat.accent} />
          )}
          {o.kind === 'newspaper' && <NewspaperCard headline={o.headline ?? ''} dek={o.dek} durationInFrames={o.dur} />}
          {o.kind === 'quote' && <QuoteCard quote={o.quote ?? ''} author={o.author} durationInFrames={o.dur} />}
          {o.kind === 'definition' && <DefinitionCard term={o.term ?? ''} pos={o.pos} def={o.def ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'name' && <LowerThird name={o.name ?? ''} role={o.role} />}
          {o.kind === 'source' && <SourceCard label={o.label ?? ''} sub={o.sub} durationInFrames={o.dur} />}
        </Sequence>
      ))}

      <HUD chapters={chapters} title="El joven que creó la TV a color" />
      <Letterbox />
      <ProgressBar progress={frame / durationInFrames} />
      <Sequence from={0} durationInFrames={26}>
        <CRTPowerOn durationInFrames={26} />
      </Sequence>
    </AbsoluteFill>
  );
};
