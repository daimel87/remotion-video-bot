import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

export const Infiel7Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senal_7.mp4')} />

      {/* GRÁFICO #6 */}
      <Sequence from={1205} durationInFrames={175}>
        <InfielSignalGraphic number="#6" title="Se irrita con preguntas normales" />
      </Sequence>

    </AbsoluteFill>
  );
};
