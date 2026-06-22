import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Mujer2Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mujer_2.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#1" title="Te presta atención a los detalles pero finge que no" />
      </Sequence>
    </AbsoluteFill>
  );
};
