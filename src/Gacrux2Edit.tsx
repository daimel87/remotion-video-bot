import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: senales_2.mp4 (17s = 425 frames)
//
//   0-225    caption: "Ninguna de estas señales por sí sola confirma una infidelidad."
//   225-425  caption: "Lo que debes observar es el patrón. Cuando varias ocurren juntas, de forma repetida, ahí está la respuesta."
//   425-600  gráfico: "#1 VA DIRECTO AL BAÑO"
//
// Total: 600 frames (24 segundos)

export const Gacrux2Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senales_2.mp4')} />

      <Sequence from={0} durationInFrames={225}>
        <CaptionBox text="Ninguna de estas señales por sí sola confirma una infidelidad." />
      </Sequence>

      <Sequence from={225} durationInFrames={200}>
        <CaptionBox text="Lo que debes observar es el patrón. Cuando varias ocurren juntas, de forma repetida, ahí está la respuesta." />
      </Sequence>

      {/* GRÁFICO #1 */}
      <Sequence from={425} durationInFrames={175}>
        <InfielSignalGraphic number="#1" title="Va directo al baño" />
      </Sequence>

    </AbsoluteFill>
  );
};
