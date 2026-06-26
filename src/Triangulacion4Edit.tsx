import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Triangulacion4Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('triangulacion_4.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#3" title='"Sientes culpa por poner límites"' />
      </Sequence>
    </AbsoluteFill>
  );
};
