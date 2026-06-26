import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Silenciosa3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('silenciosa_3.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#2" title="Te da más libertad de la que pediste" />
      </Sequence>
    </AbsoluteFill>
  );
};
