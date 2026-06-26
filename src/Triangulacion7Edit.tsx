import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Triangulacion7Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('triangulacion_7.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#6" title='"Explotas de la nada"' />
      </Sequence>
    </AbsoluteFill>
  );
};
