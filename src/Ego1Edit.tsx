import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

export const Ego1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('ego_1.mp4')} />

      <Sequence from={300} durationInFrames={200}>
        <BigTextGraphic text="Las relaciones no mueren por falta de amor. Mueren por exceso de ego." highlight="por exceso de ego." />
      </Sequence>

      <Sequence from={1060} durationInFrames={175}>
        <BigTextGraphic text="7 formas en que tu ego destruye lo que amas." highlight="destruye lo que amas." />
      </Sequence>
    </AbsoluteFill>
  );
};
