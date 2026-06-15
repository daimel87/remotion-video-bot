import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (30fps, 531 frames total):
// 0-163     caption: "Windows Xlite Optimum 11 26H1 Pro V2"
// 163-325   cutaway: "Un sistema modificado y liteado por un maestro... FB Conan"
// 325-428   normal: "Vamos a ver cómo se instala y el rendimiento del sistema"
// 428-531   normal: "¿Vale la pena instalarlo en tu PC de bajos recursos?"

export const WindowsXliteEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('windows_xlite_1.mp4')} />

      <Sequence from={0} durationInFrames={163}>
        <CaptionBox text="Windows Xlite Optimum 11 26H1 Pro V2" />
      </Sequence>

      <Sequence from={163} durationInFrames={162}>
        <BigTextGraphic
          text="Un sistema modificado y liteado por un maestro de la modificación: FB Conan"
          highlight="FB Conan"
        />
      </Sequence>

      <Sequence from={325} durationInFrames={103}>
        <CaptionBox text="Vamos a ver cómo se instala y su rendimiento" />
      </Sequence>

      <Sequence from={428} durationInFrames={103}>
        <CaptionBox text="¿Vale la pena instalarlo en tu PC de bajos recursos?" />
      </Sequence>
    </AbsoluteFill>
  );
};
