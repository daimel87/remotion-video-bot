import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Triangulacion2Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('triangulacion_2.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#1" title='"Cedes para evitar el conflicto"' />
      </Sequence>
    </AbsoluteFill>
  );
};
