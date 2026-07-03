import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CosaTitleGraphic} from './components/CosaTitleGraphic';

export const CosaReflexionEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('cosa_reflexion.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <CosaTitleGraphic title="8 señales de infidelidad" subtitle="Lo único que miente... es ella" />
      </Sequence>
    </AbsoluteFill>
  );
};
