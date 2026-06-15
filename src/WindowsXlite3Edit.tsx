import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (30fps, 1519 frames total):
// 0-123      caption: "Fondo oficial de Windows"
// 123-209    big text: "Más adelante te diré cómo cambiar este fondo de escritorio"
// 209-408    caption: carpeta Extras
// 408-494    caption: accesos directos del escritorio
// 494-589    caption: activar servicios de impresión
// 589-712    caption: solución de errores de Xbox
// 712-779    caption: guías del proyecto Xlite
// 779-893    caption: instalador de la tienda de Microsoft
// 893-1026   caption: navegadores Chrome, Edge, Firefox
// 1026-1149  caption: widgets de Windows 11
// 1149-1339  caption: registro y documentación del proyecto
// 1339-1519  caption: carpeta Wallpapers

export const WindowsXlite3Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('windows_xlite_3.mp4')} />

      <Sequence from={0} durationInFrames={123}>
        <CaptionBox text="Fondo oficial de Windows" />
      </Sequence>

      <Sequence from={123} durationInFrames={86}>
        <BigTextGraphic
          text="Más adelante te diré cómo cambiar este fondo de escritorio"
          highlight="cambiar este fondo de escritorio"
        />
      </Sequence>

      <Sequence from={209} durationInFrames={199}>
        <CaptionBox text="La carpeta Extras: accesos directos y herramientas adicionales" />
      </Sequence>

      <Sequence from={408} durationInFrames={86}>
        <CaptionBox text="Accesos directos del escritorio" />
      </Sequence>

      <Sequence from={494} durationInFrames={95}>
        <CaptionBox text="Activar los servicios de impresión" />
      </Sequence>

      <Sequence from={589} durationInFrames={123}>
        <CaptionBox text="Solución de errores de inicio de sesión de Xbox" />
      </Sequence>

      <Sequence from={712} durationInFrames={67}>
        <CaptionBox text="Guías del proyecto Xlite" />
      </Sequence>

      <Sequence from={779} durationInFrames={114}>
        <CaptionBox text="Instalador de la tienda de Microsoft" />
      </Sequence>

      <Sequence from={893} durationInFrames={133}>
        <CaptionBox text="Los tres navegadores: Chrome, Edge y Firefox" />
      </Sequence>

      <Sequence from={1026} durationInFrames={123}>
        <CaptionBox text="Activar o desactivar los widgets de Windows 11" />
      </Sequence>

      <Sequence from={1149} durationInFrames={190}>
        <CaptionBox text="Mejoras de registro y documentación del proyecto Xlite" />
      </Sequence>

      <Sequence from={1339} durationInFrames={180}>
        <CaptionBox text="Carpeta Wallpapers para cambiar tu fondo de escritorio" />
      </Sequence>
    </AbsoluteFill>
  );
};
