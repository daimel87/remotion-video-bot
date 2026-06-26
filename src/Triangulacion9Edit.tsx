import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Triangulacion9Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('triangulacion_9.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#8" title='"Atraes siempre el mismo tipo de persona"' />
      </Sequence>
    </AbsoluteFill>
  );
};
