import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

export const Soledad1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('soledad_intro.mp4')} />

      <Sequence from={450} durationInFrames={200}>
        <BigTextGraphic text="Estar solo no siempre es soledad. A veces es libertad." highlight="A veces es libertad." />
      </Sequence>

      <Sequence from={750} durationInFrames={200}>
        <BigTextGraphic text="7 rasgos psicológicos de quienes eligen su propia compañía." highlight="7 rasgos psicológicos" />
      </Sequence>
    </AbsoluteFill>
  );
};
