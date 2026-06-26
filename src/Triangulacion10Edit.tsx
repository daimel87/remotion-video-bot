import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Triangulacion10Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('triangulacion_10.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#9" title='"Confundes amor con sacrificio"' />
      </Sequence>
    </AbsoluteFill>
  );
};
