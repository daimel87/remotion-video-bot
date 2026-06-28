import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Ego4Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('ego_4.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#3" title="Confundes vulnerabilidad con debilidad" />
      </Sequence>
    </AbsoluteFill>
  );
};
