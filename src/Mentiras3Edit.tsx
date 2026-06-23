import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Mentiras3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mentiras_3.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#2" title='"Tuve que quedarme en el trabajo"' />
      </Sequence>
    </AbsoluteFill>
  );
};
