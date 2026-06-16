import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: senal_3.mp4 (43s = 1075 frames)
//
//   0-225    caption: "La primera cosa que hace una mujer infiel al llegar a casa es ir directo al baño."
//   225-400  caption: "Sin saludarte bien. Sin sentarse. Sin contarte cómo le fue."
//   400-625  caption: "No hablo de cuando llega del gimnasio. Hablo de cuando esto se convierte en un hábito nuevo. Algo que antes no hacía."
//   625-850  caption: "La psicología lo explica: el baño es el primer lugar donde puede eliminar evidencia. Perfume, mensajes, el estado de ánimo que traía de afuera."
//   850-975  caption: "¿Antes llegaba y te buscaba? ¿Y ahora lo primero que hace es desaparecer diez minutos?"
//   975-1075 big text: "Eso no es higiene. Eso es protocolo."
//   1075-1250 gráfico: "#2 EL TELÉFONO BOCA ABAJO"
//
// Total: 1250 frames (50 segundos)

export const Gacrux3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senal_3.mp4')} />

      <Sequence from={0} durationInFrames={225}>
        <CaptionBox text="La primera cosa que hace una mujer infiel al llegar a casa es ir directo al baño." />
      </Sequence>

      <Sequence from={225} durationInFrames={175}>
        <CaptionBox text="Sin saludarte bien. Sin sentarse. Sin contarte cómo le fue." />
      </Sequence>

      <Sequence from={400} durationInFrames={225}>
        <CaptionBox text="No hablo de cuando llega del gimnasio. Hablo de cuando esto se convierte en un hábito nuevo. Algo que antes no hacía." />
      </Sequence>

      <Sequence from={625} durationInFrames={225}>
        <CaptionBox text="La psicología lo explica: el baño es el primer lugar donde puede eliminar evidencia. Perfume, mensajes, el estado de ánimo que traía de afuera." />
      </Sequence>

      <Sequence from={850} durationInFrames={125}>
        <CaptionBox text="¿Antes llegaba y te buscaba? ¿Y ahora lo primero que hace es desaparecer diez minutos?" />
      </Sequence>

      {/* Frase de cierre — BigTextGraphic */}
      <Sequence from={975} durationInFrames={100}>
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
