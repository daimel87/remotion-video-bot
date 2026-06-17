import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: senales_4.mp4 (45s = 1132 frames)
// Major silences: 6.75-7.24, 14.25-15.09, 24.60-25.39, 33.36-34.26
//
//   0.00-6.75    "Entra a casa. Deja el bolso. Y el teléfono lo pone boca abajo sobre la mesa."
//   7.24-14.25   "O lo lleva consigo a todos lados. Al baño, a la cocina, incluso si solo va a buscar agua."
//   15.09-24.60  "Esto es uno de los gestos más estudiados... Se llama comportamiento de ocultamiento reactivo."
//   25.39-33.36  "El cerebro actúa por instinto... Ella ni siquiera lo piensa. Lo hace automáticamente."
//   34.26-45     BigText: "La pregunta no es si voltea el teléfono..."
//   1132-1307    gráfico: "#3 DEMASIADO AMABLE... O DEMASIADO FRÍA"

export const Gacrux4Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('senales_4.mp4')} />

      {/* 0.00s - 6.75s = frame 0-169 */}
      <Sequence from={0} durationInFrames={169}>
        <CaptionBox text="Entra a casa. Deja el bolso. Y el teléfono lo pone boca abajo sobre la mesa." />
      </Sequence>

      {/* 7.24s - 14.25s = frame 181-356 */}
      <Sequence from={181} durationInFrames={175}>
        <CaptionBox text="O lo lleva consigo a todos lados. Al baño, a la cocina, incluso si solo va a buscar agua." />
      </Sequence>

      {/* 15.09s - 24.60s = frame 377-615 */}
      <Sequence from={377} durationInFrames={238}>
        <CaptionBox text="Esto es uno de los gestos más estudiados en psicología de la infidelidad. Se llama comportamiento de ocultamiento reactivo — básicamente, el cerebro actúa por instinto para proteger información antes de que haya una amenaza real." />
      </Sequence>

      {/* 25.39s - 33.36s = frame 635-834 */}
      <Sequence from={635} durationInFrames={199}>
        <CaptionBox text="Ella ni siquiera lo piensa. Lo hace automáticamente." />
      </Sequence>

      {/* 34.26s - 45s = frame 857-1132 — BigTextGraphic */}
      <Sequence from={857} durationInFrames={275}>
        <BigTextGraphic
          text="La pregunta no es si voltea el teléfono. La pregunta es: ¿cuándo empezó a hacer eso?"
          highlight="¿cuándo empezó a hacer eso?"
        />
      </Sequence>

      {/* GRÁFICO #3 */}
      <Sequence from={1132} durationInFrames={175}>
        <InfielSignalGraphic number="#3" title="Demasiado amable... o demasiado fría" />
      </Sequence>

    </AbsoluteFill>
  );
};
