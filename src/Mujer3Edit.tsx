import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Mujer3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mujer_3.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#2" title="Se pone fría justo cuando se acercan demasiado" />
      </Sequence>
    </AbsoluteFill>
  );
};
