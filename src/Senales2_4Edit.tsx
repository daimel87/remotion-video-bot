import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Senales2_4Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('senales2_4.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#3" title="Habla de su futuro y tú no estás en él" />
      </Sequence>
    </AbsoluteFill>
  );
};
