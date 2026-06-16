import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {InfielTitleGraphic} from './components/InfielTitleGraphic';

// Timeline (25fps):
// ⚠️ Ajusta los frames según la duración real del clip de HeyGen
//
// CLIP INTRO: gacrux_1.mp4
//   0-112    "Llega a casa. Te da un beso. Te pregunta cómo te fue. Todo parece normal."
//   112-187  "Pero hay algo que no encaja. No sabes qué es. Solo lo sientes."
//   187-460  "Una mujer infiel, sin darse cuenta, repite ciertos comportamientos cada vez que cruza esa puerta."
//   460-595  "Hoy te voy a mostrar exactamente qué hace. Y cuando termines este video, ya no vas a poder ignorarlo."
//
// GRÁFICO 1 TÍTULO: 595-770 (7 segundos = 175 frames)
// Total: 770 frames

export const Gacrux1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo
        src={staticFile('gacrux_1.mp4')}
        endAt={595}
      />

      <Sequence from={0} durationInFrames={112}>
        <CaptionBox text="Llega a casa. Te da un beso. Te pregunta cómo te fue. Todo parece normal." />
      </Sequence>

      <Sequence from={112} durationInFrames={75}>
        <CaptionBox text="Pero hay algo que no encaja. No sabes qué es. Solo lo sientes." />
      </Sequence>

      <Sequence from={187} durationInFrames={273}>
        <CaptionBox text="Una mujer infiel, sin darse cuenta, repite ciertos comportamientos cada vez que cruza esa puerta." />
      </Sequence>

      <Sequence from={460} durationInFrames={135}>
        <CaptionBox text="Hoy te voy a mostrar exactamente qué hace. Y cuando termines este video, ya no vas a poder ignorarlo." />
      </Sequence>

      {/* GRÁFICO 1 — Título animado */}
      <Sequence from={595} durationInFrames={175}>
        <InfielTitleGraphic />
      </Sequence>

    </AbsoluteFill>
  );
};
