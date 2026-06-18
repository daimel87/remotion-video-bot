import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Narcicista8Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('narcicista_senal_7.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#7" title="Invalida tus emociones" />
      </Sequence>
    </AbsoluteFill>
  );
};
