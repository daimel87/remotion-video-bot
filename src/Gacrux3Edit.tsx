import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 1310 frames total, no overlaps):
// 0-92       big text: "Él sabe leer lo que ella NO dice."
// 92-264     caption: "Las mujeres raramente dicen lo que quieren de forma directa. Y no porque sean complicadas."
// 264-367    big text: "Sino porque están probando si tú realmente las ves."
// 367-551    caption: "El hombre que ninguna mujer puede olvidar presta atención a los detalles que los demás ignoran."
// 551-861    big text: "Nota cuando ella cambia el tono de voz..."
// 861-941    caption: "Y en lugar de ignorarlo, lo nombra."
// 941-998    big text: "¿Qué tienes hoy? Algo pasó."
// 998-1159   caption: "Esas tres palabras hacen más por la atracción que tres horas de conversación vacía."
// 1159-1310  big text: "Una mujer que siente que alguien realmente la ve... no lo olvida. Nunca."

export const Gacrux3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('gacrux_3.mp4')} />

      <Sequence from={0} durationInFrames={92}>
        <BigTextGraphic
          text="Él sabe leer lo que ella NO dice."
          highlight="NO dice."
        />
      </Sequence>

      <Sequence from={92} durationInFrames={172}>
        <CaptionBox text="Las mujeres raramente dicen lo que quieren de forma directa. Y no porque sean complicadas." />
      </Sequence>

      <Sequence from={264} durationInFrames={103}>
        <BigTextGraphic
          text="Sino porque están probando si tú realmente las ves."
          highlight="si tú realmente las ves."
        />
      </Sequence>

      <Sequence from={367} durationInFrames={184}>
        <CaptionBox text="El hombre que ninguna mujer puede olvidar presta atención a los detalles que los demás ignoran." />
      </Sequence>

      <Sequence from={551} durationInFrames={310}>
        <BigTextGraphic
          text={'Nota cuando cambia el tono de voz.\nNota cuando deja de escribir.\nNota cuando dice "estoy bien" y no lo está.'}
          highlight='"estoy bien"'
        />
      </Sequence>

      <Sequence from={861} durationInFrames={80}>
        <CaptionBox text="Y en lugar de ignorarlo, lo nombra." />
      </Sequence>

      <Sequence from={941} durationInFrames={57}>
        <BigTextGraphic
          text="¿Qué tienes hoy? Algo pasó."
          highlight="Algo pasó."
        />
      </Sequence>

      <Sequence from={998} durationInFrames={161}>
        <CaptionBox text="Esas tres palabras hacen más por la atracción que tres horas de conversación vacía." />
      </Sequence>

      <Sequence from={1159} durationInFrames={151}>
        <BigTextGraphic
          text="Una mujer que siente que alguien realmente la ve... no lo olvida. Nunca."
          highlight="no lo olvida. Nunca."
        />
      </Sequence>
    </AbsoluteFill>
  );
};
