import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

export const SoledadFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('soledad_9.mp4')} />

      <Sequence from={450} durationInFrames={200}>
        <BigTextGraphic text="Disfrutar tu soledad es un signo de salud mental, no de debilidad." highlight="es un signo de salud mental" />
      </Sequence>
    </AbsoluteFill>
  );
};
