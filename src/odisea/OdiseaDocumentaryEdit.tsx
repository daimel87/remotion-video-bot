// Composicion real del documental de Odisea (no el preview de demo).
// Arma el plan a partir de cues.ts + el selector de pools "menos usado +
// separacion minima" (plan.ts) y renderiza cada plano con Ken Burns +
// subtitulos corridos por palabra -- las dos cosas que ya se aprobaron del
// preview. Los cards de titulo/capitulo se dejan fuera a proposito: estan
// en discusion (ver src/montage/cards.tsx) y no bloquean este pipeline.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {buildPlan, planDurationSec} from './plan';
import {ImageShot} from './components';
import {BLOQUE_1} from './cues';

export const FPS = 30;

export const odiseaDurationInFrames = (cues = BLOQUE_1): number =>
  Math.round(planDurationSec(cues) * FPS);

export const OdiseaDocumentaryEdit: React.FC<{cues?: typeof BLOQUE_1}> = ({cues = BLOQUE_1}) => {
  const plan = buildPlan(cues);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {plan.map((shot, i) => (
        <Sequence
          key={i}
          from={Math.round(shot.fromSec * FPS)}
          durationInFrames={Math.round((shot.durationSec ?? 4) * FPS)}
        >
          <ImageShot
            src={shot.item.file}
            caption={shot.text}
            direction={i % 2 === 0 ? 'in' : 'out'}
            pan={i % 3 === 0 ? 'right' : i % 3 === 1 ? 'left' : 'none'}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
