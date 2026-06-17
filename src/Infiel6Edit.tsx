import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

export const Infiel6Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senal_6.mp4')} />

      {/* GRÁFICO #5 */}
      <Sequence from={1290} durationInFrames={175}>
        <InfielSignalGraphic number="#5" title="Evita el contacto físico natural" />
      </Sequence>

    </AbsoluteFill>
  );
};
