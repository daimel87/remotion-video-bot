import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {MentirasTitleGraphic} from './components/MentirasTitleGraphic';

export const Mentiras1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mentiras_1.mp4')} />

      <Sequence from={530} durationInFrames={208}>
        <BigTextGraphic text="Para que nunca más te la vuelvan a meter sin que te des cuenta." highlight="sin que te des cuenta." />
      </Sequence>

      <Sequence from={738} durationInFrames={175}>
        <MentirasTitleGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
