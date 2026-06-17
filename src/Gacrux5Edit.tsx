import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: senales_5.mp4 (48.64s = 1216 frames)
// Major silences: 6.20-6.90, 17.06-17.77, 25.38-26.05, 34.93-35.67, 40.32-40.95
//
//   0.00-6.20    "Esta es la señal que más confunde a los hombres. Porque puede ir en dos direcciones opuestas."
//   6.90-17.06   "Hay mujeres que llegan a casa y de repente son extremadamente cariñosas. Te abrazan más, te preguntan cómo estás, están más atentas que nunca. Esto se llama comportamiento compensatorio — el cerebro intenta equilibrar la culpa con exceso de afecto."
//   17.77-25.38  "Pero hay otras que llegan completamente apagadas. Monosílabos. Sin contacto visual. Como si estuvieran en otro lugar."
//   26.05-40.32  "Ambos extremos, cuando son nuevos y repetidos, señalan lo mismo: algo pasó afuera que está afectando su equilibrio emocional en casa."
//   40.95-48.64  BigText: "Y ese algo rara vez es el trabajo."
//   1216-1391    gráfico: "#4 CAMBIA SU RUTINA SIN EXPLICACIÓN"

export const Gacrux5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senales_5.mp4')} />

      {/* 0.00s - 6.20s = frame 0-155 */}
      <Sequence from={0} durationInFrames={155}>
        <CaptionBox text="Esta es la señal que más confunde a los hombres. Porque puede ir en dos direcciones opuestas." />
      </Sequence>

      {/* 6.90s - 17.06s = frame 173-427 */}
      <Sequence from={173} durationInFrames={254}>
        <CaptionBox text="Hay mujeres que llegan a casa y de repente son extremadamente cariñosas. Te abrazan más, te preguntan cómo estás, están más atentas que nunca. Esto se llama comportamiento compensatorio — el cerebro intenta equilibrar la culpa con exceso de afecto." />
      </Sequence>

      {/* 17.77s - 25.38s = frame 444-635 */}
      <Sequence from={444} durationInFrames={191}>
        <CaptionBox text="Pero hay otras que llegan completamente apagadas. Monosílabos. Sin contacto visual. Como si estuvieran en otro lugar." />
      </Sequence>

      {/* 26.05s - 40.32s = frame 651-1008 */}
      <Sequence from={651} durationInFrames={357}>
        <CaptionBox text="Ambos extremos, cuando son nuevos y repetidos, señalan lo mismo: algo pasó afuera que está afectando su equilibrio emocional en casa." />
      </Sequence>

      {/* 40.95s - 48.64s = frame 1024-1216 — BigTextGraphic */}
      <Sequence from={1024} durationInFrames={192}>
        <BigTextGraphic
          text="Y ese algo rara vez es el trabajo."
          highlight="rara vez es el trabajo."
        />
      </Sequence>

      {/* GRÁFICO #4 */}
      <Sequence from={1216} durationInFrames={175}>
        <InfielSignalGraphic number="#4" title="Cambia su rutina sin explicación" />
      </Sequence>

    </AbsoluteFill>
  );
};
