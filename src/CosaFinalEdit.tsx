import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

export const CosaFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('cosa_final.mp4')} />

      <Sequence from={451} durationInFrames={200}>
        <BigTextGraphic text="La verdad siempre encuentra una salida." highlight="encuentra una salida." />
      </Sequence>
    </AbsoluteFill>
  );
};
