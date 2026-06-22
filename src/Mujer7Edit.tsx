import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Mujer7Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mujer_7.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#6" title="Se pone celosa pero lo disfraza de indiferencia" />
      </Sequence>
    </AbsoluteFill>
  );
};
