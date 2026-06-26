import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {TriangulacionTitleGraphic} from './components/TriangulacionTitleGraphic';

export const Triangulacion1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('triangulacion_1.mp4')} />

      <Sequence from={0} durationInFrames={208}>
        <BigTextGraphic text="Es que prefiero ceder para no pelear." highlight="para no pelear." />
      </Sequence>

      <Sequence from={208} durationInFrames={175}>
        <TriangulacionTitleGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
