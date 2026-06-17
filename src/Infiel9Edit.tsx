import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {InfielCierreGraphic} from './components/InfielCierreGraphic';

export const Infiel9Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senal_9.mp4')} />

      {/* GRÁFICO 9 — Cierre */}
      <Sequence from={1135} durationInFrames={200}>
        <InfielCierreGraphic />
      </Sequence>

    </AbsoluteFill>
  );
};
