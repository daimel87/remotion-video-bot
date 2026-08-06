// Composicion del pipeline automatico audio->video.
//
// Arma el plan desde cues.generated.ts (cada frase del SRT + pool semantico +
// durationSec real) y el selector pickFromPool (plan.ts). Cada toma renderiza
// el material elegido -- VIDEO (OffthreadVideo) o FOTO (Ken Burns) -- anclado a
// su ventana exacta del SRT, con subtitulo corrido por palabra y la locucion
// real encima. Los planos se encadenan con crossfade (mismo truco de padding
// que Odisea para no desincronizar el audio).
import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {buildPlan, planDurationSec} from './plan';
import {CUES, AUDIO_SRC} from './cues.generated';

export const FPS = 30;
const TRANSITION_FRAMES = 12; // ~0.4s de crossfade

export const autoDurationInFrames = (cues = CUES): number =>
  Math.round(planDurationSec(cues) * FPS);

// --- Subtitulo corrido palabra por palabra (estilo Odisea) ---
const WordReveal: React.FC<{text: string; delay?: number}> = ({text, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.26em',
        maxWidth: '80%',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {text.split(' ').map((word, i) => {
        const p = spring({
          frame: frame - delay - i * 2,
          fps,
          config: {damping: 200},
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [26, 0])}px)`,
              fontSize: 44,
              fontWeight: 700,
              color: '#fff',
              textShadow: '0 3px 18px rgba(0,0,0,0.9)',
              lineHeight: 1.25,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const Caption: React.FC<{text: string}> = ({text}) => (
  <AbsoluteFill
    style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96, pointerEvents: 'none'}}
  >
    <WordReveal text={text} delay={8} />
  </AbsoluteFill>
);

const Grade: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'linear-gradient(180deg, rgba(0,0,0,0.28), transparent 30%, transparent 66%, rgba(0,0,0,0.5))',
    }}
  />
);

// --- Una toma: video o foto segun el kind del material ---
const Shot: React.FC<{
  file: string;
  kind: 'photos' | 'videos';
  caption: string;
  index: number;
}> = ({file, kind, caption, index}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  // Ken Burns solo para fotos (los videos ya tienen movimiento propio).
  const scale =
    kind === 'photos'
      ? interpolate(frame, [0, durationInFrames], index % 2 === 0 ? [1, 1.12] : [1.12, 1])
      : 1;
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {kind === 'videos' ? (
        <OffthreadVideo
          src={staticFile(file)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      ) : (
        <Img
          src={staticFile(file)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale})`,
          }}
        />
      )}
      <Grade />
      <Caption text={caption} />
    </AbsoluteFill>
  );
};

export const AutoStockEdit: React.FC<{
  cues?: typeof CUES;
  audioSrc?: string;
}> = ({cues = CUES, audioSrc = AUDIO_SRC}) => {
  const plan = buildPlan(cues);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <TransitionSeries>
        {plan.map((shot, i) => {
          const isLast = i === plan.length - 1;
          const baseFrames = Math.round(shot.durationSec * FPS);
          const durationInFrames = isLast ? baseFrames : baseFrames + TRANSITION_FRAMES;
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={durationInFrames}>
                <Shot file={shot.item.file} kind={shot.item.kind} caption={shot.text} index={i} />
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition
                  presentation={fade()}
                  timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
      {audioSrc ? <Audio src={staticFile(audioSrc)} volume={1} /> : null}
    </AbsoluteFill>
  );
};
