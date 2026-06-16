import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: senales_2.mp4 (17s = 425 frames)
// Timestamps via ffmpeg silencedetect
//
// Silences at: 1.20-1.61, 3.29-3.96, 7.96-8.59, 10.60-11.10, 15.23-15.75
//
//   0.00-3.29   "Antes de empezar, una aclaración importante."
//   3.96-7.96   "Ninguna de estas señales por sí sola confirma una infidelidad."
//   8.59-15.23  "Lo que debes observar es el patrón. Cuando varias ocurren juntas, de forma repetida, ahí está la respuesta."
//   425-600     gráfico: "#1 VA DIRECTO AL BAÑO"
//
// Total: 600 frames (24 segundos)

export const Gacrux2Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senales_2.mp4')} />

      {/* 0.00s - 3.29s = frame 0-82 */}
      <Sequence from={0} durationInFrames={82}>
        <CaptionBox text="Antes de empezar, una aclaración importante." />
      </Sequence>

      {/* 3.96s - 7.96s = frame 99-199 */}
      <Sequence from={99} durationInFrames={100}>
        <CaptionBox text="Ninguna de estas señales por sí sola confirma una infidelidad." />
      </Sequence>

      {/* 8.59s - 15.23s = frame 215-381 */}
      <Sequence from={215} durationInFrames={166}>
        <CaptionBox text="Lo que debes observar es el patrón. Cuando varias ocurren juntas, de forma repetida, ahí está la respuesta." />
      </Sequence>

      {/* GRÁFICO #1 */}
      <Sequence from={425} durationInFrames={175}>
        <InfielSignalGraphic number="#1" title="Va directo al baño" />
      </Sequence>

    </AbsoluteFill>
  );
};
