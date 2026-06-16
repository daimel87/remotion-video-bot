import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 1440 frames total, +30 frame buffer per segment):
// 0-86       big text: "Él nunca persigue. Él atrae."
// 56-231     caption: "La mayoría de los hombres cuando les gusta una mujer..."
// 201-376    big text: "Textos de más. Atención de más. Disponibilidad de más."
// 346-521    caption: "activa en la mujer lo opuesto a lo que quieres"
// 491-655    caption: "El hombre que ninguna mujer olvida..."
// 625-744    big text: "cuanto menos la persigue, más la tiene presente"
// 714-923    caption: "el cerebro femenino está programado para valorar lo que no está disponible"
// 893-990    caption: "Eso no es manipulación. Es biología."
// 960-1236   big text: "Cuando te conviertes en el hombre con su propia vida y objetivos"
// 1206-1370  caption: "ella empieza a pensar en ti. Sola."
// 1340-1470  caption: "Tensión sin ansiedad. Y es adictivo."

export const Gacrux2Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('gacrux_2.mp4')} />

      <Sequence from={0} durationInFrames={86}>
        <BigTextGraphic
          text="Él nunca persigue. Él atrae."
          highlight="Él atrae."
        />
      </Sequence>

      <Sequence from={56} durationInFrames={175}>
        <CaptionBox text="La mayoría de los hombres cuando conocen a una mujer que les gusta..." />
      </Sequence>

      <Sequence from={201} durationInFrames={175}>
        <BigTextGraphic
          text="Textos de más. Atención de más. Disponibilidad de más."
          highlight="Disponibilidad de más."
        />
      </Sequence>

      <Sequence from={346} durationInFrames={175}>
        <CaptionBox text="Activa en la mujer lo opuesto a lo que quieres" />
      </Sequence>

      <Sequence from={491} durationInFrames={164}>
        <CaptionBox text="El hombre que ninguna mujer olvida tiene una característica que parece paradójica" />
      </Sequence>

      <Sequence from={625} durationInFrames={119}>
        <BigTextGraphic
          text="Cuanto menos la persigue, más la tiene presente"
          highlight="más la tiene presente"
        />
      </Sequence>

      <Sequence from={714} durationInFrames={209}>
        <CaptionBox text="El cerebro femenino está programado para valorar lo que no está completamente disponible" />
      </Sequence>

      <Sequence from={893} durationInFrames={97}>
        <CaptionBox text="Eso no es manipulación. Es biología." />
      </Sequence>

      <Sequence from={960} durationInFrames={276}>
        <BigTextGraphic
          text="Cuando te conviertes en el hombre que tiene su propia vida y sus propios objetivos"
          highlight="su propia vida y sus propios objetivos"
        />
      </Sequence>

      <Sequence from={1206} durationInFrames={164}>
        <CaptionBox text="Ella empieza a pensar en ti. Sola. Sin que tú hagas nada." />
      </Sequence>

      <Sequence from={1340} durationInFrames={130}>
        <CaptionBox text="Tensión sin ansiedad. Y es adictivo." />
      </Sequence>
    </AbsoluteFill>
  );
};
