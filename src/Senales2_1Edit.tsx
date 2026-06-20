import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';
import {Senales2TitleGraphic} from './components/Senales2TitleGraphic';

export const Senales2_1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('senales2_1.mp4')} />

      <Sequence from={423} durationInFrames={175}>
        <BigTextGraphic text="La número 4 es la que más duele, porque es la que confirma todo." highlight="la que confirma todo." />
      </Sequence>

      <Sequence from={598} durationInFrames={175}>
        <Senales2TitleGraphic />
      </Sequence>
    </AbsoluteFill>
  );
};
