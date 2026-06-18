import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Narcicista6Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('narcicista_senal_5.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#5" title="Te aísla de las personas que te quieren" />
      </Sequence>
    </AbsoluteFill>
  );
};
