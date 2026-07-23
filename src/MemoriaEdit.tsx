import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {StaticFrame} from './components/StaticFrame';
import {segments} from './content/memoriaData';

export const MemoriaEdit: React.FC = () => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: '#ffffff'}}>
      <Audio src={staticFile('memoria_narracion.wav')} />

      {segments.map((seg, i) => {
        const from = cursor;
        cursor += seg.durationInFrames;

        return (
          <Sequence key={i} from={from} durationInFrames={seg.durationInFrames}>
            <StaticFrame src={staticFile(seg.image)} />
            <CaptionBox text={seg.text} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
