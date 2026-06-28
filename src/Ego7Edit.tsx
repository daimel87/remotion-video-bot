import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Ego7Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('ego_7.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#6" title="No celebras sus logros" />
      </Sequence>
    </AbsoluteFill>
  );
};
