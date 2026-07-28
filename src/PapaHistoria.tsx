import React from 'react';
import {Series} from 'remotion';
import {CollageAutoScene, SCENE_DURATION} from './CollageAutoScene';

const makeSeries = (n: number): React.FC => () => {
  const scenes = Array.from({length: n}, (_, i) => String(i + 1).padStart(2, '0'));
  return (
    <Series>
      {scenes.map((folder) => (
        <Series.Sequence key={folder} durationInFrames={SCENE_DURATION}>
          <CollageAutoScene folder={folder} />
        </Series.Sequence>
      ))}
    </Series>
  );
};

// Test de 1 minuto: primeras 12 escenas (12*5s = 60s).
export const PapaHistoriaTest: React.FC = makeSeries(12);
// Entrega final: las 94 escenas completas.
export const PapaHistoriaFull: React.FC = makeSeries(94);
