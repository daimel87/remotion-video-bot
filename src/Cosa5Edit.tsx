import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {NarcSignalGraphic} from './components/NarcSignalGraphic';

export const Cosa5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('cosa_5.mp4')} />

      <Sequence from={0} durationInFrames={175}>
        <NarcSignalGraphic number="#5" title="¿Por qué me controlas?" />
      </Sequence>
    </AbsoluteFill>
  );
};
