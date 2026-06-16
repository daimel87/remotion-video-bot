import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 698 frames total):
// 0-112      (no overlay): "Hay hombres que las mujeres recuerdan años después..."
// 112-214    big text: "No porque fueran los más guapos. No porque tuvieran más dinero."
// 214-382    (no overlay): "Sino porque hicieron algo distinto..."
// 382-466    (no overlay): "Y hoy te voy a contar exactamente qué es."
// 466-587    (no overlay): "Pero te advierto algo desde ahora..."
// 587-698    big text: "Esto va contra todo lo que crees que funciona con las mujeres."

export const Gacrux1Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('gacrux_1.mp4')} />

      <Sequence from={112} durationInFrames={102}>
        <BigTextGraphic
          text="No porque fueran los más guapos. No porque tuvieran más dinero."
          highlight="más guapos"
        />
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
