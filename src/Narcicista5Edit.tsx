import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Narcicista5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('narcicista_senal_4.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#4" title="Te compara con otros para desestabilizarte" />
      </Sequence>
    </AbsoluteFill>
  );
};
