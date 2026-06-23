import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Mentiras5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mentiras_5.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#4" title='"Se me murió la batería"' />
      </Sequence>
    </AbsoluteFill>
  );
};
