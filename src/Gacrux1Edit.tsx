import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {InfielTitleGraphic} from './components/InfielTitleGraphic';

// Timeline (25fps) — clip: gacrux_1.mp4 (35s = 875 frames)
// Timestamps via ffmpeg silencedetect
//
// Silences at: 1.24-1.85, 2.82-3.33, 4.51-5.40, 6.51-7.40, 9.17-10.05, 11.10-11.59, 12.69-13.67, 22.93-23.70, 26.58-27.54, 30.57-31.15, 32.71-33.17
//
//   0.00-5.40    "Llega a casa. Te da un beso. Te pregunta cómo te fue. Todo parece normal."
//   5.40-10.05   "Pero hay algo que no encaja. No sabes qué es. Solo lo sientes."
//   10.05-22.93  "Lo que muchos hombres no saben es que una mujer infiel, sin darse cuenta, repite ciertos comportamientos..."
//   23.70-35.00  big text: "Hoy te voy a mostrar exactamente qué hace. Y cuando termines este video, ya no vas a poder ignorarlo."
//   875-1050     InfielTitleGraphic
//
// Total: 1050 frames (42 segundos)

export const Gacrux1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>

      <OffthreadVideo src={staticFile('gacrux_1.mp4')} />

      {/* 0.00s - 5.40s = frame 0-135 */}
      <Sequence from={0} durationInFrames={135}>
        <CaptionBox text="Llega a casa. Te da un beso. Te pregunta cómo te fue. Todo parece normal." />
      </Sequence>

      {/* 5.40s - 10.05s = frame 135-251 */}
      <Sequence from={135} durationInFrames={116}>
        <CaptionBox text="Pero hay algo que no encaja. No sabes qué es. Solo lo sientes." />
      </Sequence>

      {/* 10.05s - 22.93s = frame 251-573 */}
      <Sequence from={251} durationInFrames={322}>
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
