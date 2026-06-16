import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 2614 frames total, no overlaps):
// 0-163      big text: "Él nunca le da todo. Le da lo suficiente para que ella quiera más."
// 163-256    caption: "Aquí está el secreto que nadie te dice."
// 256-547    caption: "El hombre que una mujer no puede olvidar nunca la llenó completamente..."
// 547-698    caption: "No porque sea cruel. Sino porque entiende algo fundamental sobre la psicología humana:"
// 698-837    big text: "Valoramos lo que nos costó. Recordamos lo que nunca terminó de completarse."
// 837-1174   caption: "Eso explica por qué las mujeres recuerdan con más intensidad a los hombres que las dejaron con preguntas..."
// 1174-1488  caption: "No te estoy diciendo que seas frío. Te estoy diciendo que seas interesante..."
// 1488-1674  big text: "Un hombre que se puede terminar de conocer en dos semanas... se olvida en dos semanas."
// 1674-1930  caption: "Mira, lo que acabo de compartirte no lo aprendes en la escuela..."
// 1930-2093  caption: "Pero está funcionando para hombres que decidieron entender cómo funciona realmente la mente femenina."
// 2093-2302  big text: "No para manipular. Sino para conectar de una forma que la mayoría de hombres nunca va a experimentar."
// 2302-2500  caption: "Si esto resonó contigo, guarda este video. Porque la mayoría lo ve una vez y lo olvida."
// 2500-2614  caption: "Los que lo aplican... son los que ninguna mujer olvida."

export const GacruxFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('gacrux_final.mp4')} />

      <Sequence from={0} durationInFrames={163}>
        <BigTextGraphic
          text="Él nunca le da todo. Le da lo suficiente para que ella quiera más."
          highlight="para que ella quiera más."
        />
      </Sequence>

      <Sequence from={163} durationInFrames={93}>
        <CaptionBox text="Aquí está el secreto que nadie te dice." />
      </Sequence>

      <Sequence from={256} durationInFrames={291}>
        <CaptionBox text="El hombre que una mujer no puede olvidar nunca la llenó completamente. Le dio suficiente para engancharse. Suficiente para querer más. Pero nunca todo." />
      </Sequence>

      <Sequence from={547} durationInFrames={151}>
        <CaptionBox text="No porque sea cruel. Sino porque entiende algo fundamental sobre la psicología humana:" />
      </Sequence>

      <Sequence from={698} durationInFrames={139}>
        <BigTextGraphic
          text="Valoramos lo que nos costó. Recordamos lo que nunca terminó de completarse."
          highlight="Recordamos lo que nunca terminó de completarse."
        />
      </Sequence>

      <Sequence from={837} durationInFrames={337}>
        <CaptionBox text="Eso explica por qué las mujeres recuerdan con más intensidad a los hombres que las dejaron con preguntas... que a los que les dieron todas las respuestas." />
      </Sequence>

      <Sequence from={1174} durationInFrames={314}>
        <CaptionBox text="No te estoy diciendo que seas frío. Te estoy diciendo que seas interesante. Que tengas profundidad real. Que haya siempre algo más en ti que descubrir." />
      </Sequence>

      <Sequence from={1488} durationInFrames={186}>
        <BigTextGraphic
          text={'Un hombre que se puede "terminar de conocer" en dos semanas... se olvida en dos semanas.'}
          highlight="se olvida en dos semanas."
        />
      </Sequence>

      <Sequence from={1674} durationInFrames={256}>
        <CaptionBox text="Mira, lo que acabo de compartirte no lo aprendes en la escuela. No te lo dice tu padre. Ni tus amigos." />
      </Sequence>

      <Sequence from={1930} durationInFrames={163}>
        <CaptionBox text="Pero está funcionando para hombres que decidieron entender cómo funciona realmente la mente femenina." />
      </Sequence>

      <Sequence from={2093} durationInFrames={209}>
        <BigTextGraphic
          text="No para manipular. Sino para conectar de una forma que la mayoría de hombres nunca va a experimentar."
          highlight="nunca va a experimentar."
        />
      </Sequence>

      <Sequence from={2302} durationInFrames={198}>
        <CaptionBox text="Si esto resonó contigo, guarda este video. Porque la mayoría lo ve una vez y lo olvida." />
      </Sequence>

      <Sequence from={2500} durationInFrames={114}>
        <CaptionBox text="Los que lo aplican... son los que ninguna mujer olvida." />
      </Sequence>
    </AbsoluteFill>
  );
};
