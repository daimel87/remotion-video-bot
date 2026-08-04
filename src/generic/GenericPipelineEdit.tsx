// Composicion del pipeline automatico: audio -> transcripcion -> keywords ->
// clips -> video. A diferencia de src/odisea/, esto no se edita a mano por
// bloque: se registra UNA sola vez en Root.tsx con datos generados (ver
// scripts/gen-generic-data.mjs), asi que correr `npm run make-video` con un
// audio distinto no requiere tocar codigo ni volver a compilar Composition
// nuevas.
//
// Planos encadenados con una transicion distinta cada vez (slide izquierda/
// derecha, zoom, wipe, fade -- se van rotando, ver TRANSITIONS abajo), no
// cortes duros ni siempre el mismo crossfade. Sigue el mismo "truco de
// padding" que src/odisea/OdiseaDocumentaryEdit.tsx para que la transicion
// no desincronice la locucion: cada plano (salvo el ultimo) se extiende
// TRANSITION_FRAMES de mas, y la Transition entre cada par consume
// exactamente esos frames.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming, type TransitionPresentation} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {GenericShot, ProgressBar, TitleCard} from './components';
import {zoomTransition} from './transitions';

export const FPS = 30;
const TRANSITION_FRAMES = 18; // ~0.6s -- alcanza para que slide/wipe/zoom se noten sin sentirse lento
const INTRO_FRAMES = 84; // ~2.8s -- card de titulo superpuesta sobre el primer plano

// Rotacion de transiciones "dinamicas" entre planos: pull-left, pull-right,
// zoom in/out, wipe, y fade de vez en cuando para variar el ritmo. Se van
// turnando por indice de corte (nunca se repite la misma dos veces seguidas
// mientras el ciclo no coincida con la cantidad de planos).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TRANSITIONS: (() => TransitionPresentation<any>)[] = [
  () => slide({direction: 'from-right'}), // "pull left": lo nuevo entra por la derecha
  () => zoomTransition(),
  () => slide({direction: 'from-left'}), // "pull right": lo nuevo entra por la izquierda
  () => wipe({direction: 'from-left'}),
  () => fade(),
  () => wipe({direction: 'from-right'}),
];

export type Clip = {inicio: number; fin: number; file: string; kind: 'photos' | 'videos'; keyword?: string};
export type Segment = {texto: string; inicio: number; fin: number};

export const genericDurationInFrames = (durationSec: number): number =>
  Math.round(durationSec * FPS);

// Texto a mostrar durante la ventana [fromSec, toSec): concatena todos los
// segmentos de la transcripcion real que se solapan con ese rango (para que
// el subtitulo nunca se desincronice de la locucion, igual que la regla
// "el SRT es ley" del resto del proyecto).
function captionFor(segments: Segment[], fromSec: number, toSec: number): string {
  return segments
    .filter((s) => s.inicio < toSec && s.fin > fromSec)
    .map((s) => s.texto.trim())
    .join(' ');
}

const GlobalProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return <ProgressBar progress={frame / durationInFrames} />;
};

export const GenericPipelineEdit: React.FC<{
  clips: Clip[];
  segments: Segment[];
  audioSrc: string;
  title?: string;
}> = ({clips = [], segments = [], audioSrc, title}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <TransitionSeries>
        {clips.map((clip, i) => {
          const isLast = i === clips.length - 1;
          const baseFrames = Math.max(1, Math.round((clip.fin - clip.inicio) * FPS));
          const durationInFrames = isLast ? baseFrames : baseFrames + TRANSITION_FRAMES;
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={durationInFrames}>
                <GenericShot
                  src={clip.file}
                  kind={clip.kind}
                  caption={captionFor(segments, clip.inicio, clip.fin)}
                  keyword={clip.keyword}
                  direction={i % 2 === 0 ? 'in' : 'out'}
                  pan={i % 3 === 0 ? 'right' : i % 3 === 1 ? 'left' : 'none'}
                />
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition
                  presentation={TRANSITIONS[i % TRANSITIONS.length]()}
                  timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>

      {title && (
        <Sequence from={0} durationInFrames={INTRO_FRAMES}>
          <TitleCard title={title} durationInFrames={INTRO_FRAMES} />
        </Sequence>
      )}

      <GlobalProgressBar />

      {audioSrc && <Audio src={staticFile(audioSrc)} volume={1} />}
    </AbsoluteFill>
  );
};
