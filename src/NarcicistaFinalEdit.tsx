import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcCierreGraphic} from './components/NarcCierreGraphic';

export const NarcicistaFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('narcicista_final.mp4')} />

      <Sequence from={0} durationInFrames={200}>
        <NarcCierreGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
