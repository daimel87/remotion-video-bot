import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 1376 frames total, no overlaps):
// 0-92       big text: "Él genera recuerdos que duelen cuando no están."
// 92-312     caption: "Piensa en los hombres que tú sabes que fueron inolvidables..."
// 312-404    big text: "Crearon momentos. No regalos. No cenas caras. Momentos."
// 404-936    caption: "La vez que pararon el coche en medio de la nada..."
// 936-1063   big text: "El cerebro femenino guarda los recuerdos con emoción, no con lógica."
// 1063-1225  caption: "Si tú conectas a una mujer con una emoción que no había sentido antes..."
// 1225-1376  big text: "te conviertes en esa emoción para ella. Y eso es imposible de borrar."

export const Gacrux4Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('gacrux_4.mp4')} />

      <Sequence from={0} durationInFrames={92}>
        <BigTextGraphic
          text="Él genera recuerdos que duelen cuando no están."
          highlight="duelen cuando no están."
        />
      </Sequence>

      <Sequence from={92} durationInFrames={220}>
        <CaptionBox text="Piensa en los hombres que fueron inolvidables para alguna mujer que conoces. ¿Qué tienen en común?" />
      </Sequence>

      <Sequence from={312} durationInFrames={92}>
        <BigTextGraphic
          text="Crearon momentos. No regalos. No cenas caras. Momentos."
          highlight="Momentos."
        />
      </Sequence>

      <Sequence from={404} durationInFrames={532}>
        <CaptionBox text="La vez que pararon el coche en medio de la nada solo para ver el cielo. La vez que le dijeron algo al oído que nadie más le había dicho. La vez que actuaron distinto, exactamente cuando ella menos lo esperaba." />
      </Sequence>

      <Sequence from={936} durationInFrames={127}>
        <BigTextGraphic
          text="El cerebro femenino guarda los recuerdos con emoción, no con lógica."
          highlight="no con lógica."
        />
      </Sequence>

      <Sequence from={1063} durationInFrames={162}>
        <CaptionBox text="Si tú conectas a una mujer con una emoción que no había sentido antes..." />
      </Sequence>

      <Sequence from={1225} durationInFrames={151}>
        <BigTextGraphic
          text="Te conviertes en esa emoción para ella. Y eso es imposible de borrar."
          highlight="imposible de borrar."
        />
      </Sequence>
    </AbsoluteFill>
  );
};
