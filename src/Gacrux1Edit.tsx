import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielTitleGraphic} from './components/InfielTitleGraphic';

// Timeline (25fps) — clip: gacrux_1.mp4 (35s = 875 frames)
// Silences >0.7s: 4.52-5.40, 6.57-7.40, 9.17-10.05, 12.78-13.67, 22.93-23.70, 26.58-27.54
//
// Phrase 1 has internal pauses (dramatic delivery):
//   "Llega a casa." (0-1.27) + "Te da un beso." (1.85-2.82)
//   + "Te pregunta cómo te fue." (3.23-4.52) + "Todo parece normal." (5.40-6.57)
//   → Full phrase: 0.00 - 6.57
//
// Phrase 2: "Pero hay algo que no encaja." (7.40-9.17) + "No sabes qué es. Solo lo sientes." (10.05-12.78)
//   → Full phrase: 7.40 - 12.78
//
// Phrase 3: "Lo que muchos hombres no saben..." 13.67 - 22.93
// Phrase 4 (BigText): "Hoy te voy a mostrar..." 23.70 - 35
// Title graphic: 875 - 1050

export const Gacrux1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('gacrux_1.mp4')} />

      {/* 0.00s - 6.57s = frame 0-164 */}
      <Sequence from={0} durationInFrames={164}>
        <CaptionBox text="Llega a casa. Te da un beso. Te pregunta cómo te fue. Todo parece normal." />
      </Sequence>

      {/* 7.40s - 12.78s = frame 185-320 */}
      <Sequence from={185} durationInFrames={135}>
        <CaptionBox text="Pero hay algo que no encaja. No sabes qué es. Solo lo sientes." />
      </Sequence>

      {/* 13.67s - 22.93s = frame 342-573 */}
      <Sequence from={342} durationInFrames={231}>
        <CaptionBox text="Lo que muchos hombres no saben es que una mujer infiel repite ciertos comportamientos cada vez que cruza esa puerta. Patrones que la psicología lleva años estudiando." />
      </Sequence>

      {/* 23.70s - 35s = frame 593-875 — BigTextGraphic */}
      <Sequence from={593} durationInFrames={282}>
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
