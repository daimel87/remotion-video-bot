import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {Senales2CierreGraphic} from './components/Senales2CierreGraphic';

export const Senales2FinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('senales2_final.mp4')} />

      <Sequence from={0} durationInFrames={200}>
        <Senales2CierreGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
