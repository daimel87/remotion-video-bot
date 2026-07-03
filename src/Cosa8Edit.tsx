import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Cosa8Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('cosa_8.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#8" title="¿No merezco privacidad?" />
      </Sequence>
    </AbsoluteFill>
  );
};
