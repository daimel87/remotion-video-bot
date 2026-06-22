import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {MujerTitleGraphic} from './components/MujerTitleGraphic';

export const Mujer1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('mujer_1.mp4')} />

      <Sequence from={480} durationInFrames={200}>
        <BigTextGraphic text="7 señales que delatan sus verdaderos sentimientos, aunque ella jure que no le importas." highlight="aunque ella jure que no le importas." />
      </Sequence>

      <Sequence from={680} durationInFrames={175}>
        <MujerTitleGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
