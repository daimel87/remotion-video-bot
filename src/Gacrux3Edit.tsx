import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: senal_3.mp4 (43s = 1075 frames)
// Major silences: 9.82-10.54, 19.67-20.42, 31.86-32.47, 39.64-40.23
//
// Phrase 1: 0.00 - 9.82 (both sentences together, no major pause between them)
// Phrase 2: 10.54 - 19.67
// Phrase 3: 20.42 - 31.86
// Phrase 4: 32.47 - 39.64
// Phrase 5 (BigText): 40.23 - 43
// Gráfico #2: 1075 - 1250

export const Gacrux3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senal_3.mp4')} />

      {/* 0.00s - 9.82s = frame 0-246 */}
      <Sequence from={0} durationInFrames={246}>
        <CaptionBox text="La primera cosa que hace una mujer infiel al llegar a casa es ir directo al baño. Sin saludarte bien. Sin sentarse. Sin contarte cómo le fue." />
      </Sequence>

      {/* 10.54s - 19.67s = frame 264-492 */}
      <Sequence from={264} durationInFrames={228}>
        <CaptionBox text="No hablo de cuando llega del gimnasio. Hablo de cuando esto se convierte en un hábito nuevo. Algo que antes no hacía." />
      </Sequence>

      {/* 20.42s - 31.86s = frame 511-797 */}
      <Sequence from={511} durationInFrames={286}>
        <CaptionBox text="La psicología lo explica: el baño es el primer lugar donde puede eliminar evidencia. Perfume, mensajes, el estado de ánimo que traía de afuera." />
      </Sequence>

      {/* 32.47s - 39.64s = frame 812-991 */}
      <Sequence from={812} durationInFrames={179}>
        <CaptionBox text="¿Antes llegaba y te buscaba? ¿Y ahora lo primero que hace es desaparecer diez minutos?" />
      </Sequence>

      {/* 40.23s - 43s = frame 1006-1075 — BigTextGraphic */}
      <Sequence from={1006} durationInFrames={69}>
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
