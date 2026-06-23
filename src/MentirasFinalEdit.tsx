import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {MentirasCierreGraphic} from './components/MentirasCierreGraphic';

export const MentirasFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mentiras_final.mp4')} />

      <Sequence from={0} durationInFrames={220}>
        <MentirasCierreGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
