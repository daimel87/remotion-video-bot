import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Silenciosa5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('silenciosa_5.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#4" title="Se arregla más, pero no para ti" />
      </Sequence>
    </AbsoluteFill>
  );
};
