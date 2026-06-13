import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {IntroTitle} from './components/IntroTitle';
import {LowerThird} from './components/LowerThird';
import {RecapList} from './components/RecapList';
import {ProgressBar} from './components/ProgressBar';
import {Outro} from './components/Outro';

export const VideoEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('input.mp4')} />

      <Sequence from={0} durationInFrames={75}>
        <IntroTitle />
      </Sequence>

      <Sequence from={40} durationInFrames={175}>
        <LowerThird />
      </Sequence>

      <Sequence from={975} durationInFrames={450}>
        <RecapList />
      </Sequence>

      <Sequence from={1425} durationInFrames={75}>
        <Outro />
      </Sequence>

      <ProgressBar />
    </AbsoluteFill>
  );
};
