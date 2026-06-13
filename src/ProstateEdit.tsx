import {AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {CaptionBox} from './components/CaptionBox';
import {FoodMarketGraphic} from './components/FoodMarketGraphic';
import {StudyGraphic} from './components/StudyGraphic';

// Timeline (25fps):
// 0-131    intro CGI: "Tu próstata ya está cambiando"
// 131-219  zoom on face: "No es una posibilidad. Es una certeza biológica."
// 219-350  normal: "Tú decides la velocidad del cambio"
// 350-613  cutaway: 10 alimentos / mercado de México / <$15 MXN
// 613-744  cutaway: estudio científico
// 744-810  normal: "No suplementos. No importados. No caros."
// 810-908  normal: "Cosas que tu abuela ya compraba en el tianguis"

const ZoomingVideo: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [131, 165, 219, 250],
    [1, 1.6, 1.6, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: '50% 28%'}}>
      <OffthreadVideo src={staticFile('prostata.mp4')} />
    </AbsoluteFill>
  );
};

export const ProstateEdit: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ZoomingVideo />

      <Sequence from={0} durationInFrames={131}>
        <CaptionBox text="Tu próstata ya está cambiando" />
      </Sequence>

      <Sequence from={131} durationInFrames={88}>
        <CaptionBox text="Es una certeza biológica" />
      </Sequence>

      <Sequence from={219} durationInFrames={131}>
        <CaptionBox text="Tú decides la velocidad del cambio" />
      </Sequence>

      <Sequence from={350} durationInFrames={263}>
        <FoodMarketGraphic />
      </Sequence>

      <Sequence from={613} durationInFrames={131}>
        <StudyGraphic />
      </Sequence>

      <Sequence from={744} durationInFrames={66}>
        <CaptionBox text="No suplementos. No importados. No caros." />
      </Sequence>

      <Sequence from={810} durationInFrames={98}>
        <CaptionBox text="Cosas que tu abuela ya compraba en el tianguis" />
      </Sequence>
    </AbsoluteFill>
  );
};
