// Composicion real del documental de Odisea (no el preview de demo).
// Arma el plan a partir de cues.ts + el selector de pools "menos usado +
// separacion minima" (plan.ts) y renderiza cada plano con Ken Burns +
// subtitulos corridos por palabra -- las dos cosas que ya se aprobaron del
// preview. Los planos se encadenan con TransitionSeries (crossfade) en vez
// de cortes duros, y llevan locucion real + musica de fondo.
//
// Truco de padding para que el crossfade no desincronice el audio: cada
// plano (salvo el ultimo) se extiende `TRANSITION_FRAMES` de mas, y la
// Transition entre cada par consume exactamente esos mismos frames -- asi
// TransitionSeries "colapsa" el solape y el plano N+1 sigue empezando en el
// frame original (Bn), igual que si no hubiera crossfade. Ver la nota en
// plan.ts sobre `durationSec` real por cue (alineado al SRT de la locucion).
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {buildPlan, planDurationSec, DEFAULT_SHOT_SEC} from './plan';
import {ImageShot} from './components';
import {BLOQUE_1} from './cues';

export const FPS = 30;
const TRANSITION_FRAMES = 12; // ~0.4s de crossfade entre planos

export const odiseaDurationInFrames = (cues = BLOQUE_1): number =>
  Math.round(planDurationSec(cues) * FPS);

export const OdiseaDocumentaryEdit: React.FC<{cues?: typeof BLOQUE_1}> = ({cues = BLOQUE_1}) => {
  const plan = buildPlan(cues);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <TransitionSeries>
        {plan.map((shot, i) => {
          const isLast = i === plan.length - 1;
          const baseFrames = Math.round((shot.durationSec ?? DEFAULT_SHOT_SEC) * FPS);
          const durationInFrames = isLast ? baseFrames : baseFrames + TRANSITION_FRAMES;
          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={durationInFrames}>
                <ImageShot
                  src={shot.item.file}
                  caption={shot.text}
                  direction={i % 2 === 0 ? 'in' : 'out'}
                  pan={i % 3 === 0 ? 'right' : i % 3 === 1 ? 'left' : 'none'}
                  fadeOut={isLast}
                />
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
      <Audio src={staticFile('audio/odisea/bloque1-vo.mp3')} volume={1} />
      {/* Musica de fondo desactivada a pedido del usuario: la agrega en su editor. */}
    </AbsoluteFill>
  );
};
