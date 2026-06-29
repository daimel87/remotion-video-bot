import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Soledad8Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('soledad_8.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#7" title="Buscan un propósito, no solo distracción" />
      </Sequence>
    </AbsoluteFill>
  );
};
