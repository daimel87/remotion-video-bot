import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {BigTextGraphic} from './components/BigTextGraphic';

// Timeline (30fps, 444 frames total):
// 0-287    caption: "Instalar tienda de Microsoft"
// 287-383  (no overlay): "la tienda de Windows funciona sin dificultades"
// 383-444  big text: "y podrán instalar las aplicaciones que deseen"

export const WindowsXlite4Edit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <OffthreadVideo src={staticFile('windows_xlite_4.mp4')} />

      <Sequence from={0} durationInFrames={287}>
        <CaptionBox text="Instalar tienda de Microsoft" />
      </Sequence>

      <Sequence from={383} durationInFrames={61}>
        <BigTextGraphic
          text="Podrán instalar las aplicaciones que deseen"
          highlight="instalar las aplicaciones que deseen"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
