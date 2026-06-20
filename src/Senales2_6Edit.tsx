import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Senales2_6Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('senales2_6.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#5" title="Ya no se molesta en fingir" />
      </Sequence>
    </AbsoluteFill>
  );
};
