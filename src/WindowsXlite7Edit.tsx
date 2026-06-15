import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (30fps, 1865 frames total):
// 0-549      caption: "Menú extendido con apps"
// 549-691    (no overlay): "Ahora nos iremos a la configuración..."
// 691-881    caption: "El sistema necesita medicina"
// 881-1146   caption: "Sistema sin bloatware"
// 1146-1269  (no overlay): "Si nos vamos a privacidad y seguridad..."
// 1269-1345  big text: "Hemos escogido la versión sin Windows Defender"
// 1345-1572  caption: "Windows Update"
// 1572-1865  big text: "No recomendable actualizar: se borrarían las optimizaciones"

export const WindowsXlite7Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('windows_xlite_7.mp4')} />

      <Sequence from={0} durationInFrames={549}>
        <CaptionBox text="Menú extendido con apps" />
      </Sequence>

      <Sequence from={691} durationInFrames={190}>
        <CaptionBox text="El sistema necesita medicina" />
      </Sequence>

      <Sequence from={881} durationInFrames={265}>
        <CaptionBox text="Sistema sin bloatware" />
      </Sequence>

      <Sequence from={1269} durationInFrames={76}>
        <BigTextGraphic
          text="Hemos escogido la versión sin Windows Defender"
          highlight="sin Windows Defender"
        />
      </Sequence>

      <Sequence from={1345} durationInFrames={227}>
        <CaptionBox text="Windows Update" />
      </Sequence>

      <Sequence from={1572} durationInFrames={293}>
        <BigTextGraphic
          text="No es recomendable actualizar: se borrarían las optimizaciones"
          highlight="se borrarían las optimizaciones"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
