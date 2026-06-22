import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Mujer8Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mujer_8.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#7" title="Se abre contigo y luego se arrepiente" />
      </Sequence>
    </AbsoluteFill>
  );
};
