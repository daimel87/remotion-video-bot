import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Ego8Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('ego_8.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#7" title="Prefieres tener razón antes que ser feliz" />
      </Sequence>
    </AbsoluteFill>
  );
};
