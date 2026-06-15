import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (30fps, 857 frames total):
// 0-124      (no overlay): "Tenemos un menú de inicio clásico... wimber"
// 124-289    caption: "Basado en Windows 11 26H1"
// 289-361    (no overlay): "Si nos vamos al administrador de tareas"
// 361-433    caption: "12 procesos en segundo plano"
// 433-609    caption: "CPU 11% y 1.2GB de RAM"
// 609-857    big text: "CPU de dos núcleos y dos hilos, 4 GB de RAM"

export const WindowsXlite5Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('windows_xlite_5.mp4')} />

      <Sequence from={124} durationInFrames={165}>
        <CaptionBox text="Basado en Windows 11 26H1, build 28000.1 Pro" />
      </Sequence>

      <Sequence from={361} durationInFrames={72}>
        <CaptionBox text="12 procesos en segundo plano" />
      </Sequence>

      <Sequence from={433} durationInFrames={176}>
        <CaptionBox text="CPU 11% y 1.2GB de RAM en uso" />
      </Sequence>

      <Sequence from={609} durationInFrames={248}>
        <BigTextGraphic
          text="Prueba con una CPU de 2 núcleos y 2 hilos, y 4 GB de RAM"
          highlight="2 núcleos y 2 hilos, y 4 GB de RAM"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
