import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';
import {StackedLinesGraphic} from './components/StackedLinesGraphic';
import {BrainTextGraphic} from './components/BrainTextGraphic';

// Timeline (25fps, 1440 frames total):
// 0-56       big text: "Él nunca persigue. Él atrae."
// 56-201     caption: "La mayoría de los hombres cuando les gusta una mujer..."
// 201-346    stacked: se acercan demasiado / Textos de más / Atención de más / Disponibilidad de más
// 346-491    caption: "activa en la mujer lo opuesto a lo que quieres"
// 491-625    caption: "El hombre que ninguna mujer olvida..."
// 625-714    big text: "cuanto menos la persigue, más la tiene presente"
// 714-893    brain graphic: "el cerebro femenino está programado..."
// 893-960    caption: "Eso no es manipulación. Es biología."
// 960-1206   big text: "Cuando tú te conviertes en el hombre que tiene su propia vida..."
// 1206-1340  caption: "ella empieza a pensar en ti. Sola. Sin que tú hagas nada."
// 1340-1440  caption: "Tensión sin ansiedad. Y es adictivo."

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
        <StackedLinesGraphic
          lines={['Se acercan demasiado.', 'Textos de más.', 'Atención de más.', 'Disponibilidad de más.']}
          highlightIndex={0}
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
        <BrainTextGraphic
          text="El cerebro femenino está programado para valorar lo que no está completamente disponible"
          highlight="valorar lo que no está completamente disponible"
        />
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
