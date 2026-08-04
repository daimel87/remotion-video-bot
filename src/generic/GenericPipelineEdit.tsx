// Composicion del pipeline automatico: audio -> transcripcion -> keywords ->
// clips -> video. A diferencia de src/odisea/, esto no se edita a mano por
// bloque: se registra UNA sola vez en Root.tsx con calculateMetadata (lee
// output/clips.json + output/transcripcion.json en tiempo de render), asi
// que correr `npm run make-video` con un audio distinto no requiere tocar
// codigo ni volver a compilar Composition nuevas.
//
// Cortes duros (Sequence), no crossfade: los clips vienen de fuentes muy
// heterogeneas (fotos y videos de duracion/resolucion variable) y el
// objetivo es un pipeline robusto y automatico, no un montaje editorial
// curado a mano como Odisea.
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {GenericShot} from './components';

export const FPS = 30;

export type Clip = {inicio: number; fin: number; file: string; kind: 'photos' | 'videos'};
export type Segment = {texto: string; inicio: number; fin: number};

export const genericDurationInFrames = (durationSec: number): number =>
  Math.round(durationSec * FPS);

// Texto a mostrar durante la ventana [fromSec, toSec): concatena todos los
// segmentos de la transcripcion real que se solapan con ese rango (para que
// el subtitulo drift nunca se desincronice de la locucion, igual que la
// regla "el SRT es ley" del resto del proyecto).
function captionFor(segments: Segment[], fromSec: number, toSec: number): string {
  return segments
    .filter((s) => s.inicio < toSec && s.fin > fromSec)
    .map((s) => s.texto.trim())
    .join(' ');
}

export const GenericPipelineEdit: React.FC<{clips: Clip[]; segments: Segment[]; audioSrc: string}> = ({
  clips = [],
  segments = [],
  audioSrc,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {clips.map((clip, i) => {
        const from = Math.round(clip.inicio * FPS);
        const durationInFrames = Math.max(1, Math.round((clip.fin - clip.inicio) * FPS));
        return (
          <Sequence key={i} from={from} durationInFrames={durationInFrames}>
            <GenericShot src={clip.file} kind={clip.kind} caption={captionFor(segments, clip.inicio, clip.fin)} />
          </Sequence>
        );
      })}
      {audioSrc && <Audio src={staticFile(audioSrc)} volume={1} />}
    </AbsoluteFill>
  );
};
