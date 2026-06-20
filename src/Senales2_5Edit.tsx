import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Senales2_5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('senales2_5.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#4" title="El contacto físico desapareció" />
      </Sequence>
    </AbsoluteFill>
  );
};
