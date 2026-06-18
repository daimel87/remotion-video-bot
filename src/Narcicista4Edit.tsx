import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Narcicista4Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('narcicista_senal_3.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#3" title="Cambia la historia para quedar como víctima" />
      </Sequence>
    </AbsoluteFill>
  );
};
