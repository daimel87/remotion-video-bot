import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 698 frames total, no overlaps):
// 0-112      caption: "Hay hombres que las mujeres recuerdan años después de que todo terminó"
// 112-214    big text: "No porque fueran los más guapos. No porque tuvieran más dinero."
// 214-382    caption: "Se queda grabado en el sistema nervioso de una mujer"
// 382-466    caption: "Hoy te voy a contar exactamente qué es"
// 466-587    caption: "Esto no es lo que te enseñaron"
// 587-698    big text: "Esto va contra todo lo que crees que funciona con las mujeres."

export const Gacrux1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('gacrux_1.mp4')} />

      <Sequence from={0} durationInFrames={112}>
        <CaptionBox text="Hay hombres que las mujeres recuerdan años después de que todo terminó" />
      </Sequence>

      <Sequence from={112} durationInFrames={102}>
        <BigTextGraphic
          text="No porque fueran los más guapos. No porque tuvieran más dinero."
          highlight="más guapos"
        />
      </Sequence>

      <Sequence from={214} durationInFrames={168}>
        <CaptionBox text="Se queda grabado en el sistema nervioso de una mujer" />
      </Sequence>

      <Sequence from={382} durationInFrames={84}>
        <CaptionBox text="Hoy te voy a contar exactamente qué es" />
      </Sequence>

      <Sequence from={466} durationInFrames={121}>
        <CaptionBox text="Esto no es lo que te enseñaron" />
      </Sequence>

      <Sequence from={587} durationInFrames={111}>
        <BigTextGraphic
          text="Esto va contra todo lo que crees que funciona con las mujeres"
          highlight="contra todo lo que crees"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
