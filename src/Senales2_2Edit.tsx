import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Senales2_2Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('senales2_2.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#1" title="Ya no pelea contigo" />
      </Sequence>
    </AbsoluteFill>
  );
};
