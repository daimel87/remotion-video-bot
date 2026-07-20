import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, useCurrentFrame} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {buildPlan} from './health/plan';
import {cues} from './health/sampleCues';
import {
  ProceduralBG, KenBurns, VideoBG, Grade, Letterbox,
  HookText, RecipeNumber, PriceTag, RecipeCard, TipCard, QuoteCard, IngredientLabel,
  HUD, ProgressBar,
} from './health/components';
import {COLORS} from './health/theme';

// ============================================================
// Canal de salud / cocina frugal para SENIORS (50+).
// PLANTILLA lista. Mañana, para el video real:
//   1. Copia el MP3 de tu voz  -> public/audio/health-narration.mp3
//   2. Copia la música de fondo -> public/audio/health-music.mp3   (opcional)
//   3. Reemplaza src/health/sampleCues.ts por la transcripción de Buzz
//   4. Pon HAS_NARRATION = true (y HAS_MUSIC = true si hay música)
//   5. Cuando haya stock descargado, pon ASSET_MODE = 'media'
// ============================================================

const XFADE = 20;                 // crossfade suave entre tomas (frames)
const HAS_NARRATION = false;      // -> true cuando exista public/audio/health-narration.mp3
const HAS_MUSIC = false;          // -> true cuando exista public/audio/health-music.mp3
const ASSET_MODE = 'procedural' as 'procedural' | 'media'; // 'media' cuando haya stock/archivo

// Resolver base -> archivo real (se completa cuando descarguemos el stock).
// Por ahora vacío: en modo 'media' cae a ProceduralBG si no encuentra archivo.
const mediaFor = (_base: string, _seed: number): {src: string; video: boolean} | null => null;

export const HealthCookingEdit: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const frame = useCurrentFrame();
  const {shots, overlays, recipes} = React.useMemo(
    () => buildPlan(fps, durationInFrames, cues),
    [fps, durationInFrames],
  );

  const renderBG = (s: (typeof shots)[number]) => {
    if (ASSET_MODE === 'media') {
      const m = mediaFor(s.base, s.seed);
      if (m) return m.video
        ? <VideoBG src={m.src} archival={s.archival} />
        : <KenBurns src={m.src} motion={s.motion} durationInFrames={s.dur + XFADE} />;
    }
    return <ProceduralBG seed={s.seed} durationInFrames={s.dur + XFADE} />;
  };

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.bg}}>
      {HAS_NARRATION && <Audio src={staticFile('audio/health-narration.mp3')} />}
      {/* cama musical ducked ~18 dB bajo la voz (medido en el video de referencia) */}
      {HAS_MUSIC && <Audio src={staticFile('audio/health-music.mp3')} volume={0.14} />}

      {/* B-roll con crossfades reales */}
      <TransitionSeries>
        {shots.flatMap((s, i) => {
          const seq = (
            <TransitionSeries.Sequence key={`seq${i}`} durationInFrames={s.dur + XFADE}>
              {renderBG(s)}
            </TransitionSeries.Sequence>
          );
          if (i === 0) return [seq];
          return [
            <TransitionSeries.Transition key={`tr${i}`} presentation={fade()} timing={linearTiming({durationInFrames: XFADE})} />,
            seq,
          ];
        })}
      </TransitionSeries>

      <Grade />

      {/* Overlays */}
      {overlays.map((o, i) => (
        <Sequence key={`o${i}`} from={o.from} durationInFrames={o.dur}>
          {o.kind === 'hook' && <HookText text={o.text ?? ''} accent={o.accent} durationInFrames={o.dur} />}
          {o.kind === 'recipeNum' && <RecipeNumber num={o.num ?? 1} title={o.title ?? ''} durationInFrames={o.dur} />}
          {o.kind === 'price' && <PriceTag value={o.value} display={o.display} prefix={o.prefix} suffix={o.suffix} label={o.label} accent={o.accent} />}
          {o.kind === 'card' && <RecipeCard kicker={o.kicker} headline={o.headline ?? ''} dek={o.dek} durationInFrames={o.dur} />}
          {o.kind === 'tip' && <TipCard term={o.term ?? ''} def={o.def ?? ''} accent={o.accent} durationInFrames={o.dur} />}
          {o.kind === 'quote' && <QuoteCard quote={o.quote ?? ''} author={o.author} durationInFrames={o.dur} />}
          {o.kind === 'label' && <IngredientLabel name={o.name ?? ''} role={o.role} accent={o.accent} />}
        </Sequence>
      ))}

      {/* HUD del canal + barras suaves + progreso */}
      <HUD recipes={recipes} channel="Cocina & Salud 50+" />
      <Letterbox />
      <ProgressBar progress={frame / durationInFrames} />
    </AbsoluteFill>
  );
};
