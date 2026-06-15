import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (30fps, 1270 frames total):
// 0-104      (no overlay): "Ahora nos vamos a la carpeta de extras"
// 104-402    caption: "Instalación de navegador web"
// 402-713    caption: "Navegación eficiente"
// 713-869    (no overlay): "Así que este sería el Windows Xlite Optimum 11 26H1 Pro V2"
// 869-1024   big text: "Un sistema excelente como nos tienen acostumbrados los chicos de Windows Xlite"
// 1024-1270  (no overlay): outro / playlist mention

export const WindowsXliteFinalEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('windows_xlite_final.mp4')} />

      <Sequence from={104} durationInFrames={298}>
        <CaptionBox text="Instalación de navegador web" />
      </Sequence>

      <Sequence from={402} durationInFrames={311}>
        <CaptionBox text="Navegación eficiente" />
      </Sequence>

      <Sequence from={869} durationInFrames={155}>
        <BigTextGraphic
          text="Un sistema excelente como nos tienen acostumbrados los chicos de Windows Xlite"
          highlight="sistema excelente"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
