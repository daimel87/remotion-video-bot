import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Triangulacion11Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('triangulacion_11.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#10" title='"Tienes miedo de estar solo contigo"' />
      </Sequence>
    </AbsoluteFill>
  );
};
