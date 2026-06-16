import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (25fps, 1685 frames total, no overlaps):
// 0-138      big text: "Él entiende que la tensión sexual no se elimina. Se mantiene."
// 138-290    caption: "Este es el más incómodo. Y por eso el más importante."
// 290-511    caption: "La mayoría de hombres, cuando sienten que algo va bien con una mujer, hacen lo mismo:"
// 511-635    big text: "intentan cerrar. Apuran. Rompen la tensión demasiado rápido. Error."
// 635-828    caption: "La atracción femenina no funciona como un interruptor que se enciende y se apaga."
// 828-1076   big text: "Funciona como una olla a presión. La atracción crece mientras haya tensión. Y cae cuando la tensión desaparece."
// 1076-1311  caption: "El hombre que ninguna mujer olvida sabe cuándo avanzar... y sabe cuándo detenerse. Justo antes. A propósito."
// 1311-1463  big text: "Esa capacidad de contenerse —de no necesitar resolver la tensión inmediatamente"
// 1463-1685  caption: "es lo que la mujer percibe como seguridad, control y misterio. Y esa combinación es irresistible."

export const Gacrux5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('gacrux_5.mp4')} />

      <Sequence from={0} durationInFrames={138}>
        <BigTextGraphic
          text="Él entiende que la tensión sexual no se elimina. Se mantiene."
          highlight="Se mantiene."
        />
      </Sequence>

      <Sequence from={138} durationInFrames={152}>
        <CaptionBox text="Este es el más incómodo. Y por eso el más importante." />
      </Sequence>

      <Sequence from={290} durationInFrames={221}>
        <CaptionBox text="La mayoría de hombres, cuando sienten que algo va bien con una mujer, hacen lo mismo:" />
      </Sequence>

      <Sequence from={511} durationInFrames={124}>
        <BigTextGraphic
          text="intentan cerrar. Apuran. Rompen la tensión demasiado rápido. Error."
          highlight="Error."
        />
      </Sequence>

      <Sequence from={635} durationInFrames={193}>
        <CaptionBox text="La atracción femenina no funciona como un interruptor que se enciende y se apaga." />
      </Sequence>

      <Sequence from={828} durationInFrames={248}>
        <BigTextGraphic
          text="Funciona como una olla a presión. La atracción crece mientras haya tensión. Y cae cuando la tensión desaparece."
          highlight="Y cae cuando la tensión desaparece."
        />
      </Sequence>

      <Sequence from={1076} durationInFrames={235}>
        <CaptionBox text="El hombre que ninguna mujer olvida sabe cuándo avanzar... y sabe cuándo detenerse. Justo antes. A propósito." />
      </Sequence>

      <Sequence from={1311} durationInFrames={152}>
        <BigTextGraphic
          text="Esa capacidad de contenerse —de no necesitar resolver la tensión inmediatamente"
          highlight="de no necesitar resolver la tensión"
        />
      </Sequence>

      <Sequence from={1463} durationInFrames={222}>
        <CaptionBox text="es lo que la mujer percibe como seguridad, control y misterio. Y esa combinación es irresistible." />
      </Sequence>
    </AbsoluteFill>
  );
};
