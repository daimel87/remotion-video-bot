import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

export const Infiel8Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senal_8.mp4')} />

      {/* GRÁFICO #7 */}
      <Sequence from={1001} durationInFrames={175}>
        <InfielSignalGraphic number="#7" title="Su historia tiene detalles que no encajan" />
      </Sequence>

    </AbsoluteFill>
  );
};
