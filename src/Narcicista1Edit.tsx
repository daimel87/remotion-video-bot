import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {NarcTitleGraphic} from './components/NarcTitleGraphic';

export const Narcicista1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('narcicista_1.mp4')} />

      <Sequence from={700} durationInFrames={260}>
        <BigTextGraphic text="Vas a entender por qué has tomado decisiones que nunca fueron tuyas." highlight="decisiones que nunca fueron tuyas." />
      </Sequence>

      <Sequence from={960} durationInFrames={175}>
        <NarcTitleGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
