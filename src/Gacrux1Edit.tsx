import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielTitleGraphic} from './components/InfielTitleGraphic';

// Timeline (25fps) — clip: gacrux_1.mp4 (35s = 875 frames)
//
//   0-200    caption: "Llega a casa. Te da un beso. Te pregunta cómo te fue. Todo parece normal."
//   200-325  caption: "Pero hay algo que no encaja. No sabes qué es. Solo lo sientes."
//   325-675  caption: "Una mujer infiel repite ciertos comportamientos cada vez que cruza esa puerta. Patrones que la psicología lleva años estudiando."
//   675-875  big text: "Hoy te voy a mostrar exactamente qué hace. Y cuando termines este video, ya no vas a poder ignorarlo."
//   875-1050 gráfico título: "LO QUE TODA MUJER INFIEL HACE AL LLEGAR A CASA"
//
// Total: 1050 frames (42 segundos)

export const Gacrux1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('gacrux_1.mp4')} />

      {/* Captions sobre el avatar */}
      <Sequence from={0} durationInFrames={200}>
        <CaptionBox text="Llega a casa. Te da un beso. Te pregunta cómo te fue. Todo parece normal." />
      </Sequence>

      <Sequence from={200} durationInFrames={125}>
        <CaptionBox text="Pero hay algo que no encaja. No sabes qué es. Solo lo sientes." />
      </Sequence>

      <Sequence from={325} durationInFrames={350}>
        <CaptionBox text="Una mujer infiel repite ciertos comportamientos cada vez que cruza esa puerta. Patrones que la psicología lleva años estudiando." />
      </Sequence>

      {/* Última frase — BigTextGraphic encima del video */}
      <Sequence from={675} durationInFrames={200}>
        <BigTextGraphic
          text="Hoy te voy a mostrar exactamente qué hace. Y cuando termines este video, ya no vas a poder ignorarlo."
          highlight="ya no vas a poder ignorarlo."
        />
      </Sequence>

      {/* GRÁFICO 1 — Título animado */}
      <Sequence from={875} durationInFrames={175}>
        <InfielTitleGraphic />
      </Sequence>

    </AbsoluteFill>
  );
};
