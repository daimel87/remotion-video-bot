import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Triangulacion8Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('triangulacion_8.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#7" title='"Tu cuerpo empieza a hablar por ti"' />
      </Sequence>
    </AbsoluteFill>
  );
};
