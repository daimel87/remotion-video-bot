import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

export const Silenciosa1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('silenciosa_1.mp4')} />

      <Sequence from={130} durationInFrames={180}>
        <BigTextGraphic text="Lo peor no es que te engañen. Es que no te des cuenta." highlight="no te des cuenta." />
      </Sequence>

      <Sequence from={650} durationInFrames={180}>
        <BigTextGraphic text="Las señales más peligrosas son las que parecen normales." highlight="parecen normales." />
      </Sequence>

      <Sequence from={1120} durationInFrames={180}>
        <BigTextGraphic text="Si reconoces 3 de estas 5... necesitas prestar atención." highlight="prestar atención." />
      </Sequence>
    </AbsoluteFill>
  );
};
