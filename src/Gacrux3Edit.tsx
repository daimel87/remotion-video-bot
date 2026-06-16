import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: senal_3.mp4 (43s = 1075 frames)
// Timestamps via ffmpeg silencedetect
//
//   0.00-5.33    caption: "La primera cosa que hace una mujer infiel al llegar a casa es ir directo al baño."
//   5.75-9.81    caption: "Sin saludarte bien. Sin sentarse. Sin contarte cómo le fue."
//   10.54-17.49  caption: "No hablo de cuando llega del gimnasio. Hablo de cuando esto se convierte en un hábito nuevo."
//   18.02-26.96  caption: "La psicología lo explica: el baño es el primer lugar donde puede eliminar evidencia."
//   27.45-35.61  caption: "¿Antes llegaba y te buscaba? ¿Y ahora lo primero que hace es desaparecer diez minutos?"
//   36.13-41.60  big text: "Eso no es higiene. Eso es protocolo."
//   1075-1250    gráfico: "#2 EL TELÉFONO BOCA ABAJO"
//
// Total: 1250 frames (50 segundos)

export const Gacrux3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senal_3.mp4')} />

      {/* 0.00s - 5.33s = frame 0-133 */}
      <Sequence from={0} durationInFrames={133}>
        <CaptionBox text="La primera cosa que hace una mujer infiel al llegar a casa es ir directo al baño." />
      </Sequence>

      {/* 5.75s - 9.81s = frame 144-245 */}
      <Sequence from={144} durationInFrames={101}>
        <CaptionBox text="Sin saludarte bien. Sin sentarse. Sin contarte cómo le fue." />
      </Sequence>

      {/* 10.54s - 17.49s = frame 264-437 */}
      <Sequence from={264} durationInFrames={173}>
        <CaptionBox text="No hablo de cuando llega del gimnasio. Hablo de cuando esto se convierte en un hábito nuevo. Algo que antes no hacía." />
      </Sequence>

      {/* 18.02s - 26.96s = frame 451-674 */}
      <Sequence from={451} durationInFrames={223}>
        <CaptionBox text="La psicología lo explica: el baño es el primer lugar donde puede eliminar evidencia. Perfume, mensajes, el estado de ánimo que traía de afuera." />
      </Sequence>

      {/* 27.45s - 35.61s = frame 686-890 */}
      <Sequence from={686} durationInFrames={204}>
        <CaptionBox text="¿Antes llegaba y te buscaba? ¿Y ahora lo primero que hace es desaparecer diez minutos?" />
      </Sequence>

      {/* 36.13s - 41.60s = frame 903-1040 — BigTextGraphic */}
      <Sequence from={903} durationInFrames={172}>
        <BigTextGraphic
          text="Eso no es higiene. Eso es protocolo."
          highlight="protocolo."
        />
      </Sequence>

      {/* GRÁFICO #2 */}
      <Sequence from={1075} durationInFrames={175}>
        <InfielSignalGraphic number="#2" title="El teléfono boca abajo" />
      </Sequence>

    </AbsoluteFill>
  );
};
