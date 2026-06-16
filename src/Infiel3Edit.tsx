import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {InfielSignalGraphic} from './components/InfielSignalGraphic';

// Timeline (25fps) — clip: infiel_3.mp4
// ⚠️ Ajusta los frames según duración real del clip
//
// GRÁFICO #2 (0-175): InfielSignalGraphic "#2 / EL TELÉFONO BOCA ABAJO"
//
// SEÑAL 2 avatar (175-1575):
//   175-400   "Entra a casa. Deja el bolso. Y el teléfono lo pone boca abajo sobre la mesa."
//   400-625   "O lo lleva consigo a todos lados. Al baño, a la cocina, incluso si solo va a buscar agua."
//   625-1025  "Esto es uno de los gestos más estudiados en psicología de la infidelidad. Se llama comportamiento de ocultamiento reactivo."
//   1025-1225 "El cerebro actúa por instinto para proteger información antes de que haya una amenaza real. Ella ni siquiera lo piensa. Lo hace automáticamente."
//   1225-1575 "La pregunta no es si voltea el teléfono. La pregunta es: ¿cuándo empezó a hacer eso?"
//
// Total estimado: 1575 frames (~63 segundos)

export const Infiel3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('infiel_3.mp4')} endAt={1400} />

      {/* GRÁFICO #2 */}
      <Sequence from={0} durationInFrames={175}>
        <InfielSignalGraphic number="#2" title="El teléfono boca abajo" />
      </Sequence>

      {/* SEÑAL 2 — avatar */}
      <Sequence from={175} durationInFrames={225}>
        <CaptionBox text="Entra a casa. Deja el bolso. Y el teléfono lo pone boca abajo sobre la mesa." />
      </Sequence>

      <Sequence from={400} durationInFrames={225}>
        <CaptionBox text="O lo lleva consigo a todos lados. Al baño, a la cocina, incluso si solo va a buscar agua." />
      </Sequence>

      <Sequence from={625} durationInFrames={400}>
        <CaptionBox text="Esto es uno de los gestos más estudiados en psicología de la infidelidad. Se llama comportamiento de ocultamiento reactivo." />
      </Sequence>

      <Sequence from={1025} durationInFrames={200}>
        <CaptionBox text="El cerebro actúa por instinto para proteger información. Ella ni siquiera lo piensa. Lo hace automáticamente." />
      </Sequence>

      <Sequence from={1225} durationInFrames={350}>
        <CaptionBox text="La pregunta no es si voltea el teléfono. La pregunta es: ¿cuándo empezó a hacer eso?" />
      </Sequence>

    </AbsoluteFill>
  );
};
