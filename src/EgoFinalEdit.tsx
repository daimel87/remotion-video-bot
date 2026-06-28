import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

export const EgoFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('ego_final.mp4')} />

      <Sequence from={450} durationInFrames={200}>
        <BigTextGraphic text="El amor empieza donde termina el ego." highlight="donde termina el ego." />
      </Sequence>
    </AbsoluteFill>
  );
};
