import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Silenciosa6Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('silenciosa_6.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#5" title="Las conversaciones se vuelven vacías" />
      </Sequence>
    </AbsoluteFill>
  );
};
