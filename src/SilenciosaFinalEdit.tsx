import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

export const SilenciosaFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('silenciosa_final.mp4')} />

      <Sequence from={40} durationInFrames={200}>
        <BigTextGraphic text="Identificar estas señales no te hace paranoico. Te hace consciente." highlight="Te hace consciente." />
      </Sequence>

      <Sequence from={970} durationInFrames={180}>
        <BigTextGraphic text="La verdad siempre se revela." highlight="siempre se revela." />
      </Sequence>
    </AbsoluteFill>
  );
};
