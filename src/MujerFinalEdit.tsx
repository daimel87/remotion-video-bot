import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {MujerCierreGraphic} from './components/MujerCierreGraphic';

export const MujerFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mujer_final.mp4')} />

      <Sequence from={0} durationInFrames={200}>
        <MujerCierreGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
