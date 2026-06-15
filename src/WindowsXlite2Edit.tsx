import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (30fps, 639 frames total):
// 0-216     caption: "Windows Xlite 26H1: ¿con o sin Defender?"
// 216-443   cutaway: "Yo personalmente me gusta sin Windows Defender, pero si te gusta el Windows Defender, también tienes la opción"
// 443-541   normal: "Elegimos el disco duro de instalación"
// 541-639   normal: "Copiando archivos e instalando Windows Xlite Optimum 11 26H1 Pro V2"

export const WindowsXlite2Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('windows_xlite_2.mp4')} />

      <Sequence from={0} durationInFrames={216}>
        <CaptionBox text="Windows Xlite 26H1: ¿con o sin Defender?" />
      </Sequence>

      <Sequence from={216} durationInFrames={227}>
        <BigTextGraphic
          text="Sin Windows Defender, pero si te gusta, también tienes la opción"
          highlight="Sin Windows Defender"
        />
      </Sequence>

      <Sequence from={448} durationInFrames={98}>
        <CaptionBox text="Elegimos el disco duro de instalación" />
      </Sequence>

      <Sequence from={546} durationInFrames={93}>
        <CaptionBox text="Copiando archivos e instalando Windows Xlite Optimum 11 26H1 Pro V2" />
      </Sequence>
    </AbsoluteFill>
  );
};
