import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

export const Gacrux5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senales_5.mp4')} />

      {/* GRÁFICO #4 */}
      <Sequence from={1216} durationInFrames={175}>
        <InfielSignalGraphic number="#4" title="Cambia su rutina sin explicación" />
      </Sequence>

    </AbsoluteFill>
  );
};
