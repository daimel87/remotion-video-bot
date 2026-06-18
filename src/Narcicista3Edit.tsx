import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Narcicista3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('narcicista_senal_2.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#2" title="Usa el silencio como castigo" />
      </Sequence>
    </AbsoluteFill>
  );
};
