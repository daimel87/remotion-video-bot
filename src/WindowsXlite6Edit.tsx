import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (30fps, 1468 frames total):
// 0-69       (no overlay): "Nos vamos ahora al explorador de Windows"
// 69-197     caption: "ISO pesa 2.39GB, idioma inglés"
// 197-306    big text: "El enlace está en el primer comentario fijado"
// 306-562    caption: "Ocupa solo 4.63GB en el disco C"
// 562-700    big text: "Se eliminan recursos y componentes para mayor rendimiento"
// 700-1015   caption: "Aplicaciones instaladas: escritorio remoto y StartAllBack"
// 1015-1143  caption: "Actualizaciones: solo 1 disponible"
// 1143-1468  caption: "Características y funciones disponibles"

export const WindowsXlite6Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('windows_xlite_6.mp4')} />

      <Sequence from={69} durationInFrames={128}>
        <CaptionBox text="ISO pesa 2.39GB, idioma inglés" />
      </Sequence>

      <Sequence from={197} durationInFrames={109}>
        <BigTextGraphic
          text="El enlace de descarga está en el primer comentario fijado"
          highlight="primer comentario fijado"
        />
      </Sequence>

      <Sequence from={306} durationInFrames={256}>
        <CaptionBox text="Ocupa solo 4.63GB en el disco C" />
      </Sequence>

      <Sequence from={562} durationInFrames={138}>
        <BigTextGraphic
          text="Se eliminan recursos y componentes para un mayor rendimiento"
          highlight="mayor rendimiento"
        />
      </Sequence>

      <Sequence from={700} durationInFrames={315}>
        <CaptionBox text="Aplicaciones instaladas: escritorio remoto y StartAllBack" />
      </Sequence>

      <Sequence from={1015} durationInFrames={128}>
        <CaptionBox text="Actualizaciones: solo 1 disponible" />
      </Sequence>

      <Sequence from={1143} durationInFrames={325}>
        <CaptionBox text="Características y funciones de Windows" />
      </Sequence>
    </AbsoluteFill>
  );
};
